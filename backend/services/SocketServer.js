const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const queueService = require("./QueueService.js");
const PatientsService = require("./PatientsService.js");
const RoomService = require("./RoomService.js");
const MessagesService = require("./MessagesService.js")
const { nextTick } = require("process");

const getKeyByValue = (map, value) => {
    if (map instanceof Map) {
        for (let [key, val] of map.entries()) {
            if (val == value) {
                return key;
            }
        }
    }
    return null; // Return null if the value is not found or the Map is empty
};



const createSocketServer = (app) => {
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*",
            credentials: true,
        },
    });
    var numberOfClients = 0;
    const clientRooms = new Map();

    // Handle WebSocket connections here
    io.on("connection", async (socket) => {
        try {
            numberOfClients++;
            const roomId = socket.handshake.query.clientId; // Access the roomId query parameter
            clientRooms.set(socket.id, roomId);
            console.log("A new user has connected", socket.id, "room number", roomId);

            if (!["monitor", "reception"].includes(roomId)) {
                let currentClient = await queueService.getFirstInQueueByRoom(roomId);
                let nextClient = await queueService.getSecondInQueueByRoom(roomId);
                console.log("current client: ", currentClient ? currentClient.ID : null);
                socket.emit("updateCurrentPatient", currentClient ? currentClient.patient : null);
                socket.emit("updateNextPatient", nextClient ? nextClient.patient : null);
            }

            //listening to calls from a client
            socket.on("moveClientToAnotherRoom", async (currentPatient, newRoomId, place) => {
                try {
                    //source room
                    //console.log(await queueService.findQueueByPatient(currentPatient));
                    const room = clientRooms.get(socket.id) != "reception" ? clientRooms.get(socket.id) : (await queueService.findQueueByPatient(currentPatient)).dataValues.RoomId;
                    //update in the db
                    await queueService.moveBetweenRooms(currentPatient, newRoomId, place);
                    //return approval to the caller
                    // socket.emit("message", "moved Client To Another Room successfully");
                    //update the new room next client- if the movement is to the beginning of the queue
                    nextClient = await queueService.getSecondInQueueByRoom(newRoomId);
                    io.to(getKeyByValue(clientRooms, newRoomId)).emit("updateNextPatient", nextClient ? nextClient.patient : null);
                    //update the monitor- 2 rooms
                    const updatedQueue1 = await queueService.getQueueListByRoom(newRoomId);
                    io.to(getKeyByValue(clientRooms, "monitor")).emit("queueUpdate", newRoomId, updatedQueue1);
                    const updatedQueue2 = await queueService.getQueueListByRoom(room);
                    io.to(getKeyByValue(clientRooms, "monitor")).emit("queueUpdate", room, updatedQueue2);
                    //update the patients table in the reception screen
                    const updatedPatient = await PatientsService.getPatientWithQueueDetailsByID(currentPatient);
                    io.to(getKeyByValue(clientRooms, "reception")).emit("queueUpdate", updatedPatient);
                    //update the room - the next and the next-next clients  
                    currentClient = await queueService.getFirstInQueueByRoom(room);
                    nextClient = await queueService.getSecondInQueueByRoom(room);
                    console.log("current: ", currentClient, "next: ", nextClient);
                    io.to(getKeyByValue(clientRooms, room)).emit("updateCurrentPatient", currentClient ? currentClient.patient : null);
                    io.to(getKeyByValue(clientRooms, room)).emit("updateNextPatient", nextClient ? nextClient.patient : null);
                } catch (error) {
                    console.log(error.message);
                    console.error('Stack Trace:', error.stack);
                    throw new Error(error.message);
                }
            });

            socket.on("subscribeToQueue", async (roomId) => {
                try {
                    const queue = await queueService.getQueueListByRoom(roomId);
                    console.log(roomId, " subscribed");
                    socket.emit(`queueUpdate`, roomId, queue);
                }
                catch (error) {
                    console.log(error.message);
                    console.error('Stack Trace:', error.stack);
                    throw new Error(error.message);
                }
            })

            socket.on("EmergencyAlertToRoom", async (room, patient) => {
                try {
                    const doctorRoom = await RoomService.findRoomByName("רופא");
                    console.log(doctorRoom, " key ", getKeyByValue(clientRooms, doctorRoom));
                    io.to(getKeyByValue(clientRooms, doctorRoom)).emit("Emergencymessage", `קריאת חירום לרופא לחדר ${room} עבור מטופל מספר ${patient}`);
                } catch (error) {
                    console.log(error.message);
                    console.error('Stack Trace:', error.stack);
                    throw new Error(error.message);
                }
            });

            socket.on("deletePatient", async (patientId) => {
                try {
                    console.log(patientId);
                    //delete patient may affect on: in the db to change the status, reception, monitor, the room he is in.
                    const appointment = await queueService.findQueueByPatient(patientId);
                    console.log("appointment ", appointment);
                    const room = appointment.dataValues.RoomId;
                    console.log("room ", room);
                    await queueService.deleteQueue(appointment.ID);
                    await PatientsService.deletePatient(patientId);
                    //reception
                    io.to(getKeyByValue(clientRooms, "reception")).emit("queueUpdate", { ID: patientId });
                    //monitor
                    const updatedQueue = await queueService.getQueueListByRoom(room);
                    io.to(getKeyByValue(clientRooms, "monitor")).emit("queueUpdate", room, updatedQueue);
                    //room
                    //update the room - the next and the next-next clients  
                    currentClient = await queueService.getFirstInQueueByRoom(room);
                    nextClient = await queueService.getSecondInQueueByRoom(room);
                    io.to(getKeyByValue(clientRooms, room)).emit("updateCurrentPatient", currentClient ? currentClient.patient : null);
                    io.to(getKeyByValue(clientRooms, room)).emit("updateNextPatient", nextClient ? nextClient.patient : null);

                }
                catch (error) {
                    console.log(error.message);
                    console.error('Stack Trace:', error.stack);
                    throw new Error(error.message);
                }
            });

            socket.on("insertPatient", async (firstName, lastName, HMOid, phone, tz, room) => {
                try {
                    //update reception table, monitor, reception room
                    let patient;
                    if (!room) {
                        console.log("enter patient", room);
                        patient = await PatientsService.createPatient(firstName, lastName, HMOid, phone, tz);
                    }
                    else {
                        console.log("reception manual patient", room);
                        patient = await PatientsService.addManualPatient(firstName, lastName, HMOid, phone, tz, room);
                    }
                    //reception table
                    const fullDataPatient = await PatientsService.getPatientWithQueueDetailsByID(patient.ID);
                    const roomId = await RoomService.findRoomByName("קבלה");
                    io.to(getKeyByValue(clientRooms, "reception")).emit("insertPatient", fullDataPatient);
                    //monitor
                    const receptionQueue = queueService.getQueueListByRoom(roomId);
                    io.to(getKeyByValue(clientRooms, "monitor")).emit("queueUpdate", roomId, receptionQueue);
                    //reception room
                    currentClient = await queueService.getFirstInQueueByRoom(roomId);
                    nextClient = await queueService.getSecondInQueueByRoom(roomId);
                    io.to(getKeyByValue(clientRooms, roomId)).emit("updateCurrentPatient", currentClient ? currentClient.patient : null);
                    io.to(getKeyByValue(clientRooms, roomId)).emit("updateNextPatient", nextClient ? nextClient.patient : null);
                    console.log(fullDataPatient.dataValues);
                    console.log(socket.id);
                    io.to(socket.id).emit(`patientInserted`, fullDataPatient.dataValues);

                } catch (error) {
                    console.log(error.message);
                    console.error('Stack Trace:', error.stack);
                    throw new Error(error.message);
                }
            });

            socket.on("messageUpdated", async () => {
                const messages = await MessagesService.findAllMessages();
                console.log("messages ",messages);
                io.to(getKeyByValue(clientRooms, "monitor")).emit("messageUpdated", messages);
            });


            socket.on("createMessage", async (content, status) => {
                try {
                    const message = await MessagesService.createMessage(content, status);
                    const allMessages = MessagesService.findAllMessages();
                    io.to(getKeyByValue(clientRooms, "monitor")).emit("messageUpdate", roomId, allMessages);

                    io.to(socket.id).emit(`messageUpdate`, message.dataValues);

                } catch (error) {
                    console.log(error.message);
                    console.error('Stack Trace:', error.stack);
                    throw new Error(error.message);
                }
            });
            
            socket.on("disconnect", () => {
                clientRooms.delete(socket.id);
                console.log(socket.id, " disconnected");
            });
        } catch (error) {
            console.log(error);
        }
    });

    return server;
}

module.exports = createSocketServer;
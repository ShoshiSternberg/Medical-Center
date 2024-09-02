const MessagesModel = require('../models/MessagesModel');

exports.findMessageById = (id) => {
    return MessagesModel.findByPk(id);
}

exports.findAllMessages = () => {
    return MessagesModel.findAll();
}


exports.updateMessage = (ID, Message) => {
    return MessagesModel.update({ Message: Message }, {

        where: { ID: ID }
    });
}


exports.updateMessageStatus = (ID, Status) => {
    return MessagesModel.update({ Status: Status },
        {
            where: { ID: ID }
        });
}

exports.deleteMessage = (id) => {
    return MessagesModel.destroy({
        where: { id: id }
    });
}

exports.createMessage = async (message, status) => {
    try {
        const data = {
            Message: message,
            Status: status
        };
        const newMessage = await MessagesModel.create(data);
        return newMessage;
    } catch (error) {
        console.log(error.message);
        console.error('Stack Trace:', error.stack);
        throw new Error(error.message);
    }
}
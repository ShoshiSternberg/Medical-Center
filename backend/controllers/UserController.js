const UsersService = require('../services/UsersService');

exports.findUserById = async (req, res) => {
    try {
        const user = await UsersService.findUserById(req.params.id);
        // if (user) {
        return res.json({
            data: user,
            message: 'Success.'
        });
        // } else {
        //     return res.status(404).json({
        //         message: 'User not found.'
        //     });
        // }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.findUserByEmailAddress = async (req, res) => {
    try {
        const user = await UsersService.findUserByEmailAddress(req.params.emailAddress);
        // if (user) {
        //     return res.json({
        //         data: user,
        //         message: 'Success.'
        //     });
        // } else {
        //     return res.status(404).json({
        //         data: null,
        //         message: 'User not found.'
        //     });
        // }
        return res.json({
            data: user,
            message: 'Success.'
        });
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.findAllUsers = async (req, res) => {
    try {
        const users = await UsersService.findAllUsers();
        return res.json({
            data: users,
            message: 'Success.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.createUser = async (req, res) => {
    try {
        const user = await UsersService.createUser(req.body);
        if (user) {
            return res.json({
                data: user,
                message: 'User created successfully.'
            });
        } else {
            return res.status(404).json({
                data: null,
                message: 'Failed.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            data: null,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.userLogin = async (req, res) => {
    try {
        const email = req.body.Email;
        const password = req.body.Password;
        const user = await UsersService.userLogin(email, password);
        if (user) {
            return res.json({
                data: user,
                message: 'Login successful'
            });
        } else {
            return res.status(401).json({
                data: null,
                message: 'Login failed. Wrong password.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const [updated] = await UsersService.updateUser(req.params.id, req.body);
        if (updated) {
            res.json({ message: "User updated successfully!" });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.getPatientsWithQueueDetails = async (req, res) => {
    try {

        const queueList = await QueueService.getQueueListByRoom(roomId);
        console.log('Queue list:', queueList); // Add logging here
        res.json(queueList);
    } catch (error) {
        console.error('Error in controller:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const deleted = await UsersService.deleteUser(req.params.id);
        if (deleted) {
            return res.json({
                message: 'User deleted successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'User not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}
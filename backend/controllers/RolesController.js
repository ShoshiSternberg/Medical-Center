const RolesService = require('../services/RolesService');

exports.findRoleById = async (req, res) => {
    try {
        const role = await RolesService.findRoleById(req.params.id);
        if (role) {
            return res.json({
                data: role,
                message: 'Success.'
            });
        } else {
            return res.status(404).json({
                message: 'Role not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.findAllRoles = async (req, res) => {
    try {
        const roles = await RolesService.findAllRoles();
        return res.json({
            data: roles,
            message: 'Success.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.createRole = async (req, res) => {
    try {
        const newRole = await RolesService.createRole(req.body);
        return res.status(201).json({
            data: newRole,
            message: 'Role created successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.updateRole = async (req, res) => {
    try {
        const updatedRole = await RolesService.updateRole(req.params.id, req.body);
        if (updatedRole[0] === 1) { // Sequelize returns an array with the number of affected rows
            return res.json({
                message: 'Role updated successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'Role not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

exports.deleteRole = async (req, res) => {
    try {
        const deleted = await RolesService.deleteRole(req.params.id);
        if (deleted) {
            return res.json({
                message: 'Role deleted successfully.'
            });
        } else {
            return res.status(404).json({
                message: 'Role not found.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

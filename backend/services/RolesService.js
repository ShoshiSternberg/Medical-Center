const RolesModel = require('../models/RoleModel');

exports.findRoleById = (id) => {
    return RolesModel.findByPk(id);
}

exports.findAllRoles = () => {
    return RolesModel.findAll();
}

exports.createRole = async (roleData) => {
    try {
        const newRole = await RolesModel.create(roleData);
        return newRole;
    } catch (error) {
        throw new Error(error.message);
    }
}

exports.updateRole = (id, roleData) => {
    return RolesModel.update(roleData, {
        where: { ID: id }
    });
}

exports.deleteRole = (id) => {
    return RolesModel.destroy({
        where: { ID: id }
    });
}

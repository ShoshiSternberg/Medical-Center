const HMOModel = require('../models/HMOModel');

exports.findHMOById = (id) => {
    return HMOModel.findByPk(id);
}

exports.findAllHMOs = () => {
    return PatientModel.findAll();
}


exports.updateHMO = (id, HMOData) => {
    return HMOModel.update(HMOData, {
        where: { id: id }
    });
}

exports.deleteHMO = (id) => {
    return HMOModel.destroy({
        where: { id: id }
    });
}

exports.createHMO = async (name) => {
    try {
        const data = {
            Name: name
        };

        const HMOEnter = await HMOModel.create(data);
        
        return HMOEnter;
    } catch (error) {
        throw new Error(error.message);
    }
};
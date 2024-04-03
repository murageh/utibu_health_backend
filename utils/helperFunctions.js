const {DataTypes} = require("sequelize");

const MedicationUnit = DataTypes.ENUM('mg', 'ml', 'tablet', 'capsule', 'injection', 'suppository', 'inhaler', 'patch', 'drop', 'spray', 'solution', 'gel', 'lotion', 'lozenge', 'vial', 'ampule', 'sachet', 'pack', 'bottle', 'tube', 'pack', 'pouch', 'strip', 'pack', 'box', 'bottle', 'jar'); // can be expanded as needed

module.exports = {MedicationUnit};
const {Medication} = require("../models");
const {MedicationUnit} = require("../utils/helperFunctions");

class MedicationResponse {
    constructor(status, message, data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }

    toJSON() {
        return {
            status: this.status,
            message: this.message,
            data: this.data,
        };
    }

    toString() {
        return JSON.stringify(this.toJSON());
    }
}

exports.getMedications = async (req, res) => {
    try {
        const medications = await Medication.findAll();
        return res.status(200).json(new MedicationResponse('success', 'Medications found', medications).toJSON());
    } catch (error) {
        return res.status(500).json(new MedicationResponse('error', 'Failed to fetch medications', null).toJSON());
    }
};

exports.getMedicationUnits = async (req, res) => {
    try {
        const medications = [...new Set([...MedicationUnit.values])];
        return res.status(200).json(new MedicationResponse('success', 'Medication units found', medications).toJSON());
    } catch (error) {
        console.log('error fetching medications', error);
        return res.status(500).json(new MedicationResponse('error', 'Failed to fetch medications', null).toJSON());
    }
}

exports.getMedicationById = async (req, res) => {
    const medicationId = req.params.medicationId;
    try {
        const medication = await Medication.findByPk(medicationId);
        if (!medication) {
            return res.status(404).json(new MedicationResponse('error', 'Medication not found', null).toJSON());
        }
        console.log('getMedicationById', medication.toJSON());
        return res.status(200).json(new MedicationResponse('success', 'Medication found', medication).toJSON());
    } catch (error) {
        console.log('error fetching medication', error);
        return res.status(500).json(new MedicationResponse('error', 'Failed to fetch medication', null).toJSON());
    }
};

exports.createMedication = async (req, res) => {
    const {name, description, stock_level, price, unit} = req.body;

    try {
        const newMedication = await Medication.create({
            name,
            description,
            stock_level,
            price,
            unit
        });
        console.log('newMedication', newMedication.toJSON());
        return res.status(201).json(new MedicationResponse('success', 'Medication created successfully', newMedication).toJSON());
    } catch (error) {
        console.log('error creating medication', error);
        return res.status(500).json(new MedicationResponse('error', 'Failed to create medication', null).toJSON());
    }
}

exports.updateMedication = async (req, res) => {
    const medicationId = req.params.medicationId;
    const {name, description, stock_level, price} = req.body;

    try {
        const medication = await Medication.findByPk(medicationId);
        if (!medication) {
            return res.status(404).json(new MedicationResponse('error', 'Medication not found', null).toJSON());
        }

        medication.name = name;
        medication.description = description;
        medication.stock_level = stock_level;
        medication.price = price;
        await medication.save();

        console.log('updateMedication', medication.toJSON());

        return res.status(200).json(new MedicationResponse('success', 'Medication updated successfully', medication).toJSON());
    } catch (error) {
        console.log('error updating medication', error);
        return res.status(500).json(new MedicationResponse('error', 'Failed to update medication', null).toJSON());
    }
};

// patch for medication stock
exports.updateMedicationStock = async (req, res) => {
    const medicationId = req.params.medicationId;
    const {stock_level} = req.body;

    try {
        const medication = await Medication.findByPk(medicationId);
        if (!medication) {
            return res.status(404).json(new MedicationResponse('error', 'Medication not found', null).toJSON());
        }

        medication.stock_level = stock_level;
        await medication.save();

        console.log('updateMedicationStock', medication.toJSON());

        return res.status(200).json(new MedicationResponse('success', 'Medication stock updated successfully', medication).toJSON());
    } catch (error) {
        console.log('error updating medication stock', error);
        return res.status(500).json(new MedicationResponse('error', 'Failed to update medication stock', null).toJSON());
    }
};
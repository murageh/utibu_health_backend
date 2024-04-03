const {Medication, Prescription, User} = require("../models");

class PrescriptionResponse {
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

exports.createPrescription = async (req, res) => {
    const {user_id, doctor_name, quantity, dosage, refill_count, medication_id} = req.body;

    if (!user_id || !doctor_name || !quantity || !dosage || !refill_count || !medication_id) {
        console.log('found', {
            user_id,
            doctor_name,
            dosage,
            refill_count,
            medication_id,
            quantity,
        })
        return res.status(400).json({message: 'Missing required fields : Expected \`user_id, doctor_name, quantity, dosage, refill_count, medication_id\`'});
    }
    const medication = await Medication.findByPk(medication_id);
    if (!medication) {
        return res.status(400).json({message: 'Invalid medication ID'});
    }

    // verify user_id is valid
    const user = await User.findByPk(user_id);
    if (!user) {
        return res.status(400).json({message: 'Invalid user ID'});
    }

    try {
        const newPrescription = await Prescription.create({
            medication_id,
            user_id,
            doctor_name,
            dosage,
            refill_count,
            quantity,
        });
        console.log('newPrescription', newPrescription.toJSON());
        return res.status(201).json(new PrescriptionResponse('success', 'Prescription created successfully', newPrescription).toJSON());
    } catch (error) {
        console.log('error creating prescription', error);
        return res.status(500).json(new PrescriptionResponse('error', 'Failed to create prescription', null).toJSON());
    }
};

exports.getPrescriptions = async (req, res) => {
    try {
        const role = req.user.role;
        let prescriptions, options = {};

        if (role !== 'pharmacist') {
            console.log('role', role, '-> only fetch prescriptions for current user');
            options = {where: {user_id: req.user.user_id}};
        }
        prescriptions = await Prescription.findAll({
            ...options,
            include: [
                {model: Medication, as: 'medication'},
                {model: User, as: 'user'},
            ], // Include medication details
        });
        console.log('getPrescriptions', prescriptions.map(p => p.toJSON()));
        return res.status(200).json(new PrescriptionResponse('success', 'Prescriptions found', prescriptions).toJSON());
    } catch (error) {
        console.log('error fetching prescriptions', error);
        return res.status(500).json(new PrescriptionResponse('error', 'Failed to fetch prescriptions', null).toJSON());
    }
};

import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.DATABASE_URL || "")

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true, 
        unique: true, 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    specialisation : {type : String },
    degree : {type : String },
    password: { type: String, required: true, minlength: 4, maxlength: 255 },
    fees: { type: Number, default: 150 },
    initialDiscount: { type: Number, default: 10 },
    city: { type: String, default: 'Pune' },
    wallet : {type: Number, default: 0 },
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        trim: true, 
        lowercase: true, 
        unique: true, 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: { type: String, required: true, minlength: 4, maxlength: 16 },
    wallet: { type: Number, default: 500 },
    deposits: [{date: Date,amount: Number}],
    doctorsVisited: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor'}],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
}, { timestamps: true });

const appointmentSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    fees : { type: Number, default: 150 },
    appointmentDate: { type: Date, required: true },
    status: { type: String, default: 'scheduled' },
    notes: { type: String },
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    amountReceived: { type: Number, required: true },
    discountGiven: { type: Number, default: 0 },
    dateTime: { type: Date, default: Date.now },
}, { timestamps: true });

const Transaction = mongoose.model('Transaction', transactionSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Doctor = mongoose.model('Doctor', doctorSchema);

export { Appointment, Transaction, Doctor, Patient };

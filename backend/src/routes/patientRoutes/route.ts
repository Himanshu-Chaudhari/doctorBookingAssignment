
import express, { Request, Response } from 'express';
import z from 'zod';
import jwt from 'jsonwebtoken';
import { Appointment, Doctor, Patient, Transaction } from '../../db/model';
import dotenv from "dotenv";
import { patientAuth, PatientRequest } from '../../auth/auth';
import mongoose, { mongo } from 'mongoose';
import { ClientSession } from 'mongoose';
import { console } from 'inspector';
import { AppointmentType, bookSlotBody, ResponseSignInUpType, SignInBodyType, signInSchema, SignUpBodyType, signUpSchema } from '../../services/types';
dotenv.config();

export const patientRouter = express.Router()

patientRouter.post('/signup', async (req: Request<{}, {}, SignUpBodyType>, res: Response<ResponseSignInUpType>): Promise<any> => {
    const body = req.body;
    try {
        const validationResult = signUpSchema.safeParse(body);
        console.log(validationResult)
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
            });
        }
        const { email, password, name } = validationResult.data;
        const patient = await Patient.create({ email, password, name });
        const id = patient._id;
        const token = jwt.sign({ email ,id}, process.env.JWT_SECRET || "", {
            expiresIn: "1h",
        });

        return res.status(201).json({
            message: "Signup successful",
            token,
        });
    } catch (err) {
        console.error("Error during signup:", err);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
}
);

patientRouter.post('/signin', async (req: Request<{}, {}, SignInBodyType>, res: Response<ResponseSignInUpType>): Promise<any> => {
    const body = req.body;
    try {
        console.log(body)
        const validationResult = signInSchema.safeParse(body);
        console.log(validationResult)
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
            });
        }
        const { email, password } = validationResult.data;
        const patient = await Patient.findOne({
            email
        });

        if (!patient) {
            return res.status(401).json({
                message: "No user found",
            });
        }
        if (patient.password !== password) {
            return res.status(404).json({
                message: "Invalid Password",
            });
        }
        const id = patient._id;

        const token = jwt.sign({ email ,id}, process.env.JWT_SECRET || "", {
            expiresIn: "1h",
        });

        return res.status(201).json({
            message: "SignIn successful",
            token,
        });

    } catch (err: any) {
        console.error("Error during signup:", err);
        if (err.code === 11000) {
            console.error('Duplicate key error:', err.message);
            return res.status(404).json({
                message: 'Email is already registered'
            });
        }
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

patientRouter.post('/deposit', patientAuth, async (req, res: Response): Promise<any> => {
    const amount = req.body.amount;
    const email = (req as PatientRequest).patientEmail;
    if (!amount) {
        return res.status(400).json({message: "Invalid Input"});
    }
    try {
        const patient = await Patient.findOneAndUpdate(
            { email: email },{
                $inc: { wallet: amount },
                $push: { deposits: { date: new Date(), amount } }
            },
            { new: true }
        );
        if (patient) {
            return res.status(200).json({message: "Deposit successful", patient: patient});
        } else {
            return res.status(404).json({message: "Patient not found"});
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
});

patientRouter.get("/alldoctors", patientAuth, async (req, res: Response) => {
    try {
        const result = await Doctor.find({});
        res.json(result);
    } catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({ error: "Failed to fetch doctors" });
    }
});

patientRouter.get("/balance", patientAuth, async (req : PatientRequest, res: Response) => {
    try {
        const patientId = req.patientId
        const result = await Patient.findById(patientId);
        res.status(200).json({ balance : result?.wallet ? result?.wallet : 0 });
    } catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({ error: "Failed to fetch doctors" });
    }
});

patientRouter.post("/bookSlot", patientAuth, async (req, res: Response) => {
    const patientEmail = (req as PatientRequest).patientEmail;
    const patientId = (req as PatientRequest).patientId;
    const body = req.body;
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    try {
        const validation = bookSlotBody.safeParse(body);
        if (!validation.success) {
            res.status(400).json({ message: "Validation failed", errors: validation.error.errors });
            return;
        }
        const { doctorEmail, date , reason , doctorId } = body;
        const existingAppointment = await Appointment.findOne({
            doctor: doctorId,
            appointmentDate: date,
        });
        if (existingAppointment) {
            res.status(201).json({ message: "Doctor Unavailable" });
            return;
        }
        const doctor = await Doctor.findById(doctorId).session(session)
        const patient = await Patient.findById(patientId).session(session)
        let patientBalance = patient?.wallet ? patient?.wallet : 0
        let doctorBalance = doctor?.wallet ? doctor?.wallet : 0
        const isDoctorVisited = await Patient.findOne({
            _id: patientId,
            doctorsVisited: doctorId 
        });
        
        let fees = doctor?.fees ? doctor?.fees : 150
        let discount=0
        console.log(isDoctorVisited)
        if(!isDoctorVisited){
            discount = doctor?.initialDiscount ? doctor?.initialDiscount : 50
            fees = fees - discount
        }
        if(patientBalance < fees){
            res.status(202).json({ message: "unsufficient Balance" });
            return;
        }
        const transaction = await Transaction.create([{
            doctor: doctorId,
            patient: patientId,
            amountReceived: fees,
            discountGiven: discount
        }], { session });
        
        patientBalance -= fees;
        doctorBalance += fees;

        const appointment : AppointmentType[] = await Appointment.create([{
            doctor: doctorId,
            patient: patientId,
            fees : fees,
            appointmentDate: new Date(date),
            notes : reason
        },],
        { session });

        await Patient.findByIdAndUpdate( patientId, {
            $push: { appointments: appointment[0]._id , transactions : transaction[0]._id },
            $addToSet: { doctorsVisited: doctorId }, 
            wallet : patientBalance
        },{ session });
        await Doctor.findByIdAndUpdate(doctorId, {
            $push: { appointments: appointment[0]._id , transactions : transaction[0]._id },
            wallet: doctorBalance
        },{ session });
        await session.commitTransaction();
        res.status(200).json({
            message: "Appointment Scheduled",
            appointment,
        });

        //  200  :- scheduled // 202 :- unsufficient balance // 201 :- doctor unavailable
    } catch (err) {
        await session.abortTransaction();
        console.error("Error occurred: ", err);
        res.status(500).json({ message: err });
    } finally {
        session.endSession();
    }
});

patientRouter.get('/bookedAppointments',patientAuth,async (req: PatientRequest , res: Response)=>{
    const id = req.patientId
    try{
        const response = await Appointment.find({
            patient : id,
            status: 'scheduled'
        }).populate('doctor','name');
        console.log(response)
        res.status(200).json({ data : response})
    }catch(error){
        console.log(error)
        res.status(401).json("Internal Server Error")
    }
})

patientRouter.get('/forReport',patientAuth,async (req: PatientRequest , res: Response)=>{
    const id = req.patientId

    try{
        const appointmentResponse = await Appointment.find({
            patient : id
        }).populate('doctor').populate('patient');

        const patientResponse = await Patient.findById(id).populate('doctorsVisited').populate('appointments').populate('transactions');
        
        console.log("This is response" , appointmentResponse)
        res.status(200).json({ bookings : appointmentResponse , patient : patientResponse})
    }catch(error){
        console.log(error)
        res.status(401).json("Internal Server Error")
    }
})
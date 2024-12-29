import mongoose from "mongoose";
import { z } from "zod";

export interface PatientRequest extends Request {
    patientEmail?: string; 
    patientId?: string;
}
export interface DoctorRequest extends Request {
    doctorEmail?: string;
    doctorId?: string ;
}

export const signUpSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4, "Password must be at least 6 characters long"),
    name: z.string().min(1, "Name is required"),
});

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4, "Password must be at least 6 characters long"),
});

export interface SignUpBodyType {
    email: string;
    password: string;
    name: string;
}

export interface SignInBodyType {
    email: string;
    password: string;
}

export interface ResponseSignInUpType {
    message: string;
    token?: string;
}

export interface SignUpBodyType {
    email: string;
    password: string;
    name: string;
}

export interface SignInBodyType {
    email: string;
    password: string;
}

export interface ResponseSignInUpType {
    message: string;
    token?: string;
}

export const bookSlotBody = z.object({
    doctorEmail: z.string().email(),
    date: z.string(),
    reason : z.string(),
    doctorId : z.string()
});

export interface AppointmentType {
    doctor: mongoose.Types.ObjectId,
    patient: mongoose.Types.ObjectId,
    appointmentDate: Date,
    fees: Number,
    notes?: string | null | undefined,
    _id: mongoose.Types.ObjectId
}
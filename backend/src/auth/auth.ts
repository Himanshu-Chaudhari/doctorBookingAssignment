import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface PatientRequest extends Request {
    patientEmail?: string; 
    patientId?: string;
}
export interface DoctorRequest extends Request {
    doctorEmail?: string;
    doctorId?: string ;
}

export const  patientAuth = (req : Request, res : Response,next : NextFunction)=>{
    const token = req.headers.key as string;
    if (!token) {
        res.status(401).json({ message: "Token Unavailable" });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET || "", (err, decoded) => {
        if (err) {
            res.status(403).json({ error: "Invalid or Expired Token", details: err });
            return;
        }if (decoded && typeof decoded !== 'string') {
            let {email , id} = (decoded as { email: string ,id : string});
            (req as PatientRequest).patientEmail = email;
            (req as PatientRequest).patientId = id;
            console.log("Everthing is fine untill here")
            next()
        } else {
            res.status(400).json({ error: "Invalid token format" });
            return 
        }
    });
} 

export const  doctorAuth =  (req : Request, res : Response , next : NextFunction)=>{
    const token = req.headers.key as string;
    if (!token) {
        res.status(401).json({ message: "Token Unavailable" });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET || "", (err, decoded) => {
        if (err) {
            res.status(403).json({ error: "Invalid or Expired Token", details: err });
            return
        }
        if (decoded && typeof decoded !== 'string') {
            let {email , id} = (decoded as { email: string ,id : string});
            (req as DoctorRequest).doctorEmail = email;
            (req as DoctorRequest).doctorId = id;
            next()
        } else {
            res.status(400).json({ error: "Invalid token format" });
            return 
        }
    });

} 
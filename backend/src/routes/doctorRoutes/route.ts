import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Appointment, Doctor } from '../../db/model';
import { doctorAuth , DoctorRequest } from '../../auth/auth';
import dotenv from "dotenv";
import { ResponseSignInUpType, SignInBodyType, signInSchema, SignUpBodyType, signUpSchema } from '../../services/types';
dotenv.config();

export const doctorRouter = express.Router();

doctorRouter.post('/signup', async (req: Request<{}, {}, SignUpBodyType>, res: Response<ResponseSignInUpType>): Promise<any> => {
    const body = req.body;
    try {
        const validationResult = signUpSchema.safeParse(body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
            });
        }
        const { email, password, name } = validationResult.data;
        console.log("I was here")
        const doctor = await Doctor.create({ email, password, name });
        const id = doctor?._id
        const token = jwt.sign({email,id}, process.env.JWT_SECRET || "", {
            expiresIn: "1h",
        });

        return res.status(201).json({
            message: "Signup successful",
            token,
        });
    } catch (err : any) {
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
}
);

doctorRouter.post('/signin', async (req: Request<{}, {}, SignInBodyType>, res: Response<ResponseSignInUpType>): Promise<any> => {
    const body = req.body;
    try {
        const validationResult = signInSchema.safeParse(body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
            });
        }
        const { email, password } = validationResult.data;
        const doctor = await Doctor.findOne({
            email
        });
        console.log(doctor)
        if (!doctor) {
            return res.status(401).json({
                message: "No user found",
            });
        }
        const id = doctor?._id

        if (doctor.password !== password) {
            return res.status(404).json({
                message: "Invalid Password",
            });
        }
        console.log(email)
        const token = jwt.sign({email,id}, process.env.JWT_SECRET || "", {
            expiresIn: "1h",
        });

        return res.status(201).json({
            message: "SignIn successful",
            token,
        });

    } catch (err) {
        console.error("Error during signin:", err);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
});

doctorRouter.get('/getSchedule',doctorAuth,async (req,res)=>{
    const id = (req as DoctorRequest).doctorId;
    try{
        const response = await Appointment.find({
            doctor: id
        }).populate('patient').populate("doctor");
        console.log(response)
        res.status(200).json({data : response})
    }catch(err){
        console.log(err)
        res.status(500).json({
            message : "Internal server error"
        })
    }
    return
})



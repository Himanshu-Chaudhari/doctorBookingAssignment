import express, { Request, Response } from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
import { doctorRouter } from './routes/doctorRoutes/route';
import { patientRouter } from './routes/patientRoutes/route';

import dotenv from "dotenv";
import { updateAppointmentStatus } from './services/appointment';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*', 
  methods: ["GET", "POST", "PUT", "DELETE"], 
  allowedHeaders: ["Content-Type", "Authorization"], 
  credentials: true,
}));

app.use(bodyParser.json());
app.use(express.json());

app.use('/api/v1/doctor',doctorRouter);
app.use('/api/v1/patient',patientRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

setInterval(updateAppointmentStatus, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

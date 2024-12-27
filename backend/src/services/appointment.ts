import { Appointment } from "../db/model";
export const updateAppointmentStatus = async () => {
    const now = new Date();
    await Appointment.updateMany(
        { appointmentDate: { $lt: now }, status: 'scheduled' },
        { $set: { status: 'due' } }
    );
    console.log("Appointment statuses updated.");
};


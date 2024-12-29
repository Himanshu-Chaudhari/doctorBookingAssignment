import React, { useState } from "react";
import { BookAppointment, DoctorInput } from "../utils/types";
import axios from "axios";


const bookAppointment = async ({ setBalance, appointmentDate, email, reason, _id }: BookAppointment) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/patient/bookSlot`, {
        "doctorEmail": email,
        "date": appointmentDate,
        "reason": reason,
        "doctorId": _id
    }, {
        headers: { key: localStorage.getItem('patientToken') }
    });

    if (response.status === 200) {
        alert(`Slot booked on ${appointmentDate.split('T')[0]} at ${appointmentDate.split('T')[1].split(':')[0]}:00 o'clock`);
        setBalance("0");
    } else if (response.status === 201) {
        alert(`Can't book appointment because Doctor is unavailable`);
    } else if (response.status === 202) {
        alert(`Insufficient Balance`);
    } else {
        alert(`Unable to process your request now`);
    }
};


export const DoctorCard: React.FC<DoctorInput> = ({ city, setBalance, name, specialization, experience, email, fees, _id }) => {
    const [appointmentDate, setAppointmentDate] = useState<string>("");
    const [selectedHour, setSelectedHour] = useState<string>("");
    const [reason, setReason] = useState<string>("");

    const now = new Date();
    const minDate = now.toISOString().slice(0, 10);
    const hours = [10, 11, 12, 13, 17, 18, 19, 20, 21, 22];

    const handleBooking = () => {
        if (!appointmentDate || !selectedHour) {
            alert("Please select a date and time to book the slot.");
            return;
        }
        const [year, month, day] = appointmentDate.split("-").map(Number);
        const appointmentDateTime = new Date(Date.UTC(year, month - 1, day, Number(selectedHour), 0, 0));
        const currentDateTime = new Date();
        if (appointmentDateTime <= currentDateTime) {
            alert("The appointment date and time must be in the future.");
            return;
        }
        bookAppointment({setBalance,appointmentDate: appointmentDateTime.toISOString(),email,reason, _id});
    };
    

    return (
        <div className="p-4 min-h-56 bg-slate-300  text-center  rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800">{name.toUpperCase()}</h2>
            <p className="text-md text-gray-700">Specialization: {specialization || "not mentioned"}</p>
            <p className="text-md text-gray-700">Experience: {experience ? experience + " years" : "not mentioned"}</p>
            <p className="text-md text-gray-700">Location: {city ? city : "not mentioned"}</p>
            <div className="mt-4">
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="appointmentDate">
                    Select Appointment Date:
                </label>
                <input type="date" id="appointmentDate" className="px-5 border rounded-lg" value={appointmentDate} min={minDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
            </div>
            <div className="mt-4">
                <label className="block text-gray-800 text-sm font-medium mb-2" htmlFor="appointmentHour">
                    Select Appointment Slot:
                </label>
                <select id="appointmentHour" className="py-1 border rounded-lg" value={selectedHour} onChange={(e) => setSelectedHour(e.target.value)} required>
                    <option value="">select slot</option>
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour < 10 ? `0${hour}` : hour}:00
                        </option>
                    ))}
                </select>
            </div>
            <textarea onChange={(e) => setReason(e.target.value)} placeholder="Reason for Appointment" className="p-2 my-3 rounded-lg bg-slate-800 text-white" aria-label="Reason for Appointment" />
            <p className="text-md text-gray-700">Appointment Fees: Rs.{fees}</p>
            <button className="mt-4 text-white bg-[#24292F] hover:bg -[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-4 py-2" onClick={() => {
                const confirmation = confirm(`Once the slot is booked, fees will be deducted from the wallet`)
                if (confirmation) { handleBooking() }
            }}
            >
                Book Slot
            </button>
        </div>
    );
};
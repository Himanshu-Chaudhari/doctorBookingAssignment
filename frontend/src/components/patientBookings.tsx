import axios from "axios";
import { useEffect, useState } from "react";
import { Appointment } from "../utils/types";


export default function PatientBookings() {
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);
  const getBookedAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/patient/bookedAppointments`,{  
          headers: {
            key: localStorage.getItem("patientToken") || "",
          },
      });
      if (response.status === 200) {
        setBookedAppointments(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    getBookedAppointments();
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        My Booked Appointments
      </h1>
      {bookedAppointments.length === 0 ? (
        <p className="text-gray-600">No booked appointments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookedAppointments.map((appointment, index) => {
            const appointmentDate = new Date(appointment.appointmentDate);
            const createdAt = new Date(appointment.createdAt);

            return (
              <div
                key={index}
                className="bg-white flex flex-col justify-between rounded-lg shadow-md p-6 min-h-72"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Appointment with Dr. {appointment.doctor.name}
                </h2>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {appointmentDate.toLocaleDateString()} at{" "}
                  {`${appointment.appointmentDate.split('T')[1].split(':')[0]} o'clock`}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  <span className={`${appointment.status === "scheduled"? "text-green-500": "text-red-500" }`} >
                    {appointment.status}
                  </span>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Fees:</span> ₹{appointment.fees}
                </p>
                {appointment.notes && (
                  <p className="text-gray-600">
                    <span className="font-medium">Purpose:</span>{" "}
                    {appointment.notes}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-4">
                  <span className="font-medium">Created At:</span>{" "}
                  {createdAt.toLocaleDateString()}{" "}
                  {createdAt.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition" onClick={() => alert("View Details coming soon!")}>
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

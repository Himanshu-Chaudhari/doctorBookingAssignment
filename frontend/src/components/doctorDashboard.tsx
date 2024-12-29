import axios from "axios";
import { useEffect, useState } from "react";
import { AppointmentType } from "../utils/types";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getAppointments = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/doctor/getSchedule`,
        {
          headers: {
            key: localStorage.getItem("doctorToken") || "",
          },
        }
      );
      console.log(response.data.data)
      if (Array.isArray(response.data.data)) {
        setAppointments(response.data.data);
      } else {
        console.error("Expected an array of appointments, but got:", response.data);
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  if (loading) {
    return <div className="pt-24 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="pt-24 px-8 min-h-screen mb-60">
      <div className="m-auto mb-12 p-6 text-center items-center w-full lg:w-4/6">
        <h1 className="text-3xl font-bold text-slate-800">
          Your Scheduled Appointments
        </h1>
        <p className="text-lg text-gray-600 mt-4">
          Manage your appointments effectively and provide seamless care to your patients.
        </p>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center text-gray-600">
          No appointments scheduled. Your calendar is free.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="p-6 bg-gray-800 text-white rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-bold">Patient Name: {appointment.patient.name}</h3>
              <p className="text-sm text-gray-300 mt-2">
                Appointment Date:
                <span className="font-medium text-green-400">
                {`   ${appointment.appointmentDate.split('T')[0]} at ${appointment.appointmentDate.split('T')[1].split(':')[0]} o'clock`}
                </span>
              </p>
              <div >
              {appointment.notes ? (
                <p className="text-sm text-gray-400 mt-2">
                  Notes: {appointment.notes}
                </p>
                ) : (
                <p className="text-sm text-gray-400 mt-2">
                  No notes
                </p>
              )}
              </div>
        
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

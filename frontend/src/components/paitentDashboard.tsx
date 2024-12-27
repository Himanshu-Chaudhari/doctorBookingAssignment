
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { generatePDF } from "../utils/getReport";

interface DoctorInput {
    name: string;
    specialization: string;
    experience: number;
    email: string;
    fees: string;
    _id: string;
    city: string;
    setBalance: React.Dispatch<React.SetStateAction<string>>;
}

interface BookAppointment {
    reason: string;
    appointmentDate: string;
    email: string;
    _id: string;
    setBalance: React.Dispatch<React.SetStateAction<string>>;
}

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
        if (appointmentDateTime <= new Date()) {
            alert("The appointment date and time must be in the future.");
            return;
        }
        bookAppointment({ setBalance, appointmentDate: appointmentDateTime.toISOString(), email, reason, _id, });
    };


    return (
        <div className="p-4 min-h-56 bg-slate-300  text-center  rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
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

export default function PatientDashboard() {
    const [doctors, setDoctors] = useState<DoctorInput[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [balance, setBalance] = useState<string>('0');
    const [amount, setAmount] = useState<string>('');
    const [showAddMoney, setShowAddMoney] = useState<boolean>(false);
    const navigate = useNavigate()
    const getBalance = async (setBalance: React.Dispatch<React.SetStateAction<string>>) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/patient/balance`, {
                headers: {
                    key: localStorage.getItem("patientToken") || "",
                }
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
        } finally {
            setLoading(false);
        }
    };
    const getDoctors = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/patient/alldoctors`, {
                headers: {
                    key: localStorage.getItem("patientToken") || "",
                }
            });
            console.log(response.data)
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        } finally {
            setLoading(false);
        }
    };

    const depositAmount = async () => {
        if (amount == '' || amount == '0') {
            alert("Please Enter Amount")
            return;
        }
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/patient/deposit`, {
            "amount": amount
        }, {
            headers: { key: localStorage.getItem('patientToken') }
        });
        if (response.status == 200) {
            alert(`Added Rs.${amount} to the wallet`)
            setShowAddMoney(false)
            setBalance("0")
        } else {
            alert("Operation failed")
        }
    }
    useEffect(() => {
        getDoctors();
        getBalance(setBalance);
    }, [balance]);
    if (loading) {
        return <div className="pt-24 text-center text-gray-500">Loading...</div>;
    }
    return (
        <div className="pt-24 px-8 min-h-screen mb-60">
            <div className="m-auto mb-16">
                <div className=" m-auto mb-4 p-6 text-center items-center w-full lg:w-4/6">
                    <h3 className="text-3xl font-medium text-slate-700 rounded-md px-4 py-2 ">
                        Connecting you to expert doctors with exclusive first-time discounts. Your health, our priority.
                    </h3>
                </div>
                <div className="flex m-auto mb-4 p-6 text-center items-center w-1/2 md:w-1/3 lg:w-1/4 bg-gray-800 rounded-lg shadow-lg">
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-2">Your Balance<p className="text-2xl font-bold text-green-400">
                            {balance ? `Rs. ${balance}` : "Rs. 0"}
                        </p></h2>
                    </div>{
                        showAddMoney ?
                            <div>
                                <input onChange={(e) => setAmount(e.target.value)} type="number" className="m-2 p-2 rounded-sm w-7/12" placeholder="Enter Amount"></input>
                                <button onClick={depositAmount} type="button" className="ml-4 text-white bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:ring-gray-600 focus:outline-none font-medium rounded-md px-4 py-2 transition duration-150 ease-in-out ">
                                    Deposit Money
                                </button>
                            </div> : <button onClick={() => setShowAddMoney(!showAddMoney)} type="button" className="ml-4 text-white bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:ring-gray-600 focus:outline-none font-medium rounded-md px-4 py-2 transition duration-150 ease-in-out ">
                                Deposit to Wallet
                            </button>
                    }

                </div>
                <div className="text-center items-center">
                    <button type="button" onClick={() => navigate('/patientBookings')} className="ml-2 text-white bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:ring-gray-600 focus:outline-none font-medium rounded-md px-4 py-2 transition duration-150 ease-in-out ">
                        My Bookings
                    </button>

                    <button onClick={generatePDF} type="button" className="ml-4 text-white bg-gray-900 hover:bg-gray-700 focus:ring-4 focus:ring-gray-600 focus:outline-none font-medium rounded-md px-4 py-2 transition duration-150 ease-in-out ">
                        Complete Report
                    </button>
                </div>
            </div>
            {doctors.length === 0 ? (
                <div>
                    <input placeholder="Enter Appointment Date" className="px-2.5 py-1 rounded-lg bg-black text-white" aria-label="Date of Appointment" />
                    <button type="button" className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg px-2.5 py-1 me-2">
                        Search
                    </button>
                    <div className="mt-4 text-red-500">No doctors available. Please try again later.</div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {doctors.map((doctor) => (
                        <DoctorCard city={doctor.city} setBalance={setBalance} name={doctor.name} experience={doctor.experience} specialization={doctor.specialization} email={doctor.email} fees={doctor.fees} _id={doctor._id} />
                    ))}
                </div>
            )}
        </div>
    );
};
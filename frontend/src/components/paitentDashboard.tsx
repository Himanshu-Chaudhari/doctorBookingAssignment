
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { generatePDF } from "../utils/getReport";
import { DoctorInput } from "../utils/types";
import { DoctorCard } from "./doctorCard";

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
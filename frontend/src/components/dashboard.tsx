import { useState } from "react";
import Auth from "./auth";
import NavbarDB from "./navbar";

export default function Dashboard() {
  const [role, setRole] = useState<"patient" | "doctor" | null>(null);
  const [operation, setOperation] = useState<"SignIn" | "SignUp">("SignUp");

  return (
    <div className=" bg-white text-gray-800">
      {/* Navbar */}
      <NavbarDB setRole={setRole} setOperation={setOperation} />

      {/* Main Content */}
      
        {role !== null ? (
          <Auth operation={operation} role={role} />
        ) : (
          <div className="flex flex-col items-center justify-center h-[70vh] text-center">
            <h1 className="text-5xl font-extrabold mb-6 text-gray-800 drop-shadow-md">
              Welcome to Your Dashboard
            </h1>
            <p className="text-lg mb-8 text-gray-600">
              Get Started
            </p>
            <div className="flex space-x-6">
              <button
                className="bg-blue-100 text-blue-700 px-8 py-4 rounded-lg shadow-lg transform transition hover:scale-105 hover:bg-blue-200"
                onClick={() => setRole("patient")}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">Patient</span>
                  <span className="text-sm text-gray-500">Access your bookings</span>
                </div>
              </button>
              <button
                className="bg-green-100 text-green-700 px-8 py-4 rounded-lg shadow-lg transform transition hover:scale-105 hover:bg-green-200"
                onClick={() => setRole("doctor")}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl font-bold">Doctor</span>
                  <span className="text-sm text-gray-500">Manage appointments</span>
                </div>
              </button>
            </div>
          </div>
          
        )}
    </div>
  );
}

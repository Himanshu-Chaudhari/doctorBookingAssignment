import { useState } from "react";
import { useNavigate } from "react-router";

interface NavbarProps {
    setRole: (role: "patient" | "doctor") => void;
    setOperation: (operation: "SignIn" | "SignUp") => void;
}

export default function NavbarDB({ setRole, setOperation }: NavbarProps) {
    const [showSignInDropdown, setShowSignInDropdown] = useState(false);
    const [showSignUpDropdown, setShowSignUpDropdown] = useState(false);

    const handleSignIn = (role: "patient" | "doctor") => {
        setOperation("SignIn");
        setRole(role);
        setShowSignInDropdown(false);
    };

    const handleSignUp = (role: "patient" | "doctor") => {
        setOperation("SignUp");
        setRole(role);
        setShowSignUpDropdown(false);
    };

    return (
        <div className="flex w-screen justify-between p-2 bg-slate-500 font-bold text-white fixed z-10">
            <div className="text-3xl px-5 py-2.5">Logo</div>
            <div className="relative flex">
                <div className="relative">
                    <button
                        type="button"
                        className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg px-5 py-2.5 me-2"
                        onClick={() => {
                            setShowSignInDropdown((prev) => !prev);
                            setShowSignUpDropdown(false);
                        }}
                    >
                        Sign In
                    </button>
                    {showSignInDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg">
                            <button
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleSignIn("patient")}
                            >
                                Patient
                            </button>
                            <button
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleSignIn("doctor")}
                            >
                                Doctor
                            </button>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <button
                        type="button"
                        className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg px-5 py-2.5"
                        onClick={() => {
                            setShowSignUpDropdown((prev) => !prev);
                            setShowSignInDropdown(false);
                        }}
                    >
                        Sign Up
                    </button>
                    {showSignUpDropdown && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg">
                            <button
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleSignUp("patient")}
                            >
                                Patient
                            </button>
                            <button
                                className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => handleSignUp("doctor")}
                            >
                                Doctor
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export function Navbar(){
    const navigate = useNavigate()
    return (
        <div className="flex w-screen justify-between p-2 bg-slate-500 font-bold text-white fixed z-10">
            <div className="text-3xl px-5 py-2.5">Logo</div>
            <div className="relative flex">
                <div className="relative">
                    <button
                        type="button"
                        className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg px-5 py-2.5 me-2"
                        onClick={() => {
                            navigate('/')
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );

}

import { useState } from "react";
import { signIn, signUp } from "../utils/authUtils";
import { useNavigate } from "react-router";
import { InputProps, Role } from "../utils/types";

const InputElement = ({ label, id, type, placeholder , onChangeFn }: InputProps) => {
    return (
        <div>
            <label htmlFor={id} className="block mb-2 text-sm">
                {label}
            </label>
            <input
                onChange={(e)=> onChangeFn(e.target.value)}
                id={id}
                type={type}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-gray-900 border rounded bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>
    );
};




export default function Auth({ operation , role  }: { operation: string , role : Role }) {
    const navigate = useNavigate()
    console.log(operation , role)
    const [name , setName] = useState("")
    const [email , setEmail] = useState("")
    const [password , setPassword] = useState("")

    const signUpInputs: InputProps[] = [
        {
            label: "Name",
            id: "name",
            type: "text",
            placeholder: "Enter your name",
            onChangeFn: setName
        },
        {
            label: "Email",
            id: "email",
            type: "email",
            placeholder: "Enter your email",
            onChangeFn: setEmail
        },
        {
            label: "Password",
            id: "password",
            type: "password",
            placeholder: "Enter your password",
            onChangeFn: setPassword
        },
    ];

    const signInInputs: InputProps[] = [
        {
            label: "Email",
            id: "email",
            type: "email",
            placeholder: "Enter your email",
            onChangeFn: setEmail
        },
        {
            label: "Password",
            id: "password",
            type: "password",
            placeholder: "Enter your password",
            onChangeFn: setPassword
        },
    ];

    if (operation === "SignUp" || operation === "SignIn") {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-600 text-gray-50">
                <div className="w-10/12 sm:w-4/12 md:w-1/3 lg:w-3/12 p-8 bg-slate-700 rounded shadow-lg">
                    <h1 className="mb-6 text-2xl font-semibold text-center">{operation} as {role}</h1>
                    <div className="space-y-4">
                        { (operation === "SignUp" ? signUpInputs : signInInputs).map((input, index) => (
                            <InputElement
                                onChangeFn={input.onChangeFn}
                                key={index}
                                label={input.label}
                                id={input.id}
                                type={input.type}
                                placeholder={input.placeholder}
                            />
                        ))}
                        <button
                            onClick={()=>{
                                operation === "SignUp" ? signUp({email,password,name,role,navigate}) : signIn({email,password,role,navigate});
                            }}
                            type="submit"
                            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            {operation}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-600 text-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-semibold">Invalid Operation</h1>
                <p className="mt-2 text-sm text-gray-300">
                    Please provide a valid operation prop.
                </p>
            </div>
        </div>
    );
}

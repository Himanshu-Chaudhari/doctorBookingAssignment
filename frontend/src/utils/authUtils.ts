import axios from "axios";
import { NavigateFunction } from "react-router";

interface SignInProps {
    email : String,
    password : String,
    role : "doctor" | "patient" | null,
    navigate : NavigateFunction
}

interface SignUpProps {
    email : String,
    password : String,
    name : String,
    role :  "doctor" | "patient" | null,
    navigate : NavigateFunction
}


export const signIn = async ({email ,password , role , navigate} : SignInProps )=>{
    
    console.log(email,password,role)
    if(email == "" || password == ""){
        alert("Improper Inputs")
        return;
    }
    console.log(`${import.meta.env.VITE_BACKEND_URL}/api/v1/${role}/signin`)
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/${role}/signin` , { 
        email,
        password
    })
    if(response.status == 201){
        localStorage.setItem(`${role}Token`,response.data.token)
        navigate(`${role}Dashboard`)
    }
    console.log(response)
}


export const signUp = async ({email ,password ,name , role ,navigate} : SignUpProps )=>{
    console.log(email,name,password,role)
    if(email == "" || password == ""){
        alert("Improper Inputs")
        return;
    }
    console.log(`${import.meta.env.VITE_BACKEND_URL}/api/v1/${role}/signup`)
    const response =await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/${role}/signup` , { 
        email,
        password,
        name
    })
    if(response.status == 201){
        localStorage.setItem(`${role}Token`,response.data.token)
        navigate(`${role}Dashboard`)
    }
    console.log((response).data)
}




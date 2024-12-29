export type InputProps = {
    label: string;
    id: string;
    type: string;
    placeholder: string;
    onChangeFn : React.Dispatch<React.SetStateAction<string>>
};

export type Role = "patient" | "doctor" | null;

export interface AppointmentType {
  doctor: string;
  patient: {
    name: string;
  };
  appointmentDate: string;
  notes?: string | null | undefined;
  _id: string;
}

export interface NavbarProps {
    setRole: (role: "patient" | "doctor") => void;
    setOperation: (operation: "SignIn" | "SignUp") => void;
}

export interface DoctorInput {
    name: string;
    specialization: string;
    experience: number;
    email: string;
    fees: string;
    _id: string;
    city: string;
    setBalance: React.Dispatch<React.SetStateAction<string>>;
}

export interface BookAppointment {
    reason: string;
    appointmentDate: string;
    email: string;
    _id: string;
    setBalance: React.Dispatch<React.SetStateAction<string>>;
}

export type Appointment = {
    appointmentDate: string; 
    createdAt: string; 
    doctor: {
      name : string
    };
    fees: number; 
    notes?: string; 
    status: string;
  };
  

import './App.css'
import Dashboard from './components/dashboard';
import { BrowserRouter, Routes, Route } from "react-router";
import PaitentDashboard from './components/paitentDashboard';
import DoctorDashboard from './components/doctorDashboard';
import { Navbar } from './components/navbar';
import PatientBookings from './components/patientBookings';
function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patientDashboard" element={<><><Navbar/></><PaitentDashboard /></>} />
        <Route path="/patientBookings" element={<><><Navbar/></><PatientBookings /></>} />
        {/* <Route path="/patientDashboard" element={<><PaitentDashboard /></>} /> */}
        <Route path="/doctorDashboard" element={<><><Navbar/></>< DoctorDashboard/></>} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

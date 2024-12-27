import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Doctor {
    _id: string;
    name: string;
    email: string;
    specialisation: string;
    degree: string;
    fees: number;
}

interface Patient {
    _id: string;
    name: string;
    email: string;
    wallet: number;
    deposits: { date: string; amount: number }[]; // Array of deposit transactions
}

interface Booking {
    appointmentDate: string; // ISO date string
    createdAt: string; // ISO date string
    doctor: Doctor;
    fees: number;
    notes: string; // Reason for the appointment
    status: string;
    patient: Patient;
}

export const generatePDF = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/patient/forReport`, {
            headers: { key: localStorage.getItem("patientToken") },
        });

        const bookings: Booking[] = response.data.bookings;
        const patient: Patient = response.data.patient;

        // Calculate Final Wallet Balance
        const totalFeesSpent = bookings.reduce((sum, booking) => sum + booking.fees, 0);
        const totalDeposits = patient.deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
        const finalWalletBalance = patient.wallet + totalDeposits - totalFeesSpent;

        const doc = new jsPDF();

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Patient Booking Report", doc.internal.pageSize.getWidth() / 2, 20, { align: "center" });

        // Patient Details
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Patient Name: ${patient.name}`, 10, 40);
        doc.text(`Email: ${patient.email}`, 10, 50);
        doc.text(`Initial Wallet Balance: ${patient.wallet} INR`, 10, 60);

        // Deposits Section
        let nextStartY = 70;
        if (patient.deposits.length > 0) {
            doc.text("Deposits:", 10, nextStartY);
            const depositRows = patient.deposits.map((deposit) => [
                new Date(deposit.date).toLocaleString(),
                `${deposit.amount} INR`,
            ]);
            autoTable(doc, {
                head: [["Date", "Amount"]],
                body: depositRows,
                startY: nextStartY + 5,
                theme: "grid",
                styles: { fontSize: 10 },
            });
            nextStartY = doc.previousAutoTable.finalY + 10;
        } else {
            doc.text("No deposits made.", 10, nextStartY);
            nextStartY += 10;
        }

        // Table Data for Bookings
        const tableColumns = ["Appointment Booked Date", "Appointment Scheduled Date", "Doctor", "Fees Paid (INR)", "Reason"];
        const tableRows = bookings.map((booking) => [
            new Date(booking.createdAt).toLocaleString(), // Booked Date
            `${booking.appointmentDate.split('T')[0]}, at ${booking.appointmentDate.split('T')[1].split(':')[0]}:00 o'clock`, // Scheduled Date
            booking.doctor.name, // Doctor Name
            `${booking.fees} INR`, // Fees Paid
            booking.notes || "N/A", // Reason (Notes)
        ]);

        // Auto Table for Bookings
        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: nextStartY,
            theme: "striped",
            styles: { font: "helvetica", fontSize: 10 },
        });

        // Final Wallet Balance
        const finalBalanceY = doc.previousAutoTable.finalY + 10;
        doc.text(`Final Wallet Balance: ${finalWalletBalance} INR`, 10, finalBalanceY);

        // Save the PDF
        doc.save("Patient_Booking_Report.pdf");
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};

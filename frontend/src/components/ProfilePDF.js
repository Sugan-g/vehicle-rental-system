import jsPDF from "jspdf";
import "jspdf-autotable";

export default function generateProfilePDF(user, vehicle, bookings) {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text("User Profile Report", 14, 20);

    // User Info
    doc.setFontSize(14);
    doc.text("User Details", 14, 35);

    doc.autoTable({
        theme: "grid",
        startY: 40,
        head: [["Field", "Value"]],
        body: [
            ["Name", user?.name || "N/A"],
            ["Email", user?.email || "N/A"],
            ["Phone", user?.phone || "N/A"],
            ["Joined On", new Date(user?.createdAt).toLocaleDateString() || "N/A"],
        ],
    });

    // Vehicle Info
    doc.text("Vehicle Details", 14, doc.lastAutoTable.finalY + 15);

    doc.autoTable({
        theme: "grid",
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Field", "Value"]],
        body: [
            ["Make", vehicle?.make || "N/A"],
            ["Model", vehicle?.model || "N/A"],
            ["Price Per Day", vehicle?.pricePerDay || "N/A"],
            ["Year", vehicle?.year || "N/A"],
        ],
    });

    // Booking Info
    doc.text("Booking Summary", 14, doc.lastAutoTable.finalY + 15);

    const bookingTable = bookings.map((b) => [
        b._id,
        new Date(b.startDate).toLocaleDateString(),
        new Date(b.endDate).toLocaleDateString(),
        b.status,
        "₹" + (b.amount || 0),
    ]);

    doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [["ID", "Start", "End", "Status", "Amount"]],
        body: bookingTable.length ? bookingTable : [["-", "-", "-", "-", "-"]],
    });

    // Save File
    const fileName = `${user?.name || "profile"}_report.pdf`;
    doc.save(fileName);
}

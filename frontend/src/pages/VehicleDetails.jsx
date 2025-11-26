import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function VehicleDetails() {
  const { id } = useParams();  // Get the vehicle ID from the URL
  const [vehicle, setVehicle] = useState(null);

  // Fetch vehicle details based on the vehicle ID
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        // Example API call (replace with your actual API or data source)
        const response = await fetch(`https://vehicle-rental-system-pitf.onrender.com/vehicles/${id}`);
        const data = await response.json();
        setVehicle(data);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      }
    };

    fetchVehicleDetails();
  }, [id]);  // Re-fetch if the ID changes

  if (!vehicle) {
    return <div>Loading...</div>;  // Display loading state until data is fetched
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vehicle Details</h1>
      <div className="space-y-4">
        <div><strong>Vehicle ID:</strong> {vehicle.id}</div>
        <div><strong>Model:</strong> {vehicle.model}</div>
        <div><strong>Brand:</strong> {vehicle.brand}</div>
        <div><strong>Price per day:</strong> ${vehicle.pricePerDay}</div>
        <div><strong>Available:</strong> {vehicle.isAvailable ? "Yes" : "No"}</div>
        <div><strong>Description:</strong> {vehicle.description}</div>
      </div>
    </div>
  );
}

export default VehicleDetails;

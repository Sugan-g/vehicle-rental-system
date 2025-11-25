import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import API from "../api/api";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DashboardCharts() {
  const [stats, setStats] = useState({
    booked: 0,
    cancelled: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/bookings/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    };

    fetchStats();
  }, []);

  const pieData = {
    labels: ["Booked", "Cancelled"],
    datasets: [
      {
        data: [stats.booked, stats.cancelled],
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)", // Green
          "rgba(255, 99, 132, 0.8)", // Red
        ],
      },
    ],
  };

  return (
    <div className="mt-16 mb-10">
      <h2 className="text-2xl font-bold text-center mb-8">
        Booking Status Overview
      </h2>

      <div className="bg-white p-4 rounded-lg shadow max-w-sm mx-auto">
        <Pie data={pieData} />
      </div>
    </div>
  );
}

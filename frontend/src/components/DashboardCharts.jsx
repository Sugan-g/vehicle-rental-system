import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function DashboardCharts() {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May"];

  const barData = {
    labels,
    datasets: [
      {
        label: "New Users",
        data: [10, 20, 35, 45, 60],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        label: "Total Revenue",
        data: [1200, 1500, 1800, 2000, 2600],
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: ["Completed", "Pending", "Cancelled"],
    datasets: [
      {
        data: [45, 35, 20],
        backgroundColor: [
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(255, 99, 132, 0.8)",
        ],
      },
    ],
  };

  return (
    <div className="mt-16 mb-10">
      <h2 className="text-2xl font-bold text-center mb-8">Dashboard Analytics</h2>

      {/* BAR */}
      <div className="bg-white p-4 rounded-lg shadow mb-10">
        <h3 className="text-lg font-semibold mb-3">User Growth</h3>
        <Bar data={barData} />
      </div>

      {/* LINE */}
      <div className="bg-white p-4 rounded-lg shadow mb-10">
        <h3 className="text-lg font-semibold mb-3">Revenue Trend</h3>
        <Line data={lineData} />
      </div>

      {/* PIE */}
      <div className="bg-white p-4 rounded-lg shadow max-w-sm mx-auto">
        <h3 className="text-lg font-semibold mb-3 text-center">Booking Status</h3>
        <Pie data={pieData} />
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { fetchAssignmentsForEngineer } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Assignment {
  _id: string;
  allocationPercentage: number;
  role?: string;
  startDate?: string;
  endDate?: string;
  projectId: {
    name: string;
    status: string;
  };
}

export default function MyAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetchAssignmentsForEngineer(user.id)
      .then(setAssignments)
      .catch(() => setAssignments([]))
      .finally(() => setLoading(false));
  }, [user]);

  // Prepare chart data
  const data = {
    labels: assignments.map((a) => a.projectId.name),
    datasets: [
      {
        label: 'Allocation %',
        data: assignments.map((a) => a.allocationPercentage),
        backgroundColor: 'rgba(37, 99, 235, 0.7)'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: {
        display: true,
        text: 'Current Project Allocation'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white border rounded shadow">
      <h1 className="text-3xl font-bold mb-6">My Assignments</h1>
      {loading ? (
        <div>Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div>No assignments found.</div>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr>
                <th className="border border-gray-300 px-3 py-2 text-left">Project</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Role</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Allocation %</th>
                <th className="border border-gray-300 px-3 py-2 text-left">Start Date</th>
                <th className="border border-gray-300 px-3 py-2 text-left">End Date</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment._id} className="odd:bg-gray-50">
                  <td className="border border-gray-300 px-3 py-2">{assignment.projectId.name}</td>
                  <td className="border border-gray-300 px-3 py-2">{assignment.role ?? '-'}</td>
                  <td className="border border-gray-300 px-3 py-2">{assignment.allocationPercentage}%</td>
                  <td className="border border-gray-300 px-3 py-2">
                    {assignment.startDate ? new Date(assignment.startDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="border border-gray-300 px-3 py-2">
                    {assignment.endDate ? new Date(assignment.endDate).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Bar options={options} data={data} />
        </>
      )}
    </div>
  );
}

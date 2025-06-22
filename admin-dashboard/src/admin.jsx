import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaUsers, FaComments, FaCog, FaChartBar } from 'react-icons/fa';

const pieData = [
  { name: 'Active', value: 70 },
  { name: 'Inactive', value: 20 },
  { name: 'Banned', value: 10 },
];

const COLORS = ['#28a745', '#ffc107', '#dc3545'];

const lineData = [
  { name: 'Jan', users: 60 },
  { name: 'Feb', users: 55 },
  { name: 'Mar', users: 75 },
  { name: 'Apr', users: 80 },
  { name: 'May', users: 60 },
  { name: 'Jun', users: 55 },
];

const DashboardCard = ({ title, value, change, color }) => (
  <div className="bg-white p-4 rounded-2xl shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h2 className="text-2xl font-semibold">{value}</h2>
    <p className={`text-sm ${color}`}>{change}</p>
  </div>
);

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
        <nav className="flex flex-col gap-4">
          <a href="#" className="flex items-center gap-2 text-purple-700 font-semibold">
            <FaChartBar /> Dashboard
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-700">
            <FaUsers /> Users
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-700">
            <FaComments /> Chats
          </a>
          <a href="#" className="flex items-center gap-2 text-gray-700">
            <FaCog /> Settings
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-2">Welcome back, Admin</h2>
        <p className="text-gray-500 mb-6">Here's what's happening with your platform today</p>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <DashboardCard title="Total Users" value="1,254" change="+12% from last period" color="text-green-600" />
          <DashboardCard title="Active Chats" value="86" change="+5% from last period" color="text-green-600" />
          <DashboardCard title="Messages Today" value="1,429" change="-3% from last period" color="text-red-600" />
          <DashboardCard title="Avg. Session" value="4.2m" change="+0.5m from last period" color="text-green-600" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} fill="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

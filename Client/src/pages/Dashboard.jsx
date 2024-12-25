import { Bar } from "react-chartjs-2";
import { FaTasks, FaCheckCircle, FaSpinner, FaList } from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// JSON-like object to store task data




// Options for the bar chart
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Tasks by Priority",
    },
  },
  layout: {
    padding: {
      top: 20,
      bottom: 20,
    },
  },
};

// Task table data
const taskTableData = [
  { id: 1, task: "Build Dashboard", createdBy: "Alice", assignedTo: "Bob", dueDate: "2024-12-20" },
  { id: 2, task: "Design UI", createdBy: "Charlie", assignedTo: "Dave", dueDate: "2024-11-15" },
  { id: 3, task: "Write Documentation", createdBy: "Eve", assignedTo: "Frank", dueDate: "2024-10-10" },
];

// Employee table data
const employeeTableData = [
  { id: 1, employee: "Alice", active: "Yes" },
  { id: 2, employee: "Bob", active: "No" },
  { id: 3, employee: "Charlie", active: "Yes" },
  { id: 4, employee: "Alice", active: "Yes" },
  { id: 5, employee: "Bob", active: "No" },
];

const Dashboard = () => {

  const [data,setData] = useState({});


  const fetchdata = async () => {
    try {
      // Add your Authorization token here  
      const Authorization = localStorage.getItem("Token");
  
      const response = await fetch("http://localhost:5000/api/task/fetchdashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${Authorization}`,
          "Content-Type": "application/json", // Optional if the server expects JSON
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json(); // Parse the JSON response  
      setData(data);
    } catch (error) {
      console.log("Error fetching data:", error.message);
    }
  };

  useEffect(()=>{
    fetchdata();
  },[]);


  const taskData = [
    {
      title: "TOTAL TASKS",
      count: data.totalTasksCount,
      lastMonth: 111,
      color: "blue-1000",
      icon: <FaTasks />,
    },
    {
      title: "COMPLETED TASKS",
      count: data.completedTasksCount,
      lastMonth: 50,
      color: "green-600",
      icon: <FaCheckCircle />,
    },
    {
      title: "TASKS IN PROGRESS",
      count: data.inProgressTasksCount,
      lastMonth: data.inProgressTasksCount,
      color: "yellow-600",
      icon: <FaSpinner />,
    },
    {
      title: "TODO",
      count: data.todoTasksCount,
      lastMonth: 21,
      color: "red-600",
      icon: <FaList />,
    },
  ];

  const chartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Tasks by Priority",
        data: [data.highPriorityCount, data.mediumPriorityCount,data.lowPriorityCount],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)", 
          "rgba(54, 162, 235, 0.5)", 
          "rgba(75, 192, 192, 0.5)", 
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  

  return (
    <div className="min-h-screen py-3 bg-gray-100 font-roboto">
      <div className="mx-auto px-2 tilt-in-top-1">



<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {taskData.map((task, index) => (
        <div
          key={index}
            // className={`shadow-md rounded-lg p-4 flex flex-col justify-between items-center text-center border-2  hover:bg-${task.color}-200 transition-all duration-300`}
            className={`shadow-md rounded-lg p-4 flex flex-col justify-between items-center text-center border-2 ${
              task.color === 'red-600'
                ? 'hover:bg-red-200'
                : task.color === 'blue-1000'
                ? 'hover:bg-blue-200'
                : task.color === 'green-600'
                ? 'hover:bg-green-200'
                : task.color === 'yellow-600'
                ? 'hover:bg-yellow-100'
                : ""
            } transition-all duration-600`}
            
        >
          <div className="mb-3">
            <div
              className={`flex items-center justify-center w-10 h-10 bg-${task.color}-500 text-${task.color} rounded-full`}
            >
              {task.icon}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-medium text-green-800 mb-1">{task.title}</h2>
            <p className="text-lg font-bold text-green-900">{task.count}</p>
            <p className="text-xs text-green-600">{task.lastMonth} last month</p>
          </div>
        </div>
      ))}
    </div>

        {/* Bar Chart Section */}
        <div className="mt-6 h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Tables Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Task Table */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-green-200 overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="">
                <tr>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">S.No</th>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Task</th>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Created_By</th>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Assigned_To</th>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Due_Date</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {taskTableData.map((row) => (
                  <tr key={row.id} className="hover:bg-green-100">
                    <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{row.id}</td>
                    <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{row.task}</td>
                    <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{row.createdBy}</td>
                    <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{row.assignedTo}</td>
                    <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{row.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Employee Table */}
          <div className="bg-white shadow-md rounded-lg p-6 border border-green-200 overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-green">
                <tr>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">S.No</th>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Employee</th>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Active</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {employeeTableData.map((row) => (
                  <tr key={row.id} className="hover:bg-green-100">
                    <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{row.id}</td>
                    <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{row.employee}</td>
                    <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{row.active}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;










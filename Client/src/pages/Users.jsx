import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getInitials } from "../utils";

const TeamManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const fetchTeam = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/teamMembers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(data.membersforteam || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching team data:", err.message);
      setLoading(false);
    }
  };

  // const handleAddEmployee = async (data) => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/auth/addemployee", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("Token")}`,
  //       },
  //       body: JSON.stringify(data), // Send the form data as JSON
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP Error: ${response.status}`);
  //     }

  //     const result = await response.json();
  //     toast.success("Employee added successfully!"); // Show success toast
  //     setEmployees((prevEmployees) => [...prevEmployees, result.employee]); // Add new employee to state
  //     setIsModalOpen(false); // Close the modal
  //     reset(); // Reset the form
  //   } catch (err) {
  //     console.error("Error adding employee:", err.message);
  //     toast.error("Failed to add employee. Please try again."); // Show error toast
  //   }
  // };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div className="container mx-auto p-4 fade-in">
      <header className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-green-700">Team</h1>
        {/*<button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
          onClick={() => setIsModalOpen(true)}
        >
          <i className="fas fa-plus mr-2"></i>
          Add Employee
        </button>*/}
      </header>
      <main>
        <div className="bg-white shadow-md rounded-lg p-6 border border-green-200 overflow-x-auto">
          {loading ? (
            <p className="text-center text-green-700">Loading team data...</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-green-700">No employees found.</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
                    Employee
                  </th>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
                    Email
                  </th>
                  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
                    Role
                  </th>
                {/*}  <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {employees.map((employee, index) => (
                  <tr
                    key={index}
                    className="hover:bg-green-100 transition duration-300 ease-in-out"
                  >
                    <td className="py-2 px-4 border-b border-green-200">
                      <div className="flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-3 text-white bg-green-400 font-bold text-lg uppercase">
                          {getInitials(employee.name)}
                        </span>
                        <span className="text-green-800 text-sm sm:text-base">
                          {employee.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b border-green-200 text-sm sm:text-base">
                      {employee.email}
                    </td>
                    <td className="py-2 px-4 border-b border-green-200 text-sm sm:text-base">
                      {employee.role}
                    </td>
                    {/*
                    <td className="py-2 px-4 border-b border-green-200 text-sm sm:text-base">
                      <button className="text-green-500 hover:text-green-700 mr-2 transition duration-300 ease-in-out transform hover:scale-110">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out transform hover:scale-110">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* 
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-green-700 mb-4">Add Employee</h2>
            <form onSubmit={handleSubmit(handleAddEmployee)}>
              <div className="mb-4">
                <label className="block text-sm text-green-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full px-3 py-2 border border-green-300 rounded"
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm text-green-700 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  {...register("title", { required: "Title is required" })}
                  className="w-full px-3 py-2 border border-green-300 rounded"
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm text-green-700 mb-1">Role</label>
                <input
                  type="text"
                  name="role"
                  {...register("role", { required: "Role is required" })}
                  className="w-full px-3 py-2 border border-green-300 rounded"
                />
                {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm text-green-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full px-3 py-2 border border-green-300 rounded"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm text-green-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full px-3 py-2 border border-green-300 rounded"
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div> 
      )}*/}
    </div>
  );
};

export default TeamManagement;


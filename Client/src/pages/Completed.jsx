import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Completed = () => {
    const [taskList, setTaskList] = useState([]);
    const [task, setcardTask] = useState({});
    const [openCard, setOpencard] = useState(false);
    const [loading, setLoading] = useState(true); // Added loading state

    const handleTaskcard = (task) => {
        setcardTask(task);
        setOpencard(true);
    };

    const fetchTasks = async () => {
        setLoading(true); // Set loading to true when fetching tasks
        try {
            const token = localStorage.getItem("Token");
            const response = await fetch(
                "http://localhost:5000/api/task/getcompletedtasks",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const tasks = await response.json();
            setTaskList(tasks.tasks);
        } catch (error) {
            // toast.error("Error fetching tasks");
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false); // Set loading to false after fetching tasks
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div>
            {openCard && task && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 to-green-600"></div>
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                            <span className="text-2xl font-semibold text-green-600">{task.title}</span>
                            <button
                                className="text-2xl font-bold text-gray-500 hover:text-gray-700"
                                onClick={() => setOpencard(false)}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <i className="fas fa-user text-green-600 mr-2 mt-1"></i>
                                <div>
                                    <p className="text-sm font-semibold text-green-600">Assigned To:</p>
                                    <p className="ml-1">{task.Assigned_to ? task.Assigned_to.join(', ') : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <i className="fas fa-calendar-alt text-green-600 mr-2 mt-1"></i>
                                <div>
                                    <p className="text-sm font-semibold text-green-600">Created At:</p>
                                    <p className="ml-1">{task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <i className="fas fa-calendar-day text-green-600 mr-2 mt-1"></i>
                                <div>
                                    <p className="text-sm font-semibold text-green-600">Due Date:</p>
                                    <p className="ml-1">{task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <i className="fas fa-exclamation-circle text-green-600 mr-2 mt-1"></i>
                                <div>
                                    <p className="text-sm font-semibold text-green-600">Priority:</p>
                                    <p className="ml-1">{task.priority || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <i className="fas fa-tasks text-green-600 mr-2 mt-1"></i>
                                <div>
                                    <p className="text-sm font-semibold text-green-600">Stage:</p>
                                    <p className="ml-1">{task.stage || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <i className="fas fa-align-left text-green-600 mr-2 mt-1"></i>
                                <div>
                                    <p className="text-sm font-semibold text-green-600">Description:</p>
                                    <p className="ml-1">{task.description || 'No description available'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Completed Tasks</h2>
                <div className="bg-white shadow-md rounded-lg p-6 border border-green-200 overflow-x-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-32">
                            <div className="loader border-t-4 border-green-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
                        </div>
                    ) : taskList.length === 0 ? (
                        <div className="text-center text-gray-500 py-6">
                            No tasks found.
                        </div>
                    ) : (
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
                                        Task
                                    </th>
                                    <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
                                        Priority
                                    </th>
                                    <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
                                        Assigned Members
                                    </th>
                                    <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
                                        Due_date
                                    </th>
                                    <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
                                        Stage
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {taskList.map((task, index) => (
                                    <tr
                                        key={index}
                                        onClick={() => handleTaskcard(task)}
                                        className={`${task.stage === "todo"
                                                ? "hover:bg-red-200"
                                                : task.stage === "in progress"
                                                    ? "hover:bg-yellow-100"
                                                    : "hover:bg-green-200"
                                            }`}
                                    >
                                        <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">
                                            {task.title}
                                        </td>
                                        <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">
                                            {task.priority}
                                        </td>
                                        <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">
                                            {task.Assigned_to.join(", ")}
                                        </td>
                                        <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">
                                            {task.due_date}
                                        </td>
                                        <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b capitalize">
                                            {task.stage}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Completed;

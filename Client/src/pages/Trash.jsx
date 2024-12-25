// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { TbRestore } from "react-icons/tb";
// import { MdDelete } from "react-icons/md";

// const Trash = () => {
//     const [taskList, setTaskList] = useState([]);
//     const [task, setcardTask] = useState({});
//     const [openCard, setOpencard] = useState(false);
//     const [loading, setLoading] = useState(true); // Added loading state

//     const handleTaskcard = (task) => {
//         setcardTask(task);
//         setOpencard(true);
//     };

//     const fetchTasks = async () => {
//         try {
//             const token = localStorage.getItem('Token');
//             const response = await fetch('http://localhost:5000/api/task/gettrashtasks', {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch tasks');
//             }

//             const tasks = await response.json();
//             setTaskList(tasks.tasks);

//         } catch (error) {
//             toast.error('Error fetching tasks');
//             console.error('Error fetching tasks:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchTasks();
//     }, []);

//     const handleRowClick = (task, e) => {
//         // Only open card if the click wasn't on the Actions column
//         if (!e.target.closest('td').classList.contains('actions-column')) {
//             handleTaskcard(task);
//         }
//     };

//     const handlerestore = async (taskId) => {
//         try {
//             console.log(taskId);
//             const token = localStorage.getItem('Token');
//             const response = await fetch("http://localhost:5000/api/task/restoretask", {
//                 method: "POST", 
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json", 
//                 },
//                 body: JSON.stringify({ taskId }), 
//             });
    
//             if (!response.ok) {
//                 toast.error("Failed to restore the task");
//             } else {
//                 toast.success("Task restored successfully");
    
//                 // Update the task list state by filtering out the restored task from the list
//                 setTaskList(prevTasks => prevTasks.filter(task => task._id !== taskId));
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     };
    

//     return (
//         <div>
//             {openCard && task && (
//                 <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-2xl">
//                         <div className="flex justify-between items-center border-b pb-4 mb-4">
//                             <span className="text-xl font-semibold">{task.title}</span>
//                             <button
//                                 className="text-2xl font-bold text-gray-500 hover:text-gray-700"
//                                 onClick={() => setOpencard(false)}
//                             >
//                                 &times;
//                             </button>
//                         </div>
//                         <div>
//                             <p><strong>Assigned To:</strong> {task.Assigned_to ? task.Assigned_to.join(', ') : 'N/A'}</p>
//                             <p><strong>Created At:</strong> {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}</p>
//                             <p><strong>Due Date:</strong> {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'N/A'}</p>
//                             <p><strong>Priority:</strong> {task.priority || 'N/A'}</p>
//                             <p><strong>Stage:</strong> {task.stage || 'N/A'}</p>
//                             <p><strong>Description:</strong> {task.description || 'No description available'}</p>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <div className="mt-6">
//                 <h2 className="text-2xl font-semibold mb-4">Trashed Tasks</h2>
//                 <div className="bg-white shadow-md rounded-lg p-6 border border-green-200 overflow-x-auto">
//                     {loading ? (
//                         <div className="flex justify-center items-center h-32">
//                             <div className="loader border-t-4 border-green-500 border-solid rounded-full w-12 h-12 animate-spin"></div>
//                         </div>
//                     ) : taskList.length === 0 ? (
//                         <div className="text-center text-gray-500 py-6">
//                             No tasks found.
//                         </div>
//                     ) : (
//                         <table className="min-w-full bg-white">
//                             <thead>
//                                 <tr>
//                                     <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
//                                         Task
//                                     </th>
//                                     <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
//                                         Priority
//                                     </th>
//                                     <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
//                                         Assigned Members
//                                     </th>
//                                     <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
//                                         Due_date
//                                     </th>
//                                     <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
//                                         Stage
//                                     </th>
//                                     <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {taskList.map((task, index) => (
//                                     <tr
//                                         key={index}
//                                         onClick={(e) => handleRowClick(task, e)}
//                                         className={`${task.stage === 'todo'
//                                             ? 'hover:bg-red-200'
//                                             : task.stage === 'in progress'
//                                                 ? 'hover:bg-yellow-100'
//                                                 : 'hover:bg-green-200'
//                                         }`}
//                                     >
//                                         <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{task.title}</td>
//                                         <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{task.priority}</td>
//                                         <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">
//                                             {task.Assigned_to.join(', ')}
//                                         </td>
//                                         <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{task.due_date}</td>
//                                         <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b capitalize">
//                                             {task.stage}
//                                         </td>
//                                         <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b actions-column">
//                                             <div className="flex space-x-2">
//                                                 <button
//                                                     className="text-green-500 hover:text-green-700"
//                                                     onClick={() => handlerestore(task._id)}
//                                                 >
//                                                     <TbRestore />
//                                                 </button>
//                                                 <button
//                                                     className="text-red-500 hover:text-red-700"
//                                                 >
//                                                     <MdDelete />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Trash;





import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { TbRestore } from "react-icons/tb";
import { MdDelete } from "react-icons/md";

const Trash = () => {
    const [taskList, setTaskList] = useState([]);
    const [task, setcardTask] = useState({});
    const [openCard, setOpencard] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal state
    const [deleteTaskId, setDeleteTaskId] = useState(null); // Task ID for deletion

    const handleTaskcard = (task) => {
        setcardTask(task);
        setOpencard(true);
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem("Token");
            const response = await fetch(
                "http://localhost:5000/api/task/gettrashtasks",
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
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleRowClick = (task, e) => {
        if (!e.target.closest("td").classList.contains("actions-column")) {
            handleTaskcard(task);
        }
    };

    const handlerestore = async (taskId) => {
        try {
            const token = localStorage.getItem("Token");
            const response = await fetch(
                "http://localhost:5000/api/task/restoretask",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ taskId }),
                }
            );

            if (!response.ok) {
                toast.error("Failed to restore the task");
            } else {
                toast.success("Task restored successfully");
                setTaskList((prevTasks) =>
                    prevTasks.filter((task) => task._id !== taskId)
                );
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClick = (taskId) => {
        setDeleteTaskId(taskId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const token = localStorage.getItem("Token");
            const response = await fetch(
                "http://localhost:5000/api/task/deletetask",
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ taskId: deleteTaskId }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete the task");
            }

            toast.success("Task deleted successfully");
            setTaskList((prevTasks) =>
                prevTasks.filter((task) => task._id !== deleteTaskId)
            );
        } catch (error) {
            toast.error("Error deleting task");
            console.error("Error deleting task:", error);
        } finally {
            setShowDeleteModal(false);
            setDeleteTaskId(null);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeleteTaskId(null);
    };

    return (
        <div>
            {/* Task details modal */}
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

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <p className="text-lg font-semibold text-center mb-4">
                            Are you sure you want to delete this task?
                        </p>
                        <div className="flex justify-around">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={confirmDelete}
                            >
                                Yes, Delete
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Trashed Tasks</h2>
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
                                    <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {taskList.map((task, index) => (
                                    <tr
                                        key={index}
                                        onClick={(e) => handleRowClick(task, e)}
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
                                        <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b actions-column">
                                            <div className="flex space-x-2">
                                                <button
                                                    className="text-green-500 hover:text-green-700"
                                                    onClick={() => handlerestore(task._id)}
                                                >
                                                    <TbRestore />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700"
                                                    onClick={() => handleDeleteClick(task._id)}
                                                >
                                                    <MdDelete />
                                                </button>
                                            </div>
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

export default Trash;

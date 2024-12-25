import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons

const Tasks = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [task, setcardTask] = useState({});
  const [openCard, setOpencard] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  const user = useSelector((state) => state.auth.user);

  // Open task card
  const handleTaskcard = (task) => {
    setcardTask(task);
    setOpencard(true);
  };

  // Fetch team members
  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('Token');
      const response = await fetch('http://localhost:5000/api/auth/teamMembers', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const members = await response.json();
      setMemberList(members.members);
    } catch (error) {
      toast.error('Error fetching team members');
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false); // Set loading to false after the fetch completes
    }
  };

  // Fetch tasks for the admin
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('Token');
      const response = await fetch('http://localhost:5000/api/task/gettasks', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }


      const tasks = await response.json();
      setTaskList(tasks.tasks);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    if (user && user.isAdmin) {
      fetchMembers();
    }
    fetchTasks();
  }, [user]);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Handle form submission for adding a new task
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('Token');
      const taskData = {
        title: data.task,
        description: data.description,
        due_date: data.dueDate,
        priority: data.priority,
        stage: 'todo',
        Assigned_to: data.assignedMembers || [],
      };

      const response = await fetch('http://localhost:5000/api/task/createtask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      toast.success('Task added successfully!');
      setModalOpen(false);
      fetchTasks(); // Refresh the task list
      reset(); // Clear form data
    } catch (error) {
      toast.error('Error adding task');
      console.error('Error:', error);
    }
  };

  // Edit and Trash handlers
  const handleEdit = (taskId) => {
    console.log('Edit task with ID:', taskId);
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('Token');
      const response = await fetch('http://localhost:5000/api/task/trashthetask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error('Failed to trash the task');
      }

      // Update taskList state by removing the trashed task
      setTaskList((prevTasks) => prevTasks.filter((task) => task._id !== taskId));

      toast.success('Task trashed successfully!');
    } catch (error) {
      toast.error('Error trashing task');
      console.error('Error:', error);
    }
  };

  // Handle row click to open task card
  const handleRowClick = (task, event) => {
    if (event.target.closest('td').classList.contains('action-column')) {
      // If the click is on the action column, do not open the task card
      return;
    }
    handleTaskcard(task); // Open task card if the click is not on the action column
  };

  return (
    <div className="relative p-4">
      {/* Admin button to open modal */}
      {user?.isAdmin ? (
        <button
          onClick={() => setModalOpen(true)}
          className="absolute top-0 right-0 bg-green-500 text-white py-1 px-6 rounded-lg hover:bg-green-600 focus:outline-none mx-0"
        >
          +
        </button>
      ) : null}

      {/* Task Card Modal */}
      {openCard && task && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md sm:w-50 md:max-w-2xl relative">
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

      {/* Modal for adding a new task */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/4 lg:w-2/4 xl:w-2/5 h-[700px] mx-4 sm:mx-6 md:mx-8 lg:mx-10 xl:mx-12 max-h-screen overflow-y-auto">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h2 className="text-2xl font-semibold mb-4 text-center">Add New Task</h2>

              {/* Task Input */}
              <div className="mb-4">
                <label htmlFor="task" className="block mb-2 text-lg">Task</label>
                <input
                  id="task"
                  type="text"
                  {...register('task', { required: 'Task is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                />
                {errors.task && <span className="text-red-500">{errors.task.message}</span>}
              </div>

              {/* Description Input */}
              <div className="mb-4">
                <label htmlFor="description" className="block mb-2 text-lg">Description</label>
                <textarea
                  id="description"
                  {...register('description', { required: 'Description is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                />
                {errors.description && <span className="text-red-500">{errors.description.message}</span>}
              </div>

              {/* Priority Dropdown */}
              <div className="mb-4">
                <label htmlFor="priority" className="block mb-2 text-lg">Priority</label>
                <select
                  id="priority"
                  {...register('priority', { required: 'Priority is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                >
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && <span className="text-red-500">{errors.priority.message}</span>}
              </div>

              {/* Assigned Members */}
              <div className="mb-4">
                <label htmlFor="assignedMembers" className="block mb-2 text-lg">Assigned Members</label>
                <div className="space-y-2">
                  {memberList.map((member, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="checkbox"
                        value={member}
                        {...register('assignedMembers')}
                        className="mr-2"
                      />
                      {member}
                    </label>
                  ))}
                </div>
              </div>

              {/* Due Date */}
              <div className="mb-4">
                <label htmlFor="due_date" className="block mb-2 text-lg">Due Date</label>
                <input
                  id="due_date"
                  type="date"
                  {...register('dueDate', { required: 'Due date is required' })}
                  className="w-full p-3 border border-gray-300 rounded-lg text-lg"
                />
                {errors.dueDate && <span className="text-red-500">{errors.dueDate.message}</span>}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-green-600 focus:outline-none w-full sm:w-auto"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-red-500 text-white py-3 px-6 rounded-lg text-lg hover:bg-red-600 focus:outline-none w-full sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Table */}
      <h2 className="text-2xl font-semibold mb-4 mt-6">Tasks</h2>
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
                <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Task</th>
                <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Priority</th>
                <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Assigned To</th>
                <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Due Date</th>
                <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Stage</th>
                <th className="py-2 px-4 border-b-2 border-green-200 text-left text-sm font-semibold text-green-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskList.map((task, index) => (
                <tr
                  key={index}
                  onClick={(event) => handleRowClick(task, event)} // Pass event to handleRowClick
                  className={`${task.stage === 'todo'
                      ? 'hover:bg-red-200'
                      : task.stage === 'in progress'
                        ? 'hover:bg-yellow-100'
                        : 'hover:bg-green-200'
                    }`}
                >
                  <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{task.title}</td>
                  <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{task.priority}</td>
                  <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">
                    {task.Assigned_to.join(', ')}
                  </td>
                  <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b">{task.due_date}</td>
                  <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b capitalize">
                    {task.stage}
                  </td>
                  <td className="py-2 px-4 text-xs sm:text-sm md:text-base border-b action-column">
                    <div className="flex space-x-2">
                      {user?.isAdmin ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click from firing
                              handleEdit(task._id);
                            }}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click from firing
                              handleDelete(task._id);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click from firing
                            handleEdit(task._id);
                          }}
                          className="text-blue-500 hover:text-blue-700 ps-3"
                        >
                          <FaEdit />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Tasks;
















import { useEffect } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Trash from "./pages/Trash";
import Taskdetails from "./pages/Taskdetails";
import { ToastContainer } from "react-toastify";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Mobilesidebar from "./components/Mobilesidebar";
import { setUser } from "./redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import Completed from "./pages/Completed";
import Inprogress from "./pages/Inprogress";
import Todo from "./pages/Todo";

function Layout() {
  const dispatch = useDispatch();
  const mobilesidebar = useSelector((state) => state.auth.isSidebarOpen);
  // const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  const navigate = useNavigate();

  const token = localStorage.getItem("Token");

  // Redirect to login if no token exists
  useEffect(() => {
    if (!token) {
      navigate("/log-in");
    }
  }, [token, navigate]);

  useEffect(() => {
    async function fetching() {
      if (!token) {
        console.error("No token found. Cannot fetch user data.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/auth/user", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          dispatch(setUser(result.user)); // Set user data in Redux store
        } else if (response.status === 401 || response.status === 403) {
          console.error("Token is invalid or expired. Redirecting to login.");
          localStorage.removeItem("Token"); // Clear the invalid/expired token
          navigate("/log-in", { state: { from: location } });
        } else {
          const error = await response.json();
          console.error("Failed to fetch user data:", error.message || response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    }

    fetching();
  }, [dispatch, token, navigate, location]);

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-1/5 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>

      {mobilesidebar && <Mobilesidebar />}

      <div className="flex-1 overflow-y-auto">
        <Navbar />

        <div className="p-4 2xl:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <main className="w-full min-h-screen bg-[#f3f4f6]">
      <Routes>
        <Route element={<Layout />}>
          <Route index path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/completed/:status" element={<Completed />} />
          <Route path="/in-progress/:status" element={<Inprogress />} />
          <Route path="/todo/:status" element={<Todo />} />
          <Route path="/team" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
          <Route path="/task/:id" element={<Taskdetails />} />
        </Route>

        <Route path="/log-in" element={<Login />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeButton={true}
        pauseOnHover={true}
      />
    </main>
  );
}

export default App;








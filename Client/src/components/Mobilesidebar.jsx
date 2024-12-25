// import React from "react";
import {
  MdDashboard,
  MdOutlinePendingActions,
  MdSettings,
  MdTaskAlt,
} from "react-icons/md";
import { GoTasklist } from "react-icons/go";
import { FaTasks, FaTrashAlt, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";

const linkData = [
  { label: "Dashboard", link: "dashboard", icon: <MdDashboard /> },
  { label: "Tasks", link: "tasks", icon: <FaTasks /> },
  { label: "Completed", link: "completed/completed", icon: <MdTaskAlt /> },
  { label: "In Progress", link: "in-progress/in progress", icon: <MdOutlinePendingActions /> },
  { label: "To Do", link: "todo/todo", icon: <MdOutlinePendingActions /> },
  { label: "Team", link: "team", icon: <FaUsers /> },
  { label: "Trash", link: "trashed", icon: <FaTrashAlt /> },
];

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];
  const sidebarLinks = user?.isAdmin ? linkData : linkData.slice(0, 5);

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }) => (
    <Link
      to={el.link}
      onClick={closeSidebar}
      className={clsx(
        "w-full flex gap-2 px-2 py-2 rounded-tr-xl items-center text-gray-800 text-base hover:bg-[#2564ed2d] hover:text-[#16a34a]",
        path === el.link.split("/")[0] ? "bg-[#16a34a] text-neutral-100" : ""
      )}
    >
      {el.icon}
      <span>{el.label}</span>
    </Link>
  );

  NavLink.propTypes = {
    el: PropTypes.shape({
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    }).isRequired,
  };

  return (
    <div className="fixed top-0 left-0 w-3/4 sm:w-2/3 h-full bg-white z-50 shadow-lg flex flex-col gap-6 p-1 transform transition-transform duration-100">
      {/* Close Button */}
      <div className="flex justify-between items-center mt-4">
        <h1 className="flex gap-1 items-center">
          <p className="bg-[#16a34a] p-2 rounded-full">
            <GoTasklist className="text-white text-2xl font-black" />
          </p>
          <span className="text-l font-bold text-black">TaskManager</span>
        </h1>
        <button
          onClick={closeSidebar}
          className="text-2xl text-gray-700 hover:text-gray-900"
        >
          <IoMdClose />
        </button>
      </div>

      {/* Links */}
      <div className="flex-1 flex flex-col gap-y-1 py-1">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      {/* Settings Button */}
      <div>
        <button className="w-full flex gap-2 p-2 items-center text-lg text-gray-800 hover:bg-[#2564ed2d] hover:text-[#16a34a]">
          <MdSettings />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

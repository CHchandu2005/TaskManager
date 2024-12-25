// import { Menu, Transition,MenuButton ,MenuItem,MenuItems} from "@headlessui/react";
// import { Fragment, useState } from "react";
// import { FaUser, FaUserLock } from "react-icons/fa";
// import { IoLogOutOutline } from "react-icons/io5";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { getInitials } from "../utils";
// import { logout } from "../redux/slices/authSlice";
// import { toast } from "react-toastify";

// const ProfileCard = ({ user, onClose }) => {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg shadow-lg p-6 md:w-96 w-70 ">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Profile Details</h2>
//           <button className="text-gray-500 hover:text-red-500" onClick={onClose}>
//             &times;
//           </button>
//         </div>
//         <div className="flex items-center mb-4">
//           <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
//             {getInitials(user?.name)}
//           </div>
//           <div className="ml-4">
//             <h3 className="text-lg font-semibold">{user?.name}</h3>
//             <p className="text-sm text-gray-600">{user?.title}</p>
//           </div>
//         </div>
//         <table className="table-auto w-full text-left text-sm">
//           <tbody>
//             <tr className="border-b">
//               <th className="py-2 pr-4 font-semibold">Email:</th>
//               <td className="py-2">{user?.email}</td>
//             </tr>
//             <tr className="border-b">
//               <th className="py-2 pr-4 font-semibold">Role:</th>
//               <td className="py-2">{user?.role}</td>
//             </tr>
//             <tr>
//               <th className="py-2 pr-4 font-semibold">Admin:</th>
//               <td className="py-2">{user?.isAdmin ? "Yes" : "No"}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// const UserAvatar = () => {
//   const [open, setOpen] = useState(false);
//   const [openPassword, setOpenPassword] = useState(false);
//   const { user } = useSelector((state) => state.auth);
//   // console.log("User:",user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();


//   const logoutHandler = async () => {
//     try {
//       // Optional: Send logout request to backend
//       // await fetch("http://localhost:5000/api/auth/logout", { method: "POST" });
  
//       // Clear local storage and update Redux state
//       localStorage.clear();
//       dispatch(logout());
  
//       // Redirect to login page
//       navigate("/log-in");
  
//       // Optional: Show success message
//       toast.success("You have been logged out successfully.");
//     } catch (error) {
//       console.error("Logout failed:", error);
//       toast.error("Failed to log out. Please try again.");
//     }
//   };
  

//   return (
//     <>
//       <div>
//         <Menu as='div' className='relative inline-block text-left'>
//           <div>
//             <MenuButton className='w-8 h-8 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-[#16a34a]'>
//               <span className='text-white font-semibold'>
//                 {getInitials(user?.name)}
//               </span>
//             </MenuButton>
//           </div>

//           <Transition
//             as={Fragment}
//             enter='transition ease-out duration-100'
//             enterFrom='transform opacity-0 scale-95'
//             enterTo='transform opacity-100 scale-100'
//             leave='transition ease-in duration-75'
//             leaveFrom='transform opacity-100 scale-100'
//             leaveTo='transform opacity-0 scale-95'
//           >
//             <MenuItems className='absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none'>
//               <div className='p-4'>
//                 <MenuItem>
//                     <button
//                       onClick={() => setOpen(true)}
//                       className='text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
//                     >
//                       <FaUser className='mr-2' aria-hidden='true' />
//                       Profile
//                     </button>
//                 </MenuItem>

//                 <MenuItem>
//                     <button
//                       onClick={() => setOpenPassword(true)}
//                       className={`tetx-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base`}
//                     >
//                       <FaUserLock className='mr-2' aria-hidden='true' />
//                       Change Password
//                     </button>
//                 </MenuItem>

//                 <MenuItem>
//                     <button
//                       onClick={logoutHandler}
//                       className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
//                     >
//                       <IoLogOutOutline className='mr-2' aria-hidden='true' />
//                       Logout
//                     </button>
//                 </MenuItem>
//               </div>
//             </MenuItems>
//           </Transition>
//         </Menu>
//         {open && (
//           <ProfileCard
//             user={user}
//             onClose={() => setOpen(false)}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default UserAvatar;





import { Menu, Transition, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Fragment, useState } from "react";
import { FaUser, FaUserLock } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getInitials } from "../utils";
import { logout } from "../redux/slices/authSlice";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const ProfileCard = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-70 md:w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Profile Details</h2>
          <button className="text-gray-500 hover:text-red-500" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-xl">
            {getInitials(user?.name)}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-600">{user?.title}</p>
          </div>
        </div>
        <table className="table-auto w-full text-left text-sm">
          <tbody>
            <tr className="border-b">
              <th className="py-2 pr-4 font-semibold">Email:</th>
              <td className="py-2">{user?.email}</td>
            </tr>
            <tr className="border-b">
              <th className="py-2 pr-4 font-semibold">Role:</th>
              <td className="py-2">{user?.role}</td>
            </tr>
            <tr>
              <th className="py-2 pr-4 font-semibold">Admin:</th>
              <td className="py-2">{user?.isAdmin ? "Yes" : "No"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ChangePasswordModal = ({ onClose }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    const { newPassword, reEnterPassword } = data;
    if (newPassword !== reEnterPassword) {
      toast.error("Passwords do not match. Please try again.");
      return;
    }
    console.log("Password Data:", data);
    toast.success("Password changed successfully.");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6  w-70 md:w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <button className="text-gray-500 hover:text-red-500" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              {...register("newPassword", { required: "New Password is required" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Re-enter Password</label>
            <input
              type="password"
              {...register("reEnterPassword", { required: "Please re-enter your password" })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
            />
            {errors.reEnterPassword && <p className="text-red-500 text-sm mt-1">{errors.reEnterPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const UserAvatar = () => {
  const [open, setOpen] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      localStorage.clear();
      dispatch(logout());
      navigate("/log-in");
      toast.success("You have been logged out successfully.");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <>
      <div>
        <Menu as='div' className='relative inline-block text-left'>
          <div>
            <MenuButton className='w-8 h-8 2xl:w-12 2xl:h-12 items-center justify-center rounded-full bg-[#16a34a]'>
              <span className='text-white font-semibold'>
                {getInitials(user?.name)}
              </span>
            </MenuButton>
          </div>

          <Transition
            as={Fragment}
            enter='transition ease-out duration-100'
            enterFrom='transform opacity-0 scale-95'
            enterTo='transform opacity-100 scale-100'
            leave='transition ease-in duration-75'
            leaveFrom='transform opacity-100 scale-100'
            leaveTo='transform opacity-0 scale-95'
          >
            <MenuItems className='absolute right-0 mt-2 w-56 origin-top-right divide-gray-100 rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none'>
              <div className='p-4'>
                <MenuItem>
                    <button
                      onClick={() => setOpen(true)}
                      className='text-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base'
                    >
                      <FaUser className='mr-2' aria-hidden='true' />
                      Profile
                    </button>
                </MenuItem>

                <MenuItem>
                    <button
                      onClick={() => setOpenPassword(true)}
                      className={`tetx-gray-700 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <FaUserLock className='mr-2' aria-hidden='true' />
                      Change Password
                    </button>
                </MenuItem>

                <MenuItem>
                    <button
                      onClick={logoutHandler}
                      className={`text-red-600 group flex w-full items-center rounded-md px-2 py-2 text-base`}
                    >
                      <IoLogOutOutline className='mr-2' aria-hidden='true' />
                      Logout
                    </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
        {open && (
          <ProfileCard
            user={user}
            onClose={() => setOpen(false)}
          />
        )}
        {openPassword && (
          <ChangePasswordModal
            onClose={() => setOpenPassword(false)}
          />
        )}
      </div>
    </>
  );
};

export default UserAvatar;

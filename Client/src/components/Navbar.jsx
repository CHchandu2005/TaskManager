// import React from "react";
import { MdOutlineSearch } from "react-icons/md";
import { useDispatch} from "react-redux";
import { setOpenSidebar } from "../redux/slices/authSlice";
import UserAvatar from "./Useravatar";
import NotificationPanel from "./NotificationPanel";

const Navbar = () => {
  const dispatch = useDispatch();



  return (
    <div className='flex justify-between items-center bg-white px-2 py-3 2xl:py-4 sticky z-10 top-0'>
      <div className='flex gap-1'>
        <button
          onClick={() => dispatch(setOpenSidebar(true))}
          className='text-xl text-gray-500 block md:hidden'
        >
          ☰
        </button>

        <div className='w-[200px] 2xl:w-[400px] flex items-center py-2 px-3 gap-2 rounded-full bg-[#f3f4f6]'>
          <MdOutlineSearch className='text-gray-500 text-xl' />

          <input
            type='text'
            placeholder='Search....'
            className='flex-1 outline-none bg-transparent placeholder:text-gray-500 text-gray-800'
          />
        </div>
      </div>

      <div className='flex gap-3 items-center'>
        <NotificationPanel />

        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
// import React from 'react';
// import { IoIosNotifications } from "react-icons/io";

// const NotificationPanel = () => {
//   return (
//     <div className="flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 shadow-md cursor-pointer hover:bg-gray-200 
//                     w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"style={{padding:"2px"}}>
//       <IoIosNotifications className="text-gray-600 text-lg sm:text-xl lg:text-2xl" />
//     </div>
//   );
// };

// export default NotificationPanel;



// import React, { useState } from 'react';
// import { IoIosNotifications } from "react-icons/io";
// import { FaTimes } from "react-icons/fa";

// const notifications = [
//   { id: 1, message: "New user signed up!", icon: "👤" },
//   { id: 2, message: "Server restarted successfully.", icon: "🔄" },
//   { id: 3, message: "New comment on your post.", icon: "💬" },
// ];

// const NotificationPanel = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [notificationList, setNotificationList] = useState(notifications);

//   const handleRemoveNotification = (id) => {
//     setNotificationList((prev) => prev.filter((notification) => notification.id !== id));
//   };

//   return (
//     <div className="relative">
//       {/* Notification Icon */}
//       <div
//         className="flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 shadow-md cursor-pointer hover:bg-gray-200 
//                     w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
//         style={{ padding: "2px" }}
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <IoIosNotifications className="text-gray-600 text-lg sm:text-xl lg:text-2xl" />
//       </div>

//       {/* Notifications Dropdown */}
//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 shadow-lg rounded-lg">
//           <div className="p-4 bg-green-500 text-white font-semibold text-center rounded-t-lg">
//             Notifications
//           </div>
//           <ul className="divide-y divide-gray-200">
//             {notificationList.length > 0 ? (
//               notificationList.map((notification) => (
//                 <li
//                   key={notification.id}
//                   className="flex items-center justify-between p-4 hover:bg-gray-100"
//                 >
//                   <div className="flex items-center">
//                     <span className="text-2xl mr-3">{notification.icon}</span>
//                     <span className="text-gray-700">{notification.message}</span>
//                   </div>
//                   <button
//                     className="text-red-500 hover:text-red-700"
//                     onClick={() => handleRemoveNotification(notification.id)}
//                   >
//                     <FaTimes />
//                   </button>
//                 </li>
//               ))
//             ) : (
//               <li className="p-4 text-center text-gray-500">No notifications available</li>
//             )}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationPanel;




import React, { useState, useRef, useEffect } from 'react';
import { IoIosNotifications } from 'react-icons/io';
import { FaTimes } from 'react-icons/fa';

const notifications = [
  { id: 1, message: 'New user signed up!', icon: '👤' },
  { id: 2, message: 'Server restarted successfully.', icon: '🔄' },
  { id: 3, message: 'New comment on your post.', icon: '💬' },
];

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);
  const panelRef = useRef(null);

  const handleRemoveNotification = (id) => {
    setNotificationList((prev) => prev.filter((notification) => notification.id !== id));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={panelRef}>
      {/* Notification Icon with Badge */}
      <button
        className="relative flex items-center justify-center rounded-full bg-gray-100 border border-gray-300 shadow-md cursor-pointer hover:bg-gray-200 
                   w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 focus:outline-none"
        aria-label="Open notifications"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoIosNotifications className="text-gray-600 text-base sm:text-lg lg:text-xl" />
        {notificationList.length > 0 && (
          <span
            className="absolute top-1 right-2 transform translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs sm:text-sm font-bold rounded-full w-5 h-5 
                       flex items-center justify-center border border-white"
          >
            {notificationList.length}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-60 sm:w-72 lg:w-80 bg-white border border-gray-300 shadow-lg rounded-lg z-50"
          role="dialog"
          aria-labelledby="notifications-heading"
        >
          <div
            id="notifications-heading"
            className="p-2 sm:p-4 bg-green-500 text-white font-semibold text-sm sm:text-base text-center rounded-t-lg"
          >
            Notifications
          </div>
          <ul className="divide-y divide-gray-200">
            {notificationList.length > 0 ? (
              notificationList.map((notification) => (
                <li
                  key={notification.id}
                  className="flex items-center justify-between p-2 sm:p-4 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <span className="text-lg sm:text-xl mr-2 sm:mr-3">{notification.icon}</span>
                    <span className="text-gray-700 text-sm sm:text-base">
                      {notification.message}
                    </span>
                  </div>
                  <button
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label={`Remove notification: ${notification.message}`}
                    onClick={() => handleRemoveNotification(notification.id)}
                  >
                    <FaTimes className="text-sm sm:text-base" />
                  </button>
                </li>
              ))
            ) : (
              <li className="p-4 text-center text-gray-500 text-sm sm:text-base">
                No notifications available
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;

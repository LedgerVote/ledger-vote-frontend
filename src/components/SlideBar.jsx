import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sidebarItems } from '../constants/sidebarItems';
import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from '../context/ThemeContext';

function SlideBar() {
  const { theme, setTheme } = useTheme();
  //const { theme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
    <div className={`${theme ? "dark" : ""}`}>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        aria-controls="default-sidebar"
        aria-expanded={isSidebarOpen}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.href}
                  className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  onClick={() => setIsSidebarOpen(false)} // Close sidebar when a link is clicked
                >
                  <svg
                    className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 22 21"
                  >
                    <path d={item.icon} />
                    {item.iconPath2 && <path d={item.iconPath2} />}
                  </svg>
                  <span className="ms-3">{item.name}</span>

                  {item.badge && (
                    <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">
                      {item.badge.text}
                    </span>
                  )}

                  {item.notification && (
                    <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                      {item.notification.count}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center mt-4 space-x-2 text-gray-900 dark:text-white">
            <button 
              onClick={() => setTheme("light")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center"
              aria-label="Light theme"
            >
              <LuSun className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center"
              aria-label="Dark theme"
            >
              <LuMoon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile (click to close sidebar) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      </div>
    </>
  );
}

export default SlideBar;
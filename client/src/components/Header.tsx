import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  onMobileMenuClick: () => void;
}

export default function Header({ onMobileMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 shadow">
      <button 
        className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-500 md:hidden"
        onClick={onMobileMenuClick}
      >
        <span className="material-icons">menu</span>
      </button>
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-2xl">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-icons text-gray-400 text-sm">search</span>
              </span>
              <input 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary transition duration-150 ease-in-out text-sm" 
                placeholder="Search for content, trends, or analytics" 
                type="search"
              />
            </div>
          </div>
        </div>
        <div className="ml-4 flex items-center md:ml-6 space-x-3">
          {/* Dark Mode Toggle */}
          <button 
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${isDark ? 'bg-primary' : 'bg-gray-200'}`}
            onClick={toggleTheme}
            aria-pressed={isDark}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span 
              className={`toggle-circle pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${isDark ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
          
          <button className="p-1 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <span className="material-icons">notifications</span>
          </button>
          
          <button className="p-1 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            <span className="material-icons">help_outline</span>
          </button>
        </div>
      </div>
    </div>
  );
}

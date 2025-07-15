import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';

const Navbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const { aToken, setAToken } = useContext(AdminContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logout = () => {
    navigate('/');
    dToken && setDToken('');
    dToken && localStorage.removeItem('dToken');
    aToken && setAToken('');
    aToken && localStorage.removeItem('aToken');
    setShowDropdown(false);
  };

  const getDisplayName = () => {
    if (aToken) return 'Admin';
    if (dToken) return 'Doctor';
    return 'User';
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white shadow-sm">
      <div className="flex items-center gap-2 text-xs">
        <img
          onClick={() => navigate('/')}
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? 'Admin Panel' : 'Doctor Panel'}
        </p>
      </div>

      {/* User Info and Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <div
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="flex flex-col items-end">
            <p className="text-sm font-medium text-gray-700">
              {getDisplayName()}
            </p>
            <p className="text-xs text-gray-500">Welcome back!</p>
          </div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            {getDisplayName().charAt(0)}
          </div>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              showDropdown ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-medium text-gray-900">
                {getDisplayName()}
              </p>
              <p className="text-xs text-gray-500">
                {aToken ? 'Administrator' : 'Medical Professional'}
              </p>
            </div>
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;

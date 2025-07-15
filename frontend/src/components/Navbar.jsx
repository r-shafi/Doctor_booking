import { useContext, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);
  const { token, userData, logout, loading } = useContext(AppContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
      <img
        onClick={() => navigate('/')}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Prescripto Logo"
      />
      <ul className="md:flex items-start gap-5 font-medium hidden">
        <NavLink to="/">
          <li className="py-1">HOME</li>
          <hr
            className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${
              isActiveRoute('/') ? 'block' : 'hidden'
            }`}
          />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">ALL DOCTORS</li>
          <hr
            className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${
              isActiveRoute('/doctors') ||
              location.pathname.startsWith('/doctors/')
                ? 'block'
                : 'hidden'
            }`}
          />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">ABOUT</li>
          <hr
            className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${
              isActiveRoute('/about') ? 'block' : 'hidden'
            }`}
          />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">CONTACT</li>
          <hr
            className={`border-none outline-none h-0.5 bg-primary w-3/5 m-auto ${
              isActiveRoute('/contact') ? 'block' : 'hidden'
            }`}
          />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4 ">
        {token && userData ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            {loading.userProfile ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : (
              <img
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                src={userData.image || assets.profile_pic}
                alt="Profile"
              />
            )}
            <span className="hidden md:block text-gray-700 font-medium">
              {userData.name}
            </span>
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
            <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
              <div className="min-w-48 bg-white shadow-lg rounded-lg border flex flex-col gap-1 p-2">
                <p
                  onClick={() => navigate('/my-profile')}
                  className="hover:bg-gray-50 px-3 py-2 rounded cursor-pointer transition-colors"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate('/my-appointments')}
                  className="hover:bg-gray-50 px-3 py-2 rounded cursor-pointer transition-colors"
                >
                  My Appointments
                </p>
                <hr className="my-1" />
                <p
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-600 px-3 py-2 rounded cursor-pointer transition-colors"
                >
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block hover:bg-primary/90 transition-colors"
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden cursor-pointer"
          src={assets.menu_icon}
          alt="Menu"
        />

        {/* ---- Mobile Menu ---- */}
        <div
          className={`md:hidden ${
            showMenu ? 'fixed w-full' : 'h-0 w-0'
          } right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} className="w-36" alt="Logo" />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              className="w-7 cursor-pointer"
              alt="Close"
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              <p className="px-4 py-2 rounded full inline-block hover:bg-gray-100 transition-colors">
                HOME
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              <p className="px-4 py-2 rounded full inline-block hover:bg-gray-100 transition-colors">
                ALL DOCTORS
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              <p className="px-4 py-2 rounded full inline-block hover:bg-gray-100 transition-colors">
                ABOUT
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              <p className="px-4 py-2 rounded full inline-block hover:bg-gray-100 transition-colors">
                CONTACT
              </p>
            </NavLink>
            {token && userData && (
              <>
                <hr className="w-full my-2" />
                <NavLink onClick={() => setShowMenu(false)} to="/my-profile">
                  <p className="px-4 py-2 rounded full inline-block hover:bg-gray-100 transition-colors">
                    My Profile
                  </p>
                </NavLink>
                <NavLink
                  onClick={() => setShowMenu(false)}
                  to="/my-appointments"
                >
                  <p className="px-4 py-2 rounded full inline-block hover:bg-gray-100 transition-colors">
                    My Appointments
                  </p>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded full inline-block hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            )}
            {!token && (
              <button
                onClick={() => {
                  navigate('/login');
                  setShowMenu(false);
                }}
                className="bg-primary text-white px-6 py-2 rounded-full mt-4 hover:bg-primary/90 transition-colors"
              >
                Login
              </button>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = '$';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem('token') ? localStorage.getItem('token') : ''
  );
  const [userData, setUserData] = useState(false);

  // Loading states for better UX
  const [loading, setLoading] = useState({
    doctors: false,
    userProfile: false,
    appointments: false,
    bookingAppointment: false,
    cancellingAppointment: false,
    updatingProfile: false,
  });

  const setLoadingState = (key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  // Getting Doctors using API
  const getDoctosData = async () => {
    try {
      setLoadingState('doctors', true);
      const { data } = await axios.get(backendUrl + '/api/doctor/list');
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingState('doctors', false);
    }
  };

  // Getting User Profile using API
  const loadUserProfileData = async () => {
    try {
      setLoadingState('userProfile', true);
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
        headers: { token },
      });

      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingState('userProfile', false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserData(false);
    toast.success('Logged out successfully');
  };

  useEffect(() => {
    getDoctosData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    doctors,
    getDoctosData,
    currencySymbol,
    backendUrl,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    loading,
    setLoadingState,
    logout,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;

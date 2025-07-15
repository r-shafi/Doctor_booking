import axios from 'axios';
import { createContext, useCallback, useState } from 'react';
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [aToken, setAToken] = useState(
    localStorage.getItem('aToken') ? localStorage.getItem('aToken') : ''
  );

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [dashData, setDashData] = useState(false);

  // Loading states for better UX
  const [isLoading, setIsLoading] = useState({
    doctors: false,
    appointments: false,
    dashboard: false,
    cancellingAppointment: false,
    changingAvailability: false,
  });

  const setLoadingState = (key, value) => {
    setIsLoading((prev) => ({ ...prev, [key]: value }));
  };

  // Getting all Doctors data from Database using API
  const getAllDoctors = useCallback(async () => {
    try {
      setLoadingState('doctors', true);
      const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', {
        headers: { aToken },
      });
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingState('doctors', false);
    }
  }, [aToken, backendUrl]);

  // Function to change doctor availablity using API
  const changeAvailability = useCallback(
    async (docId) => {
      try {
        setLoadingState('changingAvailability', true);
        const { data } = await axios.post(
          backendUrl + '/api/admin/change-availability',
          { docId },
          { headers: { aToken } }
        );
        if (data.success) {
          toast.success(data.message);
          getAllDoctors();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoadingState('changingAvailability', false);
      }
    },
    [aToken, backendUrl, getAllDoctors]
  );

  // Getting all appointment data from Database using API
  const getAllAppointments = useCallback(async () => {
    try {
      setLoadingState('appointments', true);
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoadingState('appointments', false);
    }
  }, [aToken, backendUrl]);

  // Getting Admin Dashboard data from Database using API
  const getDashData = useCallback(async () => {
    try {
      setLoadingState('dashboard', true);
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', {
        headers: { aToken },
      });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingState('dashboard', false);
    }
  }, [aToken, backendUrl]);

  // Function to cancel appointment using API
  const cancelAppointment = useCallback(
    async (appointmentId) => {
      try {
        setLoadingState('cancellingAppointment', true);
        const { data } = await axios.post(
          backendUrl + '/api/admin/cancel-appointment',
          { appointmentId },
          { headers: { aToken } }
        );

        if (data.success) {
          toast.success(data.message);
          getAllAppointments();
          // Also refresh dashboard data
          getDashData();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      } finally {
        setLoadingState('cancellingAppointment', false);
      }
    },
    [aToken, backendUrl, getAllAppointments, getDashData]
  );

  const value = {
    aToken,
    setAToken,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    getAllAppointments,
    getDashData,
    cancelAppointment,
    dashData,
    isLoading,
    setLoadingState,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;

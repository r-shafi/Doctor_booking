import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import LoadingButton from '../components/LoadingButton';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import { AppContext } from '../context/AppContext';

const MyAppointments = () => {
  const { backendUrl, token, loading, setLoadingState } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState('');
  const [cancellingId, setCancellingId] = useState('');
  const [payingId, setPayingId] = useState('');

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_');
    return (
      dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
    );
  };

  // Getting User Appointments Data Using API
  const getUserAppointments = async () => {
    try {
      setLoadingState('appointments', true);
      const { data } = await axios.get(backendUrl + '/api/user/appointments', {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingState('appointments', false);
    }
  };

  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);
      const { data } = await axios.post(
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setCancellingId('');
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Appointment Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verifyRazorpay',
            response,
            { headers: { token } }
          );
          if (data.success) {
            toast.success('Payment successful!');
            getUserAppointments();
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        } finally {
          setPayingId('');
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Function to make payment using razorpay
  const appointmentRazorpay = async (appointmentId) => {
    try {
      setPayingId(appointmentId);
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-razorpay',
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
        setPayingId('');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setPayingId('');
    }
  };

  // Function to make payment using stripe
  const appointmentStripe = async (appointmentId) => {
    try {
      setPayingId(appointmentId);
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-stripe',
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
        setPayingId('');
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setPayingId('');
    }
  };

  const getAppointmentStatus = (item) => {
    if (item.cancelled) return { status: 'cancelled', color: 'red' };
    if (item.isCompleted) return { status: 'completed', color: 'green' };
    if (item.payment) return { status: 'confirmed', color: 'blue' };
    return { status: 'pending', color: 'yellow' };
  };

  const AppointmentSkeleton = () => (
    <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b">
      <SkeletonLoader className="w-36 h-36" />
      <div className="flex-1 space-y-2">
        <SkeletonLoader className="h-5 w-40" />
        <SkeletonLoader className="h-4 w-32" />
        <SkeletonLoader className="h-4 w-48" />
        <SkeletonLoader className="h-4 w-36" />
        <SkeletonLoader className="h-4 w-44" />
      </div>
      <div className="space-y-2">
        <SkeletonLoader className="h-10 w-32" />
        <SkeletonLoader className="h-10 w-32" />
      </div>
    </div>
  );

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!token) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg mb-4">
          Please log in to view your appointments
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-3 mt-12 border-b">
        <p className="text-lg font-medium text-gray-600">My Appointments</p>
        {appointments.length > 0 && (
          <button
            onClick={getUserAppointments}
            className="text-primary hover:text-primary/80 text-sm flex items-center gap-1"
            disabled={loading.appointments}
          >
            {loading.appointments ? <LoadingSpinner size="sm" /> : '↻'} Refresh
          </button>
        )}
      </div>

      {loading.appointments ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <AppointmentSkeleton key={index} />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg mb-2">No appointments found</p>
          <p className="text-gray-400 text-sm mb-6">
            Book your first appointment with a doctor
          </p>
          <button
            onClick={() => navigate('/doctors')}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Find Doctors
          </button>
        </div>
      ) : (
        <div className="space-y-0">
          {appointments.map((item, index) => {
            const statusInfo = getAppointmentStatus(item);
            return (
              <div
                key={index}
                className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b hover:bg-gray-50 transition-colors"
              >
                <div>
                  <img
                    className="w-36 h-36 bg-[#EAEFFF] object-cover rounded-lg"
                    src={item.docData.image}
                    alt={`Dr. ${item.docData.name}`}
                    onError={(e) => {
                      e.target.src = '/placeholder-doctor.png';
                    }}
                  />
                  <div
                    className={`inline-flex px-2 py-1 text-xs rounded-full mt-2 ${
                      statusInfo.color === 'green'
                        ? 'bg-green-100 text-green-800'
                        : statusInfo.color === 'blue'
                        ? 'bg-blue-100 text-blue-800'
                        : statusInfo.color === 'red'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {statusInfo.status.toUpperCase()}
                  </div>
                </div>
                <div className="flex-1 text-sm text-[#5E5E5E]">
                  <p className="text-[#262626] text-base font-semibold">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-600">{item.docData.speciality}</p>
                  <p className="text-[#464646] font-medium mt-2">Address:</p>
                  <p className="text-gray-600">{item.docData.address.line1}</p>
                  <p className="text-gray-600">{item.docData.address.line2}</p>
                  <p className="mt-2">
                    <span className="text-sm text-[#3C3C3C] font-medium">
                      Date & Time:
                    </span>
                    <span className="ml-2">
                      {slotDateFormat(item.slotDate)} | {item.slotTime}
                    </span>
                  </p>
                  {item.fees && (
                    <p className="mt-1">
                      <span className="text-sm text-[#3C3C3C] font-medium">
                        Fee:
                      </span>
                      <span className="ml-2 font-semibold">${item.fees}</span>
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 justify-end text-sm">
                  {!item.cancelled &&
                    !item.payment &&
                    !item.isCompleted &&
                    payment !== item._id && (
                      <button
                        onClick={() => setPayment(item._id)}
                        className="text-[#696969] sm:min-w-48 py-2 px-4 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                      >
                        Pay Online
                      </button>
                    )}

                  {!item.cancelled &&
                    !item.payment &&
                    !item.isCompleted &&
                    payment === item._id && (
                      <div className="space-y-2">
                        <LoadingButton
                          onClick={() => appointmentStripe(item._id)}
                          loading={payingId === item._id}
                          className="sm:min-w-48 py-2 border rounded hover:bg-gray-100 flex items-center justify-center"
                          variant="outline"
                        >
                          <img
                            className="max-w-20 max-h-5"
                            src={assets.stripe_logo}
                            alt="Stripe"
                          />
                        </LoadingButton>
                        <LoadingButton
                          onClick={() => appointmentRazorpay(item._id)}
                          loading={payingId === item._id}
                          className="sm:min-w-48 py-2 border rounded hover:bg-gray-100 flex items-center justify-center"
                          variant="outline"
                        >
                          <img
                            className="max-w-20 max-h-5"
                            src={assets.razorpay_logo}
                            alt="Razorpay"
                          />
                        </LoadingButton>
                      </div>
                    )}

                  {!item.cancelled && item.payment && !item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border rounded text-[#696969] bg-[#EAEFFF] cursor-default">
                      Paid ✓
                    </button>
                  )}

                  {item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500 cursor-default">
                      Completed ✓
                    </button>
                  )}

                  {!item.cancelled && !item.isCompleted && (
                    <LoadingButton
                      onClick={() => cancelAppointment(item._id)}
                      loading={cancellingId === item._id}
                      className="sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                      variant="outline"
                    >
                      Cancel appointment
                    </LoadingButton>
                  )}

                  {item.cancelled && !item.isCompleted && (
                    <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 cursor-default">
                      Cancelled ✗
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;

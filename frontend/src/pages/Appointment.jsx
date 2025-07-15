import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import LoadingButton from '../components/LoadingButton';
import LoadingSpinner from '../components/LoadingSpinner';
import RelatedDoctors from '../components/RelatedDoctors';
import { AppContext } from '../context/AppContext';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData, loading } =
    useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState('');
  const [booking, setBooking] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    if (docInfo) {
      setDocInfo(docInfo);
    } else {
      toast.error('Doctor not found');
      navigate('/doctors');
    }
  };

  const getAvailableSolts = async () => {
    if (!docInfo) return;

    setSlotsLoading(true);
    setDocSlots([]);

    // getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + '_' + month + '_' + year;
        const slotTime = formattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          // Add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }

    setSlotsLoading(false);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning('Please login to book appointment');
      return navigate('/login');
    }

    if (!slotTime) {
      toast.error('Please select a time slot');
      return;
    }

    const date = docSlots[slotIndex][0].datetime;

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const slotDate = day + '_' + month + '_' + year;

    try {
      setBooking(true);
      const { data } = await axios.post(
        backendUrl + '/api/user/book-appointment',
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate('/my-appointments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || 'Failed to book appointment'
      );
    } finally {
      setBooking(false);
    }
  };

  const formatDate = (date) => {
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
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts();
    }
  }, [docInfo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset selected slot when changing days
  useEffect(() => {
    setSlotTime('');
  }, [slotIndex]);

  if (loading.doctors) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!docInfo) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Doctor not found</p>
        <button
          onClick={() => navigate('/doctors')}
          className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Browse Doctors
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* ---------- Doctor Details ----------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-primary w-full sm:max-w-72 rounded-lg object-cover h-80 sm:h-auto"
            src={docInfo.image}
            alt={`Dr. ${docInfo.name}`}
            onError={(e) => {
              e.target.src = '/placeholder-doctor.png';
            }}
          />
        </div>

        <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          {/* ----- Doc Info : name, degree, experience ----- */}
          <div className="flex items-start justify-between">
            <div>
              <p className="flex items-center gap-2 text-2xl sm:text-3xl font-medium text-gray-700">
                {docInfo.name}
                <img
                  className="w-5"
                  src={assets.verified_icon}
                  alt="Verified"
                />
              </p>
              <div className="flex items-center gap-2 mt-1 text-gray-600">
                <p>
                  {docInfo.degree} - {docInfo.speciality}
                </p>
                <button className="py-0.5 px-2 border text-xs rounded-full bg-gray-50">
                  {docInfo.experience}
                </button>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                docInfo.available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  docInfo.available ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              {docInfo.available ? 'Available' : 'Not Available'}
            </div>
          </div>

          {/* ----- Doc About ----- */}
          <div className="mt-4">
            <p className="flex items-center gap-1 text-sm font-medium text-[#262626]">
              About <img className="w-3" src={assets.info_icon} alt="Info" />
            </p>
            <p className="text-sm text-gray-600 max-w-[700px] mt-1 leading-relaxed">
              {docInfo.about}
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600 font-medium">
              Appointment fee:{' '}
              <span className="text-gray-800 text-lg font-semibold">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Booking slots */}
      <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
        <p className="text-lg mb-4">Select Appointment Slot</p>

        {!docInfo.available ? (
          <div className="text-center py-8 bg-red-50 rounded-lg">
            <p className="text-red-600 mb-2">
              This doctor is currently not available for appointments
            </p>
            <p className="text-sm text-gray-500">
              Please try again later or choose another doctor
            </p>
          </div>
        ) : slotsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Date Selection */}
            <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4 pb-2">
              {docSlots.length > 0 ? (
                docSlots.map((item, index) => (
                  <div
                    onClick={() => setSlotIndex(index)}
                    key={index}
                    className={`text-center py-4 px-4 min-w-16 rounded-xl cursor-pointer transition-all border-2 ${
                      slotIndex === index
                        ? 'bg-primary text-white border-primary shadow-lg'
                        : 'border-gray-200 hover:border-primary hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-xs font-medium">
                      {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                    </p>
                    <p className="text-sm font-bold mt-1">
                      {item[0] && formatDate(item[0].datetime)}
                    </p>
                    <p className="text-xs mt-1">{item.length} slots</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No available slots for the next 7 days
                </p>
              )}
            </div>

            {/* Time Selection */}
            {docSlots.length > 0 && docSlots[slotIndex]?.length > 0 && (
              <div className="mt-6">
                <p className="mb-3 font-medium">Available Times:</p>
                <div className="flex items-center gap-3 w-full overflow-x-scroll">
                  {docSlots[slotIndex].map((item, index) => (
                    <button
                      onClick={() => setSlotTime(item.time)}
                      key={index}
                      className={`text-sm font-medium flex-shrink-0 px-4 py-2 rounded-lg border-2 transition-all ${
                        item.time === slotTime
                          ? 'bg-primary text-white border-primary'
                          : 'text-gray-600 border-gray-300 hover:border-primary hover:bg-primary hover:text-white'
                      }`}
                    >
                      {item.time.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Book Appointment Button */}
            {slotTime && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  Selected:{' '}
                  <span className="font-medium text-gray-800">
                    {docSlots[slotIndex][0] &&
                      formatDate(docSlots[slotIndex][0].datetime)}{' '}
                    at {slotTime}
                  </span>
                </p>
                <LoadingButton
                  onClick={bookAppointment}
                  loading={booking}
                  className="px-8 py-3 rounded-full text-base"
                  disabled={booking || !slotTime}
                >
                  Book Appointment
                </LoadingButton>
              </div>
            )}
          </>
        )}
      </div>

      {/* Listing Related Doctors */}
      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  );
};

export default Appointment;

import { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import LoadingSpinner from '../../components/LoadingSpinner';
import SkeletonLoader from '../../components/SkeletonLoader';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const FILTER_OPTIONS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const AllAppointments = () => {
  const {
    aToken,
    appointments,
    cancelAppointment,
    getAllAppointments,
    isLoading,
  } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken, getAllAppointments]);

  const filteredAppointments = appointments.filter((item) => {
    const matchesSearch =
      item.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.docData.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Upcoming' && !item.isCompleted && !item.cancelled) ||
      (filter === 'Completed' && item.isCompleted) ||
      (filter === 'Cancelled' && item.cancelled);

    return matchesSearch && matchesFilter;
  });

  const AppointmentSkeleton = () => (
    <div className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center py-3 px-6 border-b">
      <SkeletonLoader className="max-sm:hidden h-4 w-6" />
      <div className="flex items-center gap-2">
        <SkeletonLoader className="w-8 h-8 rounded-full" />
        <SkeletonLoader className="h-4 w-24" />
      </div>
      <SkeletonLoader className="max-sm:hidden h-4 w-8" />
      <SkeletonLoader className="h-4 w-32" />
      <div className="flex items-center gap-2">
        <SkeletonLoader className="w-8 h-8 rounded-full" />
        <SkeletonLoader className="h-4 w-24" />
      </div>
      <SkeletonLoader className="h-4 w-12" />
      <SkeletonLoader className="h-6 w-16" />
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-5">
      {/* Header with Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-semibold">All Appointments</h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage and track all patient appointments
          </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                  ${
                    filter === option
                      ? 'bg-primary text-white shadow-md transform scale-105'
                      : 'text-gray-700 hover:bg-white hover:shadow-sm'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search patient or doctor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Results counter */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredAppointments.length} of {appointments.length}{' '}
          appointments
        </p>
      </div>

      {/* Appointments Table */}
      <div className="bg-white border rounded-lg shadow-sm text-sm max-h-[70vh] overflow-y-auto">
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 font-medium text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {isLoading?.appointments ? (
          // Loading skeleton
          [...Array(5)].map((_, index) => <AppointmentSkeleton key={index} />)
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50 transition-colors duration-200"
            >
              <p className="max-sm:hidden">{index + 1}</p>

              <div className="flex items-center gap-2">
                <img
                  src={item.userData.image}
                  className="w-8 h-8 rounded-full object-cover"
                  alt="patient"
                />
                <p className="font-medium">{item.userData.name}</p>
              </div>

              <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
              <p className="text-sm">
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>

              <div className="flex items-center gap-2">
                <img
                  src={item.docData.image}
                  className="w-8 h-8 rounded-full object-cover bg-gray-200"
                  alt="doctor"
                />
                <p className="font-medium">{item.docData.name}</p>
              </div>

              <p className="font-semibold">
                {currency}
                {item.amount}
              </p>

              <div className="flex items-center justify-center">
                {item.cancelled ? (
                  <span className="text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded-full">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                    Completed
                  </span>
                ) : (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    disabled={isLoading?.cancellingAppointment}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 group"
                    title="Cancel appointment"
                  >
                    {isLoading?.cancellingAppointment ? (
                      <LoadingSpinner size="sm" className="text-red-500" />
                    ) : (
                      <img
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-200"
                        src={assets.cancel_icon}
                        alt="cancel"
                      />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <img
                src={assets.appointment_icon}
                alt="No appointments"
                className="w-16 h-16 mx-auto opacity-50"
              />
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              No appointments found
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm || filter !== 'All'
                ? 'Try adjusting your search or filter criteria'
                : 'Appointments will appear here once they are booked'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;

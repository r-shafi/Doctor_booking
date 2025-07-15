import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const FILTER_OPTIONS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, userRole } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmationModal, setConfirmationModal] = useState({ open: false, action: null, appointmentId: null });

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  const filteredAppointments = appointments.filter(item => {
    const matchesSearch = item.userData.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === 'All' ||
      (filter === 'Upcoming' && !item.isCompleted && !item.cancelled) ||
      (filter === 'Completed' && item.isCompleted) ||
      (filter === 'Cancelled' && item.cancelled);

    return matchesSearch && matchesFilter;
  });

  const handleAppointmentAction = (action, appointmentId) => {
    setConfirmationModal({ open: true, action, appointmentId });
  };

  const confirmAction = () => {
    if (confirmationModal.action === 'cancel') {
      cancelAppointment(confirmationModal.appointmentId);
    } else if (confirmationModal.action === 'complete') {
      completeAppointment(confirmationModal.appointmentId);
    }
    setConfirmationModal({ open: false, action: null, appointmentId: null });
  };

  const cancelAction = () => {
    setConfirmationModal({ open: false, action: null, appointmentId: null });
  };

  return (
    <div className='w-full max-w-6xl mx-auto p-5'>
      {/* Header & Filters */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
        <h2 className='text-2xl font-semibold'>Appointments</h2>

        <div className='flex flex-wrap gap-2 items-center'>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {FILTER_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition
                  ${filter === option
                    ? 'bg-primary text-white shadow'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm'
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search patient"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className='bg-white border rounded-lg text-sm max-h-[70vh] overflow-y-auto'>
        <div className='hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b bg-gray-50 font-medium text-gray-700'>
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {filteredAppointments.map((item, index) => (
          <div
            key={index}
            className='flex flex-wrap justify-between max-sm:gap-5 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50'
          >
            <p className='max-sm:hidden'>{index + 1}</p>

            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 h-8 rounded-full object-cover' alt="patient" />
              <p>{item.userData.name}</p>
            </div>

            <p className='text-xs border border-primary px-2 py-0.5 rounded-full text-center w-fit'>
              {item.payment ? 'Online' : 'CASH'}
            </p>

            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>

            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

            <p>{currency}{item.amount}</p>

            {item.cancelled ? (
              <p className='text-red-400 text-xs font-medium'>Cancelled</p>
            ) : item.isCompleted ? (
              <p className='text-green-500 text-xs font-medium'>Completed</p>
            ) : (
              <div className='flex gap-2'>
                {userRole === 'doctor' && (
                  <>
                    <button
                      onClick={() => handleAppointmentAction('complete', item.id)}
                      className='px-4 py-1.5 text-xs font-medium bg-green-500 text-white rounded-md hover:bg-green-600'>
                      Complete
                    </button>
                    <button
                      onClick={() => handleAppointmentAction('cancel', item.id)}
                      className='px-4 py-1.5 text-xs font-medium bg-red-500 text-white rounded-md hover:bg-red-600'>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.open && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
          <div className='bg-white p-6 rounded-lg shadow-lg'>
            <h3 className='text-lg font-semibold'>
              Are you sure you want to {confirmationModal.action} this appointment?
            </h3>
            <div className='flex gap-4 mt-4'>
              <button
                onClick={confirmAction}
                className='px-4 py-1.5 bg-green-500 text-white rounded-md'>
                Yes, {confirmationModal.action === 'complete' ? 'Complete' : 'Cancel'}
              </button>
              <button
                onClick={cancelAction}
                className='px-4 py-1.5 bg-gray-500 text-white rounded-md'>
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;

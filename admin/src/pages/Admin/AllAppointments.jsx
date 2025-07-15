import React, { useEffect, useState, useContext } from 'react';
import { assets } from '../../assets/assets';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const FILTER_OPTIONS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  const filteredAppointments = appointments.filter(item => {
    const matchesSearch = item.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.docData.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filter === 'All' ||
      (filter === 'Upcoming' && !item.isCompleted && !item.cancelled) ||
      (filter === 'Completed' && item.isCompleted) ||
      (filter === 'Cancelled' && item.cancelled);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className='w-full max-w-6xl mx-auto p-5'>
      {/* Header with Filter Tabs & Search */}
      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4'>
        <h2 className='text-2xl font-semibold'>All Appointments</h2>
        
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
            placeholder="Search patient or doctor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className='bg-white border rounded-lg text-sm max-h-[70vh] overflow-y-auto'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 font-medium text-gray-700'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {filteredAppointments.map((item, index) => (
          <div
            key={index}
            className='flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-600 py-3 px-6 border-b hover:bg-gray-50'
          >
            <p className='max-sm:hidden'>{index + 1}</p>

            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 h-8 rounded-full object-cover' alt="patient" />
              <p>{item.userData.name}</p>
            </div>

            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

            <div className='flex items-center gap-2'>
              <img src={item.docData.image} className='w-8 h-8 rounded-full object-cover bg-gray-200' alt="doctor" />
              <p>{item.docData.name}</p>
            </div>

            <p>{currency}{item.amount}</p>

            {item.cancelled ? (
              <p className='text-red-400 text-xs font-medium'>Cancelled</p>
            ) : item.isCompleted ? (
              <p className='text-green-500 text-xs font-medium'>Completed</p>
            ) : (
              <img
                onClick={() => cancelAppointment(item._id)}
                className='w-8 cursor-pointer'
                src={assets.cancel_icon}
                alt="cancel"
              />
            )}
          </div>
        ))}

        {filteredAppointments.length === 0 && (
          <p className="text-center text-gray-500 py-6">No appointments found.</p>
        )}
      </div>
    </div>
  );
};

export default AllAppointments;

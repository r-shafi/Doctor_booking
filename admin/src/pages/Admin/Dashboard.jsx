import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import SkeletonLoader from '../../components/SkeletonLoader';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData, isLoading } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const handleCancelClick = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowConfirmDialog(true);
  };

  const handleConfirmCancel = async () => {
    if (selectedAppointmentId) {
      await cancelAppointment(selectedAppointmentId);
      setShowConfirmDialog(false);
      setSelectedAppointmentId(null);
    }
  };

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken, getDashData]);

  const DashboardCard = ({ icon, count, label, onClick, loading = false }) => (
    <div
      onClick={onClick}
      className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300 group"
    >
      <img
        className="w-14 group-hover:scale-110 transition-transform duration-300"
        src={icon}
        alt=""
      />
      <div>
        {loading ? (
          <>
            <SkeletonLoader className="h-6 w-16 mb-1" />
            <SkeletonLoader className="h-4 w-12" />
          </>
        ) : (
          <>
            <p className="text-xl font-semibold text-gray-600 group-hover:text-primary transition-colors duration-300">
              {count}
            </p>
            <p className="text-gray-400">{label}</p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="m-5">
      <div className="flex flex-wrap gap-3">
        <DashboardCard
          icon={assets.doctor_icon}
          count={dashData?.doctors || 0}
          label="Doctors"
          loading={isLoading?.dashboard}
          onClick={() => navigate('/doctor-list')}
        />
        <DashboardCard
          icon={assets.appointments_icon}
          count={dashData?.appointments || 0}
          label="Appointments"
          loading={isLoading?.dashboard}
          onClick={() => navigate('/all-appointments')}
        />
        <DashboardCard
          icon={assets.patients_icon}
          count={dashData?.patients || 0}
          label="Patients"
          loading={isLoading?.dashboard}
          onClick={() => navigate('/all-appointments')}
        />
      </div>

      <div className="bg-white mt-10 rounded-lg shadow-sm">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b bg-gray-50">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-2">
          {isLoading?.dashboard ? (
            // Loading skeleton for appointments
            <div className="space-y-2 p-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center px-2 py-3 gap-3">
                  <SkeletonLoader className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <SkeletonLoader className="h-4 w-32 mb-1" />
                    <SkeletonLoader className="h-3 w-24" />
                  </div>
                  <SkeletonLoader className="h-6 w-16" />
                </div>
              ))}
            </div>
          ) : dashData?.latestAppointments?.length > 0 ? (
            dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-50 transition-colors duration-200"
                key={index}
              >
                <img
                  className="rounded-full w-10 h-10 object-cover"
                  src={item.docData.image}
                  alt=""
                />
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-600">
                    Booking on {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium bg-red-50 px-2 py-1 rounded-full">
                    Cancelled
                  </p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded-full">
                    Completed
                  </p>
                ) : (
                  <button
                    onClick={() => handleCancelClick(item._id)}
                    disabled={isLoading?.cancellingAppointment}
                    className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                  >
                    {isLoading?.cancellingAppointment ? (
                      <LoadingSpinner size="sm" className="text-red-500" />
                    ) : (
                      <img
                        className="w-5 h-5"
                        src={assets.cancel_icon}
                        alt="cancel"
                      />
                    )}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent appointments</p>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false);
          setSelectedAppointmentId(null);
        }}
        onConfirm={handleConfirmCancel}
        title="Cancel Appointment"
        message="Are you sure you want to cancel this appointment? This action cannot be undone."
        confirmText="Cancel Appointment"
        cancelText="Keep Appointment"
        type="danger"
        isLoading={isLoading?.cancellingAppointment}
      />
    </div>
  );
};

export default Dashboard;

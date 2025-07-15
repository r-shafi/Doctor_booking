import { useContext, useEffect } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import SkeletonLoader from '../../components/SkeletonLoader';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors, isLoading } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken, getAllDoctors]);

  const DoctorSkeleton = () => (
    <div className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden">
      <SkeletonLoader className="w-full h-48" />
      <div className="p-4">
        <SkeletonLoader className="h-5 w-32 mb-2" />
        <SkeletonLoader className="h-4 w-24 mb-3" />
        <div className="flex items-center gap-1">
          <SkeletonLoader className="h-4 w-4" />
          <SkeletonLoader className="h-4 w-16" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium mb-2">All Doctors</h1>
      <p className="text-gray-600 text-sm mb-5">
        Manage doctor profiles and availability status
      </p>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {isLoading?.doctors ? (
          // Show skeleton loaders while loading
          [...Array(6)].map((_, index) => <DoctorSkeleton key={index} />)
        ) : doctors.length > 0 ? (
          doctors.map((item, index) => (
            <div
              className="border border-[#C9D8FF] rounded-xl w-56 h-80 overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300"
              key={index}
            >
              <div className="h-48 bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 overflow-hidden">
                <img
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  src={item.image}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-doctor.png'; // Fallback image
                  }}
                />
              </div>
              <div className="p-4 h-32 flex flex-col justify-between">
                <div>
                  <p
                    className="text-[#262626] text-lg font-medium truncate"
                    title={item.name}
                  >
                    {item.name}
                  </p>
                  <p
                    className="text-[#5C5C5C] text-sm truncate"
                    title={item.speciality}
                  >
                    {item.speciality}
                  </p>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm">
                  <div className="relative">
                    <input
                      onChange={() => changeAvailability(item._id)}
                      type="checkbox"
                      checked={item.available}
                      disabled={isLoading?.changingAvailability}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 disabled:opacity-50"
                    />
                    {isLoading?.changingAvailability && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingSpinner size="sm" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      item.available ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No doctors found</p>
            <p className="text-gray-400 text-sm mt-2">
              Add doctors to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorsList;

import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import SkeletonLoader from './SkeletonLoader';

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors, loading } = useContext(AppContext);

  const handleDoctorClick = (docId) => {
    navigate(`/appointment/${docId}`);
    window.scrollTo(0, 0);
  };

  const DoctorCardSkeleton = () => (
    <div className="border border-[#C9D8FF] rounded-xl overflow-hidden">
      <SkeletonLoader className="w-full h-48" />
      <div className="p-4">
        <SkeletonLoader className="h-4 w-24 mb-2" />
        <SkeletonLoader className="h-5 w-32 mb-1" />
        <SkeletonLoader className="h-4 w-28" />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>

      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {loading.doctors ? (
          Array.from({ length: 10 }).map((_, index) => (
            <DoctorCardSkeleton key={index} />
          ))
        ) : doctors.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No doctors available at the moment</p>
          </div>
        ) : (
          doctors.slice(0, 10).map((item, index) => (
            <div
              onClick={() => handleDoctorClick(item._id)}
              className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500 hover:shadow-lg"
              key={index}
            >
              <img
                className="bg-[#EAEFFF] w-full h-48 object-cover"
                src={item.image}
                alt={`Dr. ${item.name}`}
                onError={(e) => {
                  e.target.src = '/placeholder-doctor.png';
                }}
              />
              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm text-center ${
                    item.available ? 'text-green-500' : 'text-gray-500'
                  }`}
                >
                  <p
                    className={`w-2 h-2 rounded-full ${
                      item.available ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></p>
                  <p>{item.available ? 'Available' : 'Not Available'}</p>
                </div>
                <p className="text-[#262626] text-lg font-medium mt-2">
                  {item.name}
                </p>
                <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
                {item.experience && (
                  <p className="text-[#7C7C7C] text-xs mt-1">
                    {item.experience} years experience
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {!loading.doctors && doctors.length > 0 && (
        <button
          onClick={() => {
            navigate('/doctors');
            window.scrollTo(0, 0);
          }}
          className="bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10 hover:bg-primary hover:text-white transition-colors"
        >
          Show More Doctors
        </button>
      )}
    </div>
  );
};

export default TopDoctors;

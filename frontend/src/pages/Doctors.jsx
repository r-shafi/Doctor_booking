import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const { doctors, loading } = useContext(AppContext);

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist',
  ];

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDoctorClick = (docId) => {
    navigate(`/appointment/${docId}`);
    window.scrollTo(0, 0);
  };

  const DoctorSkeleton = () => (
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
    <div>
      <p className="text-gray-600">Browse through the doctors specialist.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
        >
          Filters
        </button>

        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {specialities.map((spec) => (
            <p
              key={spec}
              onClick={() =>
                speciality === spec
                  ? navigate('/doctors')
                  : navigate(`/doctors/${spec}`)
              }
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer hover:bg-gray-50 ${
                speciality === spec
                  ? 'bg-[#E2E5FF] text-black border-primary'
                  : ''
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        <div className="w-full">
          {loading.doctors ? (
            <div className="grid grid-cols-auto gap-4 gap-y-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <DoctorSkeleton key={index} />
              ))}
            </div>
          ) : filterDoc.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No doctors found {speciality && `for ${speciality}`}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Try browsing other specialities
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-auto gap-4 gap-y-6">
              {filterDoc.map((item, index) => (
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
                      e.target.src = '/placeholder-doctor.png'; // Fallback image
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;

import { Link } from 'react-router-dom';
import { specialityData } from '../assets/assets';

const SpecialityMenu = () => {
  const handleSpecialityClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div
      id="speciality"
      className="flex flex-col items-center gap-4 py-16 text-[#262626]"
    >
      <h1 className="text-3xl font-medium">Find by Speciality</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
        {specialityData.map((item, index) => (
          <Link
            to={`/doctors/${item.speciality}`}
            onClick={handleSpecialityClick}
            className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500 group"
            key={index}
          >
            <div className="w-16 sm:w-24 h-16 sm:h-24 mb-2 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <img
                className="w-12 sm:w-16 object-contain"
                src={item.image}
                alt={item.speciality}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p className="text-center font-medium group-hover:text-primary transition-colors">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SpecialityMenu;

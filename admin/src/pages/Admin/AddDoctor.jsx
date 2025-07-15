import axios from 'axios';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';
import LoadingSpinner from '../../components/LoadingSpinner';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('0 to 1 year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General Physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!fees || isNaN(fees) || Number(fees) <= 0) {
      newErrors.fees = 'Valid fees required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    if (!docImg) {
      return toast.error('Image not selected');
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email.toLowerCase().trim());
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append(
        'address',
        JSON.stringify({ line1: address1, line2: address2 })
      );

      const { data } = await axios.post(
        backendUrl + '/api/admin/add-doctor',
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName('');
        setEmail('');
        setAddress1('');
        setAddress2('');
        setDegree('');
        setAbout('');
        setFees('');
        setErrors({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const experienceOptions = Array.from({ length: 20 }, (_, i) => {
    return `${i} to ${i + 1} year${i + 1 > 1 ? 's' : ''}`;
  });

  const specialities = [
    'Allergy and Immunology',
    'Anesthesiology',
    'Cardiology',
    'Cardiothoracic Surgery',
    'Critical Care Medicine',
    'Dermatology',
    'Emergency Medicine',
    'Endocrinology',
    'Family Medicine',
    'Gastroenterology',
    'General Surgery',
    'Geriatrics',
    'Gynecology',
    'Hematology',
    'Hepatology',
    'Infectious Disease',
    'Internal Medicine',
    'Interventional Radiology',
    'Medical Genetics',
    'Nephrology',
    'Neurology',
    'Neurosurgery',
    'Nuclear Medicine',
    'Obstetrics',
    'Oncology',
    'Ophthalmology',
    'Orthopedic Surgery',
    'Otolaryngology (ENT)',
    'Pain Management',
    'Pathology',
    'Pediatrics',
    'Physical Medicine and Rehabilitation',
    'Plastic Surgery',
    'Podiatry',
    'Preventive Medicine',
    'Psychiatry',
    'Pulmonology',
    'Radiology',
    'Rheumatology',
    'Sleep Medicine',
    'Sports Medicine',
    'Surgical Oncology',
    'Thoracic Surgery',
    'Transplant Surgery',
    'Urology',
    'Vascular Surgery',
  ];

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Doctor name</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Name"
              />
              {errors.name && (
                <span className="text-red-500 text-sm">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded px-3 py-2"
                type="email"
                placeholder="Email"
              />
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <p>Experience</p>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="border rounded px-2 py-2"
              >
                {experienceOptions.map((exp, idx) => (
                  <option key={idx} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Fees</p>
              <input
                value={fees}
                onChange={(e) => setFees(e.target.value)}
                className="border rounded px-3 py-2"
                type="number"
                placeholder="Doctor fees"
              />
              {errors.fees && (
                <span className="text-red-500 text-sm">{errors.fees}</span>
              )}
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <p>Speciality</p>
              <select
                value={speciality}
                onChange={(e) => setSpeciality(e.target.value)}
                className="border rounded px-2 py-2"
              >
                {specialities.map((spec, idx) => (
                  <option key={idx} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <p>Degree</p>
              <input
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Degree"
              />
            </div>

            <div className="flex flex-col gap-1">
              <p>Address</p>
              <input
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address 1"
              />
              <input
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="border rounded px-3 py-2"
                type="text"
                placeholder="Address 2"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full px-4 pt-2 border rounded"
            rows={5}
            placeholder="Write about doctor"
          ></textarea>
        </div>

        <button
          type="submit"
          className={`mt-4 px-10 py-3 rounded-full text-white font-medium transition-all duration-200 flex items-center gap-2 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary-dark hover:shadow-lg'
          }`}
          disabled={loading}
        >
          {loading && <LoadingSpinner size="sm" className="text-white" />}
          {loading ? 'Adding Doctor...' : 'Add Doctor'}
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;

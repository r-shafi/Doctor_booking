import axios from 'axios';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import LoadingButton from '../components/LoadingButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { AppContext } from '../context/AppContext';

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const {
    token,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    loading,
  } = useContext(AppContext);

  const validateForm = () => {
    const newErrors = {};

    if (!userData.name || userData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!userData.phone || userData.phone.trim().length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    if (!userData.dob) {
      newErrors.dob = 'Date of birth is required';
    }

    if (!userData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!userData.address?.line1?.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateUserProfileData = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);

      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        {
          headers: { token },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
        setErrors({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setUserData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [field]: value }));
    }

    // Clear error when user starts typing
    if (errors[field] || errors[field.split('.')[0]]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
        [field.split('.')[0]]: '',
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setImage(file);
    }
  };

  if (loading.userProfile) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Failed to load profile data</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-4 text-sm pt-5">
      <div className="text-center">
        <label htmlFor="image" className="relative cursor-pointer group">
          <img
            className="w-36 h-36 rounded-full mx-auto object-cover border-4 border-gray-200 group-hover:border-primary transition-colors"
            src={
              image
                ? URL.createObjectURL(image)
                : userData.image || assets.upload_area
            }
            alt="Profile"
          />
          {isEdit && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs">Change Photo</span>
            </div>
          )}
          {isEdit && (
            <input
              onChange={handleImageChange}
              type="file"
              id="image"
              hidden
              accept="image/*"
            />
          )}
        </label>
        {isEdit && (
          <p className="text-xs text-gray-500 mt-2">
            Click to change profile picture (Max 5MB)
          </p>
        )}
      </div>

      {isEdit ? (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Full Name *
            </label>
            <input
              className={`w-full p-3 border rounded-md transition-colors ${
                errors.name
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-primary'
              }`}
              type="text"
              onChange={(e) => handleInputChange('name', e.target.value)}
              value={userData.name || ''}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 cursor-not-allowed"
              type="email"
              value={userData.email || ''}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number *
            </label>
            <input
              className={`w-full p-3 border rounded-md transition-colors ${
                errors.phone
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-primary'
              }`}
              type="tel"
              onChange={(e) => handleInputChange('phone', e.target.value)}
              value={userData.phone || ''}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Gender *
              </label>
              <select
                className={`w-full p-3 border rounded-md transition-colors ${
                  errors.gender
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-primary'
                }`}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                value={userData.gender || ''}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Date of Birth *
              </label>
              <input
                className={`w-full p-3 border rounded-md transition-colors ${
                  errors.dob
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-primary'
                }`}
                type="date"
                onChange={(e) => handleInputChange('dob', e.target.value)}
                value={userData.dob || ''}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dob && (
                <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address *
            </label>
            <input
              className={`w-full p-3 border rounded-md transition-colors ${
                errors.address
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-primary'
              }`}
              onChange={(e) =>
                handleInputChange('address.line1', e.target.value)
              }
              value={userData.address?.line1 || ''}
              placeholder="Street address"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">{errors.address}</p>
            )}
            <input
              className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:border-primary transition-colors"
              onChange={(e) =>
                handleInputChange('address.line2', e.target.value)
              }
              value={userData.address?.line2 || ''}
              placeholder="City, State, ZIP (optional)"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <LoadingButton
              onClick={updateUserProfileData}
              loading={saving}
              className="flex-1 py-3 rounded-md text-base"
              disabled={saving}
            >
              Save Changes
            </LoadingButton>
            <button
              onClick={() => {
                setIsEdit(false);
                setImage(false);
                setErrors({});
              }}
              className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">
              Personal Information
            </h3>
            <div className="space-y-2 text-gray-600">
              <p>
                <span className="font-medium">Name:</span>{' '}
                {userData.name || 'Not provided'}
              </p>
              <p>
                <span className="font-medium">Email:</span>{' '}
                {userData.email || 'Not provided'}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{' '}
                {userData.phone || 'Not provided'}
              </p>
              <p>
                <span className="font-medium">Gender:</span>{' '}
                {userData.gender || 'Not provided'}
              </p>
              <p>
                <span className="font-medium">Date of Birth:</span>{' '}
                {userData.dob || 'Not provided'}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Address</h3>
            <div className="text-gray-600">
              <p>{userData.address?.line1 || 'Not provided'}</p>
              {userData.address?.line2 && <p>{userData.address.line2}</p>}
            </div>
          </div>

          <button
            onClick={() => setIsEdit(true)}
            className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default MyProfile;

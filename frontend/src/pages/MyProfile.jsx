import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);
  const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('phone', userData.phone);
      formData.append('address', JSON.stringify(userData.address));
      formData.append('gender', userData.gender);
      formData.append('dob', userData.dob);
      image && formData.append('image', image);

      const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, {
        headers: { token },
      });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return userData ? (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-lg p-8">
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          {isEdit ? (
            <label htmlFor="image" className="relative cursor-pointer group">
              <img
                className="w-32 h-32 rounded-full object-cover opacity-80"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt="Profile"
              />
              <img
                className="w-8 absolute bottom-2 right-2"
                src={assets.upload_icon}
                alt="Upload"
              />
              <input
                type="file"
                id="image"
                hidden
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
          ) : (
            <img
              className="w-32 h-32 rounded-full object-cover"
              src={userData.image}
              alt="Profile"
            />
          )}
        </div>

        {/* Name */}
        <div className="text-center mb-6">
          {isEdit ? (
            <input
              className="text-2xl font-semibold border-b w-full text-center focus:outline-none bg-gray-50"
              type="text"
              value={userData.name}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          ) : (
            <h1 className="text-2xl font-semibold text-gray-800">{userData.name}</h1>
          )}
        </div>

        <hr className="mb-6" />

        {/* Contact Information */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Contact Information</h2>
          <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm text-gray-700">
            <p className="font-medium">Email:</p>
            <p className="text-blue-600">{userData.email}</p>

            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                className="bg-gray-50 p-1 rounded w-full"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-600">{userData.phone}</p>
            )}

            <p className="font-medium">Address:</p>
            {isEdit ? (
              <div className="flex flex-col gap-1">
                <input
                  className="bg-gray-50 p-1 rounded"
                  type="text"
                  placeholder="Line 1"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <input
                  className="bg-gray-50 p-1 rounded"
                  type="text"
                  placeholder="Line 2"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </div>
            ) : (
              <p className="text-gray-600">
                {userData.address.line1} <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>

        {/* Basic Information */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Basic Information</h2>
          <div className="grid grid-cols-[120px_1fr] gap-y-3 text-sm text-gray-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className="bg-gray-50 p-1 rounded"
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="Not Selected">Not Selected</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p>{userData.gender}</p>
            )}

            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                className="bg-gray-50 p-1 rounded"
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p>{userData.dob}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-8">
          {isEdit ? (
            <>
              <button
                onClick={updateUserProfileData}
                className="bg-blue-600 text-white px-6 py-2 rounded-full mr-4 hover:bg-blue-700 transition"
              >
                Save Information
              </button>
              <button
                onClick={() => setIsEdit(false)}
                className="border border-gray-400 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEdit(true)}
              className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-600 hover:text-white transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default MyProfile;

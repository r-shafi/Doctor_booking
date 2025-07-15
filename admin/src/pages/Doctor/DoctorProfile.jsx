import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext);
  const { currency, backendUrl } = useContext(AppContext);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        about: profileData.about,
        available: profileData.available
      };

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData,
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Profile update failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!profileData) return <p className="p-5">Loading profile...</p>;

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <div className="bg-white border rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <img
            className="w-32 h-32 rounded-full object-cover border"
            src={profileData.image}
            alt="Doctor"
          />

          <div className="flex-1 space-y-3">
            <div>
              <h2 className="text-2xl font-semibold">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.degree} - {profileData.speciality}</p>
              <span className="text-sm px-2 py-1 rounded-full bg-gray-100">{profileData.experience}</span>
            </div>

            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label className="font-medium">About</label>
                {isEdit ? (
                  <textarea
                    className="w-full p-2 border rounded"
                    rows={4}
                    value={profileData.about}
                    onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                  />
                ) : (
                  <p className="text-gray-700">{profileData.about}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">Appointment Fee ({currency})</label>
                  {isEdit ? (
                    <input
                      type="number"
                      className="w-full p-2 border rounded"
                      value={profileData.fees}
                      onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                    />
                  ) : (
                    <p>{currency}{profileData.fees}</p>
                  )}
                </div>

                <div>
                  <label className="font-medium">Available</label>
                  {isEdit ? (
                    <input
                      type="checkbox"
                      checked={profileData.available}
                      onChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))}
                      className="ml-2"
                    />
                  ) : (
                    <p>{profileData.available ? "Yes" : "No"}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="font-medium">Address</label>
                {isEdit ? (
                  <>
                    <input
                      className="w-full mb-2 p-2 border rounded"
                      value={profileData.address.line1}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value }
                      }))}
                    />
                    <input
                      className="w-full p-2 border rounded"
                      value={profileData.address.line2}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value }
                      }))}
                    />
                  </>
                ) : (
                  <p className="text-gray-700">
                    {profileData.address.line1}<br />
                    {profileData.address.line2}
                  </p>
                )}
              </div>

              <div className="pt-4">
                {isEdit ? (
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-primary text-white px-5 py-2 rounded-full"
                      disabled={loading}
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="border px-5 py-2 rounded-full"
                      onClick={() => setIsEdit(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="border border-primary text-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white"
                    onClick={() => setIsEdit(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;

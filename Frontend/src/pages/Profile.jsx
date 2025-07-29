// Frontend/src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import ActivityHeatmap from '../components/profile/ActivityHeatmap';

const PlaceholderAvatar = () => (
  <svg className="h-full w-full text-neutral-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [name, setName] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = '/api/users/profile';
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetchWithAuth(API_URL);
        
        // ✨ FIX: Check for content before parsing JSON
        const responseText = await res.text();
        if (!responseText) {
            throw new Error("Received an empty response from the server.");
        }
        const data = JSON.parse(responseText);

        if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
        setUserData(data);
        setName(data.name);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('name', name);
    if (avatarFile) {
      formData.append('avatar', avatarFile);
    }

    try {
      setError('');
      const res = await fetchWithAuth(API_URL, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      
      setUserData(data.user);
      setIsEditMode(false);
      setAvatarFile(null);
      setPreviewAvatar(null);

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-rose-400">Error: {error}</div>;
  }

  return (
    <div className="bg-neutral-900/50 h-[calc(100vh-4rem)] w-full flex flex-col px-4 py-4 gap-4 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        {/* Left Column: User Info */}
        <div className="md:col-span-1">
          <div className="dashboard-card p-6 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <div className="w-full h-full rounded-full overflow-hidden bg-neutral-700">
                {previewAvatar ? (
                  <img src={previewAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                ) : userData?.avatar ? (
                  <img src={`${BASE_URL}/${userData.avatar.replace(/\\/g, '/')}`} alt="User Avatar" className="w-full h-full object-cover" />
                ) : (
                  <PlaceholderAvatar />
                )}
              </div>
              {isEditMode && (
                <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-rose-600 p-2 rounded-full cursor-pointer hover:bg-rose-700">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  <input id="avatar-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
              )}
            </div>

            {isEditMode ? (
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-center bg-neutral-700 text-white text-2xl font-bold rounded-lg p-2"
              />
            ) : (
              <h2 className="text-2xl font-bold text-white">{userData?.name}</h2>
            )}
            
            <p className="text-neutral-400 mt-1">{userData?.email}</p>

            <div className="mt-6 w-full">
              {isEditMode ? (
                <div className="flex gap-4">
                  <button onClick={() => { setIsEditMode(false); setPreviewAvatar(null); }} className="w-full p-2 rounded-lg bg-neutral-600 text-white font-semibold hover:bg-neutral-700">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="w-full p-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700">
                    Save
                  </button>
                </div>
              ) : (
                <button onClick={() => setIsEditMode(true)} className="w-full p-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700">
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Stats (Phase 2) */}
        <div className="md:col-span-2">
          <ActivityHeatmap />
        </div>
      </div>
    </div>
  );
}
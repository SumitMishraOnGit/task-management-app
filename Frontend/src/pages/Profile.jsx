// Frontend/src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/fetchWithAuth';
import ActivityHeatmap from '../components/profile/ActivityHeatmap';
import { ProfileSkeleton } from '../components/ui/Skeleton';

const PlaceholderAvatar = () => (
    <svg className="h-full w-full text-neutral-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

export default function Profile() {
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');

    const API_URL = '/users/profile';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await fetchWithAuth(API_URL);

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

    const handleNameSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            setError('');
            setSuccessMessage('');
            const res = await fetchWithAuth(API_URL, {
                method: 'PUT',
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update profile');

            setUserData(data.user);
            setAvatarFile(null);
            setPreviewAvatar(null);
            setSuccessMessage("Profile updated successfully!");
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            setError(err.message);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            setPasswordError('');
            setPasswordSuccessMessage('');
            const res = await fetchWithAuth(`${API_URL}/change-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(passwordData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to change password');

            setPasswordData({ currentPassword: '', newPassword: '' });
            setPasswordSuccessMessage('Password changed successfully!');
            setTimeout(() => setPasswordSuccessMessage(''), 3000);

        } catch (err) {
            setPasswordError(err.message);
        }
    };


    if (loading) {
        return <div className="p-8 text-white">Loading profile...</div>;
    }

    if (error) {
        return <div className="p-8 text-rose-400">Error: {error}</div>;
    }

    return (
        <div className="bg-neutral-900/50 h-[calc(100vh-4rem)] w-full flex flex-col p-4 gap-4 overflow-auto">
            <div className="p-2">
                <div className="dashboard-card p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left Column: User Info */}
                        <div className="md:col-span-1 flex flex-col justify-center items-center">
                            <div className="relative w-32 h-32 mb-4">
                                <div className="w-full h-full rounded-full overflow-hidden bg-neutral-700">
                                    {previewAvatar ? (
                                        <img src={previewAvatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                                    ) : userData?.avatar ? (
                                        <img src={`/${userData.avatar.replace(/\\/g, '/')}`} alt="User Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <PlaceholderAvatar />
                                    )}
                                </div>
                                <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 bg-rose-600 p-2 rounded-full cursor-pointer hover:bg-rose-700">
                                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    <input id="avatar-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            </div>
                            <h2 className="text-2xl font-bold text-white">{name}</h2>
                            <p className="text-neutral-400 mt-1">{userData?.email}</p>
                        </div>
                        {/* Right Column: Forms */}
                        <div className="md:col-span-2">
                            <div className="flex flex-col md:flex-row md:space-x-6">
                                {/* Personal Information Form */}
                                <form onSubmit={handleNameSave} className="flex-1">
                                    <h3 className="text-md font-semibold mb-2 text-white">Personal Information</h3>
                                    {successMessage && <div className="mb-2 text-green-400 text-sm">{successMessage}</div>}
                                    <label htmlFor="name" className="text-sm text-neutral-400">Name</label>
                                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 my-2 rounded-md bg-neutral-700 border border-neutral-600 text-white focus:ring-rose-500 focus:border-rose-500" />
                                    <button type="submit" className="mt-4 px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition">Save Name/Avatar</button>
                                </form>

                                {/* Change Password Form */}
                                <form onSubmit={handlePasswordChange} className="flex-1 mt-6 md:mt-0">
                                    <h3 className="text-md font-semibold mb-2 text-white">Change Password</h3>
                                    {passwordSuccessMessage && <div className="mb-2 text-green-400 text-sm">{passwordSuccessMessage}</div>}
                                    {passwordError && <div className="mb-2 text-red-400 text-sm">{passwordError}</div>}
                                    <label htmlFor="currentPassword" className="text-sm text-neutral-400">Current Password</label>
                                    <input id="currentPassword" type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full mt-1 p-2 my-2 rounded-md bg-neutral-700 border border-neutral-600 text-white" />
                                    <label htmlFor="newPassword" className="text-sm text-neutral-400 mt-2 block">New Password</label>
                                    <input id="newPassword" type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full mt-1 p-2 my-2 rounded-md bg-neutral-700 border border-neutral-600 text-white" />
                                    <button type="submit" className="mt-4 px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 transition">Change Password</button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/*  Subtle partition line added here  */}
                    <div className="w-full h-px bg-neutral-700 my-8"></div>

                    {/* Activity Heatmap */}
                    <div className="mt-8">
                        <ActivityHeatmap />
                    </div>
                </div>
            </div>
        </div>
    );
}
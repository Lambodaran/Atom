import { useState, useEffect } from 'react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_BASE_API;

const Profile = () => {
  const [user, setUser] = useState({ username: 'Guest', email: '', phone: '', photo: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ username: 'Guest', email: '', phone: '', photo: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const response = await axios.get(`${apiBaseUrl}/auth/profile/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = response.data;
          console.log('Fetched profile data:', data);
          setUser(data);
          setEditValues(data);
        } else {
          console.error('Failed to fetch profile:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setEditValues((prev) => ({ ...prev, photo: url }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    const formData = new FormData();
    formData.append('username', editValues.username);
    formData.append('email', editValues.email);
    formData.append('phone', editValues.phone);
    if (selectedFile) {
      formData.append('photo', selectedFile);
    }

    try {
      const response = await axios.put(`${apiBaseUrl}/auth/update-profile/`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        const data = response.data;
        console.log('Profile saved successfully:', data);
        setUser(data);
        setIsEditing(false);
        setSelectedFile(null);
        // Refresh profile data after save
        await fetchProfile();
      } else {
        console.error('Failed to save profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving profile:', error.response?.data || error.message);
    }
  };

  const renderProfilePicture = () => {
    const photo = isEditing && editValues.photo ? editValues.photo : user.photo;

    if (photo) {
      const src = photo.startsWith('blob:') 
        ? photo 
        : (photo.startsWith('/media') ? `${apiBaseUrl}${photo}` : photo) + `?t=${new Date().getTime()}`;
      console.log('Image src:', src);
      return (
        <img
          src={src}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
          onError={(e) => { 
            e.target.src = ''; 
            console.error('Image failed to load:', photo); 
          }}
        />
      );
    } else {
      const initial = (user.username || 'G').charAt(0).toUpperCase();
      return (
        <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-medium border-2 border-blue-500">
          {initial}
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-center mb-4">
          {renderProfilePicture()}
        </div>
        <div className="text-center">
          {!isEditing ? (
            <>
              <h2 className="text-xl font-medium text-gray-800">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.email || 'No email provided'}</p>
              <p className="text-sm text-gray-500">{user.phone || 'No phone provided'}</p>
            </>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                name="username"
                value={editValues.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                value={editValues.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Email"
              />
              <input
                type="text"
                name="phone"
                value={editValues.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone Number"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
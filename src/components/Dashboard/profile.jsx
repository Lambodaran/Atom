import { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState({ username: 'Guest', email: '', photo: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ username: '', email: '', photo: '' });

  useEffect(() => {
    // Fetch user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser({
          username: userData.username || 'Guest',
          email: userData.email || '',
          photo: userData.photo || '',
        });
        setEditValues({
          username: userData.username || 'Guest',
          email: userData.email || '',
          photo: userData.photo || '',
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
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
      const url = URL.createObjectURL(file);
      setEditValues((prev) => ({ ...prev, photo: url }));
    }
  };

  const handleSave = () => {
    setUser(editValues);
    localStorage.setItem('user', JSON.stringify({ id: user.id || 3, ...editValues }));
    setIsEditing(false);
  };

  // Function to render profile picture or initial
  const renderProfilePicture = () => {
    const photo = isEditing && editValues.photo ? editValues.photo : user.photo;
    
    if (photo) {
      return (
        <img
          src={photo}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
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
        {/* Profile Picture */}
        <div className="flex justify-center mb-4">
          {renderProfilePicture()}
        </div>

        {/* User Information or Edit Form */}
        <div className="text-center">
          {!isEditing ? (
            <>
              <h2 className="text-xl font-medium text-gray-800">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.email || 'No email provided'}</p>
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
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>

        {/* Edit/Save Button */}
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
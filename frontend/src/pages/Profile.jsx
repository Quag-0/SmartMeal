import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { updateCurrentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    dob: '',
    gender: ''
  });
  const [avatarPreview, setAvatarPreview] = useState(`https://ui-avatars.com/api/?name=User&background=random`);
  const [avatarFile, setAvatarFile] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        const user = res.data;
        
        let dobStr = '';
        if (user.dob) {
          const dobDate = new Date(user.dob);
          const yyyy = dobDate.getFullYear();
          const mm = String(dobDate.getMonth() + 1).padStart(2, '0');
          const dd = String(dobDate.getDate()).padStart(2, '0');
          dobStr = `${yyyy}-${mm}-${dd}`;
        }

        setFormData({
          username: user.username || '',
          email: user.email || '',
          phone: user.phone || '',
          dob: dobStr,
          gender: user.gender || ''
        });

        if (user.avatar) {
          const avatarUrl = user.avatar.startsWith('/') ? `http://localhost:5000${user.avatar}` : user.avatar;
          setAvatarPreview(avatarUrl);
        } else {
          setAvatarPreview(`https://ui-avatars.com/api/?name=${user.username}&background=random`);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) return alert('Please select an image file.');
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const data = new FormData();
      data.append('username', formData.username);
      data.append('phone', formData.phone);
      data.append('dob', formData.dob);
      data.append('gender', formData.gender);
      if (avatarFile) data.append('avatar', avatarFile);

      const res = await api.put('/user/profile', data);
      const updatedUser = res.data;
      
      let newAvatarUrl = updatedUser.avatar;
      if (newAvatarUrl && newAvatarUrl.startsWith('/')) {
        newAvatarUrl = `http://localhost:5000${newAvatarUrl}`;
      }
      
      updateCurrentUser({
        username: updatedUser.username,
        avatar: newAvatarUrl
      });

      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container">
      <div className="profile-container">
        <div className="profile-header">
          <h2>👤 Edit Profile</h2>
        </div>
        
        {successMsg && <div className="success-msg" style={{display: 'block'}}>{successMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div className="avatar-preview-container">
            <img src={avatarPreview} alt="Avatar Preview" className="avatar-preview" />
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              value={formData.username} 
              onChange={e => setFormData({...formData, username: e.target.value})} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={formData.email} disabled />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label>Date of Birth</label>
            <input 
              type="date" 
              value={formData.dob} 
              onChange={e => setFormData({...formData, dob: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <button type="submit" className="btn-save" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Profile;

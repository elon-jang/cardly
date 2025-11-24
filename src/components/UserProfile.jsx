import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { getUserProfile, upsertUserProfile } from '../utils/userProfileService';
import { Save } from 'lucide-react';

export default function UserProfile({ onProfileUpdate }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    phone: '',
    email: '',
    instagram: '',
    blog: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await getUserProfile(user.id);

    if (!error && data) {
      setProfile({
        name: data.name || '',
        title: data.title || '',
        phone: data.phone || '',
        email: data.email || '',
        instagram: data.instagram || '',
        blog: data.blog || '',
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const { data, error } = await upsertUserProfile(user.id, profile);

    if (!error) {
      showToast('Profile saved successfully!', 'success');

      // Notify parent component that profile was updated
      if (onProfileUpdate) {
        onProfileUpdate(profile);
      }
    } else {
      showToast('Failed to save profile: ' + error.message, 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: '600' }}>My Profile</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 style={{ marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600' }}>My Profile</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
        This information will be used as default values when creating new business cards.
      </p>

      <form onSubmit={handleSave}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g. Clara Schumann"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Profession / Title</label>
          <input
            type="text"
            name="title"
            value={profile.title}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g. Professional Piano Instructor"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="form-input"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="form-input"
            placeholder="clara@piano.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Instagram</label>
          <input
            type="text"
            name="instagram"
            value={profile.instagram}
            onChange={handleChange}
            className="form-input"
            placeholder="@clara_piano"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Blog / Website</label>
          <input
            type="text"
            name="blog"
            value={profile.blog}
            onChange={handleChange}
            className="form-input"
            placeholder="blog.naver.com/clara"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', width: '100%', marginTop: '0.5rem' }}
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}

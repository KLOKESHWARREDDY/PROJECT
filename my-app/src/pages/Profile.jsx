import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, LogOut, GraduationCap, ChevronRight, Mail } from 'lucide-react';
import axios from 'axios';
import './TeacherProfile.css';

const Profile = ({ user: initialUser, theme, onLogout, setUser }) => {
    const navigate = useNavigate();
    const [user, setLocalUser] = useState(initialUser || null);
    const [imageError, setImageError] = useState(false);
    const [loading, setLoading] = useState(!initialUser);

    // ✅ GET TOKEN from localStorage
    const getToken = () => {
        const token = localStorage.getItem('token');
        if (token) return token;
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                const parsed = JSON.parse(savedUser);
                return parsed?.token || null;
            } catch (e) {
                console.error('Error parsing user:', e);
            }
        }
        return null;
    };

    // ✅ FETCH USER DATA
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = getToken();
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/auth/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const latestUser = response.data;
                setLocalUser(latestUser);
                if (setUser) setUser({ ...latestUser, token });
                localStorage.setItem('user', JSON.stringify({ ...latestUser, token }));
            } catch (error) {
                console.error('Error fetching user data:', error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [setUser]);

    // ✅ IMAGE UTILS
    const getImageUrl = (url) => {
        if (!url) return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/uploads')) return `http://localhost:5000${url}`;
        return url;
    };

    const profileImageUrl = getImageUrl(user?.profileImage);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--treg-bg)' }}>
                <div style={{ width: 40, height: 40, border: '4px solid rgba(139, 92, 246, 0.1)', borderTop: '4px solid var(--treg-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    return (
        <div className={`page-wrapper tp-full-page ${theme === 'light' ? 'light' : 'dark'}`}>
            {/* Background Glows */}
            <div className="treg-bg-glow treg-glow-purple"></div>
            <div className="treg-bg-glow treg-glow-blue"></div>

            <div className="tp-container">
                {/* Left Column: Profile Card */}
                <aside className="tp-profile-card">
                    <div className="tp-avatar-wrapper">
                        <img
                            src={imageError ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' : profileImageUrl}
                            alt={user?.name || "Avatar"}
                            className="tp-avatar"
                            onError={() => setImageError(true)}
                        />
                    </div>
                    <h1 className="tp-name">{user?.name || 'Loading...'}</h1>
                    <span className="tp-role-badge">{user?.role === 'student' ? 'Student' : 'Teacher'} Account</span>
                </aside>

                {/* Right Column: Content */}
                <div className="tp-content-col">
                    {/* Academic Information */}
                    <section className="tp-card">
                        <h2 className="tp-section-title">
                            <GraduationCap size={22} color="var(--treg-primary)" />
                            Personal & Academic Information
                        </h2>
                        <div className="tp-info-grid">
                            <div className="tp-info-item">
                                <span className="tp-label">Email Address</span>
                                <span className="tp-value">{user?.email || 'N/A'}</span>
                            </div>
                            <div className="tp-info-item">
                                <span className="tp-label">College Name</span>
                                <span className="tp-value">{user?.college || 'N/A'}</span>
                            </div>
                            <div className="tp-info-item">
                                <span className="tp-label">Department</span>
                                <span className="tp-value">{user?.department || 'N/A'}</span>
                            </div>
                            <div className="tp-info-item">
                                <span className="tp-label">{user?.role === 'teacher' ? 'Employee ID' : 'Registration ID'}</span>
                                <span className="tp-value">{user?.regNo || 'N/A'}</span>
                            </div>
                        </div>
                    </section>

                    <section className="tp-settings-section">
                        <h2 className="tp-section-title">
                            <Shield size={22} color="var(--treg-primary)" />
                            Account Settings
                        </h2>
                        <div className="tp-settings-grid">
                            {/* Edit Profile */}
                            <div className="tp-action-panel tp-edit" onClick={() => navigate('/edit-profile')}>
                                <div className="tp-icon-wrapper">
                                    <User size={22} />
                                </div>
                                <div className="tp-action-text">
                                    <span className="tp-action-title">Edit Profile</span>
                                    <span className="tp-action-sub">Update personal info</span>
                                </div>
                                <ChevronRight size={18} color="var(--treg-text-dim)" />
                            </div>

                            {/* Security */}
                            <div className="tp-action-panel tp-security" onClick={() => navigate('/change-password')}>
                                <div className="tp-icon-wrapper">
                                    <Shield size={22} />
                                </div>
                                <div className="tp-action-text">
                                    <span className="tp-action-title">Security</span>
                                    <span className="tp-action-sub">Change password</span>
                                </div>
                                <ChevronRight size={18} color="var(--treg-text-dim)" />
                            </div>

                            {/* Log Out */}
                            <div className="tp-action-panel tp-logout" onClick={onLogout}>
                                <div className="tp-icon-wrapper">
                                    <LogOut size={22} />
                                </div>
                                <div className="tp-action-text">
                                    <span className="tp-action-title">Log Out</span>
                                    <span className="tp-action-sub">Sign out of account</span>
                                </div>
                                <ChevronRight size={18} color="var(--treg-text-dim)" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Profile;

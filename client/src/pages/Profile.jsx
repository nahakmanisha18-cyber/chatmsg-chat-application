import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { FaUser, FaEdit, FaEnvelope, FaPhone, FaLock, FaCamera, FaCheckCircle, FaBell, FaShieldAlt } from "react-icons/fa";
import Sidebar from "../Components/Chat/Sidebar";
import ProfileEmpty from "../Components/Chat/ProfileEmpty";
import "../style/Profile.css";


const Profile = () => {
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [about, setAbout] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get("/auth/me");
                console.log("PROFILE RESPONSE:", response.data);
                const user = response.data.user;
                setName(user.fullName || "");
                setEmail(user.email || "");
                setPhone(user.mobileNumber || "");
                setAbout(
                    user.about || "Hey there! I am using ChatMsg."
                );

            } catch (error) {
                console.log("GET PROFILE ERROR:", error);
                setError(
                    error.response?.data?.message ||
                    "Failed to load profile"
                );

            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);


    const handleSave = () => {
        setEditMode(false);
        console.log("Profile Updated");
    };

    return (
        <div className="messages-page profile-page">
            <div className="messages-layout">

                <Sidebar />
                <section className="conversation-list profile-list-panel">
                    <div className="profile-header">
                        <div className="profile-header-title">
                            <h2>Profile</h2>
                            <p>Manage your profile</p>
                        </div>
                        {!editMode && (
                            <button type="button" className="profile-header-edit" onClick={() => setEditMode(true)} >
                                <FaEdit />
                                <span>Edit</span>
                            </button>
                        )}
                    </div>

                    <div className="profile-items">
                        {loading ? (
                            <div className="profile-loading">
                                Loading profile...
                            </div>
                        ) : error ? (
                            <div className="profile-loading">
                                {error}
                            </div>
                        ) : (

                            <section className="profile-card">
                                <div className="profile-card-top">
                                    <div className="profile-avatar-wrapper">
                                        <div className="profile-avatar">
                                            <FaUser />
                                        </div>
                                        {editMode && (
                                            <button type="button" className="profile-camera-btn" >
                                                <FaCamera />
                                            </button>
                                        )}
                                    </div>

                                    <div className="profile-main-info">
                                        <h2> {name}</h2>
                                        <div className="profile-online">
                                            <span className="online-dot"></span>
                                            <span> Online  </span>
                                        </div>
                                        <p>{about}</p>
                                    </div>
                                </div>
                                <div className="profile-section">
                                    <div className="profile-section-title">
                                        <h3> Personal Information </h3>
                                        <p>  Your basic account information </p>
                                    </div>

                                    <div className="profile-fields">
                                        <div className="profile-field">
                                            <label> Full Name </label>
                                            <div className="profile-input-wrapper">
                                                <FaUser />
                                                <input type="text" value={name} disabled={!editMode} onChange={(e) => setName(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="profile-field">
                                            <label> Email Address  </label>
                                            <div className="profile-input-wrapper">
                                                <FaEnvelope />
                                                <input type="email" value={email} disabled={!editMode} onChange={(e) => setEmail(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="profile-field">
                                            <label>  Phone Number  </label>
                                            <div className="profile-input-wrapper">
                                                <FaPhone />
                                                <input type="text" value={phone} disabled={!editMode} onChange={(e) => setPhone(e.target.value)} />
                                            </div>
                                        </div>

                                        <div className="profile-field profile-field-full">
                                            <label>About</label>

                                            <div className="profile-input-wrapper profile-textarea-wrapper">
                                                <FaUser />
                                                <textarea value={about} disabled={!editMode} onChange={(e) => setAbout(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>

                                    {editMode && (
                                        <div className="profile-form-actions">
                                            <button type="button" className="profile-cancel-btn" onClick={() => setEditMode(false)}   >
                                                Cancel
                                            </button>
                                            <button type="button" className="profile-save-btn" onClick={handleSave} >
                                                <FaCheckCircle />
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        <section className="profile-settings-card">
                            <div className="profile-settings-header">
                                <h3>Account & Privacy </h3>
                                <p>  Manage your ChatMsg account settings </p>
                            </div>

                            <div className="profile-settings-list">
                                <div className="profile-setting-item">
                                    <div className="profile-setting-icon">
                                        <FaLock />
                                    </div>
                                    <div className="profile-setting-info">
                                        <strong>
                                            Privacy & Security
                                        </strong>
                                        <span>  Manage your privacy and security </span>
                                    </div>
                                </div>
                                <div className="profile-setting-item">
                                    <div className="profile-setting-icon">
                                        <FaBell />
                                    </div>
                                    <div className="profile-setting-info">
                                        <strong>
                                            Notifications
                                        </strong>
                                        <span>
                                            Manage message notifications
                                        </span>
                                    </div>
                                </div>

                                <div className="profile-setting-item">
                                    <div className="profile-setting-icon">
                                        <FaShieldAlt />
                                    </div>

                                    <div className="profile-setting-info">
                                        <strong>
                                            Security
                                        </strong>
                                        <span>
                                            Keep your account protected
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
                <ProfileEmpty />
            </div>
        </div>
    );

};


export default Profile;
import React from "react";

import {FaUserCircle,FaShieldAlt,FaUser} from "react-icons/fa";

const ProfileEmpty = () => {

    return (
        <section className="profile-empty">
            <div className="profile-empty-content">
                <div className="profile-empty-icon">
                    <FaUserCircle />
                </div>
                <h2>
                    Welcome to your Profile
                </h2>
                <p>
                    Select your profile information from the left
                    to manage your ChatMsg account.
                </p>
                <div className="profile-empty-actions">
                    <div className="profile-empty-action">
                        <FaUser />
                        <span>
                            Personal Info
                        </span>
                    </div>
                    <div className="profile-empty-action">
                        <FaShieldAlt />
                        <span>
                            Privacy & Security
                        </span>
                    </div>
                </div>
            </div>
        </section>

    );

};


export default ProfileEmpty;
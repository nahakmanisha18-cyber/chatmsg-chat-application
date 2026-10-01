import React from "react";

import { FaTimes, FaRegCommentAlt, FaVideo, FaPhoneAlt, FaPhoneSlash, FaPhone, FaUser } from "react-icons/fa";

const ContactInfo = ({ contact, onClose }) => {
    if (!contact) return null;

    return (
        <section className="contact-info-panel">

            <div className="contact-info-header">
                <h2>
                    Contact info
                </h2>
                <button type="button" className="contact-info-close" onClick={onClose} title="Close" >
                    <FaTimes />
                </button>

            </div>

            <div className="contact-details-card">
                <div className="contact-details-top">
                    <div className="contact-profile">
                        <div className="contact-profile-avatar">
                            <FaUser />
                        </div>
                        <div className="contact-profile-name">
                            <h3>  {contact.name}  </h3>
                            <span>
                                {contact.online
                                    ? "Online"
                                    : "Offline"
                                }
                            </span>
                        </div>
                    </div>


                    <div className="contact-info-actions">
                        <button type="button" title="Message" >
                            <FaRegCommentAlt />
                        </button>

                        <button type="button" title="Video Call" >
                            <FaVideo />
                        </button>

                        <button type="button" title="Audio Call">
                            <FaPhoneAlt />
                        </button>
                    </div>
                </div>

                <div className="call-history">
                    <div className="call-history-date">
                        06/09/2026
                    </div>

                    <div className="call-history-item">
                        <div className="call-history-left">
                            <FaPhoneSlash />

                            <span>  Incoming voice call at 8:48 pm </span>
                        </div>
                        <span className="call-history-status">
                            Accepted on another device
                        </span>
                    </div>

                </div>

            </div>

        </section>
    );
};


export default ContactInfo;
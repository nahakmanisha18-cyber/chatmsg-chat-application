import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { FaSearch, FaUser, FaEllipsisV, FaUserPlus } from "react-icons/fa";
import Sidebar from "../Components/Chat/Sidebar";
import ContactInfo from "../Components/Chat/ContactInfo";
import ContactEmpty from "../Components/Chat/ContactEmpty";
import "../style/Contacts.css";

const Contacts = () => {

    const [selectedContact, setSelectedContact] = useState(null);
    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoading(true);
                setError("");
                const response = await api.get("/users");
                console.log("CONTACTS RESPONSE:", response.data);
                setContacts(response.data.users || []);
            } catch (error) {
                console.log("GET CONTACTS ERROR:", error);
                setError(
                    error.response?.data?.message ||
                    "Failed to load contacts"
                );
            } finally {
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const filteredContacts = contacts.filter((contact) =>
        contact.fullName?.toLowerCase().includes(search.toLowerCase())
    );


    return (

        <div className="messages-page">
            <div className="messages-layout">
                <Sidebar />
                <section className="conversation-list contacts-list-panel">
                    <div className="conversation-header">
                        <div className="conversation-title">
                            <div className="contacts-title">
                                <div>
                                    <h2> Contact</h2>
                                </div>
                            </div>
                        </div>

                        <div className="conversation-menu-wrapper">

                            <button type="button" className="conversation-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Contact menu" >
                                <FaEllipsisV />
                            </button>
                            {menuOpen && (
                                <div className="conversation-dropdown">
                                    <button type="button" onClick={() => { console.log("Add Contact"); setMenuOpen(false); }}>
                                        <FaUserPlus />
                                        <span> Add Contact</span>
                                    </button>

                                    <button type="button" onClick={() => { console.log("Contact Settings"); setMenuOpen(false); }}>
                                        <FaUser />
                                        <span> Contact Settings </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="conversation-search-box">
                        <FaSearch className="conversation-search-icon" />

                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search contacts..." />
                        {search && (
                            <button type="button" className="clear-search-btn" onClick={() => setSearch("")} >
                                ×
                            </button>
                        )}
                    </div>
                    <div className="conversation-items">
                        {loading ? (
                            <div className="no-conversation">
                                <p>Loading contacts...</p>
                            </div>
                        ) : error ? (
                            <div className="no-conversation">
                                <p>{error}</p>
                            </div>
                        ) : filteredContacts.length > 0 ? (
                            filteredContacts.map((contact) => (
                                <div
                                    key={contact._id}
                                    className={`contact-item ${selectedContact?._id === contact._id
                                        ? "active"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        setSelectedContact(contact)
                                    }
                                >

                                    <div className="contact-avatar-wrapper">
                                        <div className="contact-avatar">
                                            <FaUser />
                                        </div>

                                        {contact.isOnline && (
                                            <span className="contact-online"></span>
                                        )}
                                    </div>

                                    <div className="contact-info">
                                        <div className="contact-top">
                                            <strong>
                                                {contact.fullName}
                                            </strong>
                                        </div>

                                        <div className="contact-bottom">
                                            <p>
                                                {contact.mobileNumber}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-conversation">
                                <FaSearch />
                                <p> No contacts found </p>
                            </div>
                        )}
                    </div>
                </section>

                {selectedContact ? (
                    <ContactInfo  contact={selectedContact} onClose={() => setSelectedContact(null)} />
                ) : (
                    <ContactEmpty />
                )}
            </div>
        </div>
    );
};


export default Contacts;
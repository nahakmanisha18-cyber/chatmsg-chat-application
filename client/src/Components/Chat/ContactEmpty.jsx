import React from "react";
import { FaAddressBook } from "react-icons/fa";

const ContactEmpty = () => {
    return (
        <section className="contact-empty">
            <div className="contact-empty-icon">
                <FaAddressBook />
            </div>
            <h1>Welcome to ChatMsg Contacts</h1>
            <p>  Select a contact from the left to start chatting.</p>
        </section>
    );
};

export default ContactEmpty;
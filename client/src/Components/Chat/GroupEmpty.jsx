import React from "react";
import { FaUsers } from "react-icons/fa";

const GroupEmpty = () => {
    return (
        <section className="group-empty">
            <div className="group-empty-icon">
                <FaUsers />
            </div>
            <h1>Welcome to ChatMsg Groups</h1>
            <p>
                Select a group from the left to start chatting.
            </p>
        </section>
    );
};

export default GroupEmpty;
import React, { useState } from "react";
import { FaComments, FaUsers, FaAddressBook, FaCog, FaSun, FaMoon, FaChevronDown, FaUserCircle } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router";

const Sidebar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [settingsOpen, setSettingsOpen] = useState(false);
    const [theme, setTheme] = useState("light");


    const handleThemeChange = (selectedTheme) => {
        setTheme(selectedTheme);
        if (selectedTheme === "dark") {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");

        }
    }

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <aside className="chat-sidebar">
            <button type="button" className={`sidebar-item ${location.pathname === "/message" ? "active" : ""}`} onClick={() => handleNavigation("/message")} >
                <FaComments />
                <span>Chats</span>
            </button>

            <button type="button" className={`sidebar-item ${location.pathname === "/groups" ? "active" : ""}`} onClick={() => handleNavigation("/groups")}>
                <FaUsers />
                <span>Groups</span>
            </button>

            <button type="button" className={`sidebar-item ${location.pathname === "/contacts" ? "active" : ""}`} onClick={() => handleNavigation("/contacts")} >
                <FaAddressBook />
                <span>Contacts</span>
            </button>

            <div className="sidebar-settings">

                <button type="button" className={`sidebar-item ${location.pathname === "/settings" ? "active" : ""}`}
                    onClick={() => {
                        setSettingsOpen(!settingsOpen);
                    }} >
                    <FaCog />
                    <span>Settings</span>
                    <FaChevronDown className={`settings-arrow ${settingsOpen ? "rotate" : ""}`} />

                </button>

                {settingsOpen && (

                    <div className="theme-dropdown">
                        <button type="button" className={`theme-option ${theme === "light" ? "selected" : "" }`}
                            onClick={() =>
                                handleThemeChange("light")
                            } >
                            <FaSun />
                            <span>Light</span>
                        </button>

                        <button type="button" className={`theme-option ${theme === "dark" ? "selected" : "" }`}
                            onClick={() =>
                                handleThemeChange("dark")
                            }>
                            <FaMoon />
                            <span>Dark</span>
                        </button>
                    </div>
                )}

            </div>

            <button type="button" className={`sidebar-item sidebar-profile ${location.pathname === "/profile" ? "active" : "" }`}
                onClick={() => handleNavigation("/profile")} >
                <FaUserCircle />
                <span>Profile</span>
            </button>
        </aside >
    );
};

export default Sidebar;
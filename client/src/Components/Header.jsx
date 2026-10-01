import React, { useState } from "react";
import { FaSun, FaMoon, FaBars, FaTimes } from "react-icons/fa";
import "../style/Header.css";
import { useNavigate } from "react-router";

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle("dark-mode");
    };

    const closeMenu = () => {
        setMenuOpen(false);  
    };
    const navigate = useNavigate();

    return (
        <header className="chatmsg-header">
            <div className="chatmsg-navbar">
                <div className="chatmsg-logo">
                    <a href="/" onClick={closeMenu}>
                        <img src="./src/assets/logo3.png" alt="ChatMsg Logo" className="logo-img"  />
                    </a>
                </div>
                <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    {menuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <nav className={`chatmsg-menu ${menuOpen ? "menu-open" : ""}`}>
                    <a href="#home" onClick={closeMenu}> Home </a>
                    <a href="#features" onClick={closeMenu}>  Features </a>
                    <a href="#how-it-works" onClick={closeMenu}>  How it works  </a>
                    <a href="#industries" onClick={closeMenu}>  Industries  </a>
                    <a href="#faq" onClick={closeMenu}> FAQ </a>
                </nav>

                <div className="chatmsg-actions">
                    <button className="login-btn" onClick={() => navigate("/login")} >
                        Login
                    </button>
                </div>

            </div>
        </header>
    );
};

export default Header;
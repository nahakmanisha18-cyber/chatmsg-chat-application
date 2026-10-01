
import React from "react";
import { Link } from "react-router-dom";
import Header from "../Components/Header"
import { FaArrowRight, FaCheckCircle, FaComments, FaLock, FaBolt, FaUsers, FaUserFriends, FaMobileAlt, FaDesktop, FaShieldAlt, FaCloud, FaBell, FaVideo, FaPhoneAlt, FaGlobe, FaBriefcase, FaGraduationCap, FaHeart, FaShoppingBag, FaChevronDown, FaQuoteLeft } from "react-icons/fa";
import "../style/ChatMsg.css";

const ChatMsg = () => {
    return (
        <>
            <Header />
            <div className="chatmsg-home">
                <section className="hero-section">
                    <div className="hero-container">
                        <div className="hero-content">
                            <div className="hero-badge">
                                <span className="badge-dot"></span>
                                Simple. Fast. Secure.
                            </div>
                            <h1> Connect.<br />Chat.{" "}<span>Anytime.</span> </h1>
                            <p className="hero-description">
                                Stay connected with the people who matter.
                                ChatMsg makes messaging simple, fast and secure
                                so you can communicate anytime, anywhere.
                            </p>
                            <div className="hero-buttons">
                                <Link to="/register" className="primary-btn" >
                                    Get Started
                                    <FaArrowRight />
                                </Link>
                                <a href="#how-it-works" className="secondary-btn">
                                    See How It Works
                                </a>
                            </div>
                            <div className="hero-trust">
                                <div className="trust-item">
                                    <FaCheckCircle />
                                    <span>Free to get started</span>
                                </div>
                                <div className="trust-item">
                                    <FaCheckCircle />
                                    <span>Private conversations</span>
                                </div>
                                <div className="trust-item">
                                    <FaCheckCircle />
                                    <span>Works everywhere</span>
                                </div>
                            </div>

                        </div>

                        <div className="hero-visual">

                            <div className="hero-circle circle-one"></div>
                            <div className="hero-circle circle-two"></div>
                            <div className="floating-message message-one">
                                <div className="mini-avatar">
                                    <FaUsers />
                                </div>
                                <div>
                                    <strong>Alex</strong>
                                    <p>Hey! How are you?</p>
                                </div>
                                <FaCheckCircle className="message-check" />
                            </div>


                            <div className="chat-preview">
                                <div className="chat-preview-header">
                                    <div className="preview-user">
                                        <div className="preview-avatar">
                                            A
                                        </div>
                                        <div>
                                            <strong>Alex</strong>
                                            <span>Online</span>
                                        </div>
                                    </div>
                                    <div className="preview-actions">
                                        <FaVideo />
                                        <FaPhoneAlt />
                                    </div>
                                </div>
                                <div className="chat-preview-body">
                                    <div className="preview-date">
                                        Today
                                    </div>

                                    <div className="preview-message received">
                                        Hey! How are you?
                                        <small>10:30 PM</small>
                                    </div>

                                    <div className="preview-message sent">
                                        I'm good, thanks!
                                        <small>10:31 PM</small>
                                    </div>

                                    <div className="preview-message received">
                                        What about our project?
                                        <small>10:32 PM</small>
                                    </div>

                                    <div className="preview-message sent">
                                        It's going great!
                                        <small>10:33 PM</small>
                                    </div>

                                </div>

                                <div className="preview-input">
                                    <span> Type a message... </span>
                                    <div className="preview-send">
                                        <FaArrowRight />
                                    </div>
                                </div>
                            </div>

                            <div className="floating-message message-two">
                                <div className="online-dot">
                                    <span></span>
                                </div>
                                <div>
                                    <strong>Sarah</strong>
                                    <p>Let's connect!</p>
                                </div>
                                <FaHeart className="heart-icon" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="stats-section">
                    <div className="stats-container">
                        <div className="stat-item">
                            <FaUsers />
                            <div>
                                <strong>10K+</strong>
                                <span>Active Users</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <FaComments />
                            <div>
                                <strong>1M+</strong>
                                <span>Messages Sent</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <FaGlobe />
                            <div>
                                <strong>50+</strong>
                                <span>Countries</span>
                            </div>
                        </div>

                        <div className="stat-item">
                            <FaShieldAlt />
                            <div>
                                <strong>100%</strong>
                                <span>Private Chats</span>
                            </div>
                        </div>

                    </div>

                </section>

                <section className="features-section" id="features">

                    <div className="section-heading">
                        <span className="section-label"> FEATURES  </span>
                        <h2> Everything you need to  <span> stay connected.</span></h2>
                        <p>  ChatMsg gives you a simple and powerful way to communicate with friends, teams and communities. </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card featured">
                            <div className="feature-icon">
                                <FaBolt />
                            </div>
                            <h3>Real-time Messaging</h3>
                            <p> Send and receive messages instantly. Stay connected with conversations without waiting. </p>
                            <div className="feature-link">
                                Fast messaging
                                <FaArrowRight />
                            </div>
                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaLock />
                            </div>
                            <h3>Private & Secure</h3>
                            <p>  Your conversations are private and protected.  Chat with confidence.  </p>

                            <div className="feature-link">
                                Secure conversations
                                <FaArrowRight />
                            </div>

                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaUsers />
                            </div>
                            <h3>Groups & Communities</h3>
                            <p>  Create groups, connect with multiple people and keep conversations organized.  </p>

                            <div className="feature-link">
                                Create groups
                                <FaArrowRight />
                            </div>

                        </div>


                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaVideo />
                            </div>
                            <h3>Voice & Video Calls</h3>
                            <p> Connect beyond text with voice and video communication.</p>
                            <div className="feature-link">
                                Stay connected
                                <FaArrowRight />
                            </div>

                        </div>


                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaMobileAlt />
                            </div>
                            <h3>Any Device</h3>
                            <p>
                                Access your conversations from your desktop, tablet or mobile device.
                            </p>

                            <div className="feature-link">
                                Chat anywhere
                                <FaArrowRight />
                            </div>

                        </div>

                        <div className="feature-card">
                            <div className="feature-icon">
                                <FaBell />
                            </div>
                            <h3>Stay Updated</h3>
                            <p>
                                Never miss important conversations with
                                useful notifications.
                            </p>
                            <div className="feature-link">
                                Never miss a message
                                <FaArrowRight />
                            </div>

                        </div>
                    </div>
                </section>

                <section className="how-section" id="how-it-works" >
                    <div className="section-heading">
                        <span className="section-label">
                            HOW IT WORKS
                        </span>
                        <h2>
                            Start chatting in
                            <span> three simple steps.</span>
                        </h2>
                        <p>
                            Getting started with ChatMsg is quick and easy.
                        </p>
                    </div>


                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">
                                01
                            </div>
                            <div className="step-icon">
                                <FaUserFriends />
                            </div>
                            <h3>Create your account</h3>
                            <p>
                                Sign up with your basic information
                                and create your ChatMsg account.
                            </p>
                        </div>


                        <div className="step-line"></div>
                        <div className="step-card">
                            <div className="step-number">
                                02
                            </div>
                            <div className="step-icon">
                                <FaComments />
                            </div>
                            <h3>Find your people</h3>
                            <p>
                                Connect with friends, colleagues or
                                create your own groups.
                            </p>
                        </div>
                        <div className="step-line"></div>
                        <div className="step-card">
                            <div className="step-number">
                                03
                            </div>
                            <div className="step-icon">
                                <FaBolt />
                            </div>
                            <h3>Start chatting</h3>
                            <p>
                                Send messages and stay connected
                                anytime from anywhere.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="industries-section" id="industries" >
                    <div className="section-heading">
                        <span className="section-label"> FOR EVERYONE  </span>
                        <h2>
                            Built for the way
                            <span> you communicate.</span>
                        </h2>
                        <p>
                            Whether you're chatting with friends,
                            working with a team or building a community,
                            ChatMsg fits right in.
                        </p>
                    </div>


                    <div className="industries-grid">
                        <div className="industry-card">
                            <div className="industry-icon">
                                <FaUserFriends />
                            </div>
                            <h3>Friends & Family</h3>
                            <p>
                                Keep your personal conversations
                                close and organized.
                            </p>
                        </div>


                        <div className="industry-card">
                            <div className="industry-icon">
                                <FaBriefcase />
                            </div>
                            <h3>Teams & Work</h3>
                            <p>
                                Collaborate and communicate
                                with your team easily.
                            </p>
                        </div>


                        <div className="industry-card">
                            <div className="industry-icon">
                                <FaGraduationCap />
                            </div>
                            <h3>Education</h3>
                            <p>
                                Connect students, teachers and
                                learning communities.
                            </p>
                        </div>


                        <div className="industry-card">
                            <div className="industry-icon">
                                <FaShoppingBag />
                            </div>
                            <h3>Businesses</h3>
                            <p>
                                Build better conversations with
                                customers and teams.
                            </p>
                        </div>

                    </div>

                </section>


                <section className="security-section">
                    <div className="security-container">
                        <div className="security-visual">
                            <div className="security-card">
                                <div className="security-main-icon">
                                    <FaShieldAlt />
                                </div>
                                <div className="security-status">
                                    <span></span>
                                    Protected
                                </div>
                                <div className="security-lines">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                        </div>

                        <div className="security-content">
                            <span className="section-label">
                                PRIVACY FIRST
                            </span>
                            <h2>
                                Your conversations
                                <span> belong to you.</span>
                            </h2>
                            <p>
                                We believe conversations should remain
                                private. ChatMsg is designed with privacy
                                and security in mind.
                            </p>

                            <div className="security-list">
                                <div>
                                    <FaCheckCircle />
                                    <span>
                                        Private conversations
                                    </span>
                                </div>

                                <div>
                                    <FaCheckCircle />
                                    <span>
                                        Secure account access
                                    </span>
                                </div>

                                <div>
                                    <FaCheckCircle />
                                    <span>
                                        Protected user information
                                    </span>
                                </div>

                                <div>
                                    <FaCheckCircle />
                                    <span>
                                        Secure communication
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                <section className="testimonial-section">
                    <div className="testimonial-card">
                        <FaQuoteLeft className="quote-icon" />
                        <p>
                            "ChatMsg makes staying connected simple.
                            Everything I need for everyday conversations
                            is right where I need it."
                        </p>
                        <div className="testimonial-user">
                            <div className="testimonial-avatar">
                                A
                            </div>
                            <div>
                                <strong>Alex Johnson</strong>
                                <span>ChatMsg User</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="faq-section" id="faq"  >
                    <div className="section-heading">
                        <span className="section-label">
                            FAQ
                        </span>
                        <h2>
                            Questions?
                            <span> We've got answers.</span>
                        </h2>
                    </div>

                    <div className="faq-container">
                        <details>
                            <summary>
                                Is ChatMsg free to use?
                                <FaChevronDown />
                            </summary>
                            <p>
                                Yes. You can create a ChatMsg account
                                and start chatting without any complicated
                                setup.
                            </p>
                        </details>

                        <details>
                            <summary>
                                Can I create group conversations?
                                <FaChevronDown />
                            </summary>

                            <p>
                                Yes. ChatMsg supports group conversations
                                so you can connect with multiple people
                                in one place.
                            </p>
                        </details>

                        <details>
                            <summary>
                                Can I use ChatMsg on mobile?
                                <FaChevronDown />
                            </summary>

                            <p>
                                ChatMsg is designed to work across different
                                screen sizes including desktop, tablet and
                                mobile devices.
                            </p>
                        </details>


                        <details>
                            <summary>
                                Is my conversation private?
                                <FaChevronDown />
                            </summary>

                            <p>
                                ChatMsg is designed with privacy and
                                secure communication in mind.
                            </p>
                        </details>
                    </div>
                </section>

                <section className="cta-section">
                    <div className="cta-container">
                        <div className="cta-icon">
                            <FaComments />
                        </div>
                        <h2>
                            Ready to start
                            <span> chatting?</span>
                        </h2>
                        <p>
                            Create your ChatMsg account and connect
                            with the people who matter.
                        </p>
                        <div className="cta-buttons">
                            <Link to="/register" className="cta-primary">
                                Create Account
                                <FaArrowRight />
                            </Link>

                            <Link to="/login" className="cta-secondary" >
                                Login to ChatMsg
                            </Link>
                        </div>
                    </div>
                </section>



                <footer className="footer">
                    <div className="footer-container">
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <div className="footer-logo-icon">
                                    <FaComments />
                                </div>
                                <span>ChatMsg</span>
                            </div>
                            <p>
                                Simple, fast and secure messaging
                                for everyone.
                            </p>
                        </div>

                        <div className="footer-column">
                            <h4>Product</h4>
                            <a href="#features"> Features  </a>
                            <a href="#how-it-works">  How it works  </a>
                            <a href="#industries"> Industries </a>
                            <a href="#faq"> FAQ </a>
                        </div>

                        <div className="footer-column">
                            <h4>Account</h4>
                            <Link to="/login">
                                Login
                            </Link>
                            <Link to="/register">
                                Create Account
                            </Link>
                        </div>
                        
                        <div className="footer-column">
                            <h4>Contact</h4>

                            <a href="mailto:hello@chatmsg.com">
                                hello@chatmsg.com
                            </a>

                            <span>
                                Available anytime
                            </span>
                        </div>
                    </div>


                    <div className="footer-bottom">
                        <span>
                            © 2026 ChatMsg. All rights reserved.
                        </span>
                        <div>
                            <a href="#">Privacy</a>
                            <a href="#">Terms</a>
                        </div>

                    </div>
                </footer>
            </div>
        </>
    );
};

export default ChatMsg;
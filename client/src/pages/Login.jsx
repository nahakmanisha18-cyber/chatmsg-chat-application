
import api from "../api/axios";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaComments, FaCheckCircle, FaTimes, FaGoogle, FaGithub, FaFacebookF, FaUser, FaCheckDouble, FaHeart, FaShieldAlt } from "react-icons/fa";
import logo from "../assets/loginlogo.png";
import "../style/Login.css";
import { loginvalidateForm } from "../utils/validate";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setServerError("");
        const isValid = loginvalidateForm({
            email,
            password,
            setErrors,
            emailRef,
            passwordRef,
        });

        if (!isValid) {
            return;
        }

        setLoading(true);
        try {

            const response = await api.post("/auth/login", {
                email: email.trim().toLowerCase(),
                password,
            });

            console.log("LOGIN RESPONSE:", response.data);
            localStorage.setItem("token", response.data.token);

            localStorage.setItem("user", JSON.stringify(response.data.user));
            navigate("/message");

        } catch (error) {
            console.log("LOGIN ERROR:", error);
            const status = error.response?.status;
            const message = error.response?.data?.message;
            if (status === 404) {
                setServerError( "User does not exist. Please register." );
            } else if (status === 401) {
                setServerError( "Invalid password." );
            } else {
                setServerError( message || "Login failed. Please try again." );
            }
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">
                    <div className="brand-orb brand-orb-one"></div>
                    <div className="brand-orb brand-orb-two"></div>

                    <div className="brand-content">
                        <img src={logo} alt="ChatMsg" className="login-logo" />

                        <div className="brand-visual">
 
                            <div className="floating-message message-one">
                                <div className="message-avatar">
                                    <FaUser />
                                </div>

                                <div className="message-info">
                                    <strong>Alex</strong>
                                    <span>Hey! How are you?</span>
                                </div>
                                <FaCheckDouble className="message-check" />
                            </div>

                            <div className="brand-icon">
                                <FaComments />
                            </div>

                            <div className="online-badge">
                                <span></span>
                                <strong>Online</strong>
                            </div>

                            <div className="floating-message message-two">
                                <div className="message-avatar">
                                    <FaUser />
                                </div>

                                <div className="message-info">
                                    <strong>Sarah</strong>
                                    <span>Let's connect! 💙</span>
                                </div>

                                <FaHeart className="message-heart" />
                            </div>

                        </div>

                        <h1> Connect.<br /> Chat. <span>Anytime.</span></h1>
                        <p>
                            Simple, fast and secure messaging.
                            <br />
                            Stay connected with the people who matter.
                        </p>
 
                        <div className="brand-features">

                            <div className="brand-feature">
                                <div className="feature-icon">
                                    <FaCheckCircle />
                                </div>
                                <span>Real-time messaging</span>
                            </div>

                            <div className="brand-feature">
                                <div className="feature-icon">
                                    <FaCheckCircle />
                                </div>
                                <span>Secure conversations</span>
                            </div>

                            <div className="brand-feature">
                                <div className="feature-icon">
                                    <FaCheckCircle />
                                </div>
                                <span>Connect anywhere</span>
                            </div>

                        </div>

                        <div className="brand-trust">
                            <FaShieldAlt />
                            <span>Your conversations stay private</span>
                        </div>

                    </div>

                </div>

                <div className="login-section">
                    <Link to="/" className="login-close"> <FaTimes /> </Link>

                    <Link to="/" className="mobile-login-close">
                        <FaArrowLeft />
                    </Link>
                    <div className="login-form-container">
                        <img  src={logo}  alt="ChatMsg" className="mobile-login-logo" />
                        <div className="login-heading">
                            <h2>  Login to your account  </h2>
                            <p> Enter your details to continue to ChatMsg. </p>
                        </div>
                        {serverError && (
                            <div className="login-server-error">
                                <span> {serverError}   </span>
                                {serverError === "User does not exist. Please register." && (
                                        <Link to="/register">
                                            Register
                                        </Link>
                                    )}

                            </div>
                        )}

                        <form onSubmit={handleLogin} noValidate>
                            <div className="form-group">
                                <label htmlFor="email"> Email address </label>
                                <input ref={emailRef} type="email" id="email" placeholder="you@example.com" value={email}  onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev,   email: ""})); setServerError(""); }} className={errors.email ? "input-error" : ""}  />
                                {errors.email && (
                                    <span className="field-error">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            <div className="form-group">
                                <div className="password-label">
                                    <label htmlFor="password">  Password  </label>
                                    <Link to="/forgot-password"> Forgot password? </Link>
                                </div>

                                <div className="password-inpu">
                                    <input  ref={passwordRef}  type="password" id="password"  placeholder="Enter your password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({...prev, password: "", })); setServerError(""); }} className={errors.password ? "input-error" : ""} />
                                </div>

                                {errors.password && (
                                    <span className="field-error">
                                        {errors.password}
                                    </span>
                                )}

                            </div>

                            <button type="submit"  className="login-submit" disabled={loading} >
                                <span> {loading ? "Logging in..." : "Login"}  </span>
                            </button>
                        </form>

                        <div className="social-login">

                            <div className="social-divider">
                                <span></span>
                                <p>or continue with</p>
                                <span></span>
                            </div>

                            <div className="login-social-icons">

                                <button type="button" className="social-btn">
                                    <FaGoogle />
                                </button>

                                <button type="button" className="social-btn">
                                    <FaGithub />
                                </button>

                                <button type="button" className="social-btn">
                                    <FaFacebookF />
                                </button>

                            </div>

                        </div>

                        <div className="register-text">
                            <span> Don't have an account?  </span>
                            <Link to="/register">
                                Create an account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
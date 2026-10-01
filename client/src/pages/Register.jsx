import React, { useRef, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowRight, FaArrowLeft, FaComments, FaCheckCircle, FaTimes, FaGoogle, FaGithub, FaFacebookF, FaUser, FaCheckDouble, FaHeart, FaShieldAlt } from "react-icons/fa";
import logo from "../assets/loginlogo.png";
import "../style/Register.css";
import api from "../api/axios";
import { registervalidateForm } from "../utils/validate"

const Register = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const fullNameRef = useRef(null);
    const emailRef = useRef(null);
    const mobileRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setServerError("");

        const isValid = registervalidateForm({
            fullName,
            email,
            mobileNumber,
            password,
            confirmPassword,
            setErrors,
            fullNameRef,
            emailRef,
            mobileRef,
            passwordRef,
            confirmPasswordRef,
        });

        if (!isValid) {
            return;
        }

        setLoading(true);

        try {
            const response = await api.post("/auth/register", {
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                mobileNumber: mobileNumber.trim(),
                password,
                confirmPassword,
            });

            console.log("REGISTER RESPONSE:", response.data);
            navigate("/login");

        } catch (error) {
            console.log("REGISTER ERROR:", error);
            const message = error.response?.data?.message;
            if (error.response?.status === 409) {
                setServerError("User already exists. Please login.");
            } else {
                setServerError(message || "Registration failed. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="register-page">
            <div className="register-card">
                <div className="register-brand">

                    <div className="register-brand-orb register-brand-orb-one"></div>
                    <div className="register-brand-orb register-brand-orb-two"></div>

                    <div className="register-brand-content">

                        <img src={logo} alt="ChatMsg" className="register-logo" />
                        <div className="register-brand-visual">

                            <div className="register-floating-message register-message-one">
                                <div className="register-message-avatar">
                                    <FaUser />
                                </div>

                                <div className="register-message-info">
                                    <strong>Alex</strong>
                                    <span>Hey! How are you?</span>
                                </div>
                                <FaCheckDouble className="register-message-check" />
                            </div>

                            <div className="register-brand-icon">
                                <FaComments />
                            </div>
                            <div className="register-online-badge">
                                <span></span>
                                <strong>Online</strong>
                            </div>

                            <div className="register-floating-message register-message-two">

                                <div className="register-message-avatar">
                                    <FaUser />
                                </div>

                                <div className="register-message-info">
                                    <strong>Sarah</strong>
                                    <span>Let's connect! 💙</span>
                                </div>

                                <FaHeart className="register-message-heart" />

                            </div>
                        </div>

                        <h1>
                            Connect.
                            <br />
                            Chat. <span>Anytime.</span>
                        </h1>
                        <p>
                            Simple, fast and secure messaging.
                            <br />
                            Stay connected with the people who matter.
                        </p>

                        <div className="register-brand-features">
                            <div className="register-brand-feature">

                                <div className="register-feature-icon">
                                    <FaCheckCircle />
                                </div>

                                <span>Real-time messaging</span>

                            </div>


                            <div className="register-brand-feature">

                                <div className="register-feature-icon">
                                    <FaCheckCircle />
                                </div>

                                <span>Secure conversations</span>

                            </div>


                            <div className="register-brand-feature">

                                <div className="register-feature-icon">
                                    <FaCheckCircle />
                                </div>

                                <span>Connect anywhere</span>

                            </div>

                        </div>

                        <div className="register-brand-trust">

                            <FaShieldAlt />

                            <span>
                                Your conversations stay private
                            </span>

                        </div>

                    </div>
                </div>


                <div className="register-section">
                    <Link to="/" className="register-close">
                        <FaTimes />
                    </Link>

                    {/* Mobile Arrow */}
                    <Link to="/" className="mobile-register-close">
                        <FaArrowLeft />
                    </Link>

                    <div className="register-form-container">
                        <img src={logo} alt="ChatMsg" className="mobile-register-logo" />
                        <div className="register-heading">
                            <h2> Create your account </h2>
                            <p> Register to start using ChatMsg. </p>
                        </div>

                        {serverError && (
                            <div className="register-server-error">
                                <span>{serverError}</span>
                                {serverError === "User already exists. Please login." && (
                                    <Link to="/login">
                                        Login
                                    </Link>
                                )}
                            </div>
                        )}

                        <form onSubmit={handleRegister} noValidate>
                            <div className="register-form-group">
                                <label htmlFor="name"> Full Name  </label>
                                <input ref={fullNameRef} id="name" placeholder="Enter your name" value={fullName} onChange={(e) => { setFullName(e.target.value); if (errors.fullName) { setErrors({ ...errors, fullName: "", }); } }} className={errors.fullName ? "input-error" : ""} autoFocus={!!errors.fullName} />
                                {errors.fullName && (
                                    <span className="field-error">
                                        {errors.fullName}
                                    </span>
                                )}
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <input ref={emailRef} type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: "", })); }} />
                                {errors.email && (
                                    <span className="field-error">
                                        {errors.email}
                                    </span>
                                )}

                            </div>

                            <div className="register-form-group">
                                <div className="register-form-group">

                                    <label htmlFor="mobile">
                                        Mobile Number
                                    </label>

                                    <input ref={mobileRef} type="tel" id="mobile" placeholder="Enter mobile number" value={mobileNumber} onChange={(e) => { setMobileNumber(e.target.value); setErrors((prev) => ({ ...prev, mobileNumber: "", })); }} className={errors.mobileNumber ? "input-error" : ""} />
                                    {errors.mobileNumber && (
                                        <span className="field-error">
                                            {errors.mobileNumber}
                                        </span>
                                    )}

                                </div>

                            </div>

                            <div className="register-form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="register-password-input">
                                    <input ref={passwordRef} type={showPassword ? "text" : "password"} id="password" placeholder="Enter your password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: "", })); }} className={errors.password ? "input-error" : ""} />

                                    <button type="button" className="register-password-toggle" onClick={() => setShowPassword(!showPassword)} >
                                        {showPassword
                                            ? <FaEyeSlash />
                                            : <FaEye />
                                        }
                                    </button>
                                </div>

                                {errors.password && (
                                    <span className="field-error">
                                        {errors.password}
                                    </span>
                                )}

                            </div>

                            <div className="register-form-group">
                                <label htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <div className="register-password-input">

                                    <input ref={confirmPasswordRef} type={showConfirmPassword ? "text" : "password"} id="confirmPassword" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setErrors((prev) => ({ ...prev, confirmPassword: "" })); }} />

                                    {errors.confirmPassword && (
                                        <span className="field-error">
                                            {errors.confirmPassword}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button type="submit" className="register-submit" disabled={loading} >
                                <span>
                                    {loading ? "Creating Account..." : "Create Account"}
                                </span>
                                {!loading && <FaArrowRight />}
                            </button>

                        </form>

                        <div className="register-social-login">
                            <div className="register-social-divider">
                                <span></span>
                                <p>or continue with</p>
                                <span></span>
                            </div>

                            <div className="register-social-icons">
                                <button type="button" className="register-social-btn" >
                                    <FaGoogle />
                                </button>

                                <button type="button" className="register-social-btn"  >
                                    <FaGithub />
                                </button>

                                <button type="button" className="register-social-btn" >
                                    <FaFacebookF />
                                </button>
                            </div>
                        </div>

                        <div className="register-login-text">
                            <span>
                                Already have an account?
                            </span>
                            <Link to="/login">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
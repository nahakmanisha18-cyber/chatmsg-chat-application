import React, { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { Emoji, EmojiStyle } from "emoji-picker-react";
import ImageViewer from "./ImageViewer";
const MessageBubble = ({ message, time, type, messageId, isRead, onEdit, onDelete }) => {

    const [menuOpen, setMenuOpen] = useState(false);
    const [editPopupOpen, setEditPopupOpen] = useState(false);
    const [deletePopupOpen, setDeletePopupOpen] = useState(false);

    const [editText, setEditText] = useState(
        typeof message === "string" ? message : message?.text || ""
    );
    const [imageViewerOpen, setImageViewerOpen] = useState(false);

    const messageText = typeof message === "string" ? message : message?.text || "";
    const messageType = typeof message === "object" ? message?.messageType : "text";
    const fileUrl = typeof message === "object" ? message?.fileUrl : "";
    const fileName = typeof message === "object" ? message?.fileName : "";

    const menuRef = useRef(null);
    const isSent = type === "sent";

    const isEmojiOnly = (text) => {
        if (!text || !text.trim()) {
            return false;
        }

        return /^(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji_Modifier}|\uFE0F|\u200D|\u20E3|[\u{1F1E6}-\u{1F1FF}]|\s)+$/u.test(
            text.trim()
        );
    };

    const emojiOnly = isEmojiOnly(messageText);
    const getEmojiList = (text) => {
        const value = text?.trim();

        if (!value) {
            return [];
        }
        if (
            typeof Intl !== "undefined" &&
            Intl.Segmenter
        ) {
            const segmenter = new Intl.Segmenter(
                undefined,
                {
                    granularity: "grapheme",
                }
            );

            return Array.from(
                segmenter.segment(value),
                (item) => item.segment
            );
        }

        return Array.from(value);
    };

    const emojiList = emojiOnly ? getEmojiList(messageText) : [];
    const isSingleEmoji = emojiOnly && emojiList.length === 1;
    const isMultipleEmoji = emojiOnly && emojiList.length > 1;

    const emojiToUnified = (emoji) => {
        return Array.from(emoji)
            .map((char) =>
                char.codePointAt(0).toString(16)
            )
            .join("-");
    };

    useEffect(() => {

        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };

    }, []);


    const handleEditClick = () => {
        setMenuOpen(false);
        setEditText(messageText);
        setEditPopupOpen(true);
    };

    const handleEditSubmit = async () => {
        const updatedText = editText.trim();
        if (!updatedText) {
            return;
        }
        if (updatedText === messageText.trim()) {
            setEditPopupOpen(false);
            return;
        }
        try {
            if (onEdit) {
                await onEdit(messageId, updatedText);
            }

            setEditPopupOpen(false);

        } catch (error) {
            console.log("EDIT MESSAGE ERROR:", error);
        }

    };


    const handleDeleteClick = () => {
        setMenuOpen(false);
        setDeletePopupOpen(true);
    };


    const handleDeleteConfirm = () => {
        if (onDelete) {
            onDelete(messageId);
        }
        setDeletePopupOpen(false);
    };


    const handleEditCancel = () => {
        setEditPopupOpen(false);
        setEditText(messageText);
    };

    const handleDeleteCancel = () => {
        setDeletePopupOpen(false);
    };

    return (
        <>

            <div className={`message-row ${type}`}>

                <div
                    className={`message-bubble ${messageType === "image" ? "image-message-bubble" : isSingleEmoji ? "single-emoji-bubble" : isMultipleEmoji ? "multiple-emoji-bubble" : ""}`}>
                    {isSent && messageType !== "image" && (
                        <div
                            className="message-menu-wrapper"
                            ref={menuRef}
                        >
                            <button
                                type="button"
                                className="message-menu-button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen((prev) => !prev);
                                }}
                                title="Message options"
                            >
                                <FaChevronDown />
                            </button>

                            {menuOpen && (
                                <div
                                    className="message-dropdown"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {!isRead && (
                                        <button
                                            type="button"
                                            onClick={handleEditClick}
                                        >
                                            <FaEdit />
                                            <span>Edit</span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        className="delete-message-option"
                                        onClick={handleDeleteClick}
                                    >
                                        <FaTrash />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {messageType === "image" && fileUrl ? (
                        <div className="image-message-content">
                            {isSent && (
                                <div className="image-menu-wrapper" ref={menuRef}>
                                    <button type="button" className="message-menu-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMenuOpen((prev) => !prev);
                                        }}
                                        title="Message options" >
                                        <FaChevronDown />
                                    </button>

                                    {menuOpen && (
                                        <div className="message-dropdown image-dropdown" onClick={(e) => e.stopPropagation()}>
                                            {!isRead && (
                                                <button type="button" onClick={handleEditClick}
                                                >
                                                    <FaEdit />
                                                    <span>Edit</span>
                                                </button>
                                            )}

                                            <button type="button" className="delete-message-option"
                                                onClick={handleDeleteClick} >
                                                <FaTrash />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            <img src={fileUrl} alt={fileName || "Image"} className="chat-image"
                                onClick={() => {
                                    if (!message?.isPending) {
                                        setImageViewerOpen(true);
                                    }
                                }} />

                            {message?.isPending && (
                                <div className="image-upload-loader">
                                    <div className="image-loader-spinner"></div>
                                </div>
                            )}

                            {!message?.isPending && (
                                <div className="image-message-meta">
                                    <span>{time}</span>

                                    {isSent && (
                                        <i className={`bi bi-check-all image-read-icon ${isRead ? "read" : ""}`} title={isRead ? "Read" : "Delivered"} ></i>
                                    )}
                                </div>
                            )}
                        </div>

                    ) : messageType === "video" && fileUrl ? (
                        <div className="video-message-content">
                            <video src={fileUrl} controls className="chat-video" />
                        </div>

                    ) : messageType === "document" && fileUrl ? (

                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="document-message-content" >
                            <i className="bi bi-file-earmark-text"></i>
                            <span>
                                {fileName || "Document"}
                            </span>
                        </a>
                    ) : isSingleEmoji ? (

                        <div className="single-emoji-message">
                            <Emoji unified={emojiToUnified(emojiList[0])} size={60} emojiStyle={EmojiStyle.APPLE} />
                        </div>

                    ) : isMultipleEmoji ? (

                        <div className="multiple-emoji-message">
                            {emojiList.map((emoji, index) => (
                                <Emoji key={index} unified={emojiToUnified(emoji)} size={28} emojiStyle={EmojiStyle.APPLE}/>
                            ))}
                        </div>

                    ) : (

                        <p className="normal-message">
                            {messageText}
                        </p>

                    )}
                    {messageType !== "image" && (
                        <div className="message-meta">
                            <span>
                                {time}
                            </span>

                            {isSent && (
                                <i className={`bi bi-check-all message-read-icon ${isRead ? "read" : ""  }`} title={isRead ? "Read" : "Delivered"}  ></i>
                            )}
                        </div>
                    )}

                </div>

            </div>
            {editPopupOpen && (

                <div className="message-popup-overlay" onClick={handleEditCancel} >

                    <div  className="message-popup"  onClick={(e) => e.stopPropagation()}>
                        <div className="message-popup-header">

                            <h3>
                                Edit message
                            </h3>

                            <button  type="button"
                                onClick={
                                    handleEditCancel
                                } >
                                <FaTimes />
                            </button>

                        </div>


                        <div className="message-popup-body">

                            <textarea value={editText}
                                onChange={(e) =>
                                    setEditText(
                                        e.target.value
                                    )
                                }
                                autoFocus rows="4" placeholder="Edit your message..." />

                        </div>

                        <div className="message-popup-footer">

                            <button type="button" className="popup-cancel-btn"
                                onClick={
                                    handleEditCancel
                                } >
                                Cancel
                            </button>

                            <button type="button" className="popup-save-btn"
                                onClick={
                                    handleEditSubmit
                                }
                                disabled={
                                    !editText.trim()
                                } >
                                Save
                            </button>

                        </div>
                    </div>

                </div>

            )}


            {deletePopupOpen && (

                <div className="message-popup-overlay" onClick={handleDeleteCancel}>

                    <div className="message-popup delete-popup" onClick={(e) =>e.stopPropagation()}>
                        <div className="delete-popup-icon">
                            <FaTrash />
                        </div>
                        <h3>
                            Delete message?
                        </h3>
                        <p>
                            Are you sure you want to
                            delete this message?
                        </p>
                        <div className="message-popup-footer">
                            <button  type="button" className="popup-cancel-btn"
                                onClick={
                                    handleDeleteCancel
                                } >
                                Cancel
                            </button>

                            <button  type="button" className="popup-delete-btn"
                                onClick={
                                    handleDeleteConfirm
                                } >
                                Delete
                            </button>

                        </div>
                    </div>

                </div>

            )}

            {imageViewerOpen && fileUrl && (
                <ImageViewer imageUrl={fileUrl} fileName={fileName} onClose={() => setImageViewerOpen(false)}/>
            )}

        </>
    );
};


export default MessageBubble;
import React, { useEffect, useRef, useState, } from "react";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import api from "../../api/axios";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

const MessageInput = ({ selectedChat, setMessages, isGroup = false, groupId = null, }) => {

    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const [emojiOpen, setEmojiOpen] = useState(false);
    const [emojiLoading, setEmojiLoading] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState(
        document.body.classList.contains("dark-theme")
    );
    const [attachmentOpen, setAttachmentOpen] = useState(false);
    const emojiRef = useRef(null);
    const messageInputRef = useRef(null);

    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const documentInputRef = useRef(null);

    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDarkMode(
                document.body.classList.contains("dark-theme")
            );

        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            observer.disconnect();
        };

    }, []);



    const updateMessageFromEditor = () => {
        const editor = messageInputRef.current;
        if (!editor) {
            return;
        }
        let result = "";
        editor.childNodes.forEach((node) => {

            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            }

            else if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.tagName === "IMG"
            ) {
                result +=
                    node.dataset.emoji || "";
            }

            else {
                result +=
                    node.textContent || "";

            }
        });
        setMessage(result);

    };

    const handleEmojiClick = (emojiData) => {
        const editor = messageInputRef.current;
        if (!editor) {
            return;
        }
        editor.focus();

        const imageUrl =
            emojiData.getImageUrl
                ? emojiData.getImageUrl(
                    EmojiStyle.APPLE
                )
                : emojiData.imageUrl;

        if (!imageUrl) {
            console.log("Emoji image URL not found");
            return;
        }

        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = "";
        img.dataset.emoji = emojiData.emoji;
        img.className = "message-input-emoji";

        const selection = window.getSelection();

        if (selection && selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(img);
            range.setStartAfter(img);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        else {

            editor.appendChild(img);
            const range = document.createRange();
            range.selectNodeContents(editor);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        updateMessageFromEditor();
    };

    useEffect(() => {

        if (!emojiOpen || emojiLoading) {
            return;
        }
        let cleanup = null;
        const timer = setTimeout(() => {
            const picker = document.querySelector(".emoji-picker-container .EmojiPickerReact");

            if (!picker) {
                return;
            }

            const scrollBody =
                picker.querySelector(
                    ".epr-body"
                );

            if (!scrollBody) {

                console.log("Emoji scroll body not found");

                return;

            }

            const categoryButtons =
                Array.from(
                    picker.querySelectorAll(
                        ".epr-category-nav button"
                    )
                );

            const categories =
                Array.from(
                    scrollBody.querySelectorAll(
                        ".epr-emoji-category"
                    )
                );
            if (
                !categoryButtons.length ||
                !categories.length
            ) {
                console.log(
                    "Emoji categories not found"
                );
                return;

            }
            const setActiveCategory =
                (activeIndex) => {

                    categoryButtons.forEach(
                        (button, index) => {

                            button.classList.toggle(
                                "custom-active-category",
                                index === activeIndex
                            );

                        }
                    );

                };

            const updateActiveCategory =
                () => {

                    const bodyRect = scrollBody.getBoundingClientRect();

                    let activeIndex = 0;

                    categories.forEach(
                        (category, index) => {
                            const rect = category.getBoundingClientRect();

                            if (rect.top <= bodyRect.top + 70) {
                                activeIndex = index;
                            }
                        }
                    );
                    setActiveCategory(
                        activeIndex
                    );
                };

            updateActiveCategory();

            scrollBody.addEventListener(
                "scroll",
                updateActiveCategory,
                {
                    passive: true,
                }
            );


            const resizeObserver =
                new ResizeObserver(() => {
                    updateActiveCategory();
                });

            resizeObserver.observe(
                scrollBody
            );

            cleanup = () => {
                scrollBody.removeEventListener(
                    "scroll",
                    updateActiveCategory
                );
                resizeObserver.disconnect();
            };

        }, 100);

        return () => {
            clearTimeout(timer);
            if (cleanup) {
                cleanup();
            }
        };
    }, [
        emojiOpen,
        emojiLoading,
    ]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                emojiRef.current &&
                !emojiRef.current.contains(
                    event.target
                )
            ) {
                setEmojiOpen(false);
            }

        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };

    }, []);

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) {
            return;
        }
        if (files.length > 20) {
            console.log("Maximum 20 images allowed");
            e.target.value = "";
            return;
        }
        const previewUrls = files.map((file) =>
            URL.createObjectURL(file)
        );
        setSelectedImages(files);
        setImagePreviewUrls(previewUrls);

        setAttachmentOpen(false);

        e.target.value = "";
    };

    const handleSend = async () => {

        const receiverId = selectedChat?._id || selectedChat?.id || selectedChat?.userId;
        const currentGroupId = groupId || selectedChat?.groupId || selectedChat?._id || selectedChat?.id;

        if (isGroup) {

            if (!currentGroupId) {
                console.log("GROUP ID NOT FOUND:", selectedChat);
                return;
            }
        } else {
            if (!receiverId) {
                console.log("RECEIVER ID NOT FOUND:", selectedChat);
                return;
            }
        }

        if (selectedImages.length > 0) {

            try {

                setSending(true);

                const filesToUpload = [...selectedImages];
                const previewsToUse = [...imagePreviewUrls];
                const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
                const currentUserId = currentUser?._id || currentUser?.id || "";

                const temporaryMessages = filesToUpload.map((file, index) => ({
                    _id: `temp-image-${Date.now()}-${index}`,
                    sender: currentUserId,
                    group: isGroup
                        ? currentGroupId
                        : undefined,
                    receiver: !isGroup
                        ? receiverId
                        : undefined,
                    messageType: "image",
                    fileUrl: previewsToUse[index],
                    fileName: file.name,
                    fileSize: file.size,
                    fileMimeType: file.type,
                    text: "",
                    createdAt:
                        new Date().toISOString(),
                    isRead: false,
                    isPending: true,
                }));

                if (setMessages) {
                    setMessages((prev) => [
                        ...prev,
                        ...temporaryMessages,
                    ]);
                }

                const formData = new FormData();
                if (isGroup) {
                    formData.append(
                        "groupId",
                        String(currentGroupId)
                    );
                } else {
                    formData.append(
                        "receiverId",
                        String(receiverId)
                    );
                }
                filesToUpload.forEach((file) => {
                    formData.append(
                        "files",
                        file
                    );
                });
                setSelectedImages([]);
                setImagePreviewUrls([]);

                const response =
                    await api.post(
                        isGroup
                            ? "/group-messages/upload"
                            : "/messages/upload",
                        formData

                    );

                console.log(
                    "UPLOAD RESPONSE:",
                    response.data
                );


                const uploadedMessages =
                    response.data?.data ||
                    response.data?.messages ||
                    response.data?.message ||
                    [];


                const serverMessages =
                    Array.isArray(uploadedMessages)
                        ? uploadedMessages
                        : uploadedMessages
                            ? [uploadedMessages]
                            : [];

                if (setMessages) {

                    setMessages((prevMessages) => {

                        const withoutTemporary =
                            prevMessages.filter(
                                (item) =>
                                    !temporaryMessages.some(
                                        (temp) => temp._id === item._id
                                    )
                            );


                        const mergedMessages = [
                            ...withoutTemporary,
                        ];

                        serverMessages.forEach(
                            (serverMessage) => {

                                const alreadyExists =
                                    mergedMessages.some(
                                        (item) =>
                                            item?._id &&
                                            serverMessage?._id &&
                                            item._id.toString() ===
                                            serverMessage._id.toString()
                                    );

                                if (!alreadyExists) {
                                    mergedMessages.push(
                                        serverMessage
                                    );
                                }
                            }
                        );
                        return mergedMessages;
                    });

                }

            } catch (error) {
                if (setMessages) {
                    setMessages((prev) =>
                        prev.filter(
                            (item) =>
                                !String(
                                    item?._id
                                ).startsWith(
                                    "temp-image-"
                                )
                        )
                    );
                }
            } finally {
                setSending(false);
            }
            return;
        }


        if (!message.trim()) {
            return;
        }

        try {
            setSending(true);

            const currentUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const currentUserId =
                currentUser?._id ||
                currentUser?.id ||
                currentUser?.userId ||
                "";

            const textMessage = {
                sender: currentUserId,
                receiver: !isGroup ? receiverId : undefined,
                group: isGroup ? currentGroupId : undefined,
                messageType: "text",
                text: message.trim(),
                createdAt: new Date().toISOString(),
                isRead: false,
            };
            if (setMessages) {
                setMessages((prev) => [
                    ...prev,
                    {
                        ...textMessage,
                        _id: `temp-${Date.now()}`,
                        isPending: true,
                    },
                ]);
            }

            const response = await api.post(
                isGroup
                    ? "/group-messages"
                    : "/messages",
                isGroup
                    ? {
                        groupId: currentGroupId,
                        text: message.trim(),
                        messageType: "text",
                    }
                    : {
                        receiverId,
                        text: message.trim(),
                        messageType: "text",
                    }
            );

            console.log(
                "TEXT MESSAGE RESPONSE:",
                response.data
            );

            const serverMessage =
                response.data?.data ||
                (typeof response.data?.message === "object"
                    ? response.data.message
                    : null);

            if (serverMessage && setMessages) {
                setMessages((prev) => { 
                    const alreadyExists = prev.some(
                        (item) =>
                            item?._id &&
                            serverMessage?._id &&
                            item._id.toString() === serverMessage._id.toString()
                    );
                    const withoutTemp = prev.filter(
                        (item) => !item?._id?.toString().startsWith("temp-")
                    );
                    if (alreadyExists) {
                        return withoutTemp;
                    }
                    return [
                        ...withoutTemp,
                        serverMessage
                    ];
                });
            }
            setMessage("");

            if (messageInputRef.current) {
                messageInputRef.current.innerHTML = "";
            }

        } catch (error) {

            console.log(
                "SEND TEXT MESSAGE ERROR:",
                error.response?.data || error
            );
        } finally {

            setSending(false);

        }
    };


    const handleKeyDown = (e) => {
        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {
            e.preventDefault();
            handleSend();
        }
    };
    const handleEmojiButton = () => {
        if (emojiOpen) {
            setEmojiOpen(false);
            return;
        }

        setEmojiOpen(true);
        setEmojiLoading(true);
        setTimeout(() => {
            setEmojiLoading(false);
        }, 500);
    };

    return (
        <div className="message-input-wrapper">
            {
                imagePreviewUrls.length > 0 && (
                    <div className="selected-image-preview">

                        {imagePreviewUrls.map((url, index) => (
                            <div className="selected-image-item" key={url} >
                                <img src={url} alt={`Selected ${index + 1}`} />
                                <button type="button"
                                    onClick={() => {
                                        const newImages =
                                            selectedImages.filter(
                                                (_, i) => i !== index
                                            );

                                        const newPreviews =
                                            imagePreviewUrls.filter(
                                                (_, i) => i !== index
                                            );
                                        setSelectedImages(newImages);
                                        setImagePreviewUrls(newPreviews);
                                    }} >
                                    <i className="bi bi-x"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )
            }
            <div className="message-input">

                <div className="emoji-picker-wrapper" ref={emojiRef} >

                    <button type="button" className="input-icon-btn" title="Emoji" onClick={handleEmojiButton}  >
                        <i className="fa-regular fa-face-smile"></i>
                    </button>
                    {emojiOpen && (
                        <div className="emoji-picker-container">
                            {emojiLoading ? (
                                <div className="emoji-loading">
                                    <div className="emoji-spinner"></div>
                                </div>
                            ) : (
                                <EmojiPicker
                                    onEmojiClick={
                                        handleEmojiClick
                                    }
                                    width={520}
                                    height={500}
                                    emojiStyle="apple"
                                    theme={
                                        isDarkMode
                                            ? "dark"
                                            : "light"
                                    }
                                    searchDisabled={false}
                                    skinTonesDisabled={false}
                                    previewConfig={{
                                        showPreview: false,
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="message-input-field">

                    <div
                        ref={messageInputRef}
                        className="message-text-editor"
                        contentEditable={!sending}
                        suppressContentEditableWarning={true}
                        data-placeholder="Type a message..."
                        onInput={
                            updateMessageFromEditor
                        }
                        onKeyDown={
                            handleKeyDown
                        }
                        role="textbox"
                        aria-label="Type a message"
                    />

                </div>

                <div className="attachment-picker-wrapper">

                    <button type="button" className="input-icon-btn" title="Attach" onClick={() =>
                        setAttachmentOpen((prev) => !prev)
                    } >
                        <FaPaperclip />
                    </button>


                    {attachmentOpen && (

                        <div className="attachment-dropdown">
                            <button type="button" className="attachment-option"
                                onClick={() => {
                                    imageInputRef.current?.click();
                                }} >
                                <span className="attachment-icon image-icon">
                                    <i className="bi bi-image"></i>
                                </span>

                                <span className="attachment-text">
                                    <strong>Image</strong>
                                    <small>Send a photo</small>
                                </span>

                            </button>

                            <button type="button" className="attachment-option"
                                onClick={() => {
                                    videoInputRef.current?.click();
                                }} >

                                <span className="attachment-icon video-icon">
                                    <i className="bi bi-camera-video"></i>
                                </span>

                                <span className="attachment-text">
                                    <strong>Video</strong>
                                    <small>Send a video</small>
                                </span>

                            </button>

                            <button type="button" className="attachment-option"
                                onClick={() => {
                                    documentInputRef.current?.click();
                                }} >

                                <span className="attachment-icon document-icon">
                                    <i className="bi bi-file-earmark-text"></i>
                                </span>

                                <span className="attachment-text">
                                    <strong>Document</strong>
                                    <small>Send a document</small>
                                </span>

                            </button>

                        </div>

                    )}

                </div>

                <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={handleImageSelect} />


                <input ref={videoInputRef} type="file" accept="video/*" hidden
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            console.log("VIDEO SELECTED:", file);
                        }
                        e.target.value = "";
                        setAttachmentOpen(false);
                    }} />


                <input ref={documentInputRef} type="file" accept=" .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .tx" hidden
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            console.log("DOCUMENT SELECTED:", file);
                        }
                        e.target.value = "";
                        setAttachmentOpen(false);
                    }} />
                <button type="button" className="send-button" onClick={handleSend} title="Send message" disabled={ (!message.trim() && selectedImages.length === 0) || sending } >
                    <FaPaperPlane />
                </button>
            </div>

        </div>
    );


};


export default MessageInput;
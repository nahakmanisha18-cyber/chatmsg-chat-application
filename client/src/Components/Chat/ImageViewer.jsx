import React, { useEffect } from "react";

const ImageViewer = ({ imageUrl, fileName, onClose }) => {

    useEffect(() => {

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    const handleDownload = async () => {

        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName || "ChatMsg-image";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.log("IMAGE DOWNLOAD ERROR:", error);
        }

    };
    if (!imageUrl) {
        return null;
    }

    return (
        <div className="image-viewer-overlay" onClick={handleOverlayClick} >
            <div className="image-viewer-topbar">
                <button type="button" className="image-viewer-close" onClick={onClose} title="Close">
                    <i class="bi bi-x-lg"></i>
                </button>

                <div className="image-viewer-actions">
                    <button type="button" className="image-viewer-download" onClick={handleDownload} title="Download" >
                        <i class="bi bi-download"></i>
                    </button>
                </div>
            </div>

            <div className="image-viewer-content">
                <img src={imageUrl} alt={fileName || "Image"} className="image-viewer-image" onClick={(event) => { event.stopPropagation(); }} />
            </div>
        </div>
    );
};

export default ImageViewer;
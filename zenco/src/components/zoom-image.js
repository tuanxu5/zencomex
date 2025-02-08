import { useEffect } from "react";

const ZoomImage = ({ imageUrl }) => {
    useEffect(() => {
        // Sử dụng document.createElement để chèn script jQuery và elevateZoom
        const loadJQueryAndZoom = () => {
            const jqueryScript = document.createElement("script");
            jqueryScript.src = "https://code.jquery.com/jquery-3.6.0.min.js";
            jqueryScript.onload = () => {
                console.log("jQuery loaded:", window.jQuery);
                const elevateZoomScript = document.createElement("script");
                elevateZoomScript.src = "https://cdn.jsdelivr.net/npm/elevatezoom@3.0.8/jquery.elevatezoom.min.js";
                elevateZoomScript.onload = () => {
                    console.log("ElevateZoom loaded");
                    // Khởi tạo zoom sau khi elevateZoom đã tải
                    const $ = window.jQuery;
                    $("#zoomImage").elevateZoom({
                        zoomType: "window",
                        cursor: "crosshair",
                        zoomWindowPosition: 2,
                        zoomWindowWidth: 400,
                        zoomWindowHeight: 400,
                        lensSize: 150,
                        borderSize: 1,
                        borderColour: "#888",
                    });
                    console.log("Zoom initialized");
                };
                document.body.appendChild(elevateZoomScript);
            };
            document.body.appendChild(jqueryScript);
        };

        // Kiểm tra nếu jQuery đã có sẵn trong window
        if (typeof window !== "undefined" && window.jQuery) {
            loadJQueryAndZoom();
        } else {
            loadJQueryAndZoom();
        }
    }, []);

    return (
        <>
            <img id="zoomImage" src={imageUrl} data-zoom-image={imageUrl} alt="Zoomable Image" width="400" />
        </>
    );
};

export default ZoomImage;

import Image from "next/image";
import { BASE_URL } from "../utils/axios";

const LazyLoadedImageBanner = ({
    src,
    alt,
    isAboveTheFold = false,
    blurDataURL, // Optional: use for low-quality image placeholder
}) => {
    const url = BASE_URL.concat(src);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
                src={url}
                alt={alt}
                fill // Makes the image responsive, filling the parent container
                priority={isAboveTheFold} // Set priority to true for above-the-fold images
                loading={isAboveTheFold ? "eager" : "lazy"} // Eagerly load above-the-fold images
                fetchPriority={isAboveTheFold ? "high" : "low"} // Ensure critical images load faster
                placeholder={blurDataURL ? "blur" : "empty"} // Placeholder to improve perceived load time
                blurDataURL={blurDataURL} // Low-quality image placeholder
                style={{ objectFit: "cover", opacity: 0 }} // Applies the object-fit behavior
                onLoad={(e) => (e.target.style.opacity = 1)} // Fade-in effect
            />
        </div>
    );
};

export default LazyLoadedImageBanner;

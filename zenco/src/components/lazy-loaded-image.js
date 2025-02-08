import Image from "next/image";
import { BASE_URL } from "../utils/axios";

const LazyLoadedImage = ({ src, alt, blurDataURL }) => {
    const url = BASE_URL.concat(src);
    return (
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
                aria-hidden={false}
                src={url}
                alt={alt}
                fill // Makes the image responsive, filling the parent container
                style={{ objectFit: "center" }} // Applies the object-fit behavior
                priority={false} // Keeps the image lazy-loaded
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw" // Adjust as needed
                placeholder={blurDataURL ? "blur" : "empty"} // If blurDataURL exists, show a blur placeholder
                blurDataURL={blurDataURL} // Low-quality image placeholder for better perceived load time
            />
        </div>
    );
};

export default LazyLoadedImage;

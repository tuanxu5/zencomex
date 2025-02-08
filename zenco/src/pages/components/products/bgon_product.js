import { Box } from "@mui/material";
import axiosInstance, { BASE_URL } from "../../../utils/axios";
import { useEffect, useState } from "react";
import LazyLoadedImage from "../../../components/lazy-loaded-image";

const BgOnProduct = () => {
    const [coverImage, setCoverImage] = useState([]);
    const getCover = async () => {
        const result = await axiosInstance.get("/image/list?type=cover");
        if (result.data.DT) {
            setCoverImage(result.data.DT);
        }
    };
    useEffect(() => {
        getCover();
    }, []);
    return (
        <>
            {coverImage.length > 0 ? (
                <Box
                    component={"img"}
                    src={`${BASE_URL}/upload/${coverImage[0]?.link}`}
                    width={"100%"}
                    // height={180}
                    sx={{
                        objectFit: "contain",
                        objectPosition: "center",
                    }}
                />
            ) : (
                <Box
                    sx={{
                        height: 180,
                        backgroundColor: "#BBDEFB",
                        width: "100%",
                        zIndex: 1000,
                    }}
                />
            )}
        </>
    );
};
export default BgOnProduct;

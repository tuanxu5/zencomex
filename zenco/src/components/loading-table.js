import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { LogoZenco } from "./logo";

const LoadingTableScreen = () => {
    return (
        <Box
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(245, 245, 245, 0.8)", // Màu nền mờ
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1, // Đảm bảo rằng nó nằm trên bảng
            }}
        >
            <div style={{ position: "relative", width: "70px", height: "70px" }}>
                {/* Vòng thứ nhất với hiệu ứng xoay và bo góc */}
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }} // Xoay một vòng hoàn chỉnh
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        border: "0.5px solid #0099FF", // Màu của vòng
                        borderRadius: "23px", // Bo góc
                        top: 0,
                        left: 0,
                        transformOrigin: "center",
                        boxSizing: "border-box",
                        padding: "5px", // Khoảng cách giữa vòng và hình ảnh
                        zIndex: 1,
                        boxShadow: "0 0 20px #99FFFF", // Bóng cho vòng
                    }}
                ></motion.div>

                {/* Vòng thứ hai với hiệu ứng xoay ngược và bo góc */}
                <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -360 }} // Xoay ngược một vòng hoàn chỉnh
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        border: "0.5px solid #0099FF", // Màu của vòng
                        borderRadius: "23px", // Bo góc
                        top: 0,
                        left: 0,
                        transformOrigin: "center",
                        boxSizing: "border-box",
                        padding: "10px", // Khoảng cách giữa vòng và hình ảnh
                        zIndex: 0,
                        boxShadow: "0 0 30px #99FFFF", // Bóng cho vòng
                    }}
                ></motion.div>

                {/* Logo chính */}
                <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        zIndex: 2, // Đảm bảo hình ảnh nằm trên các vòng
                        top: "12%",
                        left: "12%",
                        width: "75%", // Kích thước hình ảnh 80%
                        height: "75%", // Kích thước hình ảnh 80%
                        transform: "translate(-50%, -50%)", // Đưa logo vào giữa
                        transformOrigin: "center",
                    }}
                >
                    <LogoZenco />
                </motion.div>
            </div>
        </Box>
    );
};

export default LoadingTableScreen;

"use client";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { LogoZenco } from "./logo";
import { useEffect, useState } from "react";

const LoadingScreen = ({ loading = true }) => {
    return (
        loading && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 9999,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
            >
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9998,
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                    }}
                ></Box>
                <div style={{ position: "relative", width: "100px", height: "100px" }}>
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
                            borderRadius: "35px", // Bo góc
                            top: 0,
                            left: 0,
                            transformOrigin: "center",
                            boxSizing: "border-box",
                            padding: "10px", // Khoảng cách giữa vòng và hình ảnh
                            zIndex: 1,
                            boxShadow: "0 0 20px #99FFFF", // Bóng cho vòng
                        }}
                    />

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
                            borderRadius: "35px", // Bo góc
                            top: 0,
                            left: 0,
                            transformOrigin: "center",
                            boxSizing: "border-box",
                            padding: "20px", // Khoảng cách giữa vòng và hình ảnh
                            zIndex: 0,
                            boxShadow: "0 0 30px #99FFFF", // Bóng cho vòng
                        }}
                    />
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
                            top: "10%",
                            left: "10%",
                            width: "80%", // Kích thước hình ảnh 80%
                            height: "80%", // Kích thước hình ảnh 80%
                            transform: "translate(-50%, -50%)", // Đưa logo vào giữa
                            transformOrigin: "center",
                        }}
                    >
                        <LogoZenco />
                    </motion.div>
                </div>
            </motion.div>
        )
    );
};

export default LoadingScreen;

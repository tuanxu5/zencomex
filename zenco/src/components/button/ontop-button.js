import PropTypes from "prop-types";
import Settings03Icon from "@untitled-ui/icons-react/build/esm/Settings03";
import { Box, ButtonBase, SvgIcon, Tooltip } from "@mui/material";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import { motion } from "framer-motion";
export const OntopButton = (props) => {
    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // Tạo hiệu ứng cuộn mượt mà
        });
    };
    return (
        <Box
            sx={{
                position: "fixed",
                bottom: "30px",
                right: "30px",
                zIndex: 1000,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            onClick={props.onClick}
        >
            {/* Vòng bóng mờ bên ngoài */}
            <motion.div
                initial={{ opacity: 0.4, scale: 1 }}
                animate={{
                    opacity: [0.4, 0.1, 0.4],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                }}
                style={{
                    position: "absolute",
                    width: "60px", // Nhỏ hơn trước
                    height: "60px", // Nhỏ hơn trước
                    borderRadius: "50%",
                    backgroundColor: "rgba(0, 100, 255, 0.3)", // Màu xanh dương nhạt
                }}
            />

            {/* Vòng bóng mờ bên trong */}
            <motion.div
                initial={{ opacity: 0.4, scale: 1 }}
                animate={{
                    opacity: [0.4, 0.2, 0.4],
                    scale: [1, 1.2, 1],
                    rotate: [0, 360], // Thêm hiệu ứng xoay
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                }}
                style={{
                    position: "absolute",
                    width: "50px", // Kích thước nhỏ hơn
                    height: "50px", // Kích thước nhỏ hơn
                    borderRadius: "30%",
                    border: "2px solid rgba(0, 100, 255, 0.2)", // Viền xanh dương nhạt
                    backgroundColor: "rgba(0, 100, 255, 0.2)", // Màu xanh dương nhạt
                }}
            />

            {/* Nút chính với hiệu ứng nhô lên xuống nhẹ */}
            <Tooltip title="Lên đầu trang">
                <Box
                    sx={{
                        backgroundColor: "background.paper",
                        borderRadius: "50%",
                        p: 0.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                    }}
                    onClick={handleScrollToTop}
                >
                    <ButtonBase
                        sx={{
                            backgroundColor: "primary.main",
                            borderRadius: "50%",
                            color: "primary.contrastText",
                            p: "6px",
                            width: "40px",
                            height: "40px",
                        }}
                        aria-label="Scroll to top"
                    >
                        <SvgIcon>
                            <KeyboardDoubleArrowUpIcon />
                        </SvgIcon>
                    </ButtonBase>
                </Box>
            </Tooltip>
        </Box>
    );
};

OntopButton.propTypes = {
    onClick: PropTypes.func,
};

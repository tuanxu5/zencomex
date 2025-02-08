import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
    Box,
    Container,
    FormHelperText,
    Grid,
    Input,
    InputAdornment,
    Stack,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";

//icon
import CallIcon from "@mui/icons-material/Call";
import { useSelector } from "react-redux";
import { ToastMessage } from "../../components/custom-toast";
import LazyLoadedImage from "../../components/lazy-loaded-image";
import { SendIcon } from "../../icons/icon-button/send";
import { IconFacebook, IconInstagram, IconLinked, IconTwitter, IconYoutube } from "../../icons/icon-button/socials";
import { paths } from "../../paths";
import axiosInstance from "../../utils/axios";

const socials = [
    {
        name: "Facebook",
        icon: <IconFacebook />,
    },
    {
        name: "Twitter",
        icon: <IconTwitter />,
    },
    {
        name: "Linked",
        icon: <IconLinked />,
    },
    {
        name: "Youtube",
        icon: <IconYoutube />,
    },
    {
        name: "Instagram",
        icon: <IconInstagram />,
    },
];
const HomeFooter = (props) => {
    const { items } = props;
    const theme = useTheme();
    const mdUp = useMediaQuery(theme.breakpoints.up("md"));
    const { overviewInfo } = useSelector((state) => state.information);
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (value !== "") {
            // Kiểm tra định dạng email (simple regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setError(true);
            } else {
                setError(false);
            }
        } else {
            setError(false);
        }
    };

    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const footerRef = useRef(null);

    //Lazy load image background footer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setBackgroundLoaded(true); // Chỉ tải ảnh nền khi footer hiển thị
                    }
                });
            },
            {
                rootMargin: "0px",
                threshold: 0.1, // Tải khi 10% Box hiển thị
            }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    const handleSendEmail = async () => {
        const body = {
            name: email,
            phone: "00000000",
            email: email,
            message: "Liên lạc với khách qua mail hỏi đi",
        };
        const response = await axiosInstance.post("/email/send", body);
        if (response && response.data.DT) {
            ToastMessage(
                "Bạn đã gửi thông tin thành công, chúng tôi sẽ sớm liên lạc với bạn",
                "success",
                "top-right",
                5000
            );
            setEmail("");
        } else {
            ToastMessage("Gửi mail không thành công ", "success");
        }
    };

    return (
        <Box
            ref={footerRef}
            sx={{
                backgroundColor: "#BBDEFB",
                backgroundImage: backgroundLoaded ? 'url("/assets/footer.jpg")' : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
                color: "white",
                mt: 2,
                pb: 16,
                minHeight: 400,
            }}
        >
            <Container
                maxWidth="xl"
                sx={{
                    minHeight: 300,
                }}
            >
                <Typography
                    width="100%"
                    variant="h2"
                    p={2}
                    sx={{
                        fontSize: mdUp ? "32px !important" : "20px !important",
                    }}
                >
                    CÔNG TY TNHH SẢN XUẤT VÀ XUẤT NHẬP KHẨU ZENCO
                </Typography>
                {overviewInfo && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <Grid container>
                            <Grid item xs={12} md={4}>
                                <Box p={2} pr={4}>
                                    <Typography variant="h3">Thông tin liên hệ</Typography>
                                    <Stack spacing={2} p={2}>
                                        {Object.keys(overviewInfo).length > 0 &&
                                            overviewInfo.overview.map((child) => {
                                                const results = () => {
                                                    switch (child.ten_vi) {
                                                        case "Hotline":
                                                            return (
                                                                <Box
                                                                    sx={{
                                                                        color: "white",
                                                                        textDecoration: "none",
                                                                    }}
                                                                    component="a"
                                                                    href={`tel:${child.noidung_vi}`}
                                                                >
                                                                    {child.noidung_vi}
                                                                </Box>
                                                            );
                                                        case "Email":
                                                            return (
                                                                <Box
                                                                    sx={{
                                                                        color: "white",
                                                                        textDecoration: "none",
                                                                    }}
                                                                    component="a"
                                                                    href={`mailto:${child.noidung_vi}`}
                                                                >
                                                                    {child.noidung_vi}
                                                                </Box>
                                                            );

                                                        default:
                                                            return child.noidung_vi;
                                                    }
                                                };
                                                return (
                                                    <Typography key={child.id}>
                                                        <b>{child.ten_vi}</b> : {results()}
                                                    </Typography>
                                                );
                                            })}
                                    </Stack>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Box p={2}>
                                            {/* <Typography variant="h3">Liên kết nhanh</Typography>
                                            <Stack spacing={0.5} p={2}>
                                                {items.map((item, index) => (
                                                    <Stack key={index} direction="row" spacing={1}>
                                                        <ArrowRightIcon />
                                                        <Box
                                                            component={NextLink}
                                                            href={item.path !== "" ? item.path : paths.index}
                                                            sx={{
                                                                color: "white !important",
                                                                "&:hover": {
                                                                    color: "red !important",
                                                                },
                                                            }}
                                                        >
                                                            {item.title}
                                                        </Box>
                                                    </Stack>
                                                ))}
                                            </Stack> */}
                                            <Typography variant="h3">Chính sách hỗ trợ</Typography>
                                            <Stack spacing={1} p={2}>
                                                {Object.keys(overviewInfo).length > 0 &&
                                                    overviewInfo.policies?.map((p, index) => {
                                                        return (
                                                            <Typography
                                                                key={p.id}
                                                                sx={{
                                                                    color: "white",
                                                                    "&:hover": {
                                                                        color: "red",
                                                                    },
                                                                    fontSize: 13,
                                                                    textDecoration: "none",
                                                                    maxWidth: mdUp ? "40%" : "50%",
                                                                }}
                                                                component={NextLink}
                                                                href={paths.detail(p.tenkhongdau)}
                                                            >
                                                                {p.ten_vi}
                                                            </Typography>
                                                        );
                                                    })}
                                            </Stack>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box p={2}>
                                            <Typography variant="h3">Phòng kinh doanh</Typography>
                                            <Stack spacing={2} p={2}>
                                                {Object.keys(overviewInfo).length > 0 &&
                                                    overviewInfo.sales.map((child) => (
                                                        <Stack
                                                            key={child.id}
                                                            spacing={1}
                                                            direction="row"
                                                            alignItems="center"
                                                        >
                                                            <CallIcon />
                                                            <Typography>
                                                                <Box
                                                                    sx={{
                                                                        color: "white",
                                                                        textDecoration: "none",
                                                                    }}
                                                                    component="a"
                                                                    href={`tel:${child.noidung_vi}`}
                                                                >
                                                                    {child.noidung_vi}
                                                                </Box>{" "}
                                                                - {child.ten_vi}
                                                            </Typography>
                                                        </Stack>
                                                    ))}
                                            </Stack>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Box p={2}>
                                    <Typography variant="h3">Đăng kí báo giá</Typography>
                                    <Stack mt={2} mb={4}>
                                        <Input
                                            disableUnderline
                                            type="email"
                                            placeholder="Nhập địa chỉ Email của bạn"
                                            sx={{
                                                flexGrow: 1,
                                                border: "1px solid #ccc",
                                                borderRadius: 5,
                                                pl: 2,
                                                color: "white",
                                                "&::placeholder": { color: "white" },
                                                borderColor: error ? "#FFCC33" : "#ccc",
                                                width: "60%",
                                            }}
                                            endAdornment={
                                                <InputAdornment position="start">
                                                    <Tooltip title="Gửi thông tin">
                                                        <Box
                                                            onClick={handleSendEmail}
                                                            sx={{
                                                                backgroundColor: "#33CCFF",
                                                                borderRadius: "50%",
                                                                width: 23,
                                                                height: 23,
                                                                color: "white",
                                                                display: "flex",
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                cursor: "pointer",
                                                                mr: -0.5,
                                                                fontSize: 13,
                                                            }}
                                                            aria-label="Gửi thông tin"
                                                            role="button" // Thêm role để chỉ rõ đây là một nút
                                                            tabIndex={0} // Đảm bảo có thể focus bằng bàn phím
                                                        >
                                                            <SendIcon />
                                                        </Box>
                                                    </Tooltip>
                                                </InputAdornment>
                                            }
                                            value={email}
                                            onChange={handleEmailChange}
                                        />

                                        {error && (
                                            <FormHelperText sx={{ color: "#FFCC33" }}>
                                                Địa chỉ email không hợp lệ
                                            </FormHelperText>
                                        )}
                                    </Stack>
                                    <Stack spacing={1}>
                                        <Box width={300} height={200} mb={4}>
                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3917.2378530641377!2d106.6457894!3d10.945397199999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d757489de811%3A0xcdb8c60b74a8aec0!2zVuG6rXQgVMawIFBo4bulIC0gWmVuY29tZXg!5e0!3m2!1svi!2s!4v1735781588005!5m2!1svi!2s"
                                                width="100%"
                                                height="100%"
                                                style={{ border: 0 }}
                                                allowFullScreen=""
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                                title="Google Maps Location"
                                            />
                                        </Box>
                                        {/* <Typography variant="h3">Chứng nhận</Typography>
                                        {Object.keys(overviewInfo).length > 0 &&
                                            overviewInfo.certification.map((child, index) => {
                                                return (
                                                    <Box p={1} key={index} width={200} height={80}>
                                                        <LazyLoadedImage
                                                            src={`/upload/${child.noidung_vi}`}
                                                            alt="certification"
                                                        />
                                                    </Box>
                                                );
                                            })} */}
                                        <Typography variant="h3">Mạng xã hội</Typography>
                                        <Stack direction="row" spacing={2} p={2}>
                                            {Object.keys(overviewInfo).length > 0 &&
                                                overviewInfo.socials.map((social, index) => {
                                                    const sizeIcon = () => {
                                                        switch (social.ten_vi) {
                                                            case "Twitter":
                                                                return 26;
                                                            case "Youtube":
                                                                return 22;
                                                            default:
                                                                return 30;
                                                        }
                                                    };
                                                    if (social.ten_vi === "Zalo") return;
                                                    const icon = socials.find(
                                                        (item) => item.name === social.ten_vi
                                                    )?.icon;
                                                    return (
                                                        <Tooltip key={index} title={social.ten_vi}>
                                                            <Box
                                                                component="a"
                                                                href={
                                                                    social.noidung_vi !== ""
                                                                        ? social.noidung_vi
                                                                        : undefined
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                aria-label={`Go to ${social.ten_vi}`}
                                                                sx={{
                                                                    fontSize: sizeIcon(),
                                                                    cursor: "pointer",
                                                                    "&:hover": {
                                                                        fontSize: 36,
                                                                    },
                                                                    width: 36,
                                                                    height: 36,
                                                                    display: "flex",
                                                                    justifyContent: "center",
                                                                    alignItems: "center",
                                                                    borderRadius: "50%",
                                                                }}
                                                                onClick={(e) => {
                                                                    if (social.noidung_vi === "") {
                                                                        e.preventDefault();
                                                                        ToastMessage(
                                                                            `Link ${social.ten_vi} đang chờ cập nhật...`,
                                                                            "warning",
                                                                            "bottom-right"
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                {icon}
                                                            </Box>
                                                        </Tooltip>
                                                    );
                                                })}
                                        </Stack>
                                    </Stack>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default HomeFooter;

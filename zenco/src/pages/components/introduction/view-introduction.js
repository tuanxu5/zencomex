import { Box, Container, Grid, TextField, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import ViewProductDescription from "../products/view-product-description";
import ShareButtons from "../../../components/shareButton";

const ViewIntroduction = ({ introduction, setBreadcrumbsList }) => {
    const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    useEffect(() => {
        setBreadcrumbsList([
            { id: 1, title: "Trang chủ", alias: "trang-chu" },
            { id: introduction.id, title: introduction.title, alias: "gioi-thieu" },
        ]);
    }, [introduction]);

    const [iframeData, setIframeData] = useState(() => {
        if (introduction?.videoUrl) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(introduction.videoUrl, "text/html");
            const iframe = doc.querySelector("iframe");

            // Thay đổi URL sang nocookie
            const noCookieUrl = iframe.src.replace("www.youtube.com", "www.youtube-nocookie.com");
            return {
                src: iframe ? noCookieUrl : "",
                width: "100%",
                height: "315",
                title: "YouTube video player",
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                referrerPolicy: "strict-origin-when-cross-origin",
                allowfullscreen: true,
            };
        }
        return { src: "", width: "100%", height: "315" }; // Default values
    });

    return (
        <>
            <Container maxWidth="xl">
                <Box sx={{ padding: 1, marginTop: 2, width: "100%" }}>
                    <Grid container spacing={2}>
                        {iframeData.src !== "" && (
                            <Grid item xs={12} md={6}>
                                <Box
                                    sx={{
                                        width: "100%",
                                        height: smUp ? 315 : 180,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        overflow: "hidden",
                                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.3)",
                                    }}
                                >
                                    <iframe
                                        width={iframeData.width}
                                        height={iframeData.height}
                                        src={iframeData.src}
                                        title={iframeData.title}
                                        allow={iframeData.allow}
                                        referrerPolicy={iframeData.referrerPolicy}
                                        allowFullScreen={iframeData.allowfullscreen}
                                    />
                                </Box>
                            </Grid>
                        )}
                        <Grid item xs={12} md={iframeData.src !== "" ? 6 : 12}>
                            <Box height="100%" sx={{ display: "flex", alignItems: "center" }}>
                                <TextField
                                    disabled
                                    value={introduction?.intro}
                                    multiline
                                    sx={{
                                        fontSize: 14,
                                        fontStyle: "italic",
                                        color: "blue",
                                        width: "100%",
                                        "& .MuiInputBase-input": { padding: 1 },
                                        "& .Mui-disabled": { border: "none", WebkitTextFillColor: "blue !important" },
                                        "& fieldset": { border: "none" },
                                    }}
                                    InputProps={{ disableUnderline: true }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Container maxWidth="lg" sx={{ padding: "0px !important" }}>
                <Box sx={{ backgroundColor: "#E8E8E8", maxWidth: 180, p: 1, ml: 1, mt: 2, mb: 0.5, borderRadius: 1 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: "18px !important",
                        }}
                    >
                        {introduction?.title}
                    </Typography>
                </Box>
                <Box p={1}>
                    <ViewProductDescription data={introduction.description} type={introduction.type} sx={{ mt: 0 }} />
                </Box>
                <Box mt={2} ml={1}>
                    <ShareButtons
                        url={`${process.env.NEXT_PUBLIC_API_URL}/${introduction.alias}`}
                        title={introduction.title}
                    />
                </Box>
            </Container>
        </>
    );
};

export default ViewIntroduction;

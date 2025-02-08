import { Box, Container, TextField, Typography } from "@mui/material";
import { formatTimeDMY } from "../../../utils/format-daytime";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axios";
import SliderGeneral from "../../../sections/home/component/slide-general";
import ViewProductDescription from "../products/view-product-description";
import ShareButtons from "../../../components/shareButton";

const ViewGeneral = ({ detail, setBreadcrumbsList }) => {
    const [generalRelated, setGeneralRalated] = useState([]);
    const getGeneralRelated = async () => {
        if (detail) {
            const tag = detail.keywordSeo.split(",")[0];
            try {
                const response = await axiosInstance.get(
                    `/general/${detail.parent.alias}?page=0&pageSize=10&tag=${tag}`
                );
                if (response && response.data && response.data.DT) {
                    setGeneralRalated(response.data.DT);
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    };
    useEffect(() => {
        setBreadcrumbsList([
            {
                id: 1,
                title: "Trang chủ",
                alias: "trang-chu",
            },
            {
                id: 2,
                title: detail.parent.title,
                alias: detail.parent.alias,
            },
            {
                id: 3,
                title: detail.title,
                alias: detail.alias,
            },
        ]);
        getGeneralRelated();
    }, [detail]);

    return (
        <>
            <Container maxWidth="lg" sx={{ padding: "0" }}>
                <Box
                    sx={{
                        pl: 2,
                        pr: 2,
                    }}
                >
                    <Typography variant="h3" component="h1">
                        {detail.title}
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1,
                            fontSize: 13,
                            color: "#777",
                            fontStyle: "italic",
                            fontWeight: "500",
                        }}
                    >
                        {formatTimeDMY(detail.dateCreate)}
                    </Typography>
                </Box>
                {detail.intro && (
                    <Box
                        sx={{
                            border: "2px solid #E8E8E8",
                            borderRadius: 1,
                            mt: 2,
                            ml: 1,
                            mr: 1,
                        }}
                    >
                        <TextField
                            disabled
                            value={detail.intro}
                            multiline
                            sx={{
                                mt: -2,
                                fontSize: 14,
                                fontStyle: "italic",
                                color: "blue",
                                width: "100%",
                                "& .MuiInputBase-input": {
                                    padding: 1,
                                },
                                "& .Mui-disabled": {
                                    border: "none",
                                    WebkitTextFillColor: "black !important", // Ensure the text color is applied
                                },
                                "& fieldset": {
                                    border: "none", // Remove border
                                },
                            }}
                            InputProps={{
                                disableUnderline: true, // Remove underline
                            }}
                        />
                    </Box>
                )}

                {detail && detail.description && detail.description.length > 0 && (
                    <Box p={1}>
                        <ViewProductDescription data={detail.description} type={detail.type} sx={{ mt: 4 }} />
                    </Box>
                )}
                <Box mt={2} ml={1}>
                    <ShareButtons url={`${process.env.NEXT_PUBLIC_API_URL}/${detail.alias}`} title={detail.title} />
                </Box>
            </Container>
            <Box
                p={2}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Box
                    width={180}
                    p={1}
                    sx={{
                        backgroundColor: "#E8E8E8",
                        margin: "24px 8px 8px 0px",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Typography fontWeight={800} variant="h6" component="h2">
                        {detail.parent.title} liên quan
                    </Typography>
                </Box>
            </Box>
            <SliderGeneral generalList={generalRelated} />
        </>
    );
};

export default ViewGeneral;

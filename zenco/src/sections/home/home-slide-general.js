import { Box, Typography } from "@mui/material";
import SliderGeneral from "./component/slide-general";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";

const HomeSlideGeneral = () => {
    const [menuGeneral, setMenuGeneral] = useState([
        // {
        //     id: 1,
        //     title: "Dịch vụ",
        //     alias: "dich-vu",
        //     children: [],
        // },
        {
            id: 2,
            title: "Tin tức",
            alias: "tin-tuc",
            children: [],
        },
    ]);

    const getMenuList = async () => {
        try {
            const dataPromises = menuGeneral.map(async (item) => {
                const response = await axiosInstance.get(`/general/${item.alias}`);
                if (response && response.data.DT) {
                    return { ...item, children: response.data.DT };
                }
                return item;
            });
            const updatedMenu = await Promise.all(dataPromises);
            setMenuGeneral(updatedMenu);
        } catch (error) {
            console.log("Error fetching menu list:", error);
        }
    };

    useEffect(() => {
        getMenuList();
    }, []);

    return (
        <div>
            {menuGeneral.map((item, index) => (
                <Box key={index} mt={4}>
                    <Box>
                        <Typography
                            sx={{
                                fontSize: "24px !important",
                                textAlign: "center",
                                fontWeight: 700,
                                mb: 2,
                            }}
                            variant="h2"
                        >
                            {item.title}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            width: "100%", // Tính toán chiều rộng của slider
                            margin: "0 auto",
                            // boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)", // Shadow nhẹ nhàng
                            borderRadius: 2, // Làm mềm các cạnh
                            cursor: "grab",
                            transition: "cursor 0.2s ease",
                            padding: "10px",
                            pb: 0,
                        }}
                    >
                        <SliderGeneral generalList={item.children} />
                    </Box>
                </Box>
            ))}
        </div>
    );
};

export default HomeSlideGeneral;

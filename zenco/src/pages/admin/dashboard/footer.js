import Head from "next/head";
import { Layout as AdminLayout } from "../../../layouts/dashboard";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import CompanyInformation from "../../../sections/admin/footer/company-information";
import HomeEffect from "../../../sections/admin/footer/effect";
const Page = () => {
    const [menuFooter, setMenuFooter] = useState([
        {
            id: "1",
            title: "Thông tin chung",
            alias: "thong-tin-chung",
            component: <CompanyInformation />,
        },
        {
            id: "2",
            title: "Hiệu ứng",
            alias: "hieu-ung",
            component: <HomeEffect />,
        },
    ]);

    const [value, setValue] = useState("1");
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <Head>
                <title>Admin - Footer</title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 4,
                }}
            >
                <Box sx={{ width: "100%", typography: "body1", p: 2 }}>
                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                {menuFooter.map((item, index) => {
                                    return (
                                        <Tab
                                            sx={{
                                                width: 200,
                                            }}
                                            key={index}
                                            label={item.title}
                                            value={item.id}
                                        />
                                    );
                                })}
                            </TabList>
                        </Box>
                        {menuFooter.map((item) => (
                            <TabPanel key={item.id} value={item.id}>
                                {item.component}
                            </TabPanel>
                        ))}
                    </TabContext>
                </Box>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <AdminLayout>{page}</AdminLayout>;

export default Page;

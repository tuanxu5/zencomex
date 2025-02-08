import Head from "next/head";
import { addDays, format, parse, subDays, subHours, subMinutes } from "date-fns";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import { Box, Button, Container, Stack, SvgIcon, Typography, Unstable_Grid2 as Grid } from "@mui/material";
import { usePageView } from "../../hooks/use-page-view";
import { useSettings } from "../../hooks/use-settings";
import { Layout as DashboardLayout } from "../../layouts/dashboard";
import { OverviewBanner } from "../../sections/dashboard/overview/overview-banner";
import { OverviewDoneTasks } from "../../sections/dashboard/overview/overview-done-tasks";
import { OverviewEvents } from "../../sections/dashboard/overview/overview-events";
import { OverviewTransactions } from "../../sections/dashboard/overview/overview-transactions";
import { OverviewPendingIssues } from "../../sections/dashboard/overview/overview-pending-issues";
import { OverviewSubscriptionUsage } from "../../sections/dashboard/overview/overview-subscription-usage";
import { OverviewHelp } from "../../sections/dashboard/overview/overview-help";
import { OverviewJobs } from "../../sections/dashboard/overview/overview-jobs";
import { OverviewOpenTickets } from "../../sections/dashboard/overview/overview-open-tickets";
import { OverviewTips } from "../../sections/dashboard/overview/overview-tips";
import { useContext, useEffect, useState } from "react";
import LoadingScreen from "../../components/loading-screen";
import { AuthContext } from "../../contexts/auth/jwt-context";
import { useAuth } from "../../hooks/use-auth";
import { OverviewInbox, OverviewMail } from "../../sections/admin/overview/overview-mail";
import axiosInstance from "../../utils/axios";
import { formatTimeDMY } from "../../utils/format-daytime";
import { ToastMessage } from "../../components/custom-toast";
import LexicalEditor from "../../components/lexical-editor/lexical-editor";
import TiptapEditor from "../../components/tiptap/tiptapEditor";

const avatars = [
    "/assets/avatars/avatar-alcides-antonio.png",
    "/assets/avatars/avatar-marcus-finn.png",
    "/assets/avatars/avatar-carson-darrin.png",
    "/assets/avatars/avatar-jie-yan-song.png",
    "/assets/avatars/avatar-fran-perez.png",
];
const now = new Date();

const Page = () => {
    const settings = useSettings();
    const [loading, setLoading] = useState(true);
    const [mailList, setMailList] = useState([]);

    usePageView();

    const getAllMailRequest = async () => {
        try {
            const response = await axiosInstance.get("/email");
            if (response && response.data.DT) {
                const data = response.data.DT.map((mail, index) => ({
                    id: mail.id,
                    content: mail.message,
                    createdAt: format(new Date(mail.createdAt), "HH:mm:ss dd/MM/yyyy"),
                    senderAvatar: avatars[index >= 5 ? index % 5 : index],
                    senderName: mail.name,
                    senderMail: mail.email,
                    senderPhone: mail.phone,
                    senderOnline: true,
                }));
                setMailList(data);
                setLoading(false);
            }
        } catch (error) {
            console.log("error", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getAllMailRequest();
    }, []);

    const handleDeleteEmailRequest = async (idMail) => {
        if (idMail) {
            try {
                const response = await axiosInstance.delete(`/email/delete/${idMail}`);
                if (response && response.data.DT) {
                    ToastMessage("Xóa Email thành công", "success");
                    getAllMailRequest();
                }
            } catch (error) {
                ToastMessage("Đã xảy ra lỗi", "error");
            }
        }
    };

    return (
        <>
            {loading && <LoadingScreen />}
            <Head>
                <title>Zencomex - Admin </title>
            </Head>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    py: 8,
                }}
            >
                <Container maxWidth={settings.stretch ? false : "xl"}>
                    <Grid
                        container
                        disableEqualOverflow
                        spacing={{
                            xs: 3,
                            lg: 4,
                        }}
                    >
                        <Grid xs={12}>
                            <Stack direction="row" justifyContent="space-between" spacing={4}></Stack>
                        </Grid>
                        <Grid xs={12} md={4}>
                            <OverviewDoneTasks amount={31} />
                        </Grid>
                        <Grid xs={12} md={4}>
                            <OverviewPendingIssues amount={12} />
                        </Grid>
                        <Grid xs={12} md={4}>
                            <OverviewOpenTickets amount={5} />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <OverviewMail messages={mailList} onDelete={handleDeleteEmailRequest} />
                        </Grid>
                        <Grid xs={12} md={6}>
                            <OverviewBanner />
                        </Grid>

                        <Grid xs={12} md={5}>
                            <OverviewTips
                                sx={{ height: "100%" }}
                                tips={[
                                    {
                                        title: "New fresh design.",
                                        content:
                                            "Your favorite template has a new trendy look, more customization options, screens & more.",
                                    },
                                    {
                                        title: "Tip 2.",
                                        content: "Tip content",
                                    },
                                    {
                                        title: "Tip 3.",
                                        content: "Tip content",
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid xs={12} md={7}>
                            <OverviewSubscriptionUsage
                                chartSeries={[
                                    {
                                        name: "This year",
                                        data: [40, 37, 41, 42, 45, 42, 36, 45, 40, 44, 38, 41],
                                    },
                                    {
                                        name: "Last year",
                                        data: [26, 22, 19, 22, 24, 28, 23, 25, 24, 21, 17, 19],
                                    },
                                ]}
                            />
                        </Grid>

                        <Grid xs={12} md={7}>
                            <OverviewTransactions
                                transactions={[
                                    {
                                        id: "d46800328cd510a668253b45",
                                        amount: 25000,
                                        createdAt: now.getTime(),
                                        currency: "usd",
                                        sender: "Devias",
                                        status: "on_hold",
                                        type: "receive",
                                    },
                                    {
                                        id: "b4b19b21656e44b487441c50",
                                        amount: 6843,
                                        createdAt: subDays(now, 1).getTime(),
                                        currency: "usd",
                                        sender: "Zimbru",
                                        status: "confirmed",
                                        type: "send",
                                    },
                                    {
                                        id: "56c09ad91f6d44cb313397db",
                                        amount: 91823,
                                        createdAt: subDays(now, 1).getTime(),
                                        currency: "usd",
                                        sender: "Vertical Jelly",
                                        status: "failed",
                                        type: "send",
                                    },
                                    {
                                        id: "aaeb96c5a131a55d9623f44d",
                                        amount: 49550,
                                        createdAt: subDays(now, 3).getTime(),
                                        currency: "usd",
                                        sender: "Devias",
                                        status: "confirmed",
                                        type: "receive",
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid xs={12} md={5}>
                            <OverviewEvents
                                events={[
                                    {
                                        id: "3bfa0bc6cbc99bf747c94d51",
                                        createdAt: addDays(now, 1),
                                        description: "17:00 to 18:00",
                                        title: "Meeting with Partners",
                                    },
                                    {
                                        id: "dd6c8ce8655ac222b01f24f9",
                                        createdAt: addDays(now, 4),
                                        description: "17:00 to 18:00",
                                        title: "Weekly Meeting",
                                    },
                                    {
                                        id: "f274902e2bf226865b3cf947",
                                        createdAt: addDays(now, 4),
                                        description: "17:00 to 18:00",
                                        title: "Weekly Meeting",
                                    },
                                    {
                                        id: "d2a66e24110f52acb0cd0b9f",
                                        createdAt: addDays(now, 7),
                                        description: "17:00 to 18:00",
                                        title: "Weekly Meeting",
                                    },
                                ]}
                            />
                        </Grid>
                        <Grid xs={6}>
                            <OverviewJobs />
                        </Grid>
                        <Grid xs={6}>
                            <OverviewHelp />
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

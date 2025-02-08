import { Box, Breadcrumbs, Stack, useMediaQuery } from "@mui/material";
import { BreadcrumbsSeparator } from "./breadcrumbs-separator";
import NextLink from "next/link";
import { paths } from "../paths";

export const CustomBreadscrum = (props) => {
    const { breadcrumbsList, setBreadcrumbsList } = props;
    const xlUp = useMediaQuery((theme) => theme.breakpoints.up("xl"));
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
    const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
    return (
        <Box
            backgroundColor="#E8E8E8"
            sx={{
                p: 0.5,
                pl: xlUp ? 18 : mdUp ? 8 : 3,
                pr: xlUp ? 18 : mdUp ? 8 : 3,
            }}
        >
            <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                    <Breadcrumbs separator={<BreadcrumbsSeparator />}>
                        {breadcrumbsList?.map((item, index) => {
                            return (
                                <NextLink
                                    key={item.id}
                                    href={item.id === 1 ? paths.index : paths.detail(item.alias)}
                                    style={{
                                        height: 30,
                                        textDecoration: "none", // Tắt gạch chân
                                    }}
                                    onClick={() => {
                                        const newBreadcrumbsList = breadcrumbsList.slice(0, index + 1);
                                        setBreadcrumbsList(newBreadcrumbsList);
                                    }}
                                >
                                    <Box
                                        p={0.5}
                                        sx={{
                                            color: "text.primary",
                                            "&:hover": {
                                                color: "red",
                                                textDecoration: "underline",
                                            },
                                            fontSize: smUp ? 16 : 14,
                                        }}
                                    >
                                        {item.title}
                                    </Box>
                                </NextLink>
                            );
                        })}
                    </Breadcrumbs>
                </Stack>
            </Stack>
        </Box>
    );
};

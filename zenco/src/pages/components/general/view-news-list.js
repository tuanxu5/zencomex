import { Card, CardHeader, List, ListItem, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import FeedIcon from "@mui/icons-material/Feed";
import { formatTimeDMY } from "../../../utils/format-daytime";
import NextLink from "next/link";
import TitleWithDivider from "../../../components/custom-title-divider";
import { Box } from "@mui/system";
import { BoxEmpty } from "../../../components/view-layout/box-empty";
import { BASE_URL } from "../../../utils/axios";
const CardNewList = ({ news }) => {
    return (
        <Card
            sx={{
                minHeight: 300,
            }}
        >
            <Box pt={2} pl={2}>
                <TitleWithDivider title="Bài viết gần đây" />
            </Box>
            {news.length > 0 ? (
                <List>
                    {news &&
                        news.map((item) => {
                            return (
                                <ListItem key={item.id}>
                                    <ListItemIcon
                                        sx={{
                                            color: "green",
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            sx={{
                                                objectFit: "center",
                                                objectPosition: "center",
                                            }}
                                            width={50}
                                            height={50}
                                            src={`${BASE_URL}/upload/baiviet/${item.image}`}
                                        />
                                    </ListItemIcon>

                                    <ListItemText
                                        disableTypography
                                        primary={
                                            <NextLink
                                                href={item.alias}
                                                style={{
                                                    textDecoration: "none",
                                                    color: "black",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        "&:hover": {
                                                            textDecoration: "underline",
                                                            color: "#0000AA",
                                                        },
                                                    }}
                                                    variant="subtitle2"
                                                >
                                                    {item.title}
                                                </Typography>
                                            </NextLink>
                                        }
                                        secondary={
                                            // <Typography
                                            //     color="text.secondary"
                                            //     sx={{
                                            //         overflow: "hidden",
                                            //         textOverflow: "ellipsis",
                                            //         whiteSpace: "nowrap",
                                            //     }}
                                            //     variant="body2"
                                            // >
                                            //     {item.intro}
                                            // </Typography>
                                            <Typography
                                                color="text.secondary"
                                                sx={{ whiteSpace: "nowrap", fontStyle: "italic" }}
                                                variant="caption"
                                            >
                                                {formatTimeDMY(item.dateUpdate)}
                                            </Typography>
                                        }
                                        sx={{ pr: 2 }}
                                    />
                                </ListItem>
                            );
                        })}
                </List>
            ) : (
                <Box width={"40%"} m="auto">
                    <BoxEmpty note={"Chưa có bài viết"} />
                </Box>
            )}
        </Card>
    );
};
export default CardNewList;

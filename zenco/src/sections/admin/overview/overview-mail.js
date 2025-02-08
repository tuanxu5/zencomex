import {
    Avatar,
    Badge,
    Card,
    CardHeader,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { Scrollbar } from "../../../components/scrollbar";
import BoxIcon from "../../components/buttons/box-for-icon";
import { IconDelete } from "../../components/buttons/button-mui";

export const OverviewMail = (props) => {
    const { messages, onDelete } = props;
    return (
        <Card>
            <CardHeader title="Email yêu cầu" />
            <Scrollbar
                sx={{
                    height: 500,
                }}
            >
                <List
                    disablePadding
                    sx={{
                        width: "98%",
                    }}
                >
                    {messages.map((message) => {
                        return (
                            <ListItem
                                key={message.id}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: "action.hover",
                                        cursor: "pointer",
                                    },
                                    "&:hover .delete-button": {
                                        display: "block", // Hiển thị nút khi hover
                                    },
                                }}
                            >
                                <ListItemAvatar>
                                    {message.senderOnline ? (
                                        <Badge
                                            anchorOrigin={{
                                                horizontal: "right",
                                                vertical: "bottom",
                                            }}
                                            color="success"
                                            variant="dot"
                                        >
                                            <Avatar src={message.senderAvatar} />
                                        </Badge>
                                    ) : (
                                        <Avatar src={message.senderAvatar} />
                                    )}
                                </ListItemAvatar>
                                <ListItemText
                                    disableTypography
                                    primary={
                                        <Typography
                                            sx={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                            variant="subtitle2"
                                        >
                                            {message.senderName} - {message.senderPhone}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                }}
                                                variant="body2"
                                            >
                                                {message.senderMail}
                                            </Typography>
                                            <Typography
                                                color="text.secondary"
                                                sx={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                                variant="body2"
                                            >
                                                {message.content}
                                            </Typography>
                                        </>
                                    }
                                    sx={{ pr: 2 }}
                                />
                                <Typography
                                    color="text.secondary"
                                    sx={{ whiteSpace: "nowrap", fontStyle: "italic" }}
                                    variant="caption"
                                >
                                    {message.createdAt}
                                </Typography>
                                <BoxIcon
                                    className="delete-button"
                                    sx={{
                                        position: "absolute",
                                        right: 8,
                                        top: "30%",
                                        transform: "translateY(-50%)",
                                        display: "none", // Ẩn nút ban đầu
                                        color: "red",
                                    }}
                                    onClick={() => onDelete(message.id)}
                                >
                                    <IconDelete />
                                </BoxIcon>
                            </ListItem>
                        );
                    })}
                </List>
            </Scrollbar>
            <Divider />
        </Card>
    );
};

OverviewMail.propTypes = {
    messages: PropTypes.array.isRequired,
};

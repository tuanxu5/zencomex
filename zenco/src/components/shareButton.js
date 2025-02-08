import { Tooltip, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import {
    FacebookIcon,
    FacebookShareButton,
    LinkedinIcon,
    LinkedinShareButton,
    TwitterIcon,
    TwitterShareButton,
} from "react-share";

const ShareButtons = ({ url = "", title = "" }) => {
    return (
        <Stack direction="row" spacing={2}>
            <Typography
                sx={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: 20,
                    fontWeight: 700,
                }}
            >
                Chia sẻ:{" "}
            </Typography>

            <Stack direction="row" spacing={1}>
                <Tooltip title="Facebook">
                    <FacebookShareButton url={url} quote={title}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                </Tooltip>

                <TwitterShareButton url={url} title={title}>
                    <TwitterIcon size={32} round />
                </TwitterShareButton>

                <LinkedinShareButton url={url} title={title}>
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
            </Stack>
        </Stack>
    );
};

export default ShareButtons;

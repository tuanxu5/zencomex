import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import NextLink from "next/link";
import ChevronDownIcon from "@untitled-ui/icons-react/build/esm/ChevronDown";
import { Box, ButtonBase, Paper, Portal, SvgIcon, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

const TOP_NAV_HEIGHT = 64;
const TOP_NAV_SPACE = 0;
const OFFSET = 16;

export const TopNavItem = (props) => {
    const { active, children, path, title } = props;
    const [open, setOpen] = useState(false);

    const handleMouseEnter = useCallback(() => {
        setOpen(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setOpen(false);
    }, []);

    // With mega-menu

    if (children) {
        // const isExternal = path && path.startsWith("http");

        linkProps = {
            component: NextLink,
            href: path,
        };
        return (
            <>
                <Box
                    component="li"
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                    }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <ButtonBase
                        disableRipple
                        sx={{
                            alignItems: "center",
                            borderRadius: 1,
                            display: "flex",
                            justifyContent: "flex-start",
                            px: "16px",
                            py: "8px",
                            textAlign: "left",
                            "&:hover": {
                                backgroundColor: "action.hover",
                            },
                            ...(active && {
                                color: "primary.main",
                            }),
                        }}
                        {...linkProps}
                    >
                        <Typography component="span" variant="subtitle2" fontSize={15}>
                            {title}
                        </Typography>
                        <SvgIcon
                            sx={{
                                fontSize: 16,
                                ml: 1,
                                width: 20, // Đảm bảo chiều rộng cố định
                                height: 20, // Đảm bảo chiều cao cố định
                            }}
                            aria-hidden="true" // Giúp cải thiện khả năng truy cập
                        >
                            <ChevronDownIcon />
                        </SvgIcon>
                    </ButtonBase>
                </Box>
                {open && (
                    <Portal>
                        <Box
                            onMouseEnter={handleMouseEnter}
                            sx={{
                                left: -100,
                                position: "fixed",
                                pt: OFFSET + "px",
                                right: 0,
                                top: TOP_NAV_HEIGHT + TOP_NAV_SPACE,
                                zIndex: (theme) => theme.zIndex.appBar + 100,
                                width: "100%",
                            }}
                        >
                            <Paper
                                onMouseLeave={handleMouseLeave}
                                elevation={16}
                                sx={{
                                    backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.9),
                                    backdropFilter: "blur(6px)",
                                    mx: "auto",
                                    width: 380, // Example fixed width in pixels
                                    p: 2, // Optional: add padding for internal spacing
                                }}
                            >
                                {children}
                            </Paper>
                        </Box>
                    </Portal>
                )}
            </>
        );
    }

    // Simple

    let linkProps = undefined;

    if (path) {
        const isExternal = path.startsWith("http");

        linkProps = isExternal
            ? {
                  component: "a",
                  href: path,
                  target: "_blank",
              }
            : {
                  component: NextLink,
                  href: path,
              };
    }

    return (
        <Box
            component="li"
            sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
            }}
        >
            <ButtonBase
                disableRipple
                sx={{
                    alignItems: "center",
                    borderRadius: 1,
                    display: "flex",
                    justifyContent: "flex-start",
                    px: "16px",
                    py: "8px",
                    textAlign: "left",
                    "&:hover": {
                        backgroundColor: "action.hover",
                    },
                    ...(active && {
                        color: "primary.main",
                    }),
                }}
                {...linkProps}
            >
                <Typography component="span" variant="subtitle2" fontSize={15}>
                    {title}
                </Typography>
            </ButtonBase>
        </Box>
    );
};

TopNavItem.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.any,
    path: PropTypes.string,
    title: PropTypes.string.isRequired,
};

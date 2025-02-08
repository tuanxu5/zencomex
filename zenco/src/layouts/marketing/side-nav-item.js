import { Box, ButtonBase, Collapse, Stack } from "@mui/material";
import NextLink from "next/link";
import PropTypes from "prop-types";
import { useCallback, useState } from "react";

//icon
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export const SideNavItem = (props) => {
    const { active, children, type, item } = props;
    const [open, setOpen] = useState(false);
    const handleToggle = useCallback(() => {
        setOpen((prevOpen) => !prevOpen);
    }, []);

    // Leaf

    let linkProps = undefined;

    if (item.path) {
        const isExternal = item.path.startsWith("http");

        linkProps = isExternal
            ? {
                  component: "a",
                  href: item.path,
                  target: "_blank",
              }
            : {
                  component: NextLink,
                  href: item.path,
              };
    }

    return (
        <li>
            <Stack direction="row" alignItems="center">
                <ButtonBase
                    sx={{
                        alignItems: "center",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "flex-start",
                        px: `${type === "children" ? "24px" : "12px"}`,
                        py: "6px",
                        textAlign: "left",
                        width: "87%",
                        ...(active && {
                            backgroundColor: "action.hover",
                        }),
                        "&:hover": {
                            backgroundColor: "action.hover",
                        },
                    }}
                    {...linkProps}
                >
                    <Box
                        component="span"
                        sx={{
                            flexGrow: 1,
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontSize: 14,
                            fontWeight: `${type === "children" ? 500 : 700}`,
                            lineHeight: "24px",
                            whiteSpace: "nowrap",
                            ...(active && {
                                color: "primary.main",
                            }),
                        }}
                    >
                        {item.title}
                    </Box>
                </ButtonBase>

                {type === "parent"
                    ? item.children && (
                          <>
                              {open ? (
                                  <KeyboardArrowDownIcon
                                      sx={{
                                          "&:hover": {
                                              cursor: "pointer",
                                              backgroundColor: "#DDDDDD",
                                              color: "green",
                                              borderRadius: "50%",
                                          },
                                      }}
                                      onClick={handleToggle}
                                  />
                              ) : (
                                  <NavigateNextIcon
                                      sx={{
                                          "&:hover": {
                                              cursor: "pointer",
                                              backgroundColor: "#DDDDDD",
                                              color: "green",
                                              borderRadius: "50%",
                                          },
                                      }}
                                      onClick={handleToggle}
                                  />
                              )}
                          </>
                      )
                    : children &&
                      children.length > 0 && (
                          <>
                              {open ? (
                                  <KeyboardArrowDownIcon
                                      sx={{
                                          "&:hover": {
                                              cursor: "pointer",
                                              backgroundColor: "#DDDDDD",
                                              color: "green",
                                              borderRadius: "50%",
                                          },
                                      }}
                                      onClick={handleToggle}
                                  />
                              ) : (
                                  <NavigateNextIcon
                                      sx={{
                                          "&:hover": {
                                              cursor: "pointer",
                                              backgroundColor: "#DDDDDD",
                                              color: "green",
                                              borderRadius: "50%",
                                          },
                                      }}
                                      onClick={handleToggle}
                                  />
                              )}
                          </>
                      )}
            </Stack>
            <Collapse in={open} sx={{ mt: 0.5 }}>
                {children}
            </Collapse>
        </li>
    );
};

SideNavItem.propTypes = {
    active: PropTypes.bool,
    disabled: PropTypes.bool,
    depth: PropTypes.number,
    children: PropTypes.any,
    open: PropTypes.bool,
    item: PropTypes.object.isRequired,
};

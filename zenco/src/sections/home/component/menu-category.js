import { Box, ButtonBase, Stack } from "@mui/material";
import NextLink from "next/link";

//icon
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Scrollbar } from "../../../components/scrollbar";

export const MenuCategory = ({ activeId, expandIndex }) => {
    const { allCategory } = useSelector((state) => state.product);

    const [expandedIndex, setExpandedIndex] = useState(expandIndex ? expandIndex : null);

    const handleToggleExpand = (idExpand) => {
        setExpandedIndex(expandedIndex === idExpand ? null : idExpand);
    };

    useEffect(() => {
        setExpandedIndex(expandIndex);
    }, [expandIndex]);

    return (
        <Scrollbar
            sx={{
                height: 900,
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gap: 2.5,
                    gridTemplateColumns: "repeat(1, 1fr)",
                    p: 2,
                    width: "100%",
                }}
            >
                {allCategory.map((item, index) => {
                    let linkProps = undefined;
                    if (item.tenkhongdau) {
                        linkProps = {
                            component: NextLink,
                            href: item.tenkhongdau,
                        };
                    }
                    return (
                        <Stack
                            component="ul"
                            key={item.id}
                            spacing={0.5}
                            sx={{
                                listStyle: "none",
                                m: 0,
                                p: 0,
                                height: "auto",
                                minHeight: expandedIndex ? "auto" : 40,
                            }}
                        >
                            <li key={item.title}>
                                <Stack direction="row" alignItems="center">
                                    <ButtonBase
                                        sx={{
                                            alignItems: "center",
                                            borderRadius: 1,
                                            display: "flex",
                                            justifyContent: "flex-start",
                                            px: "12px",
                                            py: "6px",
                                            textAlign: "left",
                                            width: "90%",
                                            ...(activeId === item.id && {
                                                backgroundColor: "#BBDEFB",
                                            }),
                                            "&:hover": {
                                                backgroundColor: activeId === item.id ? "#BBDEFB" : "action.hover",
                                            },
                                        }}
                                        {...linkProps}
                                    >
                                        <Box component="span" sx={{ flexGrow: 1 }}>
                                            <Box
                                                component="span"
                                                sx={{
                                                    display: "block",
                                                    fontFamily: (theme) => theme.typography.fontFamily,
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    lineHeight: "24px",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <Stack direction="row" spacing={2}>
                                                    {item.ten_vi}
                                                </Stack>
                                            </Box>
                                            {item.caption && (
                                                <Box
                                                    component="span"
                                                    sx={{
                                                        color: "text.secondary",
                                                        display: "block",
                                                        fontFamily: (theme) => theme.typography.fontFamily,
                                                        fontSize: 12,
                                                        fontWeight: 400,
                                                        lineHeight: "18px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {item.caption}
                                                </Box>
                                            )}
                                        </Box>
                                    </ButtonBase>
                                    {item.children.length > 0 &&
                                        (expandedIndex === item.id ? (
                                            <KeyboardArrowDownIcon
                                                sx={{
                                                    "&:hover": {
                                                        cursor: "pointer",
                                                        backgroundColor: "#DDDDDD",
                                                        color: "green",
                                                        borderRadius: "50%",
                                                    },
                                                }}
                                                onClick={() => handleToggleExpand(null)}
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
                                                onClick={() => handleToggleExpand(item.id)}
                                            />
                                        ))}
                                </Stack>

                                {expandedIndex === item.id && item.children.length > 0 && (
                                    <Stack
                                        component="ul"
                                        spacing={0.5}
                                        sx={{
                                            listStyle: "none",
                                            m: 0,
                                            p: 0,
                                            pl: 16 + "px", // icon size + icon margin
                                        }}
                                    >
                                        {item.children.map((child) => {
                                            let linkProps = undefined;

                                            if (child.alias) {
                                                linkProps = {
                                                    component: NextLink,
                                                    href: child.alias,
                                                };
                                            }

                                            return (
                                                <li key={child.title}>
                                                    <ButtonBase
                                                        sx={{
                                                            marginLeft: 2,
                                                            alignItems: "center",
                                                            borderRadius: 1,
                                                            display: "flex",
                                                            justifyContent: "flex-start",
                                                            px: "12px",
                                                            py: "6px",
                                                            textAlign: "left",
                                                            width: "90%",
                                                            ...(activeId === child.id && {
                                                                backgroundColor: "#BBDEFB",
                                                            }),
                                                            "&:hover": {
                                                                backgroundColor:
                                                                    activeId === child.id ? "#BBDEFB" : "action.hover",
                                                            },
                                                        }}
                                                        {...linkProps}
                                                    >
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                color: "text.secondary",
                                                                display: "block",
                                                                fontFamily: (theme) => theme.typography.fontFamily,
                                                                fontSize: 14,
                                                                fontWeight: 500,
                                                                lineHeight: "24px",
                                                                whiteSpace: "nowrap",
                                                            }}
                                                        >
                                                            {child.title}
                                                        </Box>
                                                    </ButtonBase>
                                                </li>
                                            );
                                        })}
                                    </Stack>
                                )}
                            </li>
                        </Stack>
                    );
                })}
            </Box>
        </Scrollbar>
    );
};

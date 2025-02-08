import { Box, ButtonBase, Drawer, Stack } from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Scrollbar } from "../../components/scrollbar";
import { paths } from "../../paths";
import { SideNavItem } from "./side-nav-item";
import { BASE_URL } from "../../utils/axios";

const renderItems = ({ depth = 0, items, pathname }) =>
    items.reduce(
        (acc, item) =>
            reduceChildRoutes({
                acc,
                depth,
                item,
                pathname,
            }),
        []
    );

const reduceChildRoutes = ({ acc, depth, item, pathname }) => {
    const checkPath = !!(item.path && pathname);
    const partialMatch = checkPath && item.path === pathname ? true : false;
    const exactMatch = checkPath ? pathname === item.path : false;

    if (item) {
        acc.push(
            <SideNavItem key={item.title} active={partialMatch} depth={depth} item={item} type="parent">
                <Stack spacing={2}>
                    {item.children?.map((child, index) => {
                        const checkPathChild = !!(child.path && pathname);
                        const partialMatchChild = checkPathChild ? pathname.includes(child.path) : false;
                        return (
                            <Stack
                                component="ul"
                                key={index}
                                spacing={0.5}
                                sx={{
                                    listStyle: "none",
                                    m: 0,
                                    p: 0,
                                }}
                            >
                                <SideNavItem
                                    active={partialMatchChild}
                                    depth={depth + index}
                                    disabled={child.disabled}
                                    key={child.subheader}
                                    open={partialMatchChild}
                                    item={child}
                                    type="children"
                                >
                                    {child.items.map((item) => {
                                        const checkPath = !!(item.path && pathname);
                                        const active = checkPath ? pathname === item.path : false;

                                        let linkPropsChild = undefined;

                                        if (item.path) {
                                            const isExternal = item.path.startsWith("http");

                                            linkPropsChild = isExternal
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
                                            <ul
                                                key={item.title}
                                                style={{
                                                    textDecoration: "none",
                                                    listStyle: "none",
                                                }}
                                            >
                                                <li>
                                                    <ButtonBase
                                                        sx={{
                                                            alignItems: "center",
                                                            borderRadius: 1,
                                                            display: "flex",
                                                            justifyContent: "flex-start",
                                                            pr: "16px",
                                                            py: "8px",
                                                            textAlign: "left",
                                                            "&:hover": {
                                                                backgroundColor: "action.hover",
                                                            },
                                                            ...(active && {
                                                                color: "primary.main",
                                                            }),
                                                        }}
                                                        {...linkPropsChild}
                                                    >
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                height: 6,
                                                                width: 6,
                                                            }}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    backgroundColor: "neutral.400",
                                                                    borderRadius: "50%",
                                                                    height: 4,
                                                                    opacity: 0,
                                                                    width: 4,
                                                                    ...(active && {
                                                                        backgroundColor: "primary.main",
                                                                        height: 6,
                                                                        opacity: 1,
                                                                        width: 6,
                                                                    }),
                                                                }}
                                                            />
                                                        </Box>
                                                        <Box
                                                            component="span"
                                                            sx={{
                                                                flexGrow: 1,
                                                                fontFamily: (theme) => theme.typography.fontFamily,
                                                                fontSize: 13,
                                                                fontWeight: 400,
                                                                lineHeight: "24px",
                                                                whiteSpace: "nowrap",
                                                                ml: 1,
                                                            }}
                                                        >
                                                            {item.title}
                                                        </Box>
                                                    </ButtonBase>
                                                </li>
                                            </ul>
                                        );
                                    })}
                                </SideNavItem>
                            </Stack>
                        );
                    })}
                </Stack>
            </SideNavItem>
        );
    } else {
        acc.push(
            <SideNavItem
                active={exactMatch}
                depth={depth}
                disabled={item.disabled}
                key={item.title}
                path={item.path}
                title={item.title}
            />
        );
    }
    return acc;
};

export const SideNav = (props) => {
    const { allCategory } = useSelector((state) => state.product);
    const { onClose, open = false, menu, logo } = props;

    const [items, setItems] = useState([]);
    const pathname = usePathname();

    useEffect(() => {
        if (menu && menu.length > 0) {
            setItems(() => {
                return menu.map((i) => {
                    if (i.path === "") {
                        return {
                            ...i,
                            path: paths.index,
                        };
                    }
                    if (i.path === "san-pham") {
                        return {
                            ...i,
                            path: paths.detail(i.path),
                            children: allCategory.map((item) => {
                                return {
                                    title: item.ten_vi,
                                    alias: item.tenkhongdau,
                                    id: item.id,
                                    path: paths.detail(item.tenkhongdau),
                                    items: item.children.map((child) => ({
                                        title: child.title,
                                        alias: child.alias,
                                        id: child.id,
                                        path: paths.detail(child.alias),
                                    })),
                                };
                            }),
                        };
                    }
                    return {
                        ...i,
                        path: paths.detail(i.path),
                    };
                });
            });
        }
    }, [menu]);

    return (
        <Drawer
            anchor="right"
            onClose={onClose}
            open={open}
            PaperProps={{
                sx: {
                    maxWidth: "100%",
                    minWidth: 200,
                },
            }}
            variant="temporary"
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    justifyContent: "center",
                }}
            >
                <Stack
                    alignItems="center"
                    component={NextLink}
                    direction="row"
                    display="inline-flex"
                    href={paths.index}
                    spacing={1}
                    sx={{ textDecoration: "none" }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 80, // Điều chỉnh theo kích thước logo của bạn
                            height: 80,
                            overflow: "hidden", // Đảm bảo logo không bị tràn ra ngoài
                            mt: -1,
                            // borderRadius: "50%", // Tùy chọn: làm cho logo có hình tròn
                        }}
                    >
                        <Box
                            component="img"
                            sx={{
                                width: "100%",
                                height: "100%",
                            }}
                            src={logo !== "" ? `${BASE_URL}/upload/${logo}` : "/zenco.png"}
                        />
                    </Box>
                </Stack>
            </Box>
            <Scrollbar
                sx={{
                    minWidth: "85vw",
                    height: "80vh",
                    overflowX: "hidden",
                    scrollBehavior: "smooth",
                }}
            >
                <Box component="nav" sx={{ p: 2 }}>
                    <Stack
                        component="ul"
                        spacing={1}
                        sx={{
                            listStyle: "none",
                            m: 0,
                            p: 0,
                        }}
                    >
                        {renderItems({ items, pathname })}
                    </Stack>
                </Box>
            </Scrollbar>
        </Drawer>
    );
};

SideNav.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool,
};

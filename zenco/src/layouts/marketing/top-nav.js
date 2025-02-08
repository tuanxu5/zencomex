import {
    Badge,
    Box,
    Button,
    ButtonBase,
    Container,
    IconButton,
    Input,
    Stack,
    styled,
    SvgIcon,
    useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Menu01Icon from "@untitled-ui/icons-react/build/esm/Menu01";

// next link
import NextLink from "next/link";
import { useRouter } from "next/router";

import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useWindowScroll } from "../../hooks/use-window-scroll";
import { paths } from "../../paths";
import { ProductPopover } from "./product-popover";
import { TopNavItem } from "./top-nav-item";
//icons
import SearchMdIcon from "@untitled-ui/icons-react/build/esm/SearchMd";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import { BASE_URL } from "../../utils/axios";
import { fontSize, textAlign } from "@mui/system";
import { useSelector } from "react-redux";

const TOP_NAV_HEIGHT = 64;

const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        right: 0,
        top: 1,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: "0 4px",
        textAlign: "center",
        fontSize: "12px",
        backgroundColor: "#FF0000",
        color: "white",
    },
}));

export const TopNav = (props) => {
    // Giỏ hàng
    const cart = useSelector((state) => state.cart);
    const [quantity, setQuantity] = useState(cart.items.length); // Sử dụng cart.totalQuantity làm giá trị khởi tạo

    useEffect(() => {
        // Cập nhật quantity khi cart thay đổi
        setQuantity(cart.items.length);
    }, [cart]); // Giỏ hàng thay đổi sẽ làm re-render và cập nhật quantity

    const router = useRouter();
    const { onMobileNavOpen, menu, logo } = props;

    const [searchValue, setSearchValue] = useState("");

    const [items, setItems] = useState([]);

    const pathname = usePathname();
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
    const [elevate, setElevate] = useState(false);
    const offset = 64;
    const delay = 100;

    const handleWindowScroll = useCallback(() => {
        if (window.scrollY > offset) {
            setElevate(true);
        } else {
            setElevate(false);
        }
    }, []);

    useEffect(() => {
        if (menu.length > 0) {
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
                            children: <ProductPopover />,
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

    useWindowScroll({
        handler: handleWindowScroll,
        delay,
    });

    // search
    const handleClickSearch = () => {
        if (searchValue.length > 0) {
            router.push(paths.detail("san-pham", searchValue));
            setSearchValue("");
        }
    };

    const handleKeyUp = (e) => {
        e.preventDefault();
        if (e.key === "Enter" && searchValue.length > 0) {
            router.push(paths.detail("san-pham", searchValue));
            setSearchValue("");
        }
    };

    return (
        <Box
            component="header"
            sx={{
                left: 0,
                position: "fixed",
                right: 0,
                top: 0,
                // pt: 2,
                width: "100%",
                margin: "0 auto",
                zIndex: (theme) => theme.zIndex.appBar,
            }}
        >
            <Container
                maxWidth="xxl"
                sx={{
                    backdropFilter: "blur(6px)",
                    backgroundColor: "transparent",
                    // borderRadius: 2.5,
                    boxShadow: "none",
                    transition: (theme) =>
                        theme.transitions.create("box-shadow, background-color", {
                            easing: theme.transitions.easing.easeInOut,
                            duration: 200,
                        }),
                    ...(elevate && {
                        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.5),
                        // backgroundColor: "#BBDEFB",
                        boxShadow: 8,
                    }),
                }}
            >
                <Stack direction="row" sx={{ height: TOP_NAV_HEIGHT }}>
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        direction="row"
                        spacing={1}
                        sx={{ flexGrow: 1, maxWidth: "20%", width: "100%" }}
                    >
                        <Stack
                            alignItems="center"
                            component={NextLink}
                            direction="row"
                            display="inline-flex"
                            href={paths.index}
                            sx={{ textDecoration: "none" }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: mdUp ? 100 : 70, // Điều chỉnh theo kích thước logo của bạn
                                    height: mdUp ? 95 : 65,
                                    overflow: "hidden", // Đảm bảo logo không bị tràn ra ngoài
                                    mt: -1,
                                    p: 1,
                                    // borderRadius: "50%", // Tùy chọn: làm cho logo có hình tròn
                                }}
                            >
                                <Box
                                    component="img"
                                    sx={{
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "contain",
                                    }}
                                    src={logo !== "" ? `${BASE_URL}/upload/${logo}` : "/zenco.png"}
                                    alt="Go to Zencomex homepage"
                                />
                            </Box>
                        </Stack>
                    </Stack>
                    {mdUp && (
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={2}
                            sx={{
                                flexGrow: 1,
                                maxWidth: "48%",
                                width: "100%",
                            }}
                        >
                            <Box component="nav" sx={{ height: "100%" }}>
                                <Stack
                                    component="ul"
                                    alignItems="center"
                                    justifyContent="center"
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        height: "100%",
                                        listStyle: "none",
                                        m: 0,
                                        p: 0,
                                    }}
                                >
                                    <>
                                        {items.map((item) => {
                                            const checkPath = !!(item.path && pathname);
                                            const partialMatch = checkPath ? pathname.includes(item.path) : false;
                                            const exactMatch = checkPath ? pathname === item.path : false;
                                            const active = item.children ? partialMatch : exactMatch;

                                            return (
                                                <TopNavItem
                                                    active={active}
                                                    key={item.title}
                                                    path={item.path}
                                                    title={item.title}
                                                >
                                                    {item.children}
                                                </TopNavItem>
                                            );
                                        })}
                                    </>
                                </Stack>
                            </Box>
                        </Stack>
                    )}
                    <Stack width={mdUp ? "18%" : "60%"} alignItems="center" direction="row" spacing={1}>
                        <Input
                            disableUnderline
                            fullWidth
                            // inputProps={{ ref: queryRef }}
                            placeholder="Tìm sản phẩm"
                            sx={{ flexGrow: 1, border: "1px solid #ccc", borderRadius: 5, pl: 2 }}
                            value={searchValue}
                            onChange={(e) => {
                                setSearchValue(e.target.value);
                            }}
                            onKeyUp={handleKeyUp}
                        />
                    </Stack>
                    <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
                        <Box
                            aria-label="Tìm kiếm"
                            component={ButtonBase}
                            sx={{
                                width: 40, // Đảm bảo kích thước đủ lớn
                                height: 40, // Tăng chiều cao để đạt chuẩn 44px trở lên
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                "&:hover": {
                                    backgroundColor: "#F3F3F3",
                                },
                            }}
                            onClick={handleClickSearch}
                        >
                            <SvgIcon sx={{ cursor: "pointer", color: "#1976D2" }}>
                                <SearchMdIcon />
                            </SvgIcon>
                        </Box>
                    </Box>
                    {/* <Stack alignItems="center" direction="row" spacing={mdUp ? 1 : 0} ml={1}>
                        <NextLink href={paths.cart}>
                            <Box
                                component={ButtonBase}
                                sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: "50%",
                                    color: "black",
                                    "&:hover": {
                                        backgroundColor: "#F3F3F3",
                                    },
                                }}
                            >
                                <StyledBadge badgeContent={quantity}>
                                    <SvgIcon
                                        sx={{
                                            cursor: "pointer",
                                            "&:hover": {
                                                color: "#1976D2",
                                            },
                                        }}
                                    >
                                        <ShoppingCartOutlinedIcon />
                                    </SvgIcon>
                                </StyledBadge>
                            </Box>
                        </NextLink>
                        <Box
                            component={ButtonBase}
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                "&:hover": {
                                    backgroundColor: "#F3F3F3",
                                },
                            }}
                            onClick={() => {}}
                        >
                            <SvgIcon
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                        color: "#1976D2",
                                    },
                                }}
                            >
                                <PersonSharpIcon />
                            </SvgIcon>
                        </Box>
                    </Stack> */}

                    {!mdUp && (
                        <Box height={"100%"} position="absolute" top={"20%"} right={"3%"}>
                            <IconButton onClick={onMobileNavOpen} tabIndex={0} aria-label="Open menu">
                                <SvgIcon fontSize="medium">
                                    <Menu01Icon />
                                </SvgIcon>
                            </IconButton>
                        </Box>
                    )}
                </Stack>
            </Container>
        </Box>
    );
};

TopNav.propTypes = {
    onMobileNavOpen: PropTypes.func,
};

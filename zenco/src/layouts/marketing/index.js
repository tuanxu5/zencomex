import { Box, useMediaQuery } from "@mui/material";
import { styled } from "@mui/material/styles";
import { usePathname } from "next/navigation";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CallButton } from "../../components/button/call-button";
import { OntopButton } from "../../components/button/ontop-button";
import { ZaloButton } from "../../components/button/zalo-button";
import ChristmasEffect from "../../components/christmasEffect";
import LoadingScreen from "../../components/loading-screen";
import CombinedEffect from "../../components/lunarNewYearEffect";
import { BoxEmpty } from "../../components/view-layout/box-empty";
import { fetchInformation } from "../../redux/thunks/informationThunk";
import { fetchAllCategories } from "../../redux/thunks/productThunks";
import HomeFooter from "../../sections/home/home-footer";
import { SideNav } from "./side-nav";
import { TopNav } from "./top-nav";

const menuHome = [
  {
    descriptionSeo: "Trang chính của Zencomex - Cung cấp vật tư phụ ME chất lượng cao",
    id: 48,
    keywordSeo: "vật tư ME, phụ tùng ME, Zencomex, vật tư công nghiệp",
    path: "",
    title: "Trang chủ",
    titleSeo: "Trang chủ Zencomex",
  },
  {
    descriptionSeo: "Giới thiệu tổng quan công ty Zencomex",
    id: 49,
    keywordSeo: "zencomex, trang chủ, Trang Chủ, Zencomex",
    path: "gioi-thieu",
    title: "Giới thiệu",
    titleSeo: "Giới thiệu tổng quan công ty Zencomex",
  },
  {
    descriptionSeo: "Chúng tôi cung cấp nhiều sản phẩm cho các công trình xấy dựng như thang mang cáp",
    id: 50,
    keywordSeo: "san pham, Sản phẩm, sản phẩm",
    path: "san-pham",
    title: "Sản phẩm",
    titleSeo: "Tất cả sản phẩm của Zencomex",
  },
  {
    descriptionSeo: "",
    id: 51,
    keywordSeo: "dịch vụ, zencomex",
    path: "dich-vu",
    title: "Dịch vụ",
    titleSeo: "Dịch vụ mang đến sự thành công",
  },
  {
    descriptionSeo: null,
    id: 55,
    keywordSeo: null,
    path: "du-an",
    title: "Dự án",
    titleSeo: null,
  },
  {
    descriptionSeo: null,
    id: 56,
    keywordSeo: null,
    path: "tin-tuc",
    title: "Tin tức",
    titleSeo: null,
  },
  {
    descriptionSeo: null,
    id: 57,
    keywordSeo: null,
    path: "tuyen-dung",
    title: "Tuyển dụng",
    titleSeo: null,
  },
  {
    descriptionSeo: null,
    id: 58,
    keywordSeo: null,
    path: "lien-he",
    title: "Liên hệ",
    titleSeo: null,
  },
];

const useMobileNav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handlePathnameChange = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    handleOpen,
    handleClose,
  };
};

const LayoutRoot = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: "100%",
}));

export const Layout = (props) => {
  const { loading: loadingProduct, allCategory } = useSelector((state) => state.product);
  const { loading: loadingInfo, overviewInfo } = useSelector((state) => state.information);

  const { children } = props;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const mobileNav = useMobileNav();

  const dispatch = useDispatch();
  const fetchData = useCallback(() => {
    dispatch(fetchInformation());
    dispatch(fetchAllCategories());
  }, [dispatch, allCategory, overviewInfo]);

  const [menu, setMenu] = useState(() => {
    if (overviewInfo && overviewInfo.menu) {
      const newData = overviewInfo.menu
        .filter((item) => item.tenkhongdau !== "chinh-sach-ho-tro")
        .map((i) => ({
          id: i?.id,
          title: i?.ten_vi,
          path: i?.tenkhongdau,
          titleSeo: i?.title,
          keywordSeo: i?.keywords,
          descriptionSeo: i?.description,
        }));
      return newData;
    } else {
      return menuHome;
    }
  });
  const [effect, setEffect] = useState(() => {
    if (overviewInfo && overviewInfo.effect) {
      const data = overviewInfo.effect;
      if (data.length === 0) {
        return "none";
      } else {
        return data[0].noidung_vi;
      }
    } else {
      return "none";
    }
  });
  const [logo, setLogo] = useState(() => {
    if (overviewInfo && overviewInfo.logo) {
      const data = overviewInfo.logo;
      if (data.length === 0) {
        return "";
      } else {
        return data[0].noidung_vi;
      }
    } else {
      return "";
    }
  });

  const renderEffect = () => {
    switch (effect) {
      case "none":
        return;
      case "christmas":
        return <ChristmasEffect />;
      case "lunar":
        return <CombinedEffect />;
      default:
        return;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadingPage = loadingProduct && loadingInfo;
  return (
    <>
      {renderEffect()}
      <TopNav menu={menu} logo={logo} onMobileNavOpen={mobileNav.handleOpen} />
      {!lgUp && <SideNav menu={menu} logo={logo} onClose={mobileNav.handleClose} open={mobileNav.isOpen} />}
      <LayoutRoot suppressHydrationWarning={true}>
        {loadingPage ? (
          <LoadingScreen />
        ) : (
          <Box
            sx={{
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top center",
              backgroundImage: 'url("/assets/gradient-bg.svg")',
              pt: "110px",
              height: "100vh",
              position: "relative",
            }}
          >
            {!allCategory || !overviewInfo ? (
              <BoxEmpty note={"Website đang bảo trì, quay lại sau nhé."} />
            ) : (
              <>
                {children}
                <HomeFooter items={menu} />
                <OntopButton />
                <ZaloButton />
                <CallButton />
              </>
            )}
          </Box>
        )}
      </LayoutRoot>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

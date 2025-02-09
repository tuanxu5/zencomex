import { Box, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import axiosInstance from "../../utils/axios";
import SliderGeneral from "./component/slide-general";

const HomeSlideGeneral = () => {
  const [menuGeneral, setMenuGeneral] = useState([
    // {
    //     id: 1,
    //     title: "Dịch vụ",
    //     alias: "dich-vu",
    //     children: [],
    // },
    {
      id: 2,
      title: "Tin tức",
      alias: "tin-tuc",
      children: [],
    },
  ]);

  const sectionRef = useRef(null);
  const [hasFetched, setHasFetched] = useState(false);

  const getMenuList = async () => {
    try {
      const dataPromises = menuGeneral.map(async (item) => {
        const response = await axiosInstance.get(`/general/${item.alias}`);
        if (response && response.data.DT) {
          return { ...item, children: response.data.DT };
        }
        return item;
      });
      const updatedMenu = await Promise.all(dataPromises);
      setMenuGeneral(updatedMenu);
    } catch (error) {
      console.log("Error fetching menu list:", error);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasFetched) {
            getMenuList();
            setHasFetched(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasFetched]);

  return (
    <div ref={sectionRef}>
      {menuGeneral.map((item, index) => (
        <Box key={index} mt={4}>
          <Box>
            <Typography
              sx={{
                fontSize: "24px !important",
                textAlign: "center",
                fontWeight: 700,
                mb: 2,
              }}
              variant="h2"
            >
              {item.title}
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              margin: "0 auto",
              borderRadius: 2,
              cursor: "grab",
              transition: "cursor 0.2s ease",
              padding: "10px",
              pb: 0,
            }}
          >
            <SliderGeneral generalList={item.children} />
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default HomeSlideGeneral;

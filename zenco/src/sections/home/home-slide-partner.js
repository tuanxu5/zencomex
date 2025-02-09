import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import LazyLoadedImage from "../../components/lazy-loaded-image";
import { BoxEmpty } from "../../components/view-layout/box-empty";
import axiosInstance from "../../utils/axios";
import SliderGeneral from "./component/slide-general";

const HomeSlidePartner = () => {
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const smUp = useMediaQuery((theme) => theme.breakpoints.up("sm"));
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const [filesPartner, setFilesPartner] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const sectionRef = useRef(null);

  const sliderSettings = {
    slidesToShow: lgDown ? 2 : 3,
    slidesToScroll: 1,
    rows: 5,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    draggable: true,
    swipeToSlide: true,
    arrows: false,
    responsive: [
      { breakpoint: 900, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 780, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 580, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    ],
  };

  const getImagesPartner = async () => {
    try {
      const images = await axiosInstance.get("image/list?type=partner");
      if (images?.data?.DT) {
        const newData = images.data.DT.map((item) => ({
          id: item.id,
          title: item.ten_vi,
          image: item.link,
        }));
        setFilesPartner(newData);
      }
    } catch (error) {
      console.log("Error fetching partner images:", error);
    }
  };

  const getProjectList = async () => {
    try {
      const response = await axiosInstance.get(`/general/du-an`);
      if (response && response.data.DT) {
        setProjectList(response.data.DT);
      }
    } catch (error) {
      console.log("Error fetching project list:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getImagesPartner();
      await getProjectList();
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasFetched) {
            fetchData();
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
    <Box
      ref={sectionRef}
      sx={{
        pt: 4,
        backgroundRepeat: "no-repeat",
        backgroundImage: 'url("/assets/gradient-bg.svg")',
      }}
    >
      <Grid container>
        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontSize: "24px !important",
              fontWeight: 700,
              textAlign: "start",
              mb: 2,
              ml: { xs: 1, sm: 8 },
            }}
            variant="h2"
          >
            Đối tác của chúng tôi
          </Typography>
          <Box p={smUp ? 2 : 1}>
            {filesPartner.length > 0 ? (
              <Slider {...sliderSettings}>
                {filesPartner.map((item) => (
                  <Box key={item.id}>
                    <Box
                      sx={{
                        backgroundColor: "#fff",
                        m: "8px auto",
                        p: 2,
                        height: 120,
                        transition: "transform 0.3s ease-in-out",
                        "&:hover": { transform: "scale(1.1)" },
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        maxWidth: smUp ? 200 : 180,
                      }}
                    >
                      <LazyLoadedImage src={`/upload/${item.image}`} alt={item.title} />
                    </Box>
                  </Box>
                ))}
              </Slider>
            ) : (
              <BoxEmpty sx={{ height: 200 }} note={"Danh sách đối tác đang chờ cập nhật..."} />
            )}
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            sx={{
              fontSize: "24px !important",
              fontWeight: 700,
              textAlign: mdUp ? "end" : "start",
              mb: 2,
              mr: { xs: 1, sm: 6 },
              ml: { xs: 1, sm: 4 },
            }}
            variant="h2"
          >
            Dự án tiêu biểu đã thực hiện
          </Typography>
          <Box>
            {projectList.length > 0 ? (
              <SliderGeneral generalList={projectList} setting={true} />
            ) : (
              <BoxEmpty note={"Danh sách dự án đang chờ cập nhật..."} sx={{ height: 200 }} />
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomeSlidePartner;

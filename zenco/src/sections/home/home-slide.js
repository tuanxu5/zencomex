import { Box, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useRef, useState } from "react";
import LazyLoadedImageBanner from "../../components/lazy-loaded-image-banner";
import LoadingChildScreen from "../../components/loading-child-screen";
import axiosInstance from "../../utils/axios";

const HomeSlide = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      speed: 3,
    },
    [Autoplay({ delay: 3000 })]
  );
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const sectionRef = useRef(null);

  const getAllSlides = async () => {
    try {
      const result = await axiosInstance.get("/home/slides");
      if (result && result.data.DT) {
        setSlides(result.data.DT);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllSlides();
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

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const theme = useTheme();
  const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));
  const smUp = useMediaQuery(theme.breakpoints.up("sm"));

  const renderHeight = () => {
    if (lgUp) return 750;
    else if (mdUp) return 600;
    else if (smUp) return 350;
    else return 200;
  };

  return (
    <Container maxWidth="xxl" ref={sectionRef}>
      {loading && <LoadingChildScreen />}
      {slides.length > 0 && (
        <Box position="relative" width="100%" height="auto">
          <div style={{ overflow: "hidden", position: "relative", cursor: "pointer" }} className="embla" ref={emblaRef}>
            <div className="embla__container" style={{ display: "flex" }}>
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="embla__slide"
                  style={{
                    flex: "0 0 100%",
                    minWidth: "0",
                    width: "100%",
                    height: renderHeight(),
                  }}
                >
                  <LazyLoadedImageBanner
                    isAboveTheFold={index < 2}
                    src={`/upload/${slide.link}`}
                    alt={slide.ten_vi}
                    blurDataURL={slide.link}
                  />
                </div>
              ))}
            </div>
            <button onClick={scrollPrev} id="prev" style={buttonStyle} aria-label="Scroll to previous item">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M15.61 7.41L14.2 6l-6 6 6 6 1.41-1.41L11.03 12l4.58-4.59z" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              id="next"
              style={{ ...buttonStyle, right: "0" }}
              aria-label="Scroll to next item"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M10.02 6L8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z" />
              </svg>
            </button>
          </div>
        </Box>
      )}
    </Container>
  );
};

// Button style
const buttonStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "white",
  border: "none",
  padding: "8px",
  borderRadius: "50%",
  outline: "0",
  cursor: "pointer",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
};

export default HomeSlide;

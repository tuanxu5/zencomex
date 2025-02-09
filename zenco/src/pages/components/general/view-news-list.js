import { Card, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Box } from "@mui/system";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import TitleWithDivider from "../../../components/custom-title-divider";
import { BoxEmpty } from "../../../components/view-layout/box-empty";
import axiosInstance, { BASE_URL } from "../../../utils/axios";
import { formatTimeDMY } from "../../../utils/format-daytime";

const CardNewList = ({ item }) => {
  const [news, setNews] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const sectionRef = useRef(null);

  const getNewsList = async () => {
    if (item && item.alias !== "tin-tuc") {
      try {
        const response = await axiosInstance.get(`/general/tin-tuc?page=0&pageSize=10`);
        if (response && response.data && response.data.DT) {
          setNews(response.data.DT);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      getNewsList();
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
    <Card
      sx={{
        minHeight: 300,
      }}
    >
      <Box pt={2} pl={2} ref={sectionRef}>
        <TitleWithDivider title="Bài viết gần đây" />
      </Box>
      {news.length > 0 ? (
        <List>
          {news &&
            news.map((item) => {
              return (
                <ListItem key={item.id}>
                  <ListItemIcon
                    sx={{
                      color: "green",
                    }}
                  >
                    <Box
                      component="img"
                      sx={{
                        objectFit: "center",
                        objectPosition: "center",
                      }}
                      width={50}
                      height={50}
                      src={`${BASE_URL}/upload/baiviet/${item.image}`}
                    />
                  </ListItemIcon>

                  <ListItemText
                    disableTypography
                    primary={
                      <NextLink
                        href={item.alias}
                        style={{
                          textDecoration: "none",
                          color: "black",
                        }}
                      >
                        <Typography
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            "&:hover": {
                              textDecoration: "underline",
                              color: "#0000AA",
                            },
                          }}
                          variant="subtitle2"
                        >
                          {item.title}
                        </Typography>
                      </NextLink>
                    }
                    secondary={
                      // <Typography
                      //     color="text.secondary"
                      //     sx={{
                      //         overflow: "hidden",
                      //         textOverflow: "ellipsis",
                      //         whiteSpace: "nowrap",
                      //     }}
                      //     variant="body2"
                      // >
                      //     {item.intro}
                      // </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ whiteSpace: "nowrap", fontStyle: "italic" }}
                        variant="caption"
                      >
                        {formatTimeDMY(item.dateUpdate)}
                      </Typography>
                    }
                    sx={{ pr: 2 }}
                  />
                </ListItem>
              );
            })}
        </List>
      ) : (
        <Box width={"40%"} m="auto">
          <BoxEmpty note={"Chưa có bài viết"} />
        </Box>
      )}
    </Card>
  );
};
export default CardNewList;

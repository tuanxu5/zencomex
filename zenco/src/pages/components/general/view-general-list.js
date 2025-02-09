import { Box, Button, Card, Chip, Container, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import LazyLoadedImage from "../../../components/lazy-loaded-image";
import PaginationComponent from "../../../components/panigation";
import { paths } from "../../../paths";
import { isValidUrl } from "../../../sections/home/component/card-product";
import axiosInstance from "../../../utils/axios";
import { formatTimeDMY } from "../../../utils/format-daytime";
import ContactWithUs from "./view-contact";

//icon
import SellIcon from "@mui/icons-material/Sell";
import { useSelector } from "react-redux";
import TitleWithDivider from "../../../components/custom-title-divider";
import TiptapEditor from "../../../components/tiptap/tiptapEditor";
import CardNewList from "./view-news-list";

const ViewGeneralList = ({ item, setBreadcrumbsList, tag }) => {
  const { allCategory } = useSelector((state) => state.product);
  const smDown = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  useEffect(() => {
    setBreadcrumbsList([
      {
        id: 1,
        title: "Trang chủ",
        alias: "trang-chu",
      },
      {
        id: 2,
        title: item.title,
        alias: item.alias,
      },
    ]);
  }, [item]);

  //------------ Pagination ------------//
  const defaultPage = {
    pageSize: 30,
    pageIndex: 1,
  };
  const [page, setPage] = useState(defaultPage);
  const [totalPage, setTotalPage] = useState(2);
  const [generals, setGenerals] = useState([]);
  const [tags, setTags] = useState([]);

  const handlePageChange = (value) => {
    setPage({ ...page, pageIndex: value });
  };

  const getGeneralList = async () => {
    if (item) {
      try {
        const response = await axiosInstance.get(
          `/general/${item.alias}?page=${page.pageIndex - 1}&pageSize=${page.pageSize}&tag=${tag}`
        );
        if (response && response.data && response.data.DT) {
          setTotalPage(Math.ceil(response.data.total / page.pageSize));
          setGenerals(response.data.DT);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const getAllTag = async () => {
    if (item) {
      try {
        const response = await axiosInstance.get(`/general/tag/${item.alias}`);
        if (response && response.data && response.data.DT) {
          const data = response.data.DT;
          const newData = [];
          data.map((item) => {
            const tags = item.keywords.split(",");
            newData.push({
              keywords: tags[0],
              tenkhongdau: item.tenkhongdau,
            });
          });
          const filteredItems = newData.reduce((acc, current) => {
            const normalizedKeyword = current.keywords.trim().toLowerCase();

            // Tìm xem phần tử đã tồn tại trong danh sách hay chưa
            const existingItem = acc.find((item) => item.keywords.trim().toLowerCase() === normalizedKeyword);

            if (existingItem) {
              // Nếu đã tồn tại, tăng số lượng
              existingItem.count += 1;
            } else {
              // Nếu chưa tồn tại, thêm vào danh sách và đặt số lượng là 1
              acc.push({ ...current, count: 1 });
            }

            return acc;
          }, []);
          setTags(filteredItems);
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  useEffect(() => {
    setPage(defaultPage);
  }, [item]);

  useEffect(() => {
    getGeneralList();
    getAllTag();
  }, [page]);

  return (
    <Container maxWidth="xxl">
      <Grid container>
        <Grid item xs={12} sm={4} lg={2.5} sx={{ order: { xs: 2, sm: 1 } }}>
          <Box
            p={2}
            sx={{
              width: "100%",
              minHeight: "100vh",
            }}
          >
            qwerqwer
            {tags.length > 0 && (
              <Stack>
                <TitleWithDivider title="Từ khóa" />
                <Box p={2}>
                  {tags.map((tg, index) => {
                    const actived = tg.keywords === tag;
                    return (
                      <NextLink key={index} href={paths.detail(item.alias, "", tg.keywords)}>
                        <Chip
                          sx={{
                            backgroundColor: actived ? "#C6E2FF" : "",
                            mb: 2,
                            "&:hover": {
                              backgroundColor: "#C6E2FF",
                            },
                          }}
                          label={tg.keywords}
                          onClick={() => {}}
                          icon={
                            <SellIcon
                              sx={{
                                fontSize: 16,
                                color: "#0066FF !important",
                              }}
                            />
                          }
                        />
                      </NextLink>
                    );
                  })}
                </Box>
              </Stack>
            )}
            <Stack>
              <TitleWithDivider title="Danh mục sản phẩm" />
              <Box p={2} style={{ marginBottom: "5000px" }}>
                {allCategory.map((tag, index) => {
                  return (
                    <NextLink key={index} href={tag.tenkhongdau}>
                      <Chip
                        sx={{
                          mb: 2,
                          "&:hover": {
                            backgroundColor: "#C6E2FF",
                          },
                        }}
                        label={tag.ten_vi}
                        onClick={() => {}}
                        icon={
                          <SellIcon
                            sx={{
                              fontSize: 16,
                              color: "#0066FF !important",
                            }}
                          />
                        }
                      />
                    </NextLink>
                  );
                })}
              </Box>
              {item && item.alias !== "tin-tuc" && <CardNewList item={item} />}
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} sm={8} lg={9.5} sx={{ order: { xs: 1, sm: 2 } }}>
          <Box
            sx={{
              p: 2,
              ml: smDown ? 0 : 4,
            }}
          >
            <>
              <Typography display="none" variant="h1">
                {item.title}
              </Typography>
              <Grid container spacing={{ xs: 2, md: 4 }} mb={4}>
                {generals?.map((item) => {
                  return (
                    <Grid key={item.id} item xs={12} lg={6}>
                      <Card
                        sx={{
                          width: "100%",
                          cursor: "pointer",
                          height: smDown ? 120 : 180,

                          overflow: "hidden",
                          transition: "transform 0.4s ease-in-out",
                          "&:hover": {
                            boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
                          },

                          borderRadius: 0,
                          backgroundColor: "#F5F5F5",
                          position: "relative",
                        }}
                      >
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <NextLink href={paths.detail(item.alias)} legacyBehavior>
                            <Box>
                              <Stack direction="row" width={"100%"}>
                                <Card
                                  sx={{
                                    borderRadius: 0,
                                    height: "100%",
                                    width: smDown ? 120 : 180,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      height: smDown ? 120 : 180,
                                      width: smDown ? 120 : 180,
                                      objectFit: "center",
                                      objectPosition: "center",
                                      transition: "transform 0.4s ease-in-out",
                                      "&:hover": {
                                        transform: "scale(1.2)",
                                      },
                                    }}
                                  >
                                    <LazyLoadedImage
                                      src={isValidUrl(item.image) ? item.image : `/upload/baiviet/${item.image}`}
                                      alt={`Hình ảnh ${item.ten_vi}`}
                                    />
                                  </Box>
                                </Card>

                                <Box
                                  p={smDown ? 1 : 2}
                                  height={120}
                                  sx={{
                                    width: smDown ? "calc(100% - 120px)" : "calc(100% - 200px)",
                                  }}
                                >
                                  <Stack spacing={smDown ? 0.5 : 1}>
                                    <Typography
                                      sx={{
                                        "&:hover": {
                                          color: "red",
                                        },
                                        fontSize: smDown ? 13 : 15,
                                        fontWeight: 800,
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        WebkitLineClamp: 2, // Số dòng tối đa
                                        textOverflow: "ellipsis",
                                      }}
                                    >
                                      {item.title}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: smDown ? 10 : 13,
                                        fontStyle: "italic",
                                        fontWeight: 600,
                                        opacity: 0.7,
                                      }}
                                    >
                                      {formatTimeDMY(item.dateUpdate)}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        WebkitLineClamp: smDown ? 2 : 3, // Số dòng tối đa
                                        textOverflow: "ellipsis",
                                        fontSize: smDown ? 10 : 13,
                                      }}
                                    >
                                      {item.intro}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Stack>
                            </Box>
                          </NextLink>
                        </motion.div>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              {generals.length > 0 && (
                <PaginationComponent onPageChange={handlePageChange} totalPage={totalPage} pageIndex={page.pageIndex} />
              )}
            </>
          </Box>
          {generals.length === 0 && (
            <>
              {item.alias !== "lien-he" ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mb: 6,
                    }}
                  >
                    <Box
                      alt="Internal server error"
                      component="img"
                      src="/assets/errors/error-500.png"
                      sx={{
                        height: "auto",
                        maxWidth: "100%",
                        width: 300,
                      }}
                    />
                  </Box>
                  <Typography align="center" variant={"h4"}>
                    Trang truy cập hiện đang nâng cấp
                  </Typography>
                  <Typography align="center" color="text.secondary" sx={{ mt: 0.5 }}>
                    Quay lại sau nhé.
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    <Button component={NextLink} href={paths.index}>
                      Trang chủ
                    </Button>
                  </Box>
                </>
              ) : (
                <ContactWithUs />
              )}
            </>
          )}
          {generals?.noidung_vi && (
            <Container maxWidth="lg">
              <Box
                sx={{
                  backgroundColor: "#E8E8E8",
                  width: 150,
                  p: 1,
                  mt: 4,
                }}
              >
                <Typography>{generals?.ten_vi}</Typography>
              </Box>
              <TiptapEditor contentEditor={generals?.noidung_vi} isDisable={true} />
            </Container>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ViewGeneralList;

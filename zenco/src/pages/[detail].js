import { Box, useMediaQuery } from "@mui/material";
import { NextSeo } from "next-seo"; // Import NextSeo
import Head from "next/head";
import { useState } from "react";
import { CustomBreadscrum } from "../components/custom-breadscrum";
import { usePageView } from "../hooks/use-page-view";
import { Layout as MarketingLayout } from "../layouts/marketing";
import axiosInstance, { BASE_URL } from "../utils/axios";
import { CheckMenuItem } from "../utils/check-menu-item";
import ViewGeneral from "./components/general/view-general-detail";
import ViewGeneralList from "./components/general/view-general-list";
import ViewIntroduction from "./components/introduction/view-introduction";
import BgOnProduct from "./components/products/bgon_product";
import ViewProductDetail from "./components/products/view-product-detail";
import ViewProductList from "./components/products/view-product-list";

const Page = ({ detail, search, tag }) => {
    const xlUp = useMediaQuery((theme) => theme.breakpoints.up("xl"));
    const mdUp = useMediaQuery((theme) => theme.breakpoints.up("md"));
    usePageView();
    const [breadcrumbsList, setBreadcrumbsList] = useState();

    const renderCPNByType = () => {
        switch (detail.type) {
            case "product":
                return <ViewProductDetail data={detail} setBreadcrumbsList={setBreadcrumbsList} />;
            case "general":
                return <ViewGeneral detail={detail} setBreadcrumbsList={setBreadcrumbsList} />;
            case "gioi-thieu":
                return <ViewIntroduction introduction={detail} setBreadcrumbsList={setBreadcrumbsList} />;
            case "san-pham":
                return <ViewProductList detail={detail} setBreadcrumbsList={setBreadcrumbsList} search={search} />;
            case "category":
                return <ViewProductList detail={detail} setBreadcrumbsList={setBreadcrumbsList} />;
            case "childCategory":
                return <ViewProductList detail={detail} setBreadcrumbsList={setBreadcrumbsList} />;
            default:
                return (
                    <ViewGeneralList
                        generals={detail.child}
                        setBreadcrumbsList={setBreadcrumbsList}
                        item={detail}
                        tag={tag}
                    />
                );
        }
    };
    const renderFolderImage = () => {
        switch (detail.type) {
            case "product":
                return "product";
            case "general":
                return "baiviet";
            default:
                return "";
        }
    };
    return (
        <>
            <Head>
                <title>{detail.titleSeo || `${detail.title} - Zencomex` || "Chi tiết sản phẩm - Zencomex"}</title>
                <meta
                    name="description"
                    content={detail.descriptionSeo || detail.intro || "Thông tin chi tiết sản phẩm."}
                />
                <meta name="keywords" content={detail.keywordSeo || `${detail.title || "sản phẩm"}`} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={`${process.env.NEXT_PUBLIC_API_URL}/${detail.alias}`} />
                <meta charSet="UTF-8" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": detail.type || "WebPage", // Chọn Product nếu hiển thị chi tiết sản phẩm
                        name: detail.title,
                        description: detail.intro,
                        image: `${BASE_URL}/upload/${renderFolderImage()}/${detail.image}?ver=${new Date().getTime()}`,
                        url: `${process.env.NEXT_PUBLIC_API_URL}/${detail.alias}`,
                        brand: {
                            "@type": "Brand",
                            name: "Zencomex",
                        },
                        offers: {
                            "@type": "Offer",
                            priceCurrency: "VND",
                            price: detail.price || "0",
                            availability: "https://schema.org/InStock",
                            url: `${process.env.NEXT_PUBLIC_API_URL}/${detail.alias}`,
                        },
                        aggregateRating: {
                            "@type": "AggregateRating",
                            ratingValue: detail.ratingValue || "4.5",
                            reviewCount: detail.reviewCount || "10",
                        },
                    })}
                </script>

                {/* Open Graph meta tags */}
                <meta property="og:title" content={detail.titleSeo || `${detail.title} - Zencomex`} />
                <meta
                    property="og:description"
                    content={detail.descriptionSeo || detail.intro || "Thông tin chi tiết sản phẩm."}
                />
                <meta property="og:url" content={`${process.env.NEXT_PUBLIC_API_URL}/${detail.alias}`} />
                <meta property="og:site_name" content="Zencomex" />
                <meta
                    property="og:image"
                    content={`${BASE_URL}/upload/${renderFolderImage()}/${detail.image}?ver=${new Date().getTime()}`}
                />
                <meta property="og:image:width" content="800" />
                <meta property="og:image:height" content="600" />

                {/* Twitter meta tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@zencomex" />
                <meta name="twitter:title" content={detail.titleSeo || `${detail.title} - Zencomex`} />
                <meta
                    name="twitter:description"
                    content={detail.descriptionSeo || detail.intro || "Thông tin chi tiết sản phẩm."}
                />
                <meta
                    name="twitter:image"
                    content={`${BASE_URL}/upload/${renderFolderImage()}/${detail.image}?ver=${new Date().getTime()}`}
                />
            </Head>

            {/* NextSeo configuration */}
            <NextSeo
                title={detail.titleSeo || `${detail.title} - Zencomex` || "Chi tiết sản phẩm - Zencomex"}
                description={detail.descriptionSeo || detail.intro || "Thông tin chi tiết sản phẩm."}
                canonical={`${process.env.NEXT_PUBLIC_API_URL}/${detail.alias}`}
                openGraph={{
                    url: `${process.env.NEXT_PUBLIC_API_URL}/${detail.alias}`,
                    title: detail.title || "Chi tiết sản phẩm - Zencomex",
                    description: detail.intro || "Thông tin chi tiết sản phẩm.",
                    images: [
                        {
                            url: `${BASE_URL}/upload/${renderFolderImage()}/${
                                detail.image
                            }?ver=${new Date().getTime()}`,
                            width: 800,
                            height: 600,
                            alt: detail.title || "Sản phẩm Zencomex",
                        },
                    ],
                    site_name: "Zencomex",
                }}
                twitter={{
                    cardType: "summary_large_image",
                    site: "@zencomex",
                    title: detail.title || "Chi tiết sản phẩm - Zencomex",
                    description: detail.intro || "Thông tin chi tiết sản phẩm.",
                    image: `${BASE_URL}/upload/${renderFolderImage()}/${detail.image}?ver=${new Date().getTime()}`,
                }}
            />

            <BgOnProduct />
            <CustomBreadscrum breadcrumbsList={breadcrumbsList} setBreadcrumbsList={setBreadcrumbsList} />
            <Box
                sx={{
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "top center",
                    backgroundImage: 'url("/assets/gradient-bg.svg")',
                    pt: 2,
                    pl: xlUp ? 16 : mdUp ? 4 : 0,
                    pr: xlUp ? 16 : mdUp ? 4 : 0,
                }}
            >
                {renderCPNByType()}
            </Box>
        </>
    );
};

export async function getServerSideProps(context) {
    const { detail } = context.query;
    const searchQuery = context.query.search || "";
    const tagQuery = context.query.tag || "";
    const res = await axiosInstance.get(`/footer?type=menu&tenkhongdau=${detail}`);
    if (res && res.data.DT) {
        const isMenu = res.data.DT;
        if (isMenu.alias === "gioi-thieu") {
            const response = await axiosInstance.get(`/general/${isMenu.alias}`);

            if (response && response.data.DT) {
                const newData = response.data.DT;
                return {
                    props: { detail: { ...newData[0], type: isMenu.alias }, search: searchQuery, tag: tagQuery },
                };
            }
        }
        return {
            props: {
                detail: isMenu,
                search: searchQuery,
                tag: tagQuery,
            },
        };
    } else {
        try {
            const isValid = await axiosInstance.post(`/product/check/`, {
                url: detail,
            });
            if (isValid.data.DT) {
                return {
                    props: {
                        detail: isValid.data.DT,
                        search: searchQuery,
                        tag: tagQuery,
                    },
                };
            } else {
                const isValidGeneral = await axiosInstance.post(`/general/check/`, {
                    url: detail,
                });

                if (isValidGeneral.data.DT) {
                    const newData = isValidGeneral.data.DT;
                    const data = {
                        ...newData,
                        parent: CheckMenuItem(newData.parent),
                    };
                    return {
                        props: {
                            detail: data,
                            search: searchQuery,
                            tag: tagQuery,
                        },
                    };
                } else {
                    return {
                        notFound: true,
                    };
                }
            }
        } catch (error) {
            return {
                notFound: true, // Xử lý lỗi và trả về trang 404 nếu cần
            };
        }
    }
}

Page.getLayout = (page) => <MarketingLayout scrollToTop={true}>{page}</MarketingLayout>;

export default Page;

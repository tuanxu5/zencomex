import { Typography } from "@mui/material";
import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePageView } from "../hooks/use-page-view";
import { Layout as MarketingLayout } from "../layouts/marketing";
import ChristmasEffect from "../components/christmasEffect";
import TiptapEditor from "../components/tiptap/tiptapEditor";
import LazyLoadSection from "./components/lazyLoadSection";

// Lazy load components using dynamic imports
const HomeSlide = dynamic(() => import("../sections/home/home-slide"), { ssr: false });
const HomeProductFavourite = dynamic(() => import("../sections/home/home-products-favourite"), { ssr: false });
const HomeProducts = dynamic(() => import("../sections/home/home-products"), { ssr: false });
const HomeIntroduction = dynamic(() => import("../sections/home/home-introduction"), { ssr: false });
const HomeSlideGeneral = dynamic(() => import("../sections/home/home-slide-general"), { ssr: false });
const HomeSlidePartner = dynamic(() => import("../sections/home/home-slide-partner"), { ssr: false });

const Page = () => {
    const { overviewInfo } = useSelector((state) => state.information);
    const [home, setHome] = useState(() => {
        if (overviewInfo && overviewInfo.menu) {
            const data = overviewInfo.menu[0];
            const newData = {
                id: data?.id,
                title: data?.ten_vi,
                path: data?.tenkhongdau,
                titleSeo: data?.title,
                keywordSeo: data?.keywords,
                descriptionSeo: data?.description,
            };
            return newData;
        }
    });

    usePageView();

    return (
        <>
            <Head>
                <title>{home?.titleSeo || "Trang chủ - Zencomex"}</title>
                <meta
                    name="description"
                    content={home?.descriptionSeo || "Trang chính của Zencomex - Cung cấp vật tư phụ ME chất lượng cao"}
                />
                <meta
                    name="keywords"
                    content={home?.keywordSeo || "vật tư ME, phụ tùng ME, Zencomex, vật tư công nghiệp"}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={process.env.NEXT_PUBLIC_API_URL} />
                <meta charSet="UTF-8" />
                <script type="application/ld+json">
                    {`
                        {
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "name": "Zencomex",
                            "url": "${process.env.NEXT_PUBLIC_API_URL}",
                            "description": "Trang chính của Zencomex - Cung cấp vật tư phụ ME chất lượng cao",
                            "potentialAction": {
                                "@type": "SearchAction",
                                "target": "${process.env.NEXT_PUBLIC_API_URL}/?s={search_term_string}",
                                "query-input": "required name=search_term_string"
                            }
                        }
                    `}
                </script>
                <NextSeo
                    title={home?.titleSeo || "Trang chủ - Zencomex"}
                    description={
                        home?.descriptionSeo || "Trang chính của Zencomex - Cung cấp vật tư phụ ME chất lượng cao"
                    }
                    canonical={process.env.NEXT_PUBLIC_API_URL}
                    openGraph={{
                        url: process.env.NEXT_PUBLIC_API_URL,
                        title: home?.titleSeo || "Dashboard - Zencomex",
                        description:
                            home?.descriptionSeo || "Trang chính của Zencomex - Cung cấp vật tư phụ ME chất lượng cao",
                        images: [
                            {
                                url: `${process.env.NEXT_PUBLIC_API_URL}/upload/hinhanh/avatar.jpg`,
                                width: 800,
                                height: 600,
                                alt: "Zencomex Image",
                            },
                        ],
                        site_name: "Zencomex",
                    }}
                    twitter={{
                        cardType: "summary_large_image",
                        site: "@zencomex",
                        title: home?.titleSeo || "Dashboard - Zencomex",
                        description:
                            home?.descriptionSeo || "Trang chính của Zencomex - Cung cấp vật tư phụ ME chất lượng cao",
                        image: `${process.env.NEXT_PUBLIC_API_URL}/upload/hinhanh/avtar.jpg`,
                    }}
                />
            </Head>
            <main>
                <Typography
                    sx={{
                        display: "none",
                        fontFamily: "-moz-initial",
                    }}
                    variant="h1"
                >
                    CÔNG TY TNHH SẢN XUẤT VÀ XUẤT NHẬP KHẨU ZENCO
                </Typography>
                <HomeSlide />

                <LazyLoadSection>
                    <HomeProductFavourite />
                </LazyLoadSection>

                <LazyLoadSection>
                    <HomeProducts />
                </LazyLoadSection>

                <LazyLoadSection>
                    <HomeSlideGeneral />
                </LazyLoadSection>

                <LazyLoadSection>
                    <HomeSlidePartner />
                </LazyLoadSection>

                <LazyLoadSection>
                    <HomeIntroduction />
                </LazyLoadSection>
            </main>
        </>
    );
};

Page.getLayout = (page) => <MarketingLayout>{page}</MarketingLayout>;

export default Page;

import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Head from "next/head";
import { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { RTL } from "../components/rtl";
import { Toaster } from "../components/toaster";
import { gtmConfig } from "../config";
import { AuthConsumer, AuthProvider } from "../contexts/auth/jwt-context";
import { SettingsConsumer, SettingsProvider } from "../contexts/settings-context";
import { gtm } from "../libs/gtm";
import { createTheme } from "../theme";
import { createEmotionCache } from "../utils/create-emotion-cache";
// Remove if nprogress is not used
import "../libs/nprogress";
// Remove if mapbox is not used
import "../libs/mapbox";
// Remove if locales are not used
import "../locales/i18n";

// scroll
import "../styles/custom-scroll.css";
import "../styles/global.css";

import LoadingScreen from "../components/loading-screen";
import { store } from "../redux/store";

// //font
// import { Roboto } from "next/font/google";

// // Sử dụng Roboto từ Google Fonts
// const roboto = Roboto({
//     subsets: ["latin"],
//     weight: ["100", "300", "400", "500", "700", "900"],
// });

const clientSideEmotionCache = createEmotionCache();

const useAnalytics = () => {
    useEffect(() => {
        gtm.initialize(gtmConfig);
    }, []);
};

const App = (props) => {
    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    useAnalytics();

    const getLayout = Component.getLayout ?? ((page) => page);

    return (
        <CacheProvider value={emotionCache}>
            <ReduxProvider store={store}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <AuthProvider>
                        <AuthConsumer>
                            {(auth) => (
                                <SettingsProvider>
                                    <SettingsConsumer>
                                        {(settings) => {
                                            // Prevent theme flicker when restoring custom settings from browser storage
                                            if (!settings.isInitialized) {
                                                // return null;
                                            }

                                            const theme = createTheme({
                                                colorPreset: settings.colorPreset,
                                                contrast: settings.contrast,
                                                direction: settings.direction,
                                                paletteMode: settings.paletteMode,
                                                responsiveFontSizes: settings.responsiveFontSizes,
                                            });

                                            // Prevent guards from redirecting
                                            const showSlashScreen = !auth.isInitialized;

                                            return (
                                                <ThemeProvider theme={theme}>
                                                    <Head>
                                                        <meta name="color-scheme" content={settings.paletteMode} />
                                                        <meta name="theme-color" content={theme.palette.neutral[900]} />
                                                    </Head>
                                                    <RTL direction={settings.direction}>
                                                        <CssBaseline />
                                                        <div>
                                                            {showSlashScreen ? (
                                                                <LoadingScreen />
                                                            ) : (
                                                                <>{getLayout(<Component {...pageProps} />)}</>
                                                            )}
                                                            <Toaster />
                                                        </div>
                                                    </RTL>
                                                </ThemeProvider>
                                            );
                                        }}
                                    </SettingsConsumer>
                                </SettingsProvider>
                            )}
                        </AuthConsumer>
                    </AuthProvider>
                </LocalizationProvider>
            </ReduxProvider>
        </CacheProvider>
    );
};

export default App;

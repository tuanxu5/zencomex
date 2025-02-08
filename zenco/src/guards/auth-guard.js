import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { paths } from "../paths";
import { checkToken } from "../services/Auth/auth-admin";
import { Issuer } from "../utils/auth";
import { setAuthorizationHeader } from "../utils/axios";

const loginPaths = {
    [Issuer.Amplify]: paths.auth.amplify.login,
    [Issuer.Auth0]: paths.auth.auth0.login,
    [Issuer.Firebase]: paths.auth.firebase.login,
    // [Issuer.JWT]: paths.auth.jwt.login,
    [Issuer.JWT]: paths.admin.login,
};

export const AuthGuard = (props) => {
    const { children } = props;
    const router = useRouter();
    const { isAuthenticated, issuer } = useAuth();

    const [checked, setChecked] = useState(false);
    const check = useCallback(async () => {
        if (!isAuthenticated) {
            const accessToken = localStorage.getItem("access_token");
            if (accessToken) {
                const isValid = await checkToken(accessToken);
                if (!isValid) {
                    localStorage.removeItem("access_token");
                    setAuthorizationHeader(null);
                    const href = loginPaths[issuer];
                    router.replace(href);
                } else {
                    setAuthorizationHeader(accessToken);
                    setChecked(true);
                }
            } else {
                const href = loginPaths[issuer];
                router.replace(href);
            }
        } else {
            setChecked(true);
        }
    }, [isAuthenticated, issuer, router]);

    useEffect(
        () => {
            check();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );
    if (!checked) {
        return null;
    }

    return <>{children}</>;
};

AuthGuard.propTypes = {
    children: PropTypes.node,
};

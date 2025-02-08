import PropTypes from "prop-types";
import { createContext, useCallback, useEffect, useReducer } from "react";
import { authApi } from "../../api/auth";
import { ToastMessage } from "../../components/custom-toast";
import { AdminLogin, AdminLogout, AdminRegister } from "../../services/Auth/auth-admin";
import { Issuer } from "../../utils/auth";
import { setAuthorizationHeader } from "../../utils/axios";

const STORAGE_KEY = "accessToken";

var ActionType;
(function (ActionType) {
    ActionType["INITIALIZE"] = "INITIALIZE";
    ActionType["SIGN_IN"] = "SIGN_IN";
    ActionType["SIGN_UP"] = "SIGN_UP";
    ActionType["SIGN_OUT"] = "SIGN_OUT";
})(ActionType || (ActionType = {}));

const initialState = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
};

const handlers = {
    INITIALIZE: (state, action) => {
        const { isAuthenticated, user } = action.payload;

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
        };
    },
    SIGN_IN: (state, action) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    SIGN_UP: (state, action) => {
        const { user } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
        };
    },
    SIGN_OUT: (state) => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

export const AuthContext = createContext({
    ...initialState,
    issuer: Issuer.JWT,
    signIn: () => Promise.resolve(),
    signUp: () => Promise.resolve(),
    signOut: () => Promise.resolve(),
});

export const AuthProvider = (props) => {
    const { children } = props;
    const [state, dispatch] = useReducer(reducer, initialState);

    const initialize = useCallback(async () => {
        try {
            const accessToken = globalThis.localStorage.getItem(STORAGE_KEY);

            if (accessToken) {
                const user = await authApi.me({ accessToken });

                dispatch({
                    type: ActionType.INITIALIZE,
                    payload: {
                        isAuthenticated: true,
                        user,
                    },
                });
            } else {
                dispatch({
                    type: ActionType.INITIALIZE,
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                });
            }
        } catch (err) {
            console.error(err);
            dispatch({
                type: ActionType.INITIALIZE,
                payload: {
                    isAuthenticated: false,
                    user: null,
                },
            });
        }
    }, [dispatch]);

    useEffect(
        () => {
            initialize();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const signIn = useCallback(
        async (email, password) => {
            try {
                const res = await AdminLogin({ email, password });
                if (res) {
                    localStorage.setItem("access_token", res.access_token);
                    setAuthorizationHeader(res.access_token);
                    ToastMessage("Đăng nhập thành công", "success");
                    dispatch({
                        type: ActionType.SIGN_IN,
                        payload: {
                            user: res.name,
                        },
                    });
                    return true;
                } else {
                    ToastMessage("Đăng nhập thất bại", "error");
                    return false;
                }
            } catch (error) {
                console.log(error);
                ToastMessage("Đã có lỗi xảy ra", "error");
            }
        },
        [dispatch]
    );

    const signUp = useCallback(
        async (email, name, password) => {
            try {
                const res = await AdminRegister({ email, name, password });
                if (typeof res === "string") {
                    ToastMessage(res, "error");
                } else {
                    if (res) {
                        ToastMessage("Đăng ký thành công", "success");
                    } else {
                        ToastMessage("Đăng ký thất bại", "error");
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
        [dispatch]
    );

    const signOut = useCallback(async () => {
        try {
            const res = await AdminLogout();
            if (res) {
                ToastMessage("Đăng xuất thành công", "success");
            } else {
                ToastMessage("Đăng xuất thất bại", "error");
            }
            localStorage.removeItem("access_token");
            dispatch({ type: ActionType.SIGN_OUT });
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    return (
        <AuthContext.Provider
            value={{
                ...state,
                issuer: Issuer.JWT,
                signIn,
                signUp,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const AuthConsumer = AuthContext.Consumer;

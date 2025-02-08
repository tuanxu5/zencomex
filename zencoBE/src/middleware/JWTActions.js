require("dotenv").config();
import jwt from "jsonwebtoken";

const nonSecurePaths = ["/logout", "/register", "/login"];

const createJWT = (data) => {
    let payload = data || "";
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRESIN });
    } catch (error) {
        console.log(error);
    }
    return token;
};

const verifyToken = (token) => {
    let key = process.env.JWT_SECRET; // Lấy secret key từ biến môi trường
    let decoded = null; // Khởi tạo biến để lưu trữ thông tin giải mã

    if (!token || !key) {
        console.log("Token or secret key is missing");
        return null; // Trả về null nếu thiếu token hoặc secret key
    }

    try {
        // Xác thực và giải mã token
        decoded = jwt.verify(token, key);
        return decoded; // Trả về payload của token nếu xác thực thành công
    } catch (error) {
        throw new Error(error); // Nếu có lỗi thì ném lỗi ra ngoài
    }
};

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(" ")[0] === "Bearer") {
        return req.headers.authorization.split(" ")[1];
    }
    return null;
};

const checkUserJWT = (req, res, next) => {
    // if (nonSecurePaths.includes(req.path)) return next();
    let cookies = req.cookies;
    let tokenFromHeader = extractToken(req);
    if ((cookies && cookies.jwt) || tokenFromHeader) {
        let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeader;
        let decoded = verifyToken(token);
        if (decoded) {
            let data = decoded;
            req.user = data;
            req.token = token;
            next();
        } else {
            return res.status(401).json({
                EC: "-2",
                DT: false,
                EM: "Not authenticated the user",
            });
        }
    } else {
        return res.status(401).json({
            EC: "-2",
            DT: false,
            EM: "Not authenticated the user",
        });
    }
};

const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(req.path) || req.path === "/account") return next();
    if (req.user) {
        let email = req.user.email;
        let roles = req.user.groupWithRoles.Roles;
        let currentUrl = req.path;
        let canAccess = roles.some((item) => item.url === currentUrl);
        if (!roles || roles.length === 0) {
            return res.status(403).json({
                EC: "-1",
                DT: "",
                EM: "You don't permisson access this resource....",
            });
        }
        if (canAccess === true) {
            return next();
        } else {
            return res.status(403).json({
                EC: "-1",
                DT: "",
                EM: "You don't permisson access this resource....",
            });
        }
    } else {
        return res.status(401).json({
            EC: "-1",
            DT: "",
            EM: "Not authenticated the user",
        });
    }
};
module.exports = {
    createJWT,
    verifyToken,
    checkUserJWT,
    checkUserPermission,
};

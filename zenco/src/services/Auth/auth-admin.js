import axiosInstance from "../../utils/axios";
export const AdminRegister = async (data) => {
    try {
        const res = await axiosInstance.post("/admin/register", data);
        if (res && res.data.DT) {
            return res.data.DT;
        }
        if (res && res.data.EC === "-2") {
            return "Vui lòng đăng nhập được cấp quyền để thực hiện chức năng này";
        }
        return false;
    } catch (error) {
        console.log(error);
    }
};

export const AdminLogin = async (data) => {
    try {
        const res = await axiosInstance.post("/admin/login", data);
        if (res && res.data.DT) {
            return res.data.DT;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
};
export const AdminLogout = async (data) => {
    try {
        const res = await axiosInstance.post("/admin/logout", data);
        if (res && res.data.DT) {
            return res.data.DT;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
};

export const checkToken = async (token) => {
    try {
        const res = await axiosInstance.post("/admin/checkToken", {
            token,
        });
        if (res && res.data.DT) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
    }
};

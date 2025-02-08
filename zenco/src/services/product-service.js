import axiosInstance from "../utils/axios";

//-------------------CATEGORY-------------------//
// create new category
const createCategory = async (data) => {
    try {
        const response = await axiosInstance.post("/product/category/create", data);
        if (response && response.data) {
            return response.data;
        }
        return false;
    } catch (error) {}
};
// update category
const updateCategory = async (data, id) => {
    try {
        const response = await axiosInstance.post(`/product/category/update/${id}`, data);
        if (response && response.data) {
            return response.data;
        }
        return false;
    } catch (error) {}
};

//------------------CHILD CATEGORY------------------//
//get categories
const getCategories = async (pageSize, pageIndex, searchName) => {
    try {
        const categories = await axiosInstance.get(
            `/product/category?page=${pageIndex}&pageSize=${pageSize}&name=${searchName}`
        );
        if (categories && categories.data) {
            return categories.data;
        }
    } catch (error) {}
};

const createChildCategory = async (data) => {
    try {
        const response = await axiosInstance.post("/product/child-category/create", data);
        if (response && response.data) {
            return response.data;
        }
        return false;
    } catch (error) {}
};
// update category
const updateChildCategory = async (data, id) => {
    try {
        const response = await axiosInstance.post(`/product/child-category/update/${id}`, data);
        if (response && response.data) {
            return response.data;
        }
        return false;
    } catch (error) {}
};

// ------------------PRODUCT------------------//
const createProduct = async (data) => {
    try {
        const response = await axiosInstance.post("/product/create", data);
        if (response && response.data) {
            return response.data;
        }
        return false;
    } catch (error) {}
};

// update category
const updateProduct = async (data, id) => {
    try {
        const response = await axiosInstance.post(`/product/update/${id}`, data);
        if (response && response.data) {
            return response.data;
        }
        return false;
    } catch (error) {}
};

//get list images by id category, id product
const getListImages = async (id) => {
    try {
        const response = await axiosInstance.get(`/image/list/${id}`);
        if (response && response.data) {
            return response.data.DT;
        }
        return false;
    } catch (error) {}
};

// get list product favorite
const getListProductFavorite = async () => {
    try {
        const response = await axiosInstance.get("/product/favorite");
        if (response && response.data) {
            return response.data;
        }
        return false;
    } catch (error) {}
};

export {
    //Child category
    getCategories,
    createChildCategory,
    updateChildCategory,

    //Category
    createCategory,
    updateCategory,

    //Product
    createProduct,
    updateProduct,

    //Together
    getListImages,

    //Favorite
    getListProductFavorite,
};

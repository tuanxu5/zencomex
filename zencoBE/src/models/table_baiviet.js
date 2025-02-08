const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    // Define the model and store the reference in a variable
    const Baiviet = sequelize.define(
        "table_baiviet",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            id_cat: {
                type: DataTypes.INTEGER,
            },
            id_list: {
                type: DataTypes.INTEGER,
            },
            id_item: {
                type: DataTypes.INTEGER,
            },
            id_sub: {
                type: DataTypes.INTEGER,
            },
            type: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            hienthi: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            noibat: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            photo: {
                type: DataTypes.STRING(225),
            },
            thumb: {
                type: DataTypes.STRING(225),
            },
            thumb2: {
                type: DataTypes.TEXT,
            },
            photo2: {
                type: DataTypes.STRING(255),
            },
            tenkhongdau: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            ten_vi: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            ten_en: {
                type: DataTypes.STRING(255),
            },
            name_vi: {
                type: DataTypes.STRING(255),
            },
            mota_vi: {
                type: DataTypes.TEXT,
            },
            name_en: {
                type: DataTypes.STRING(255),
            },
            mota_en: {
                type: DataTypes.TEXT,
            },
            noidung_vi: {
                type: DataTypes.TEXT,
            },
            noidung_en: {
                type: DataTypes.TEXT,
            },
            file_download: {
                type: DataTypes.STRING(255),
            },
            title: {
                type: DataTypes.STRING(255),
            },
            keywords: {
                type: DataTypes.TEXT,
            },
            description: {
                type: DataTypes.TEXT,
            },
            ngaytao: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: () => {
                    const now = new Date();
                    const utc7Offset = 7 * 60 * 60 * 1000; // UTC+7 offset in milliseconds
                    return Math.floor((now.getTime() + utc7Offset) / 1000); // Convert to seconds
                },
            },
            ngaysua: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: () => {
                    const now = new Date();
                    const utc7Offset = 7 * 60 * 60 * 1000; // UTC+7 offset in milliseconds
                    return Math.floor((now.getTime() + utc7Offset) / 1000); // Convert to seconds
                },
            },
            luotxem: {
                type: DataTypes.INTEGER,
            },
            stt: {
                type: DataTypes.INTEGER.UNSIGNED,
            },
        },
        {
            sequelize,
            tableName: "table_baiviet",
            timestamps: true, // Bật timestamps
            createdAt: "ngaytao", // Đổi tên trường createdAt
            updatedAt: "ngaysua", // Đổi tên trường updatedAt
            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [{ name: "id" }],
                },
            ],
        }
    );

    // Add the beforeUpdate hook correctly
    Baiviet.beforeUpdate((instance, options) => {
        const now = new Date();
        const utc7Offset = 7 * 60 * 60 * 1000; // UTC+7 offset in milliseconds
        instance.ngaysua = Math.floor((now.getTime() + utc7Offset) / 1000); // Update to current timestamp in seconds
    });

    return Baiviet;
};

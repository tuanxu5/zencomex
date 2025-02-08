const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "table_product",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            id_cat: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            id_list: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            id_item: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            id_sub: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            tags: {
                type: DataTypes.STRING(2000),
                allowNull: true,
            },
            type: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            noibat: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            banchay: {
                type: DataTypes.INTEGER,
                default: 0,
            },
            new: {
                type: DataTypes.INTEGER,
                default: 1,
            },
            khuyenmai: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            hienthi: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            photo: {
                type: DataTypes.STRING(225),
                allowNull: true,
            },
            thumb: {
                type: DataTypes.STRING(225),
                allowNull: true,
            },
            thumb2: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            photo2: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            masp: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            tenkhongdau: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            ten_vi: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            ten_en: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            name_vi: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            name_en: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            mota_vi: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            mota_en: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            noidung_vi: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            noidung_en: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            giaban: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            giacu: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            keywords: {
                type: DataTypes.STRING(1024),
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING(1024),
                allowNull: true,
            },
            soluong: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            stt: {
                type: DataTypes.INTEGER.UNSIGNED,
                defaultValue: 1,
                allowNull: true,
            },
            luotxem: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            ngaytao: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            ngaysua: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            username: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "table_product",
            timestamps: false,
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
};

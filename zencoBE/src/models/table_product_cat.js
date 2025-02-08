const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "table_product_cat",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            id_list: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            ten_vi: {
                type: DataTypes.STRING(255),
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
            tenkhongdau: {
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
            photo: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            thumb: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            stt: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            hienthi: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            noibat: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            ngaytao: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            ngaysua: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "table_product_cat",
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

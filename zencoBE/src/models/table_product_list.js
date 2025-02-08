const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "table_product_list",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING(100),
                defaultValue: "san-pham",
            },
            noibat: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            new: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
            },
            ten_vi: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            ten_en: {
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

            link: {
                type: DataTypes.STRING(500),
                allowNull: true,
            },
            title: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            tenkhongdau: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            keywords: {
                type: DataTypes.STRING(225),
                allowNull: true,
            },
            description: {
                type: DataTypes.STRING(225),
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
            thumb2: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            photo2: {
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
            tableName: "table_product_list",
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

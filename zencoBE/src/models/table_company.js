const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "table_company",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            id_cat: {
                type: DataTypes.STRING(2),
            },
            type: {
                type: DataTypes.STRING(100),
            },
            ten_vi: {
                type: DataTypes.STRING(225),
            },
            tenkhongdau: {
                type: DataTypes.STRING(255),
            },
            mota_vi: {
                type: DataTypes.TEXT,
            },
            noidung_vi: {
                type: DataTypes.TEXT,
            },
            ten_en: {
                type: DataTypes.STRING(225),
            },
            mota_en: {
                type: DataTypes.TEXT,
            },
            noidung_en: {
                type: DataTypes.TEXT,
            },
            title: {
                type: DataTypes.STRING(255),
            },
            keywords: {
                type: DataTypes.STRING(1024),
            },
            description: {
                type: DataTypes.STRING(1024),
            },
            photo: {
                type: DataTypes.STRING(100),
            },
            thumb: {
                type: DataTypes.STRING(255),
            },
            stt: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 1,
            },
            hienthi: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: 1,
            },
            ngaytao: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
            ngaysua: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            sequelize,
            tableName: "table_company",
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

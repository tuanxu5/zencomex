const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "table_photo",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING(30),
                allowNull: true,
            },
            id_vitri: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            photo_vi: {
                type: DataTypes.STRING(225),
                allowNull: true,
            },
            photo_en: {
                type: DataTypes.STRING(225),
                allowNull: true,
            },
            thumb_vi: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            thumb_en: {
                type: DataTypes.STRING(150),
                allowNull: true,
            },
            thumb: {
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
            link: {
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
            isdelete: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: "table_photo",
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

const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "table_product_photo",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            id_product: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            photo: {
                type: DataTypes.STRING(225),
                allowNull: true,
            },
            thumb: {
                type: DataTypes.STRING(225),
                allowNull: true,
            },
            ten: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            mota: {
                type: DataTypes.STRING(1024),
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
            tableName: "table_product_photo",
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

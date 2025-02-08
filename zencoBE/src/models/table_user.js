const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
        "table_user",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING(225),
                allowNull: false,
            },
            password: {
                type: DataTypes.STRING(225),
                allowNull: false,
            },
            ten: {
                type: DataTypes.STRING(225),
                allowNull: false,
            },
            dienthoai: {
                type: DataTypes.STRING(225),
            },
            email: {
                type: DataTypes.STRING(225),
            },
            diachi: {
                type: DataTypes.STRING(225),
            },
            sex: {
                type: DataTypes.BOOLEAN,
            },
            nick_yahoo: {
                type: DataTypes.STRING(225),
            },
            nick_skype: {
                type: DataTypes.STRING(225),
            },
            congty: {
                type: DataTypes.STRING(225),
            },
            country: {
                type: DataTypes.STRING(225),
            },
            city: {
                type: DataTypes.STRING(225),
            },
            quyen: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: "user",
            },
            role: {
                type: DataTypes.TINYINT.UNSIGNED,
                allowNull: false,
                defaultValue: 1,
            },
            hienthi: {
                type: DataTypes.BOOLEAN,
            },
            com: {
                type: DataTypes.STRING(225),
            },
            secretKey: {
                type: DataTypes.STRING(255),
            },
            login_session: {
                type: DataTypes.STRING(255),
            },
            user_token: {
                type: DataTypes.STRING(255),
            },
            lastlogin: {
                type: DataTypes.STRING(255),
                allowNull: false,
                defaultValue: () => {
                    const now = new Date();
                    const utc7Offset = 7 * 60 * 60 * 1000; // UTC+7 offset in milliseconds
                    return Math.floor((now.getTime() + utc7Offset) / 1000); // Convert to seconds
                },
            },
        },
        {
            sequelize,
            tableName: "table_user",
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

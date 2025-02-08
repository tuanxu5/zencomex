module.exports = (sequelize, DataTypes) => {
    const Contact = sequelize.define(
        "table_contact",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            phone: {
                type: DataTypes.STRING(15),
                allowNull: true,
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            message: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            sent: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
        },
        {
            tableName: "table_contact", // Tên bảng
            timestamps: true, // Tự động thêm createdAt, updatedAt
            paranoid: true, // Xóa mềm
        }
    );

    return Contact;
};

import { Sequelize } from "sequelize";
import config from "./config"; // Đường dẫn đúng đến file config.json

const env = process.env.NODE_ENV || "development";
const { username, password, database, host, dialect, define, logging } = config[env];

const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
    define,
    logging,
});

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Kết nối đến cơ sở dữ liệu thành công.");
    } catch (error) {
        console.error("Không thể kết nối đến cơ sở dữ liệu:", error);
    }
};

export default connection;

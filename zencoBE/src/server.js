require("dotenv").config();
import expess from "express";
import configViewEngine from "./config/viewEngine";
import configCors from "./config/cors";
import initWebRoutes from "./routes/web";
import bodyParser from "body-parser";
import connectionDatabase from "./config/connectDB";
import initApiRoutes from "./routes/api";
import cookieParser from "cookie-parser";
const compression = require("compression");

const app = expess();
const PORT = process.env.PORT || 8081;

//
app.use(compression());

// config CORS
configCors(app);

//config view engine
configViewEngine(app);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// config cookie parser
app.use(cookieParser());

// init web routes
initWebRoutes(app);
//init api routes
initApiRoutes(app);
//DB
connectionDatabase();

app.use((req, res) => {
    return res.send("404 not found");
});

app.listen(PORT, () => {
    console.log(">>>> Zenco Backend is running on port = " + PORT);
});

import express from "express";
import { APP_PORT } from "./cores/constants";
import { expenseRoutes } from "./routes/ExpenseRoutes";
import { expenseItemRoutes } from "./routes/ExpenseItemRoutes";
import cors from "cors";
import dotenv from "dotenv";
import { openRoutes } from "./routes/OpenRoutes";
import { verifyTokenMiddleware } from "./middlewares/verifyTokenMIddleware";
import { MariaDatabase } from "./mariadb";
import { dashboardRoutes } from "./routes/DashboardRoutes";

const app = express();

app.use(express.json());

dotenv.config();

// CORS configuration
const corsOptions = {
    origin: `${process.env.ALLOWED_ORIGIN}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

const baseurl = process.env.BASE_URL ?? "/api/";

console.log(baseurl);
  
app.use(cors(corsOptions));
app.use(baseurl, openRoutes);

app.use(verifyTokenMiddleware);

app.use(baseurl + "expense", expenseRoutes);
app.use(baseurl, expenseItemRoutes);
app.use(baseurl, dashboardRoutes);

app.listen(APP_PORT, () => {
    console.log(`Maria database connection: ${ (new MariaDatabase).IsConnected() ? 'successed.' : 'failed.' }`);
    console.log(`Server is running on port ${APP_PORT}`);
});
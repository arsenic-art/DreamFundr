import express from "express";
import cors from "cors";
import healthRoutes from "./routes/health.routes.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api", routes);
app.use("/health", healthRoutes);

export default app;

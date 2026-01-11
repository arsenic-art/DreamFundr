import express from "express";
import cors from "cors";
import helmet from "helmet";
import healthRoutes from "./routes/health.routes.js";
import routes from "./routes/index.js";
import { handleWebhook } from "./controllers/payment.controller.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// Rate limiting middleware (install: npm i express-rate-limit)
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// WEBHOOK FIRST (before JSON parsing)
app.post("/api/payments/webhook", 
  express.raw({ type: "application/json" }),
  handleWebhook
);

// JSON parsing AFTER webhook
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);
app.use("/health", healthRoutes);

export default app;

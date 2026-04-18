import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { apiRouter } from "./modules/routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { openApiDocument } from "./config/openapi.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "OK",
    data: { status: "healthy" },
    meta: null,
    error: null,
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "OK",
    data: { status: "healthy" },
    meta: null,
    error: null,
  });
});

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Urban Farming API",
    data: {
      docs: "/docs",
      health: "/health",
      apiHealth: "/api/health",
      apiBase: "/api",
    },
    meta: null,
    error: null,
  });
});

app.get("/api", (_req, res) => {
  res.json({
    success: true,
    message: "Urban Farming API base",
    data: {
      health: "/api/health",
      docs: "/docs",
    },
    meta: null,
    error: null,
  });
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

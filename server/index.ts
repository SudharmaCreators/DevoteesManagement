import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import { seedDemoData } from "./seedData";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, unknown> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Seed demo data in development
  if (process.env.NODE_ENV !== "production") {
    try {
      await seedDemoData();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.log("Demo data already exists or seeding failed:", msg);
    }
  }

  // Global Express error handler — must NOT re-throw after sending response
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    const status =
      typeof err === "object" && err !== null && "status" in err
        ? (err as { status?: number }).status ?? 500
        : 500;
    const message =
      err instanceof Error ? err.message : "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }

    // Log without crashing the process
    console.error("[Express Error]", err);
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Prevent uncaught promise rejections from killing the process
  process.on("unhandledRejection", (reason) => {
    console.error("[Unhandled Rejection]", reason);
  });

  process.on("uncaughtException", (err) => {
    console.error("[Uncaught Exception]", err);
    // Keep running — log and continue
  });

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`serving on port ${port}`);
  });
})();

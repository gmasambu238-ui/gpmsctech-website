/**
 * GPMSCTECH SERVER-001
 * SYSTEM SHUTDOWN CONTROLLER
 * Node.js + Express.js
 */

// Place immediately after:
// const app = express();

// Health check remains available.
app.get("/healthz", (req, res) => {
  res.status(200).json({
    service: "GPMSCTECH SERVER-001",
    health: "OK",
    systemStatus:
      process.env.GPMSCTECH_SYSTEM_STATUS === "CLOSED"
        ? "CLOSED"
        : "OPEN",
    dataPreservation: true
  });
});

// System shutdown middleware.
app.use((req, res, next) => {
  const status = (
    process.env.GPMSCTECH_SYSTEM_STATUS || "OPEN"
  ).toUpperCase();

  if (status === "CLOSED") {
    return res.status(503).json({
      system: "GPMSCTECH",
      server: "SERVER-001",
      status: "SYSTEM_CLOSED",
      message: "Huduma za mfumo zimesimamishwa.",
      dataPreservation: true,
      timestamp: new Date().toISOString()
    });
  }

  next();
});

// Continue with application routes below.

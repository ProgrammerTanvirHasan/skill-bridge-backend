import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { tutorsRouter } from "./modules/tutors/tutors.route";
const app = express();
app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/tutors", tutorsRouter);

app.get("/", (req, res) => {
  res.send("skill bridge runnings");
});

export default app;

import express from 'express';
import cors from "cors";
import { ENV } from "./config/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/authRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();
const port = Number(ENV.PORT) || 3000;


app.use(express.json());
app.use(cors({
 origin: ENV.CLIENT_ORIGIN,
 credentials: true
}));

app.get('/', (request, response) => {
  response.send('Express + TypeScript Server');
});

app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/analytics", analyticsRoutes);


const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log("Server is running on port:", port));
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();
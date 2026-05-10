import express from 'express';
import cors from "cors";
import dns from "node:dns";
import { ENV } from "./config/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "../src/routes/authRoutes.js";
import financeRoutes from "../src/routes/financeRoutes.js";

const app = express();
const port = Number(ENV.PORT) || 3000;

// remove once it fix- https://github.com/nodejs/node/issues/62326
dns.setServers(['8.8.8.8', '1.1.1.1']); 

app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
  response.send('Express + TypeScript Server');
});

app.use("/api/auth", authRoutes);
app.use("/api/finance", financeRoutes);


const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => console.log("Server is running on port:", port));
  } catch (error) {
    console.error("Error starting the server", error);
  }
};

startServer();
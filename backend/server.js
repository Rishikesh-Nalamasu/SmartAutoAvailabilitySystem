import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import locationRoutes from "./routes/locationRoutes.js";
import checkpointRoutes from "./routes/checkpointRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/locations", locationRoutes);
app.use("/api/checkpoints", checkpointRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

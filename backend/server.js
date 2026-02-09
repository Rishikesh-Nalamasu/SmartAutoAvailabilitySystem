import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import locationRoutes from "./routes/locationRoutes.js";
import checkpointRoutes from "./routes/checkpointRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/locations", locationRoutes);
app.use("/api/checkpoints", checkpointRoutes);

app.get("/", (req, res) => res.send("API Running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

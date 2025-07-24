import "dotenv/config";
import "./models";
import "./models/schema";
import app from "./server";

const PORT = process.env.API_PORT_NO || 3000;
const HOST =
  process.env.MODE === "DEV"
    ? `http://localhost:${PORT}`
    : "https://express-social-network.fly.dev";

const handleListening = () => console.log(`✅ Server listenting on ${HOST} 🚀`);
app.listen(PORT, handleListening);

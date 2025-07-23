import "dotenv/config";
import "./models";
import "./models/schema";
import app from "./server";

const MODE = process.env.MODE;
const PORT = process.env.API_PORT_NO || 3000;
const HOST =
  MODE === "DEV" ? `http://localhost:${PORT}` : "https://{CUSTOM_DOMAIN}";

const handleListening = () => console.log(`✅ Server listenting on ${HOST} 🚀`);
app.listen(PORT, handleListening);

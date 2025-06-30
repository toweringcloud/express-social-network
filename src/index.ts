import "dotenv/config";
import "./db";
import "./db/schema";
import app from "./server";

const PORT = process.env.API_PORT_NO;
const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);

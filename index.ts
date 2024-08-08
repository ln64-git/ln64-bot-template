import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    message.channel.send("Pong.");
  }
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(() => console.log("Bot logged in"))
  .catch(console.error);

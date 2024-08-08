import { Client, GatewayIntentBits, type Interaction, Guild } from "discord.js";
import { config } from "dotenv";
import { REST, Routes } from "discord.js";
import { handlePing } from "./commands/ping";

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Initialize the bot
async function initializeBot() {
  client.once("ready", () => {
    console.log(`Logged in as ${client.user?.tag}!`);
  });

  client.on("guildCreate", async (guild: Guild) => {
    console.log(`Joined a new guild: ${guild.name} (ID: ${guild.id})`);
    await registerCommands(guild.id);
  });

  client.on("interactionCreate", async (interaction: Interaction) => {
    await processCommands(interaction);
  });

  await client.login(process.env.BOT_TOKEN);
}

// Register commands dynamically for a specific guild
async function registerCommands(guildId: string) {
  const { BOT_TOKEN, CLIENT_ID } = process.env;

  if (!BOT_TOKEN || !CLIENT_ID) {
    throw new Error("Missing BOT_TOKEN or CLIENT_ID environment variable");
  }

  const commands = [
    {
      name: "init",
      description: "Initializes the bot in the server",
    },
    {
      name: "ping",
      description: "Replies with Pong!",
    },
  ];

  const rest = new REST({ version: "9" }).setToken(BOT_TOKEN);

  try {
    console.log(`Registering commands for guild: ${guildId}`);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {
      body: commands,
    });
    console.log(`Successfully registered commands for guild: ${guildId}`);
  } catch (error) {
    console.error(`Failed to register commands for guild: ${guildId}`, error);
  }
}

// Process incoming commands
async function processCommands(interaction: Interaction) {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case "init":
      await interaction.reply("Bot initialized in this server!");
      break;
    case "ping":
      await handlePing(interaction);
      break;
    default:
      await interaction.reply("Unknown command!");
      break;
  }
}

// Initialize the bot
initializeBot();

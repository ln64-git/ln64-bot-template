// ping-user.ts
import { CommandInteraction } from "discord.js";

export async function handlePing(interaction: CommandInteraction) {
  await interaction.reply("Pong!");
}

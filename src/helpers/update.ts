import { CommandInteraction, Guild } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { registerCommands } from "../utils/deploy-commands";
import { handleError } from "../utils/handleError";
import joinedGuild from "./joinedGuild";

export async function update(interaction: CommandInteraction) {
  try {
    const guild = interaction.guild;
    if (guild) registerCommands(guild.id);
    await interaction.reply({ embeds: convertToCode(`Updated!\n\n`) });
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default update;

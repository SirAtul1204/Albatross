import { CommandInteraction, Guild } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { handleError } from "../utils/handleError";
import joinedGuild from "./joinedGuild";

export async function update(interaction: CommandInteraction) {
  try {
    const guild = interaction.guild;
    if (guild) joinedGuild(guild);
    await interaction.reply({ embeds: convertToCode(`Updated!\n\n`) });
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default update;

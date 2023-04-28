import { CommandInteraction, Guild, GuildMember } from "discord.js";
import { checkManager } from "../utils/checks";
import { convertToCode } from "../utils/convertToCode";
import { handleError } from "../utils/handleError";

export async function createChannel(interaction: CommandInteraction) {
  try {
    const { member } = interaction;
    if (!checkManager(member as GuildMember))
      return await interaction.reply({
        embeds: convertToCode("You are not authorized"),
      });

    const type = interaction.options.getString("type");
    const name = interaction.options.getString("name");
    const channelManager = interaction.guild?.channels;
    await channelManager?.create(name!, {
      type: type === "text" ? "GUILD_TEXT" : "GUILD_VOICE",
    });

    await interaction.reply({
      embeds: convertToCode("Channel Created"),
    });
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

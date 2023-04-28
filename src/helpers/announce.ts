import { CommandInteraction, Guild, TextChannel } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { ANNOUNCEMENT_CHANNEL_NAME, Errors } from "../utils/enum";
import { handleError } from "../utils/handleError";

export async function announce(interaction: CommandInteraction) {
  try {
    const title = interaction.options.getString("title");
    const message = interaction.options.getString("message");
    if (!message || !title) throw new Error(Errors.missingArgument);
    const allChannels = await interaction.guild?.channels.fetch();
    const announcementChannel = allChannels?.find(
      (channel) =>
        channel.isText() && channel.name === ANNOUNCEMENT_CHANNEL_NAME
    );
    if (!announcementChannel)
      throw new Error(Errors.announcementChannelNotFound);

    (announcementChannel as TextChannel).send({
      embeds: convertToCode(title, "@everyone " + message),
    });
    await interaction.reply({
      embeds: convertToCode("Done!"),
    });
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

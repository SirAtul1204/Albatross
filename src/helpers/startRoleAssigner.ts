import {
  CommandInteraction,
  Guild,
  GuildMember,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import { checkManager } from "../utils/checks";
import { convertToCode } from "../utils/convertToCode";
import { ANNOUNCEMENT_CHANNEL_NAME, Errors } from "../utils/enum";
import { handleError } from "../utils/handleError";

export async function startRoleAssigner(interaction: CommandInteraction) {
  try {
    const { member, guild } = interaction;
    if (!checkManager(member as GuildMember))
      return await interaction.reply({
        embeds: convertToCode("You are not authorized"),
      });

    const allChannels = await guild?.channels.fetch();
    const announcementChannel = allChannels?.find(
      (channel) =>
        channel.name === ANNOUNCEMENT_CHANNEL_NAME && channel.isText()
    ) as TextChannel;

    if (!announcementChannel)
      throw new Error(Errors.announcementChannelNotFound);

    const role = interaction.options.getRole("role");

    announcementChannel.send({
      embeds: [
        new MessageEmbed().setTitle(
          `Click on the following button to get the role ${role?.name}`
        ),
      ],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId(`role/${role?.name}`)
            .setLabel(`Get Role ${role?.name}`)
            .setStyle("SUCCESS")
        ),
      ],
    });

    await interaction.reply({
      embeds: convertToCode(
        "Started the role assigner in Announcement channel"
      ),
    });
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

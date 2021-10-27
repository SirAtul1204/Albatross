import {
  CommandInteraction,
  Guild,
  GuildMember,
  Permissions,
  RoleManager,
} from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { ANNOUNCEMENT_CHANNEL_NAME, Roles } from "../utils/enum";
import { handleError } from "../utils/handleError";

export async function leave(interaction: CommandInteraction): Promise<void> {
  try {
    const member = interaction.member as GuildMember;
    const guild = interaction.guild as Guild;
    if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      interaction.reply({
        embeds: convertToCode(`Ok Leaving..Will you miss me?`),
      });
      const allChannels = await guild.channels.fetch();
      const announcementChannel = allChannels.find(
        (channel) =>
          channel.name === ANNOUNCEMENT_CHANNEL_NAME && channel.isText()
      );

      if (announcementChannel) await announcementChannel.delete();

      const roleManager = new RoleManager(guild);
      const allRoles = await roleManager.fetch();

      const managerRole = allRoles.find((role) => role.name === Roles.Managers);
      if (managerRole) await managerRole.delete();

      const djRole = allRoles.find((role) => role.name === Roles.DJ);
      if (djRole) await djRole.delete();

      guild.leave();
    } else {
      interaction.reply({
        embeds: convertToCode(
          `Only a member with Administrator permission can make me leave`
        ),
      });
    }
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default leave;

import { Guild, Role, TextChannel } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { ANNOUNCEMENT_CHANNEL_NAME, Errors, Roles } from "../utils/enum";
import { handleError } from "../utils/handleError";

export async function deletedGuild(guild: Guild) {
  try {
    const allChannel = await guild.channels.fetch();

    const announcementChannel = allChannel.find(
      (channel) =>
        channel.name === ANNOUNCEMENT_CHANNEL_NAME && channel.isText()
    );

    if (announcementChannel)
      await (announcementChannel as TextChannel).send({
        embeds: convertToCode(
          `Thanks for having me, deleting Role ${Roles.Managers} and ${Roles.DJ} and this channel.`
        ),
      });

    const allRoles = await guild.roles.fetch();
    const managerRole = allRoles.find((role) => role.name === Roles.Managers);
    if (managerRole) await (managerRole as Role).delete();

    const djRole = allRoles.find((role) => role.name === Roles.DJ);
    if (djRole) await (djRole as Role).delete();
  } catch (e) {
    handleError(guild, e);
  }
}

export default deletedGuild;

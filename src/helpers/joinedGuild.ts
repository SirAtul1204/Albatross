import { Guild, RoleManager, TextChannel, Permissions } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { registerCommands } from "../utils/deploy-commands";
import {
  ANNOUNCEMENT_CHANNEL_NAME,
  COMMAND_CHANNEL_NAME,
  Errors,
  Roles,
} from "../utils/enum";
import { handleError } from "../utils/handleError";
import { initializeDb } from "../db/initializeDb";

// Creates announcement channel and roles
// runs whenever bot joins a group or the user uses /update command
export async function joinedGuild(guild: Guild): Promise<void> {
  try {
    const allChannels = await guild.channels.fetch();
    let announcementChannel = allChannels.find(
      (channel) =>
        channel.name === ANNOUNCEMENT_CHANNEL_NAME && channel.isText()
    );
    let commandChannel = allChannels.find(
      (channel) => channel.name === COMMAND_CHANNEL_NAME && channel.isText()
    );
    console.log(`Joined or updated ${guild.name}.`);

    if (!announcementChannel)
      announcementChannel = await guild.channels.create(
        ANNOUNCEMENT_CHANNEL_NAME,
        {
          type: "GUILD_TEXT",
          permissionOverwrites: [
            {
              id: guild.id,
              deny: ["SEND_MESSAGES", "USE_APPLICATION_COMMANDS"],
            },
          ],
        }
      );

    if (!announcementChannel) throw Errors.announcementChannelCantBeCreated;

    if (!commandChannel)
      commandChannel = await guild.channels.create(COMMAND_CHANNEL_NAME, {
        type: "GUILD_TEXT",
        permissionOverwrites: [{ id: guild.id, deny: ["VIEW_CHANNEL"] }],
      });

    const roleManager = new RoleManager(guild);
    if (!roleManager) throw Errors.roleManagerCantBeCreated;
    const allRoles = await roleManager.fetch();
    const managerRole = allRoles.find((role) => role.name === Roles.Managers);
    if (!managerRole)
      await roleManager.create({
        name: Roles.Managers,
        color: "BLURPLE",
        permissions: [
          Permissions.FLAGS.KICK_MEMBERS,
          Permissions.FLAGS.MANAGE_ROLES,
          Permissions.FLAGS.MANAGE_CHANNELS,
          Permissions.FLAGS.MANAGE_MESSAGES,
          Permissions.FLAGS.MANAGE_THREADS,
          Permissions.FLAGS.MUTE_MEMBERS,
          Permissions.FLAGS.DEAFEN_MEMBERS,
          Permissions.FLAGS.MOVE_MEMBERS,
        ],
      });

    const djRole = allRoles.find((role) => role.name === Roles.DJ);

    if (!djRole)
      await roleManager.create({
        name: Roles.DJ,
        color: "RED",
        permissions: [
          Permissions.FLAGS.MUTE_MEMBERS,
          Permissions.FLAGS.DEAFEN_MEMBERS,
          Permissions.FLAGS.MOVE_MEMBERS,
        ],
      });

    const owner = await guild.fetchOwner();
    console.log(
      `Required Roles Created in ${guild.name} of ${owner.displayName}`
    );

    const directMessage = await owner.createDM();

    if (!directMessage) throw Errors.directMessageCantBeCreated;

    await directMessage.send({
      embeds: convertToCode(
        `Please check and review the Roles and their positions in your ${guild.name} server`
      ),
    });

    initializeDb(guild.id);

    // Register Slash Commands
    registerCommands(guild.id);

    if (!announcementChannel) throw Errors.announcementChannelNotFound;

    (announcementChannel as TextChannel).send({
      embeds: convertToCode(
        `Thanks for adding me to your server.\n\nCreated Roles 'Managers' and 'DJ'\n\nAll Slash Commands are registered, type / to get started`
      ),
    });
  } catch (e) {
    handleError(guild, e);
  }
}

export default joinedGuild;

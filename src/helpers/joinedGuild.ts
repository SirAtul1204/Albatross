import { Guild, RoleManager, TextChannel, Permissions } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { registerCommands } from "../utils/deploy-commands";
import { ANNOUNCEMENT_CHANNEL_NAME, Errors, Roles } from "../utils/enum";

export async function joinedGuild(guild: Guild) {
  try {
    console.log(`Joined ${guild.name}.`);
    const announcementChannel = await guild.channels.create(
      ANNOUNCEMENT_CHANNEL_NAME,
      { type: "GUILD_TEXT" }
    );

    if (!announcementChannel) throw Errors.announcementChannelCantBeCreated;

    const roleManager = new RoleManager(guild);
    if (!roleManager) throw Errors.roleManagerCantBeCreated;

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

    await directMessage.send(
      convertToCode(
        `Please check and review the Roles and their positions in your ${guild.name} server`
      )
    );

    const channel = guild.channels.cache.find(
      (channel) =>
        channel.isText() && channel.name === ANNOUNCEMENT_CHANNEL_NAME
    ) as TextChannel;
    // Register Slash Commands
    registerCommands(guild.id);

    if (!channel) throw Errors.announcementChannelNotFound;

    channel.send(
      convertToCode(
        `Thanks for adding me to your server.\n\nCreated Roles 'Managers' and 'DJ'\n\nAll Slash Commands are registered, type / to get started`
      )
    );
  } catch (e) {
    const channel = guild.channels.cache.find((channel) => {
      if (channel.name === "general" && channel.type === "GUILD_TEXT") {
        return true;
      }
      return false;
    }) as TextChannel;

    switch (e) {
      case Errors.announcementChannelCantBeCreated:
        if (channel)
          channel.send("Cannot create announcement channel, Contact Developer");
        break;
      case Errors.announcementChannelNotFound:
        if (channel)
          channel.send("Cannot find announcement channel, Contact Developer");
        break;
      case Errors.roleManagerCantBeCreated:
        if (channel)
          channel.send("Cannot create Role Manager, Contact Developer");
        break;
      case Errors.directMessageCantBeCreated:
        if (channel)
          channel.send(
            "Cannot create a Direct Message to Owner, contact Developer"
          );
        break;
      default:
        if (channel)
          channel.send(
            convertToCode(
              `Looks like you already have role named 'Managers' and 'DJ'. Kindly rename or remove them and re-add YoBot.\nIt is important for functioning of YoBot.`
            )
          );
        break;
    }
  }
}

export default joinedGuild;

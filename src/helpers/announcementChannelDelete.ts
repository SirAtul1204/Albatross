import { GuildChannel } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { ANNOUNCEMENT_CHANNEL_NAME, Errors } from "../utils/enum";
import { handleError } from "../utils/handleError";

export async function announcementChannelDelete(channel: GuildChannel) {
  try {
    if (channel.isText() && channel.name === ANNOUNCEMENT_CHANNEL_NAME) {
      const guildOwner = await channel.guild.fetchOwner();
      if (!guildOwner) throw Errors.guildOwnerNotFound;

      const dmToOwner = await guildOwner.createDM();
      if (!dmToOwner) throw Errors.directMessageCantBeCreated;

      dmToOwner.send({
        embeds: convertToCode(
          `You deleted ${ANNOUNCEMENT_CHANNEL_NAME} from your ${channel.guild.name} Server. That is important for proper functioning of the bot.`
        ),
      });
    }
  } catch (e) {
    handleError(channel.guild, e);
  }
}

export default announcementChannelDelete;

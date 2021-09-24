import { GuildChannel } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { ANNOUNCEMENT_CHANNEL_NAME, Errors } from "../utils/enum";

export async function announcementChannelDelete(channel: GuildChannel) {
  try {
    if (channel.isText() && channel.name === ANNOUNCEMENT_CHANNEL_NAME) {
      const guildOwner = await channel.guild.fetchOwner();
      if (!guildOwner) throw Errors.guildOwnerNotFound;

      const dmToOwner = await guildOwner.createDM();
      if (!dmToOwner) throw Errors.directMessageCantBeCreated;

      dmToOwner.send(
        convertToCode(
          `You deleted ${ANNOUNCEMENT_CHANNEL_NAME} from your ${channel.guild.name} Server. That is important for proper functioning of the bot.`
        )
      );
    }
  } catch (e) {
    console.log(e);
  }
}

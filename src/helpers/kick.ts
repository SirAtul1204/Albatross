import {
  Client,
  CommandInteraction,
  GuildMember,
  Permissions,
} from "discord.js";
import { convertToCode } from "../utils/convertToCode";

export async function kick(interaction: CommandInteraction, client: Client) {
  try {
    // Getting the member who invoked the command
    const member = interaction.member as GuildMember;

    //Checking for permission if the above member has rights to kick other members
    if (member.permissions.has([Permissions.FLAGS.KICK_MEMBERS])) {
      // Getting user that is going to be kicked and the reason if specified
      const user = interaction.options.getUser("user", true);
      let reason = interaction.options.getString("reason", false);

      // An Administrator can not be kicked
      let guild = client.guilds.cache.first();
      const guildMember = await guild?.members.fetch(user);
      if (guildMember?.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        await interaction.reply(
          convertToCode("An Administrator can not be kicked!")
        );
        return;
      }

      // Kicking the user
      if (!reason) reason = convertToCode("You have been Kicked Out.");
      guild?.members.kick(user, reason);

      //Sending Channel Notification
      await interaction.reply(
        convertToCode(
          `${user.username} has disappeared from the Server Mysteriously!`
        )
      );
    }
    //If member invoking the command doesn't have the right permission
    else {
      await interaction.reply(
        convertToCode("You don't have permission to kick a member!")
      );
    }
  } catch (e) {
    await interaction.reply(convertToCode("Oops! Looks like you found a bug."));
    console.log("Some Error", e);
  }
}

export default kick;

import {
  CommandInteraction,
  Guild,
  GuildMember,
  Permissions,
  Role,
  User,
} from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { Errors, Roles } from "../utils/enum";
import { handleError } from "../utils/handleError";

export async function promote(interaction: CommandInteraction) {
  try {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const user = interaction.options.getUser("user");
    if (!user) throw Errors.userNotFound;
    const role = interaction.options.getRole("role");
    if (!role) throw Errors.roleNotFound;
    switch (role.name) {
      case Roles.DJ:
        if (member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
          const userMember = await guild.members.fetch(user);
          userMember.roles.add(role as Role);
          await interaction.reply({
            embeds: convertToCode(
              `Congratulations @${
                userMember.nickname
                  ? userMember.nickname
                  : userMember.displayName
              } you are promoted to '${Roles.DJ}'`
            ),
          });
        } else {
          await interaction.reply({
            embeds: convertToCode(
              `Only '${Roles.Managers}' or 'Administrators' can promote to '${Roles.DJ}'.`
            ),
          });
        }
        break;
      case Roles.Managers:
        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
          const userMember = await guild.members.fetch(user);
          userMember.roles.add(role as Role);
          await interaction.reply({
            embeds: convertToCode(
              `Congrats @${
                userMember.nickname
                  ? userMember.nickname
                  : userMember.displayName
              } you are promoted to '${Roles.Managers}'`
            ),
          });
        } else {
          await interaction.reply({
            embeds: convertToCode(
              `Only 'Administrators' can promote to '${Roles.Managers}'.`
            ),
          });
        }
        break;
      default:
        interaction.reply({ embeds: convertToCode(`Invalid Role`) });
        break;
    }
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default promote;

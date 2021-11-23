import {
  CommandInteraction,
  Guild,
  GuildMember,
  Permissions,
  Role,
} from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { Errors, Roles } from "../utils/enum";
import { handleError } from "../utils/handleError";

// Demote a guild member
export async function demote(interaction: CommandInteraction): Promise<void> {
  try {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const user = interaction.options.getUser("user");
    if (!user) throw Errors.userNotFound;
    const role = interaction.options.getRole("role");
    if (!role) throw Errors.roleNotFound;

    const userMember = await guild.members.fetch(user);
    switch (role.name) {
      case Roles.DJ:
        if (member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) {
          await userMember.roles.remove(role as Role);
          await interaction.reply({
            embeds: convertToCode(
              `@${
                userMember.nickname
                  ? userMember.nickname
                  : userMember.displayName
              } failed as '${Roles.DJ}'`
            ),
          });
        } else {
          await interaction.reply({
            embeds: convertToCode(
              `You don't have the permissions to take away someone's pride`
            ),
          });
        }
        break;
      case Roles.Managers:
        if (member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
          await userMember.roles.remove(role as Role);
          await interaction.reply({
            embeds: convertToCode(
              `@${
                userMember.nickname
                  ? userMember.nickname
                  : userMember.displayName
              } failed as '${Roles.Managers}'`
            ),
          });
        } else {
          await interaction.reply({
            embeds: convertToCode(`You can't take away someone's pride`),
          });
        }
        break;
      default:
        await interaction.reply({ embeds: convertToCode(`Invalid Role`) });
        break;
    }
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default demote;

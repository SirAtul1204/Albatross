import { CommandInteraction, Guild, GuildMember } from "discord.js";
import { checkManager } from "../utils/checks";
import { convertToCode } from "../utils/convertToCode";
import { handleError } from "../utils/handleError";

export async function createRole(interaction: CommandInteraction) {
  try {
    const { member, guild } = interaction;
    if (!checkManager(member as GuildMember))
      return await interaction.reply({
        embeds: convertToCode("You are not authorized"),
      });

    const name = interaction.options.getString("name");
    const roleManager = guild?.roles;
    await roleManager?.create({
      name: name!,
      color: "RANDOM",
    });

    await interaction.reply({
      embeds: convertToCode(
        "Role created\n\nType /startRoleAssigner to create an emoji based role assigner"
      ),
    });
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

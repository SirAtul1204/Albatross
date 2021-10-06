import { CommandInteraction, Guild, GuildMember } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { Roles, VoiceObject } from "../utils/enum";
import { handleError } from "../utils/handleError";

export async function add(
  interaction: CommandInteraction,
  VoiceController: Map<string, VoiceObject>
) {
  try {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    if (member.roles.cache.some((role) => role.name === Roles.DJ)) {
      const voiceController = VoiceController.get(guild.id);
      if (voiceController) {
        if (voiceController.voiceChannelId === member.voice.channelId) {
          const search = interaction.options.getString("search");
          voiceController.queue.push(search!);
          await interaction.reply({ embeds: convertToCode(`Added to Queue!`) });
        } else {
          await interaction.reply({
            embeds: convertToCode(
              `Playing at ${voiceController.voiceChannelName}, join that channel to use this command.`
            ),
          });
        }
      } else {
        await interaction.reply({
          embeds: convertToCode(`You are not playing anything`),
        });
      }
    } else {
      await interaction.reply({
        embeds: convertToCode(`You are not a '${Roles.DJ}'`),
      });
    }
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default add;

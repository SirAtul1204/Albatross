import { CommandInteraction, Guild, GuildMember } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { Roles, VoiceObject } from "../utils/enum";
import { handleError } from "../utils/handleError";

// Clears the queue
export async function clear(
  interaction: CommandInteraction,
  VoiceController: Map<string, VoiceObject>
) {
  try {
    const guild = interaction.guild as Guild;
    const voiceController = VoiceController.get(guild.id);
    if (voiceController) {
      const member = interaction.member as GuildMember;
      if (member.roles.cache.some((role) => role.name === Roles.DJ)) {
        if (member.voice.channelId === voiceController.voiceChannelId) {
          voiceController.queue = new Array();
          await interaction.reply({ embeds: convertToCode(`Queue Cleared!`) });
        } else {
          await interaction.reply({
            embeds: convertToCode(
              `Playing at '${voiceController.voiceChannelName}, join that channel to use this command!'`
            ),
          });
        }
      } else {
        await interaction.reply({
          embeds: convertToCode(`You are not a '${Roles.DJ}'`),
        });
      }
    } else {
      await interaction.reply({
        embeds: convertToCode(`Nothing is playing, no song is in Queue`),
      });
    }
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default clear;

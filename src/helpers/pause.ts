import { CommandInteraction, Guild, GuildMember } from "discord.js";
import { AudioPlayer, AudioPlayerStatus } from "@discordjs/voice";
import { handleError } from "../utils/handleError";
import { Errors, Roles, VoiceObject } from "../utils/enum";
import { convertToCode } from "../utils/convertToCode";

// To pause the playing audio
export async function pause(
  interaction: CommandInteraction,
  VoiceController: Map<string, VoiceObject>
): Promise<void> {
  try {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    if (member.roles.cache.some((role) => role.name === Roles.DJ)) {
      const player = VoiceController.get(guild.id)?.player;
      if (player) {
        if (player.state.status === AudioPlayerStatus.Playing) {
          if (
            member.voice.channelId ===
            VoiceController.get(guild.id)?.voiceChannelId
          ) {
            player.pause();
            await interaction.reply({
              embeds: convertToCode(
                `Paused, you can use /resume to play it again`
              ),
            });
          } else {
            await interaction.reply({
              embeds: convertToCode(
                `Playing at ${
                  VoiceController.get(guild.id)?.voiceChannelName
                }. Join that channel to use this command`
              ),
            });
          }
        } else {
          await interaction.reply({
            embeds: convertToCode(`You are not playing anything!`),
          });
        }
      } else {
        await interaction.reply({
          embeds: convertToCode(`Not playing anything`),
        });
      }
    } else {
      await interaction.reply({
        embeds: convertToCode(`You are not a '${Roles.DJ}'.'`),
      });
    }
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default pause;

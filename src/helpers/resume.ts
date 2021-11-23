import { AudioPlayerStatus } from "@discordjs/voice";
import { CommandInteraction, Guild, GuildMember } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { Errors, Roles, VoiceObject } from "../utils/enum";
import { handleError } from "../utils/handleError";

export async function resume(
  interaction: CommandInteraction,
  VoiceController: Map<string, VoiceObject>
) {
  try {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    if (member.roles.cache.some((role) => role.name === Roles.DJ)) {
      const player = VoiceController.get(guild.id)?.player;
      if (player) {
        if (player.state.status === AudioPlayerStatus.Paused) {
          if (
            member.voice.channelId ===
            VoiceController.get(guild.id)?.voiceChannelId
          ) {
            player.unpause();
            await interaction.reply({
              embeds: convertToCode(`Resuming you song, Enjoy!`),
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
            embeds: convertToCode(
              `Nothing to Resume, play and pause something first`
            ),
          });
        }
      } else {
        await interaction.reply({
          embeds: convertToCode(`Not playing anything.`),
        });
      }
    } else {
      await interaction.reply({
        embeds: convertToCode(`You are not a '${Roles.DJ}'!`),
      });
    }
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default resume;

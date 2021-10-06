import {
  CommandInteraction,
  Guild,
  GuildAuditLogs,
  GuildMember,
} from "discord.js";
import { DetailsModel } from "../db/schema";
import { convertToCode } from "../utils/convertToCode";
import { Roles, VoiceObject } from "../utils/enum";
import { handleError } from "../utils/handleError";

export async function volume(
  interaction: CommandInteraction,
  VoiceController: Map<string, VoiceObject>
) {
  try {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const memberVoiceChannelId = member.voice.channelId;
    const VoiceConnection = VoiceController.get(guild.id);
    if (member.roles.cache.some((role) => role.name === Roles.DJ)) {
      if (VoiceConnection) {
        if (memberVoiceChannelId === VoiceConnection?.voiceChannelId) {
          const volume = interaction.options.getNumber("value");
          if (volume) {
            VoiceConnection.resource.volume?.setVolume(volume);
            await interaction.reply({
              embeds: convertToCode(`Volume is set to ${volume}`),
            });

            await DetailsModel.findOneAndUpdate(
              { guildId: guild.id },
              { volume: volume }
            );
          } else {
            await interaction.reply({
              embeds: convertToCode(
                `Current Volume is ${VoiceConnection.resource.volume?.volume}`
              ),
            });
          }
        } else {
          await interaction.reply({
            embeds: convertToCode(
              `Already Playing at ${
                VoiceController.get(guild.id)?.voiceChannelName
              }. Join that channel and use /stop to make me free again.`
            ),
          });
        }
      } else {
        await interaction.reply({
          embeds: convertToCode(`Not Playing anything!`),
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

export default volume;

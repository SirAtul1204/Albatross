import { CommandInteraction, Guild, GuildMember } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { Roles, VoiceObject } from "../utils/enum";

export async function stop(
  interaction: CommandInteraction,
  VoiceController: Map<string, VoiceObject>
) {
  const guild = interaction.guild as Guild;
  const member = interaction.member as GuildMember;
  if (member.roles.cache.some((role) => role.name === Roles.DJ)) {
    const voiceObject = VoiceController.get(guild.id);
    if (voiceObject) {
      if (member.voice.channelId === voiceObject.voiceChannelId) {
        voiceObject.connection.destroy();
        VoiceController.delete(guild.id);
        await interaction.reply({ embeds: convertToCode(`Stopped!`) });
      } else {
        await interaction.reply({
          embeds: convertToCode(
            `Playing at ${voiceObject.voiceChannelName}. Join that channel to use this command.`
          ),
        });
      }
    } else {
      await interaction.reply({
        embeds: convertToCode(`Not playing anything`),
      });
    }
  } else {
    await interaction.reply({
      embeds: convertToCode(`You are not a '${Roles.DJ}'.`),
    });
  }
}

export default stop;

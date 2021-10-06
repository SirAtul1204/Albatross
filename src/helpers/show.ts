import { CommandInteraction, Guild } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { VoiceObject } from "../utils/enum";
import { handleError } from "../utils/handleError";

export async function show(
  interaction: CommandInteraction,
  VoiceController: Map<string, VoiceObject>
) {
  try {
    const guild = interaction.guild as Guild;
    const voiceController = VoiceController.get(guild.id);
    if (voiceController) {
      const queue = voiceController.queue;
      if (queue.length >= 1) {
        const all = queue.join("\n");
        await interaction.reply({
          embeds: convertToCode(`Current Queue`, all),
        });
      } else {
        await interaction.reply({ embeds: convertToCode(`Queue is Empty!`) });
      }
    } else {
      await interaction.reply({
        embeds: convertToCode(`Nothing is playing and the queue is empty`),
      });
    }
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default show;

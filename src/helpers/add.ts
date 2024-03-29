import axios from "axios";
import { CommandInteraction, Guild, GuildMember } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { Roles, VoiceObject } from "../utils/enum";
import { handleError } from "../utils/handleError";

// Adds the song to queue
export async function add(
  interaction: CommandInteraction,
  VoiceController: Map<string, VoiceObject>
): Promise<void> {
  try {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const options = interaction.options.getString("search");
    const allOptions = options!.split(" ");
    let videoId: string = "";
    let url = "";
    if (member.roles.cache.some((role) => role.name === Roles.DJ)) {
      const voiceController = VoiceController.get(guild.id);
      if (voiceController) {
        if (voiceController.voiceChannelId === member.voice.channelId) {
          //Youtube Search API
          const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${
            process.env.YOUTUBE_API_KEY
          }&q=${allOptions.join("+")}`;

          const response = await axios.get(searchUrl);
          const data = response.data;
          videoId = data.items[0].id.videoId;
          url = `https://www.youtube.com/watch?v=${videoId}`;

          const titleUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;
          const resp = await axios.get(titleUrl);
          const title = resp.data.items[0].snippet.title;
          voiceController.queue.push(title);
          await interaction.reply({ embeds: convertToCode(`Added to Queue!`) });
        } else {
          await interaction.reply({
            embeds: convertToCode(
              `Playing at ${
                voiceController!.voiceChannelName
              }, join that channel to use this command.`
            ),
          });
        }
      } else {
        await interaction.reply({
          embeds: convertToCode(
            `You are not playing anything first play a song using /play`
          ),
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

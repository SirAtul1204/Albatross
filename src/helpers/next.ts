import {
  createAudioResource,
  StreamType,
  createAudioPlayer,
  NoSubscriberBehavior,
} from "@discordjs/voice";
import axios from "axios";
import { CommandInteraction, Guild, GuildMember } from "discord.js";
import ytdl from "ytdl-core";
import { DetailsModel } from "../db/schema";
import { convertToCode } from "../utils/convertToCode";
import { Roles, VoiceObject } from "../utils/enum";
import { handleError } from "../utils/handleError";
import play from "./play";

export async function next(
  interaction: CommandInteraction,
  VoiceController: Map<string, VoiceObject>
) {
  try {
    const guild = interaction.guild as Guild;
    const voiceController = VoiceController.get(guild.id);
    if (voiceController as VoiceObject) {
      const member = interaction.member as GuildMember;
      if (member.roles.cache.some((role) => role.name === Roles.DJ)) {
        if (member.voice.channelId === voiceController?.voiceChannelId) {
          if (voiceController.queue.length >= 1) {
            const options = voiceController?.queue.shift()!;
            const allOptions = options?.split(" ");
            let videoId;
            let url = "";
            if (allOptions[0] === "link") {
              url = allOptions[1];
              const parsedUrl = new URL(url);
              videoId = String(parsedUrl.searchParams.get("v"));
            } else {
              //Youtube Search API
              const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${
                process.env.YOUTUBE_API_KEY
              }&q=${allOptions.join("+")}`;

              const response = await axios.get(searchUrl);
              const data = response.data;
              videoId = data.items[0].id.videoId;
              url = `https://www.youtube.com/watch?v=${videoId}`;
            }
            const titleUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`;
            const resp = await axios.get(titleUrl);
            const title = resp.data.items[0].snippet.title;
            const img = resp.data.items[0].snippet.thumbnails.high.url;

            const stream = ytdl(url, { filter: "audioonly" });

            const resource = createAudioResource(stream, {
              inputType: StreamType.Arbitrary,
              inlineVolume: true,
            });

            const doc = await DetailsModel.findOne({ guildId: guild.id });
            const vol = doc.volume;

            resource.volume?.setVolume(vol);

            const player = createAudioPlayer({
              behaviors: {
                noSubscriber: NoSubscriberBehavior.Pause,
              },
            });

            player.play(resource);
            if (voiceController) {
              voiceController.connection.subscribe(player);
              voiceController.player = player;
              voiceController.resource = resource;
            }

            await interaction.reply({
              embeds: convertToCode(
                title,
                `Enjoy your song at ${voiceController?.voiceChannelName}`,
                img
              ),
            });
          } else {
            await interaction.reply({
              embeds: convertToCode(
                `Queue is empty use /add command to add a song to queue`
              ),
            });
          }
        } else {
          await interaction.reply({
            embeds: convertToCode(
              `Playing at ${voiceController?.voiceChannelName} join that channel to use this command.`
            ),
          });
        }
      } else {
        await interaction.reply({
          embeds: convertToCode(`You are not a '${Roles.DJ}'`),
        });
      }
    } else {
      play(interaction, VoiceController);
    }
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default next;

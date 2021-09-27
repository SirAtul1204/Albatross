import {
  CommandInteraction,
  Guild,
  GuildMember,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  StreamType,
  AudioPlayer,
  VoiceConnection,
} from "@discordjs/voice";
import ytdl from "ytdl-core";
import axios from "axios";
import { handleError } from "../utils/handleError";
import { convertToCode } from "../utils/convertToCode";
import { Roles, VoiceObject } from "../utils/enum";

export async function play(
  interaction: CommandInteraction,
  VoiceController: Map<string, VoiceObject>
) {
  try {
    const guild = interaction.guild as Guild;
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel as VoiceChannel;
    const options = interaction.options.getString("search");
    let videoId: string = "";
    if (options) {
      const allOptions = options.split(" ");
      if (member.roles.cache.some((role) => role.name === Roles.DJ)) {
        if (
          !VoiceController.get(guild.id)?.voiceChannelName ||
          member.voice.channelId ===
            VoiceController.get(guild.id)?.voiceChannelId
        ) {
          const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
          });
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
          });

          const player = createAudioPlayer({
            behaviors: {
              noSubscriber: NoSubscriberBehavior.Pause,
            },
          });

          player.play(resource);

          connection.subscribe(player);

          VoiceController.set(guild.id, {
            connection: connection,
            player: player,
            queue: new Array(),
            voiceChannelId: voiceChannel.id,
            voiceChannelName: voiceChannel.name,
          });
          await interaction.reply({
            embeds: convertToCode(
              title,
              `Enjoy your song at ${voiceChannel.name}`,
              img
            ),
          });
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
          embeds: convertToCode(`You are not a ${Roles.DJ}`),
        });
      }
    } else {
      await interaction.reply({
        embeds: convertToCode(`No search term was given`),
      });
    }
  } catch (e) {
    // console.error(e);
    handleError(interaction.guild as Guild, e);
  }
}

export default play;

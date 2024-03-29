// Import modules and packages
import { config } from "dotenv";
import { connect } from "mongoose";
import {
  Client,
  Guild,
  GuildChannel,
  GuildMember,
  Intents,
  MessagePayload,
} from "discord.js";
import {
  ADD,
  ANNOUNCE,
  CLEAR,
  CREATE_CHANNEL,
  CREATE_ROLE,
  DEMOTE,
  GIF,
  KICK,
  LEAVE,
  MEME,
  NEXT,
  PAUSE,
  PING,
  PLAY,
  PROMOTE,
  RESUME,
  SHOW,
  START_ROLE_ASSIGNER,
  STOP,
  UPDATE,
  VOLUME,
} from "./utils/commands";
import { convertToCode } from "./utils/convertToCode";
import ping from "./helpers/ping";
import kick from "./helpers/kick";
import joinedGuild from "./helpers/joinedGuild";
import announcementChannelDelete from "./helpers/announcementChannelDelete";
// import deletedGuild from "./helpers/deletedGuild";
import update from "./helpers/update";
import leave from "./helpers/leave";
import promote from "./helpers/promote";
import demote from "./helpers/demote";
import play from "./helpers/play";
import pause from "./helpers/pause";
import stop from "./helpers/stop";
import resume from "./helpers/resume";
import { VoiceObject } from "./utils/enum";
import volume from "./helpers/volume";
import add from "./helpers/add";
import clear from "./helpers/clear";
import next from "./helpers/next";
import gif from "./helpers/gif";
import meme from "./helpers/meme";
import show from "./helpers/show";
import { announce } from "./helpers/announce";
import { createChannel } from "./helpers/createChannel";
import { createRole } from "./helpers/createRole";
import { startRoleAssigner } from "./helpers/startRoleAssigner";
import axios from "axios";
config();

// Connecting MONGO_DB
connect(String(process.env.MONGODB_URI), () => {
  console.log("Connected to MongoDB");
});

// the object which stores information like currently playing sound, and resources related to it such as
// audio player, audio resource
export const VoiceController: Map<string, VoiceObject> = new Map();

// Connecting to client
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.once("ready", () => {
  console.log("Ready!⚡");
});

client.on("guildCreate", async (guild: Guild) => {
  joinedGuild(guild);
});

//Listening for interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  switch (commandName) {
    case PING:
      await ping(interaction, client);
      break;
    case KICK:
      await kick(interaction, client);
      break;
    case UPDATE:
      await update(interaction);
      break;
    case LEAVE:
      await leave(interaction);
      break;
    case PROMOTE:
      await promote(interaction);
      break;
    case DEMOTE:
      await demote(interaction);
      break;
    case PLAY:
      await play(interaction, VoiceController);
      break;
    case PAUSE:
      await pause(interaction, VoiceController);
      break;
    case RESUME:
      await resume(interaction, VoiceController);
      break;
    case STOP:
      await stop(interaction, VoiceController);
      break;
    case VOLUME:
      await volume(interaction, VoiceController);
      break;
    case ADD:
      await add(interaction, VoiceController);
      break;
    case CLEAR:
      await clear(interaction, VoiceController);
      break;
    case NEXT:
      await next(interaction, VoiceController);
      break;
    case GIF:
      await gif(interaction);
      break;
    case MEME:
      await meme(interaction);
      break;
    case SHOW:
      await show(interaction, VoiceController);
      break;
    case ANNOUNCE:
      await announce(interaction);
      break;
    case CREATE_CHANNEL:
      await createChannel(interaction);
      break;
    case CREATE_ROLE:
      await createRole(interaction);
      break;
    case START_ROLE_ASSIGNER:
      await startRoleAssigner(interaction);
      break;
    default:
      await interaction.reply({ embeds: convertToCode("Wrong Command") });
      break;
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  const { customId, member } = interaction;
  const options = customId.split("/");
  if (options[0] === "role") {
    const roles = await interaction.guild?.roles.fetch();
    const requiredRole = roles?.find((role) => role.name === options[1]);
    (member as GuildMember).roles.add(requiredRole!);
    await interaction.reply({
      embeds: convertToCode(
        `${(member as GuildMember).displayName} have been assigned the role ${
          options[1]
        }`
      ),
      ephemeral: true,
    });
  }
});

client.on("messageCreate", async (message) => {
  const response = await axios.post("http://localhost:5000/predictText", {
    text: message.content,
  });

  if (response.data.prediction == "1") {
    await message.reply({
      embeds: convertToCode(
        `Message of @${message.author.username} is deleted because of profanity`
      ),
    });
    message.delete();
  }

  message.attachments.forEach(async (attachment, key) => {
    if (attachment.contentType?.split("/")[0] == "image") {
      const response = await axios.post("http://localhost:5000/predictImage", {
        url: attachment.proxyURL,
      });

      if (response.data.prediction == "1") {
        await message.reply({
          embeds: convertToCode(
            `Message of @${message.author.username} is deleted because of profanity`
          ),
        });
        message.delete();
      }
    }
  });
});

client.on("channelDelete", async (channel) => {
  await announcementChannelDelete(channel as GuildChannel);
});

// client.on("guildDelete", (guild) => {
//   deletedGuild(guild);
// });

client.on("error", (error) => {
  console.error(error);
});

client.login(process.env.TOKEN);

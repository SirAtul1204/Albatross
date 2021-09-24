import { config } from "dotenv";
import { Client, Guild, GuildChannel, Intents } from "discord.js";
import { KICK, PING } from "./utils/commands";
import ping from "./helpers/ping";
import kick from "./helpers/kick";
import joinedGuild from "./helpers/joinedGuild";
import { announcementChannelDelete } from "./helpers/announcementChannelDelete";
config();

const client = new Client({ intents: Intents.FLAGS.GUILDS });
client.once("ready", () => {
  console.log("Ready!⚡");
});

client.on("guildCreate", async (guild: Guild) => {
  joinedGuild(guild);
});

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
    default:
      interaction.reply("Wrong Command");
      break;
  }
});

client.on("channelDelete", async (channel) => {
  await announcementChannelDelete(channel as GuildChannel);
});

client.login(process.env.TOKEN);

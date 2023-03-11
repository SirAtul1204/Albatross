import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
require("dotenv").config();
import {
  PING,
  KICK,
  UPDATE,
  LEAVE,
  PROMOTE,
  DEMOTE,
  PLAY,
  PAUSE,
  RESUME,
  STOP,
  VOLUME,
  ADD,
  CLEAR,
  NEXT,
  GIF,
  MEME,
  SHOW,
  ANNOUNCE,
  CREATE_CHANNEL,
  CREATE_ROLE,
  START_ROLE_ASSIGNER,
} from "./commands";

export function registerCommands(GUILD_ID: string) {
  const commands = [
    new SlashCommandBuilder()
      .setName(PING)
      .setDescription("Replies with pong!"),
    new SlashCommandBuilder()
      .setName(KICK)
      .setDescription("Kicks a user")
      .addUserOption((option) => {
        return option
          .setName("user")
          .setDescription("username")
          .setRequired(true);
      })
      .addStringOption((option) => {
        return option
          .setName("reason")
          .setDescription("Reason for being kicked");
      }),
    new SlashCommandBuilder()
      .setName(UPDATE)
      .setDescription("Update Albatross"),

    new SlashCommandBuilder()
      .setName(LEAVE)
      .setDescription(
        "Make Albatross leave the server, deleting all announcement channel and roles created by the bot"
      ),

    new SlashCommandBuilder()
      .setName(PROMOTE)
      .setDescription("Promote a user to a Role")
      .addUserOption((option) => {
        return option
          .setName("user")
          .setDescription("User you want to promote")
          .setRequired(true);
      })
      .addRoleOption((option) => {
        return option
          .setName("role")
          .setDescription("the role you want to assign")
          .setRequired(true);
      }),

    new SlashCommandBuilder()
      .setName(DEMOTE)
      .setDescription("Demote a user from a Role")
      .addUserOption((option) => {
        return option
          .setName("user")
          .setDescription("User you want to demote")
          .setRequired(true);
      })
      .addRoleOption((option) => {
        return option
          .setName("role")
          .setDescription("The role you want to take away from the user.")
          .setRequired(true);
      }),
    new SlashCommandBuilder()
      .setName(PLAY)
      .setDescription("Play a song")
      .addStringOption((option) => {
        return option
          .setName("search")
          .setDescription("Search keyword or link for song")
          .setRequired(true);
      }),
    new SlashCommandBuilder().setName(PAUSE).setDescription("Pause Song"),
    new SlashCommandBuilder().setName(RESUME).setDescription("Resume a song"),
    new SlashCommandBuilder()
      .setName(STOP)
      .setDescription(
        "Stops the song and make Albatross leave the voice channel"
      ),
    new SlashCommandBuilder()
      .setName(VOLUME)
      .setDescription("Set Bot Volume (0-2) default is 1")
      .addNumberOption((option) => {
        return option
          .setName("value")
          .setDescription(
            "Return the current volume or pass a value to change volume to that value"
          );
      }),
    new SlashCommandBuilder()
      .setName(ADD)
      .setDescription("Add a song to queue, use /next to switch to next song.")
      .addStringOption((option) => {
        return option
          .setName("search")
          .setDescription("Search keyword or link for song")
          .setRequired(true);
      }),
    new SlashCommandBuilder().setName(CLEAR).setDescription("Clears the queue"),
    new SlashCommandBuilder()
      .setName(NEXT)
      .setDescription("Play next song in queue"),
    new SlashCommandBuilder()
      .setName(GIF)
      .setDescription("Get a gif based on your search words")
      .addStringOption((option) => {
        return option
          .setName("search")
          .setDescription("search keywords")
          .setRequired(true);
      }),
    new SlashCommandBuilder()
      .setName(MEME)
      .setDescription("Get a meme from famous memes subreddit"),
    new SlashCommandBuilder()
      .setName(SHOW)
      .setDescription("Shows current queue"),
    new SlashCommandBuilder()
      .setName(ANNOUNCE)
      .setDescription("Make an announcement")
      .addStringOption((option) =>
        option
          .setName("title")
          .setDescription("Title of your announcement")
          .setRequired(true)
      )
      .addStringOption((option) => {
        return option
          .setName("message")
          .setDescription("Message of your announcement")
          .setRequired(true);
      }),
    new SlashCommandBuilder()
      .setName(CREATE_CHANNEL)
      .setDescription("Create a new channel")
      .addStringOption((option) =>
        option
          .setName("type")
          .setDescription("text | voice")
          .addChoices([
            ["TEXT", "text"],
            ["VOICE", "voice"],
          ])
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("Name of the channel")
          .setRequired(true)
      ),
    new SlashCommandBuilder()
      .setName(CREATE_ROLE)
      .setDescription("Create a role")
      .addStringOption((option) =>
        option
          .setName("name")
          .setDescription("Name of the role")
          .setRequired(true)
      ),
    new SlashCommandBuilder()
      .setName(START_ROLE_ASSIGNER)
      .setDescription("Starts a roles assigner")
      .addRoleOption((role) =>
        role
          .setName("role")
          .setDescription("The role you want the assigner to be for")
          .setRequired(true)
      ),
  ].map((command) => command.toJSON());

  const rest = new REST({ version: "9" }).setToken(String(process.env.TOKEN));

  rest
    .put(
      Routes.applicationGuildCommands(String(process.env.CLIENT_ID), GUILD_ID),
      {
        body: commands,
      }
    )
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error);
}

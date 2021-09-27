import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Permissions } from "discord.js";
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
} from "./commands";

export function registerCommands(GUILD_ID: string) {
  const commands = [
    new SlashCommandBuilder()
      .setName(PING)
      .setDescription("Replies with pong!"),
    new SlashCommandBuilder()
      .setName("server")
      .setDescription("Replies with server info!"),
    new SlashCommandBuilder()
      .setName("user")
      .setDescription("Replies with user info!"),
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

import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
require("dotenv").config();
import { PING, KICK } from "./commands";

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

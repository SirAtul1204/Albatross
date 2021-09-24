import { Client, CommandInteraction } from "discord.js";
import { convertToCode } from "../utils/convertToCode";

export async function ping(interaction: CommandInteraction, client: Client) {
  try {
    //Latency
    await interaction.reply(convertToCode(`Pong! ${client.ws.ping}ms`));
  } catch (e) {
    await interaction.reply(convertToCode("Oops! Looks like you found a bug."));
    console.log("Some Error", e);
  }
}
export default ping;

import { Client, CommandInteraction, Guild } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { handleError } from "../utils/handleError";

export async function ping(interaction: CommandInteraction, client: Client) {
  try {
    //Latency
    await interaction.reply({
      embeds: convertToCode(`Pong! ${client.ws.ping}ms 👋`),
    });
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}
export default ping;

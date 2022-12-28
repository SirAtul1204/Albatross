import axios from "axios";
import { CommandInteraction, Guild } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { handleError } from "../utils/handleError";

const memesSubReddits = [
  "IndianMeyMeys",
  "meme",
  "indiameme",
  "IndianDankMemes",
  "dankmemes",
];

// Randomly sends a meme from popular reddit meme subreddit
export async function meme(interaction: CommandInteraction): Promise<void> {
  try {
    let url = "https://meme-api.com/gimme/";
    const subReddit =
      memesSubReddits[Math.floor(Math.random() * memesSubReddits.length)];
    url += subReddit;
    let response = await axios.get(url);
    let data = response.data;
    await interaction.reply({
      embeds: convertToCode(`${data.title}`, `${data.author}`, data.url),
    });
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default meme;

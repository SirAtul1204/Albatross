import axios from "axios";
import { CommandInteraction, Guild } from "discord.js";
import { convertToCode } from "../utils/convertToCode";
import { handleError } from "../utils/handleError";

let GIF_LIMIT = 3;

export async function gif(interaction: CommandInteraction) {
  try {
    const search = interaction.options.getString("search");
    if (search) {
      const searchTerms = search?.split(" ");
      let url = "https://g.tenor.com/v1/search?q=";
      if (searchTerms.length > 0) {
        url += searchTerms.join("+");
      } else {
        GIF_LIMIT = 40;
        url += "random";
      }
      url +=
        "&key=" + process.env.TENOR_GIF_KEY + "&limit=" + String(GIF_LIMIT);
      const data = await axios.get(url);
      let randomIndex = Math.floor(Math.random() * GIF_LIMIT);
      const gif = data.data.results[randomIndex];

      await interaction.reply({
        embeds: convertToCode(
          gif.h1_title,
          undefined,
          gif.media[0].mediumgif.url
        ),
      });
    }
  } catch (e) {
    handleError(interaction.guild as Guild, e);
  }
}

export default gif;

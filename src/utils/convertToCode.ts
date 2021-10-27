import { MessageEmbed } from "discord.js";

// Updates the simple text to a embed message
export function convertToCode(
  title: string,
  description?: string,
  img?: string
): MessageEmbed[] {
  const embed = new MessageEmbed().setColor("#0099ff").setTitle(title);
  if (description) embed.setDescription(description);
  if (img) embed.setImage(img);

  return [embed];
}

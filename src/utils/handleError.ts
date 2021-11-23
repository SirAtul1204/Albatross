import { Guild } from "discord.js";
import { convertToCode } from "./convertToCode";
import { Errors } from "./enum";

export async function handleError(guild: Guild, e: any) {
  const owner = await guild.fetchOwner();
  if (owner) {
    const dm = await owner.createDM();
    if (dm) {
      console.log(e);
      switch (e) {
        case Errors.announcementChannelCantBeCreated:
          dm.send({
            embeds: convertToCode(Errors.announcementChannelCantBeCreated),
          });
          break;
        case Errors.announcementChannelNotFound:
          dm.send({
            embeds: convertToCode(Errors.announcementChannelNotFound),
          });
          break;
        case Errors.directMessageCantBeCreated:
          dm.send({ embeds: convertToCode(Errors.directMessageCantBeCreated) });
          break;
        case Errors.djRoleNotFound:
          dm.send({ embeds: convertToCode(Errors.djRoleNotFound) });
          break;
        case Errors.guildOwnerNotFound:
          dm.send({ embeds: convertToCode(Errors.guildOwnerNotFound) });
          break;
        case Errors.managerRoleNotFound:
          dm.send({ embeds: convertToCode(Errors.managerRoleNotFound) });
          break;
        case Errors.roleManagerCantBeCreated:
          dm.send({ embeds: convertToCode(Errors.roleManagerCantBeCreated) });
          break;
        case Errors.roleNotFound:
          dm.send({ embeds: convertToCode(Errors.roleNotFound) });
          break;
        default:
          dm.send({
            embeds: convertToCode(
              "Oops! looks like you found a bug, Please contact developer"
            ),
          });
      }
    }
  }
}

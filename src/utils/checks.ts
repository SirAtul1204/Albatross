import { GuildMember } from "discord.js";
import { Roles } from "./enum";

export function checkManager(member: GuildMember) {
  const isManager = member.roles.cache.some(
    (role) => role.name === Roles.Managers
  );
  return isManager;
}

export function checkDj(member: GuildMember) {
  const isDj = member.roles.cache.some((role) => role.name === Roles.DJ);

  return isDj;
}

import { AudioPlayer, AudioResource, VoiceConnection } from "@discordjs/voice";

export enum Errors {
  announcementChannelCantBeCreated = "Announcement Channel can't be created",
  roleManagerCantBeCreated = "Role Manger couldn't be created",
  announcementChannelNotFound = "Announcement Channel Not Found!",
  directMessageCantBeCreated = "Direct Message can't be created",
  guildOwnerNotFound = "Guild Owner Couldn't be found",
  managerRoleNotFound = "Manager Role Can't be found",
  djRoleNotFound = "DJ Role Can't be found",
  userNotFound = "Invalid User",
  roleNotFound = "Invalid Role",
  audioPlayerNotFound = "No AudioPlayer Found, are you really playing?",
  missingArgument = "Argument is required",
}

export enum Roles {
  Managers = "Manager",
  DJ = "DJ",
}

export const ANNOUNCEMENT_CHANNEL_NAME = "albatross-announcement".toLowerCase();

export interface VoiceObject {
  connection: VoiceConnection;
  player: AudioPlayer;
  voiceChannelId: string;
  voiceChannelName: string;
  queue: string[];
  resource: AudioResource;
}

import { VoiceObject } from "../utils/enum";
export async function playNext(
  guildId: string,
  VoiceController: Map<string, VoiceObject>
) {
  const voiceController = VoiceController.get(guildId);
  if (voiceController) {
    const search = voiceController.queue.shift();
    if (!search) {
    }
  }
}

export default playNext;

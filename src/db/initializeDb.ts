import { DetailsModel } from "./schema";

export async function initializeDb(guildId: string) {
  const doc = await DetailsModel.findOne({ guildId: guildId });
  // console.log(doc);
  if (!doc) {
    const instance = new DetailsModel({
      guildId: guildId,
      volume: 1.0,
    });
    await instance.save();
    console.log("New entry in MongoDB 📝");
  } else {
    console.log("Document already exist ✅");
  }
}

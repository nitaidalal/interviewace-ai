import { deepgram } from "../config/deepgram.js";
import ApiError from "../utils/ApiError.js";

const speechService = {
  async transcribe(file) {
    if (!file) throw new ApiError(400, "No audio file provided");

    try {
      const response = await deepgram.listen.v1.media.transcribeFile(
        file.buffer,
        {
          model: "nova-3",
          language: "en",
          smart_format: true,
          keyterm:["react","nodejs","javascript","typescript","python","java","c++","c#","ruby","php","go","frontend","backend","fullstack","devops","cloud","aws","docker","kubernetes","microservices","rest api","sql","nosql"],
        },
      );

      const transcript =
        response.results?.channels?.[0]?.alternatives?.[0]?.transcript;
      return (transcript ?? "").trim();
    } catch {
      throw new ApiError(
        503,
        "Speech recognition is unavailable right now. Please type your answer.",
      );
    }
  },
};

export default speechService;

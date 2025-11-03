import { InferenceClient } from "@huggingface/inference";
const client = new InferenceClient(process.env.HF_TOKEN);
const convertAudio = async ({ text }) => {
  try {
    const audioBlob = await client.textToSpeech({
      provider: "fal-ai",
      model: "hexgrad/Kokoro-82M",
      inputs: text,
    });
    const audioBuffer = await audioBlob.arrayBuffer();
    return audioBuffer;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to generate completion"
    );
  }
};
export default convertAudio;

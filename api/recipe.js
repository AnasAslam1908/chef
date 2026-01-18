// api/recipe.js - NEW FILE
import { HfInference } from "@huggingface/inference";

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { ingredients } = req.body;

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Please provide an array of ingredients" });
    }

    // Your original AI logic goes here
    const hf = new HfInference(process.env.VITE_HUGGINGFACEHUB_API_TOKEN);
    const ingredientsString = ingredients.join(", ");

    const SYSTEM_PROMPT = `You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in MARKDOWN to make it easier to render to a web page`;

    const response = await hf.chatCompletion({
      model: "meta-llama/Llama-3.2-3B-Instruct",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
        },
      ],
      max_tokens: 1024,
    });

    const recipe = response.choices[0].message.content;
    res.status(200).json({ recipe });
  } catch (error) {
    console.error("Hugging Face API error:", error);
    res.status(500).json({
      error: "Failed to generate recipe",
      details: error.message,
    });
  }
}

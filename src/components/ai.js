// src/ai.js - UPDATED VERSION (frontend only)
export async function getRecipeFromMistral(ingredientsArr) {
  try {
    // Determine API URL based on environment
    const API_URL = import.meta.env.PROD
      ? "/api/recipe" // Same origin in production
      : "http://localhost:3000/api/recipe"; // Local dev

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients: ingredientsArr }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.recipe;
  } catch (err) {
    console.error("Recipe generation failed:", err.message);
    return `# Recipe Generation Failed\n\nSorry, I couldn't generate a recipe right now. Error: ${err.message}`;
  }
}

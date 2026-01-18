export async function getRecipeFromMistral(ingredientsArr) {
  try {
    const API_URL = import.meta.env.PROD
      ? "/api/recipe" 
      : "http://localhost:3000/api/recipe"; 

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

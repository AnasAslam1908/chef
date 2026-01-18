import { useState, useRef,useEffect } from "react";
import ClaudeRecipe from "./ClaudeRecipe";
import IngredientsList from "./IngredientsList";
import { getRecipeFromMistral } from "./ai";

export default function Main() {
    const [ingredients, setIngredients] = useState([
      "all the main spices",
      "pasta",
      "ground beef",
      "tomato paste",
    ]);
    const [recipe, setRecipe] = useState("");
    const recipeSection = useRef(null);

    useEffect(() => {
      if (recipe !== "" && recipeSection.current !== null) {
        recipeSection.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [recipe]);

     async function getRecipe() {
       const recipeMarkdown = await getRecipeFromMistral(ingredients);
        setRecipe(recipeMarkdown);
     
      }
    

   function addIngredient(formData) {
     const newIngredient = formData.get("ingredient");
     setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
   } 
  return (
    <main>
      <form action={addIngredient} className="ingredient-form">
        <input
          placeholder="e.g. oregano"
          aria-label="Add ingredient"
          name="ingredient"
        />
        <button>Add ingredient</button>
      </form>
      {ingredients.length > 0 && (
        <IngredientsList
          ref={recipeSection}
          ingredients={ingredients}
          getRecipe={getRecipe}
        />
      )}
      {recipe && <ClaudeRecipe recipe={recipe} />}
    </main>
  );
}

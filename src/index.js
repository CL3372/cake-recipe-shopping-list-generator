function displayRecipe(response) {
  new Typewriter("#recipe", {
    strings: response.data.answer,
    autoStart: true,
    delay: 1.5,
    cursor: "",
  });
}

function generateRecipe(event) {
  event.preventDefault();

  let instructionsInput = document.querySelector("#user-instructions");

  let apiKey = "aa9340df384978aa7t1a53a8fabcc2o1";
  let prompt = `User instructions: generate a cake recipe ${instructionsInput.value}`;
  let context =
    "You are a Pastry Chef and love baking cakes. Your mission is to write a recipe in basic HTML  make sure to follow instructions below, sign the recipe 'CARLA LOURO 😊' inside a <strong> element at the end of the recipe";
  let apiUrl = `https://api.shecodes.io/ai/v1/generate?prompt=${prompt}&context=${context}&key=${apiKey}`;

  let recipeElement = document.querySelector("#recipe");
  recipeElement.classList.remove("hidden");
  recipeElement.innerHTML = `<div class="generating"> ⏳Generating Recipe...⌛${instructionsInput.value}</div>`;

  console.log("Generating recipe");
  console.log(`Pormpt: ${prompt}`);
  console.log(`Context: ${context}`);

  axios.get(apiUrl).then(displayRecipe);
}

let recipeElement = document.querySelector("#recipe");

let recipeFormElement = document.querySelector("#recipe-generator-form");
recipeFormElement.addEventListener("submit", generateRecipe);

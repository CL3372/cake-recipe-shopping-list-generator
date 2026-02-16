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

function displayRecipe(response) {
  let recipeElement = document.querySelector("#recipe");
  recipeElement.innerHTML = response.data.answer;

  initShoppingList();
}

recipeFormElement.addEventListener("submit", generateRecipe);

const SHOP_KEY = "shopping_list_v1";

// Generate unique ID
function uid() {
  return Date.now().toString();
}

function loadShopping() {
  try {
    return JSON.parse(localStorage.getItem(SHOP_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveShopping(items) {
  localStorage.setItem(SHOP_KEY, JSON.stringify(items));
}

function initShoppingList() {
  const container = document.querySelector("#shopping-list");
  if (!container) return;

  if (container.dataset.ready === "true") {
    renderShopping(loadShopping());
    return;
  }

  container.innerHTML = `
    <h2>Shopping List</h2>

    <form id="shopping-form">
      <input
        id="shopping-input"
        type="text"
        placeholder="Add ingredient..."
        autocomplete="off"
      />
      <button type="submit">Add</button>
      <button type="button" id="clear-shopping">Clear</button>
    </form>

    <ul id="shopping-items"></ul>
  `;

  container.dataset.ready = "true";

  const form = document.querySelector("#shopping-form");
  const input = document.querySelector("#shopping-input");
  const clearBtn = document.querySelector("#clear-shopping");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = input.value.trim();
    if (!value) return;

    let items = loadShopping();
    items.unshift({
      id: uid(),
      text: value,
      done: false,
    });

    saveShopping(items);
    renderShopping(items);

    input.value = "";
  });

  clearBtn.addEventListener("click", function () {
    saveShopping([]);
    renderShopping([]);
  });

  renderShopping(loadShopping());
}

function renderShopping(items) {
  const ul = document.querySelector("#shopping-items");
  if (!ul) return;

  ul.innerHTML = "";

  items.forEach(function (item) {
    const li = document.createElement("li");
    if (item.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;

    checkbox.addEventListener("change", function () {
      let updated = loadShopping().map(function (x) {
        if (x.id === item.id) {
          x.done = !x.done;
        }
        return x;
      });
      saveShopping(updated);
      renderShopping(updated);
    });

    const span = document.createElement("span");
    span.textContent = item.text;

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.classList.add("shopping-delete");

    del.addEventListener("click", function () {
      let updated = loadShopping().filter(function (x) {
        return x.id !== item.id;
      });
      saveShopping(updated);
      renderShopping(updated);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(del);

    ul.appendChild(li);
  });
}

// Show shopping list immediately when page loads
document.addEventListener("DOMContentLoaded", function () {
  initShoppingList();
});

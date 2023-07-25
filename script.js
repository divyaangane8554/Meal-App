// Initialize an empty array to store favorite meals
let favorites = [];

// Get elements id
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResults = document.getElementById("search-results");
const favButton = document.getElementById("fav");
const homeButton = document.getElementById("home");
const resetButton = document.getElementById("reset");
// functions fetching from api
function searchMeals() {
  const searchQuery = searchInput.value;

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals === null) {
        displayErrorMessage("No meals found for your search.");
      } else {
        displaySearchResults(data.meals);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

// Function to display meal items on screen
function displaySearchResults(meals) {
  searchResults.innerHTML = "";

  meals.forEach((meal) => {
    const mealElement = createMealElement(meal, false);
    searchResults.appendChild(mealElement);
  });
}

// Function to display an error message
function displayErrorMessage(message) {
  searchResults.innerHTML = "";
  const errorMessage = document.createElement("p");
  errorMessage.innerText = message;
  searchResults.appendChild(errorMessage);
}


function createMealElement(meal, isFavorite) {
  const mealElement = document.createElement("div");
  mealElement.classList.add("meal");

  const mealImage = document.createElement("img");
  mealImage.src = meal.strMealThumb;
  mealImage.alt = meal.strMeal;
  mealElement.appendChild(mealImage);

  const mealName = document.createElement("h2");
  mealName.innerText = meal.strMeal;
  mealName.classList.add("meal-name");
  mealElement.appendChild(mealName);


  const mealIngredients = document.createElement("ul");
  mealIngredients.classList.add("ingredients"); // Add a class for styling, and to hide it by default
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      const ingredient = document.createElement("li");
      ingredient.innerText = `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`;
      mealIngredients.appendChild(ingredient);
    } else {
      break;
    }
  }
  mealElement.appendChild(mealIngredients);

  const mealDescription = document.createElement("p");
  mealDescription.classList.add("description");
  mealDescription.innerText = meal.strInstructions;
  mealElement.appendChild(mealDescription);

  const readMoreButton = document.createElement("button");
  readMoreButton.innerHTML = "Read More";
  readMoreButton.addEventListener("click", () => {
    mealDescription.classList.toggle("show");
    mealIngredients.classList.toggle("show"); // Toggle the visibility of ingredients
    toggleButtonText();
  });
  mealElement.appendChild(readMoreButton);

  const favoriteButton = document.createElement("button");
  favoriteButton.innerHTML = isFavorite
    ? '<i class="fas fa-heart"></i> Remove from Favorites'
    : '<i class="fas fa-heart"></i> Add to Favorites';
  favoriteButton.addEventListener("click", () => {
    toggleFavorite(meal);
  });
  mealElement.appendChild(favoriteButton);

  return mealElement;
}


function toggleButtonText() {
  const mealDescription = document.querySelector(".description");
  const mealIngredients = document.querySelector(".ingredients");
  const computedDescHeight = window.getComputedStyle(mealDescription).maxHeight;
  const computedIngredientsHeight = window.getComputedStyle(mealIngredients).maxHeight;
  const maxHeight = "500px"; // The max-height value set in the CSS

  const isShowingFullContent = computedDescHeight === maxHeight && computedIngredientsHeight === maxHeight;

  const readMoreButton = document.querySelector(".meal button");
  readMoreButton.innerHTML = isShowingFullContent ? "Show More" : "Read Less";
}



// Function to toggle favorite status of a meal
function toggleFavorite(meal) {
  const mealIndex = favorites.findIndex((fav) => fav.idMeal === meal.idMeal);
  if (mealIndex !== -1) {
    favorites.splice(mealIndex, 1);
    searchMeals();
    alert(`${meal.strMeal} has been removed from your favorites.`);
  } else {
    favorites.push(meal);
    alert(`${meal.strMeal} has been added to your favorites.`);
  }
}

// Function to show favorite meals
function showFavorites() {
  searchResults.innerHTML = "";

  if (favorites.length === 0) {
    displayErrorMessage("Oops! Favorite List Is empty");
  } else {
    favorites.forEach((meal) => {
      const mealElement = createMealElement(meal, true);
      searchResults.appendChild(mealElement);
    });
  }
}

// Event listeners
searchButton.addEventListener("click", searchMeals);
favButton.addEventListener("click", showFavorites);
homeButton.addEventListener("click", function () {
  searchResults.innerHTML = "";
});

resetButton.addEventListener("click", function () {
  // Clear the search results
  searchResults.innerHTML = "";

  // Clear the favorite list
  favorites = [];

  // Clear the search history by resetting the input value
  searchInput.value = "";
});

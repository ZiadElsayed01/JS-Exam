$(document).ready(function () {
  searchByName("").then(function () {
    $(".main-loading").fadeOut(500);
  });
});

// NavMenu
function openNavMenu() {
  $(".nav-menu").animate({ left: 0 }, 500);
  $(".toggle-icon").removeClass("fa-align-justify");
  $(".toggle-icon").addClass("fa-x");
  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
}
function closeNavMenu() {
  $(".nav-menu").animate({ left: -$(".nav-content").outerWidth() }, 500);
  $(".toggle-icon").removeClass("fa-x");
  $(".toggle-icon").addClass("fa-align-justify");
  $(".links li").animate(
    {
      top: 300,
    },
    500
  );
}
closeNavMenu();
$(".toggle-icon").on("click", function () {
  if ($(".nav-menu").css("left") == "0px") {
    closeNavMenu();
  } else {
    openNavMenu();
  }
});

// Dispaly Meals
function display(data) {
  let cartona = "";
  for (let i = 0; i < data.length; i++) {
    cartona += `
    <div
      class="xl:w-3/12 lg:w-4/12 max-sm:w-full group cursor-pointer p-3" onclick="getDetails(${data[i].idMeal})">
      <div class="image w-full relative overflow-hidden rounded-xl">
        <img class="w-full" src="${data[i].strMealThumb}" alt="" />
        <div
        class="layer transition-all duration-500 group-hover:bottom-0 bg-white absolute -bottom-full w-full h-full opacity-70 text-black font-bold flex items-center p-4"
      >
        <h1 class="font-medium text-4xl">${data[i].strMeal}</h1>
        </div>
      </div>
    </div>
    `;
  }
  $("#container").html(cartona);
}

async function getDetails(meal) {
  $("#container").html("");
  $("#loading").fadeIn(300);
  $("#search-container").html("");

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal}`
  );
  let data = await response.json();

  displayDetails(data.meals[0]);
  $("#loading").fadeOut(300);
}

function displayDetails(data) {
  $("#search-container").html("");

  let cartona = "";
  let ingredients = "";
  let tagContainer = "";

  let tags = [];
  if (data.strTags) {
    tags = data.strTags.split(",");
  }

  for (let i = 0; i < tags.length; i++) {
    tagContainer += `
    <li class="bg-red-200 p-2 inline-block rounded-lg mr-1 text-red-600">${tags[i]}</li>
    `;
  }

  for (let i = 1; i <= 20; i++) {
    if (data[`strIngredient${i}`]) {
      ingredients += `
      <li class="bg-blue-400 p-2 inline-block rounded-lg mr-2 my-2">
      ${data[`strMeasure${i}`]} ${data[`strIngredient${i}`]}
      </li>
      `;
    }
  }
  cartona = `
    <div class="xl:w-1/3 lg:w-1/3 sm:w-full p-2 text-white ">
      <div class="image w-full overflow-hidden rounded-xl">
        <img class="w-full" src="${data.strMealThumb}" alt="" />
        </div>
        <h1 class="font-medium text-4xl mt-1">${data.strMeal}</h1>
    </div>
    <div class="xl:w-2/3 lg:w-2/3 sm:w-full text-white">
      <div class="content px-4">
        <h2 class="font-medium text-3xl">Instructions</h2>
        <p class="my-3 text-justify">
          ${data.strInstructions}
        </p>
        <h3 class="font-bold text-3xl my-3">Area : ${data.strArea}</h3>
        <h3 class="font-bold text-3xl my-3">Category : ${data.strCategory}</h3>
        <h3 class="font-bold text-3xl my-3">Recipes :</h3>
        <ul>
          ${ingredients}
        </ul>
        <h3 class="font-bold text-3xl mt-3">Tags :</h3>
        <ul class="list-none flex gap-3 flex-wrap mt-5">
          ${tagContainer}
        </ul>
        <div class="links mt-5">
          <a
            target="_blank"
            href="${data.strSource}"
            class="bg-emerald-400 p-2 inline-block rounded-lg mr-1"
            >Source</a
          >
          <a
            target="_blank"
            href="${data.strYoutube}"
            class="bg-red-400 p-2 inline-block rounded-lg"
            >Youtube</a
          >
        </div>
      </div>
    </div>
    `;
  $("#container").html(cartona);
}
// Search Section
function showSearchInputs() {
  $("#loading").fadeIn(200);
  $("#search-container").html(
    `
    <div class="w-1/2 max-sm:w-full p-5 mx-auto">
      <input
      class="text-white w-full bg-transparent border outline-0 p-2 rounded-md"
      type="text"
      placeholder="Search By Name"
      id="nameInput"
      />
    </div>
    <div class="w-1/2 max-sm:w-full p-5 mx-auto">
      <input
      maxlength="1"
      class="text-white w-full bg-transparent border outline-0 p-2 rounded-md"
      type="text"
      placeholder="Search By First Letter"
      id="letterInput"
      />
    </div>`
  );

  $("#container").html("");
  $("#loading").fadeOut(200);
}

async function searchByName(term) {
  $("#container").html("");
  $("#loading").fadeIn(200);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  data = await response.json();

  if (data.meals) {
    display(data.meals);
  } else {
    display([]);
  }
  $("#loading").fadeOut(200);
}

async function searchByLetter(term) {
  $("#container").html("");
  $("#loading").fadeIn(200);

  term = term || "a";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`
  );
  let data = await response.json();

  if (data.meals) {
    display(data.meals);
  } else {
    display([]);
  }
  $("#loading").fadeOut(200);
}

$("#search").on("click", function () {
  closeNavMenu();
  showSearchInputs();
});
$("#search-container").on("keyup", "#nameInput", function () {
  searchByName($("#nameInput").val());
});
$("#search-container").on("keyup", "#letterInput", function () {
  searchByLetter($("#letterInput").val());
});

// Categories Section
async function getCategories() {
  $("#container").html("");
  $("#loading").fadeIn(300);
  $("#search-container").html("");

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await response.json();

  displayCategories(data);
  $("#loading").fadeOut(300);
}

function displayCategories(data) {
  let cartona = "";
  for (let i = 0; i < data.categories.length; i++) {
    cartona += `
    <div
      onclick="getCategoryMeals('${
        data.categories[i].strCategory
      }')"class="xl:w-3/12 lg:w-4/12 sm:w-full cursor-pointer p-4 flex justify-center items-center flex-col">
      <div class="image w-full relative overflow-hidden rounded-xl">
        <img class="w-full" src="${
          data.categories[i].strCategoryThumb
        }" alt="" />
        <div
        class="layer transition-all duration-500 group-hover:bottom-0 bg-white absolute -bottom-full w-full h-full opacity-70 text-black font-bold flex items-center p-4 flex-col"
      >
        <h1 class="text-3xl mb-3">${data.categories[i].strCategory}</h1>
        <p class="font-normal text-sm text-center">${data.categories[
          i
        ].strCategoryDescription
          .split(" ")
          .slice(0, 20)
          .join(" ")}</p>
        </div>
      </div>
    </div>
    `;
  }
  $("#container").html(cartona);
}
async function getCategoryMeals(category) {
  $("#container").html("");
  $("#loading").fadeIn(300);
  $("#search-container").html("");

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  let data = await response.json();

  display(data.meals.slice(0, 20));
  $("#loading").fadeOut(300);
}

$("#categories").on("click", function () {
  closeNavMenu();
  getCategories();
});

// Area Section
async function getArea() {
  $("#container").html("");
  $("#loading").fadeIn(300);
  $("#search-container").html("");

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await response.json();

  displayArea(data);
  $("#loading").fadeOut(300);
}

function displayArea(data) {
  let cartona = "";
  for (let i = 0; i < data.meals.length; i++) {
    cartona += `
      <div class="xl:w-3/12 lg:w-4/12 max-sm:w-full cursor-pointer p-4 flex justify-center items-center flex-col flex-wrap" onclick="getAreaMeals('${data.meals[i].strArea}')">
          <i class="fa-solid fa-house-laptop fa-4x block"></i>
          <h1 class="text-3xl mt-3 text-center">${data.meals[i].strArea}</h1>
      </div>
    `;
  }
  $("#container").html(cartona);
}
async function getAreaMeals(area) {
  $("#container").html("");
  $("#loading").fadeIn(300);
  $("#search-container").html("");

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  let data = await response.json();

  display(data.meals.slice(0, 20));
  $("#loading").fadeOut(300);
}
$("#area").on("click", function () {
  closeNavMenu();
  getArea();
});

// Ingrediant Section
async function getIngredient() {
  $("#container").html("");
  $("#loading").fadeIn(300);
  $("#search-container").html("");

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await response.json();

  displayIngredient(data.meals.slice(0, 20));
  $("#loading").fadeOut(300);
}
function displayIngredient(data) {
  let cartona = "";
  for (let i = 0; i < data.length; i++) {
    let description = data[i].strDescription || "";
    let truncatedDescription = description.split(" ").slice(0, 20).join(" ");
    cartona += `
      <div class="xl:w-3/12 lg:w-4/12 sm:w-full cursor-pointer p-4 flex justify-center items-center flex-col" onclick="getIngredientMeals('${data[i].strIngredient}')">
        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
        <h1 class="text-3xl mt-3">${data[i].strIngredient}</h1>
        <p class="text-center">${truncatedDescription}</p>
      </div>
    `;
  }
  $("#container").html(cartona);
}
async function getIngredientMeals(ingredient) {
  $("#container").html("");
  $("#loading").fadeIn(300);
  $("#search-container").html("");

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
  );
  let data = await response.json();

  display(data.meals.slice(0, 20));
  $("#loading").fadeOut(300);
}
$("#ingredient").on("click", function () {
  closeNavMenu();
  getIngredient();
});
// Contact Section
function renderContactForm() {
  $("#container").html("");
  $("#loading").fadeIn(300);
  $("#search-container").html("");
  let cartona = `
    <div class="contact mx-auto flex flex-col justify-center w-full">
      <div class="data">
        <div class="row flex flex-wrap">
          <div class="xl:w-1/2 lg:w-1/2 max-sm:w-full p-5 mx-auto">
            <input
              class="w-full bg-white border outline-0 p-2 rounded-md block text-black"
              type="text"
              placeholder="Enter Your Name"
              id="nameInput"
            />
            <div
              class="nameInputError text-red-700 bg-red-300 p-5 mt-3 rounded-lg text-center w-full hidden"
            >
              Special characters and numbers not allowed
            </div>
          </div>
          <div class="xl:w-1/2 lg:w-1/2 max-sm:w-full p-5 mx-auto">
            <input
              class="w-full bg-white border outline-0 p-2 rounded-md block text-black"
              type="text"
              placeholder="Enter Your Email"
              id="emailInput"
            />
            <div
              class="emailInputError text-red-700 bg-red-300 p-5 mt-3 rounded-lg text-center w-full hidden"
            >
              Email not valid *example@yyy.zzz
            </div>
          </div>
        </div>
        <div class="row flex flex-wrap">
          <div class="xl:w-1/2 lg:w-1/2 max-sm:w-full p-5 mx-auto">
            <input
              class="w-full bg-white border outline-0 p-2 rounded-md block text-black"
              type="text"
              placeholder="Enter Your Phone"
              id="phoneInput"
            />
            <div
              class="phoneInputError text-red-700 bg-red-300 p-5 mt-3 rounded-lg text-center w-full hidden"
            >
              Enter valid Phone Number
            </div>
          </div>
          <div class="xl:w-1/2 lg:w-1/2 max-sm:w-full p-5 mx-auto">
            <input
              class="w-full bg-white border outline-0 p-2 rounded-md block text-black"
              type="number"
              placeholder="Enter Your Age"
              id="ageInput"
            />
            <div
              class="ageInputError text-red-700 bg-red-300 p-5 mt-3 rounded-lg text-center w-full hidden"
            >
              Enter valid age
            </div>
          </div>
        </div>
        <div class="row flex flex-wrap">
          <div class="xl:w-1/2 lg:w-1/2 max-sm:w-full p-5 mx-auto">
            <input
              class="w-full bg-white border outline-0 p-2 rounded-md block text-black"
              type="password"
              placeholder="Enter Your Password"
              id="passInput"
            />
            <div
              class="passInputError text-red-700 bg-red-300 p-5 mt-3 rounded-lg text-center w-full hidden"
            >
              Enter valid password *Minimum eight characters, at least one letter and one number
            </div>
          </div>
          <div class="xl:w-1/2 lg:w-1/2 max-sm:w-full p-5 mx-auto">
            <input
              class="w-full bg-white border outline-0 p-2 rounded-md block text-black"
              type="password"
              placeholder="Re-enter Password"
              id="repassInput"
            />
            <div
              class="repassInputError text-red-700 bg-red-300 p-5 mt-3 rounded-lg text-center w-full hidden"
            >
              Passwords do not match
            </div>
          </div>
        </div>
        <button
          type="submit"
          class="border rounded-lg bg-red-800 text-white block m-auto p-3 px-4 disabled:border-red-800 disabled:text-red-800 disabled:bg-black"
          disabled
          id="submitBtn"
        >
          Submit
        </button>
      </div>
    </div>
  `;
  $("#container").html(cartona);
  $("#loading").fadeOut(300);

  document.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("input", function () {
      validateInputs(this);
    });
  });
}

$("#contact").on("click", function () {
  closeNavMenu();
  renderContactForm();
});

function validateInputs(element) {
  let regex = {
    nameInput: /^[a-zA-Z ]+$/,
    emailInput:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phoneInput: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    ageInput: /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/,
    passInput: /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/,
  };

  let valid = true;

  if (element.id === "repassInput") {
    let passInput = document.getElementById("passInput");
    if (element.value !== passInput.value) {
      element.nextElementSibling.classList.remove("hidden");
      valid = false;
    } else {
      element.nextElementSibling.classList.add("hidden");
    }
  } else {
    if (!regex[element.id].test(element.value)) {
      element.nextElementSibling.classList.remove("hidden");
      valid = false;
    } else {
      element.nextElementSibling.classList.add("hidden");
    }
  }

  document.querySelectorAll("input").forEach(function (input) {
    if (input.id === "repassInput") {
      let passInput = document.getElementById("passInput");
      if (input.value !== passInput.value) {
        valid = false;
      }
    } else {
      if (!regex[input.id].test(input.value)) {
        valid = false;
      }
    }
  });

  document.getElementById("submitBtn").disabled = !valid;
}

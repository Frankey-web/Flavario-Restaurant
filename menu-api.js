let useMealDB = false;

const API_KEY = "e216b0f7145a4055a5a5cbb485f612b1";

const categories = [
    {
        queries: ["salad", "wings", "soup", "bread"],
        container: "starters-grid"
    },
    {
        queries: ["chicken", "steak", "salmon", "pasta"],
        container: "main-grid"
    },
{
    queries: [
        "margherita pizza",
        "pepperoni pizza",
        "bbq chicken pizza",
        "vegetarian pizza"
    ],
    container: "pizza-grid"
},
    {
        queries: ["cheesecake", "cake", "brownie", "ice cream"],
        container: "dessert-grid"
    },
    {
        queries: ["smoothie", "milkshake", "juice", "coffee"],
        container: "drink-grid"
    }
];

async function loadCategory(query, containerId) {

    const container = document.getElementById(containerId);

    container.innerHTML = "<p>Loading menu...</p>";

    try {

        const response = await fetch(
            `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=4&addRecipeInformation=true&apiKey=${API_KEY}`
        );

        const data = await response.json();

        container.innerHTML = "";

        data.results.forEach(food => {

            const price = (food.pricePerServing / 100).toFixed(2);

            container.innerHTML += `

                <div class="menu-card">

                    <div class="menu-image">
                       <img
    src="${food.image}"
    alt="${food.title}"
    onerror="
        this.onerror=null;
        this.src='placeholder-food.jpg';
        toast('Some food images could not be loaded.');
    "
>
                    </div>

                    <div class="menu-details">

                        <h3>${food.title}</h3>

                        <p>
                            Ready in ${food.readyInMinutes} minutes.
                        </p>

                        <span class="price">$${price}</span>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

        container.innerHTML = "<p>Failed to load menu.</p>";

    }

}

const mealDBQueries = {
    "bbq chicken pizza": "pizza",
    "vegetarian pizza": "pizza",
    "margherita pizza": "pizza",
    "pepperoni pizza": "pizza",
    "milkshake": "shake",
    "smoothie": "smoothie"
};

async function fetchMealDB(query) {

    const searchQuery = mealDBQueries[query] || query;

    const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchQuery)}`
    );

    if (!response.ok) {
        throw new Error("MealDB unavailable");
    }

    const data = await response.json();

    if (!data.meals) return [];

    return data.meals.map(meal => ({

        id: meal.idMeal,

        title: meal.strMeal,

        image: meal.strMealThumb,

        pricePerServing: Math.floor(Math.random() * 1800) + 800,

        vegetarian: false

    }));

}

async function loadMixedCategory(queries, containerId) {

    const container = document.getElementById(containerId);

    container.innerHTML = "<p>Loading menu...</p>";

    container.innerHTML = "";

    for (const query of queries) {

        try {

            let foods;

try{

    foods = await fetchSpoonacular(query);

}catch(error){

    console.log("Using MealDB fallback...");

    foods = await fetchMealDB(query);

}

if (!foods.length) {
    continue;
}

foods.forEach(food=>{

                const price = food.pricePerServing
    ? (food.pricePerServing / 100).toFixed(2)
    : (Math.random() * 15 + 8).toFixed(2);

                container.innerHTML += `
                    <div class="menu-card">

                        <div class="menu-image">
                            <img src="${food.image}" alt="${food.title}">
                        </div>

                        <div class="menu-details">
                        
                        <div class="food-badge">
    ⭐⭐⭐⭐⭐
</div>

                            <h3>${food.title}</h3>

<p>
    ${food.vegetarian === true
    ? "🌱 Chef's Vegetarian Special"
    : "🔥 Customer Favorite"}
</p>

                            <div class="card-bottom">

    <span class="price">$${price}</span>

    <button class="add-order-btn"
        data-id="${food.id}"
        data-name="${food.title}"
        data-image="${food.image}"
        data-price="${price}">
        Add +
    </button>

</div>

                        </div>

                    </div>
                `;

            });

        } catch (err) {
    console.error(`Failed to load '${query}'`, err);
}

    }

const cards = container.querySelectorAll(".menu-card");

cards.forEach((card,index)=>{

    if(index>=4){

        card.style.display="none";

    }

});

const btn=document.createElement("button");

btn.className="view-btn";

const hiddenCount = cards.length - 4;

btn.textContent =
    hiddenCount > 0
        ? `View ${hiddenCount} More Dishes`
        : "View All";

let expanded = false;

btn.onclick = function () {

    expanded = !expanded;

    cards.forEach((card, index) => {

        if (index >= 4) {

            card.style.display = expanded ? "block" : "none";

        }

    });

    btn.textContent = expanded
        ? "Show Less"
        : `View ${hiddenCount} More Dishes`;

};
container.nextElementSibling?.remove();
container.after(btn);
updateMenuButtons();
}


categories.forEach(category => {

    loadMixedCategory(category.queries, category.container);

});

function toast(message){

    const el = document.getElementById("toast");

    el.textContent = message;

    el.classList.add("show");

    clearTimeout(el.timer);

    el.timer = setTimeout(() => {
        el.classList.remove("show");
    }, 2500);

}

document.addEventListener("click", function(e){

    if(!e.target.classList.contains("add-order-btn")) return;

    const item = {

        id: e.target.dataset.id,

        name: e.target.dataset.name,

        image: e.target.dataset.image,

        price: Number(e.target.dataset.price),

        quantity:1

    };

    let cart = JSON.parse(localStorage.getItem("flavorioCart")) || [];

    const existing = cart.find(food=>food.id===item.id);

    if(existing){

        existing.quantity++;

    }else{

        cart.push(item);

    }

    localStorage.setItem("flavorioCart", JSON.stringify(cart));
    updateCartCount();
    updateMenuButtons();
    openMiniCart();

    toast(item.name + " added to your order.");

});

updateCartCount();

function updateMenuButtons() {

    const cart = JSON.parse(localStorage.getItem("flavorioCart")) || [];

    document.querySelectorAll(".add-order-btn").forEach(btn => {

        const item = cart.find(food => food.id === btn.dataset.id);

        if(item){

            btn.innerHTML = `✓ Added (${item.quantity})`;
            btn.classList.add("added");

        }else{

            btn.innerHTML = "Add +";
            btn.classList.remove("added");

        }

    });

}



function updateCartCount(){

    const cart = JSON.parse(localStorage.getItem("flavorioCart")) || [];

    const total = cart.reduce((sum,item)=>sum+item.quantity,0);

    const badge = document.getElementById("cart-count");
    const floating = document.getElementById("cart-count-floating");

    if(badge){

        badge.textContent = total;
        badge.style.display = total ? "flex" : "none";

    }

    if(floating){

        floating.textContent = total;
        floating.style.display = total ? "flex" : "none";

    }

}

const miniCart = document.getElementById("miniCart");
const miniOverlay = document.querySelector(".mini-cart-overlay");
const miniItems = document.getElementById("miniCartItems");
const miniSubtotal = document.getElementById("miniSubtotal");
const closeMiniCart = document.getElementById("closeMiniCart");
let miniCartTimer;

function renderMiniCart(){

    const cart = JSON.parse(localStorage.getItem("flavorioCart")) || [];

    if(cart.length === 0){

        miniItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        miniSubtotal.textContent = "$0.00";

        return;

    }

    let subtotal = 0;

    miniItems.innerHTML = "";

    cart.forEach(item=>{

        subtotal += item.price * item.quantity;

        miniItems.innerHTML += `

            <div class="mini-cart-item">

                <img src="${item.image}" alt="${item.name}">

                <div class="mini-item-info">

                    <h4>${item.name}</h4>

                    <p>

                        $${item.price.toFixed(2)} × ${item.quantity}

                    </p>

                </div>

            </div>

        `;

    });

    miniSubtotal.textContent = "$" + subtotal.toFixed(2);

}

function openMiniCart(){

    renderMiniCart();

    miniCart.classList.add("show");
    miniOverlay.classList.add("show");

    clearTimeout(miniCartTimer);

    miniCartTimer = setTimeout(() => {
        closeMini();
    }, 3000);

}

function closeMini(){

    miniCart.classList.remove("show");

    miniOverlay.classList.remove("show");

}

closeMiniCart.onclick = closeMini;

miniOverlay.onclick = closeMini;

async function fetchSpoonacular(query){

    if(useMealDB){
        throw new Error("Using MealDB");
    }

    const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&addRecipeInformation=true&apiKey=${API_KEY}`
    );

    const data = await response.json();

    if(!response.ok || !data.results){

        useMealDB = true;

        throw new Error("Spoonacular unavailable");

    }

    return data.results;

}
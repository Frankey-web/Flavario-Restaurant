document.addEventListener("click", function(e){

    if(!e.target.classList.contains("add-home-order")) return;

    const item = {

        id: e.target.dataset.id,
        name: e.target.dataset.name,
        image: e.target.dataset.image,
        price: Number(e.target.dataset.price),
        quantity: 1

    };

    let cart = JSON.parse(localStorage.getItem("flavorioCart")) || [];

    const existing = cart.find(food => food.id === item.id);

    if(existing){

        existing.quantity++;

    }else{

        cart.push(item);

    }

    localStorage.setItem("flavorioCart", JSON.stringify(cart));

    updateCartCount();
    renderMiniCart();
    openMiniCart();

    toast(item.name + " added to your order.");

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

let miniCartTimer;

const miniCart = document.getElementById("miniCart");
const miniOverlay = document.querySelector(".mini-cart-overlay");
const miniItems = document.getElementById("miniCartItems");
const miniSubtotal = document.getElementById("miniSubtotal");
const closeMiniCart = document.getElementById("closeMiniCart");

closeMiniCart.onclick = closeMini;
miniOverlay.onclick = closeMini;


updateCartCount();

const desktopModal = document.getElementById("desktopModal");
const desktopContinueBtn = document.getElementById("desktopContinueBtn");

window.addEventListener("load", () => {

    if(window.innerWidth <= 992){

        setTimeout(() => {

            desktopModal.style.display = "flex";

        }, 800);

    }

});

desktopContinueBtn.onclick = function(){

    desktopModal.style.display = "none";

};
const cart = JSON.parse(localStorage.getItem("flavorioCart")) || [];

const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");

const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");

const progressBar = document.getElementById("progress-bar");
const deliveryMessage = document.getElementById("delivery-message");

function renderCart(){

    if(cart.length===0){

        cartItems.innerHTML=`

            <div class="empty-cart">

                <img src="cart.svg">

                <h3>Your cart is empty</h3>

                <p>
                    Browse our menu and add delicious meals.
                </p>

                <a href="menu.html">
                    Browse Menu
                </a>

            </div>

        `;

        cartCount.textContent=0;

        subtotalEl.textContent="$0.00";
        deliveryEl.textContent="$0.00";
        taxEl.textContent="$0.00";
        totalEl.textContent="$0.00";

        progressBar.style.width="0%";

        deliveryMessage.textContent=
        "You're $30 away from FREE delivery.";

        return;

    }

    cartItems.innerHTML="";

    let subtotal=0;
    let totalItems=0;

    cart.forEach(item=>{

        subtotal += item.price * item.quantity;

        totalItems += item.quantity;

        cartItems.innerHTML += `

        <div class="cart-item">

            <img src="${item.image}">

            <div class="cart-info">

                <h4>${item.name}</h4>

                <span>$${item.price} each</span>

                <div class="qty-controls">

                    <button class="minus"
                        data-id="${item.id}">
                        −
                    </button>

                    <span>${item.quantity}</span>

                    <button class="plus"
                        data-id="${item.id}">
                        +
                    </button>

                </div>

            </div>

            <div class="item-right">

                <h4>$${(item.price*item.quantity).toFixed(2)}</h4>

                <button class="delete"
                    data-id="${item.id}">

                    <img src="trash.svg">

                </button>

            </div>

        </div>

        `;

    });

    cartCount.textContent=totalItems;

    updateTotals(subtotal);

}

function updateTotals(subtotal){

    let delivery = subtotal>=30 ? 0 : 4.99;

    let tax = subtotal * 0.08;

    let total = subtotal + delivery + tax;

    subtotalEl.textContent="$"+subtotal.toFixed(2);

    deliveryEl.textContent="$"+delivery.toFixed(2);

    taxEl.textContent="$"+tax.toFixed(2);

    totalEl.textContent="$"+total.toFixed(2);

    let percent=Math.min((subtotal/30)*100,100);

    progressBar.style.width=percent+"%";

    if(subtotal>=30){

        deliveryMessage.innerHTML=

        "🎉 Congratulations! You unlocked FREE delivery.";

    }else{

        deliveryMessage.innerHTML=

        `You're <strong>$${(30-subtotal).toFixed(2)}</strong> away from <strong>FREE delivery!</strong>`;

    }

}

renderCart();

document.addEventListener("click", function(e){

    const id = e.target.dataset.id ||
               e.target.closest("[data-id]")?.dataset.id;

    if(!id) return;

    // Increase quantity
    if(e.target.classList.contains("plus")){

        const item = cart.find(food => food.id == id);

        item.quantity++;

    }

    // Decrease quantity
    else if(e.target.classList.contains("minus")){

        const item = cart.find(food => food.id == id);

        if(item.quantity > 1){

            item.quantity--;

        }else{

            const index = cart.findIndex(food => food.id == id);

            cart.splice(index,1);

        }

    }

    // Delete item
    else if(
        e.target.classList.contains("delete") ||
        e.target.closest(".delete")
    ){

        const index = cart.findIndex(food => food.id == id);

        cart.splice(index,1);

    }else{

        return;

    }

    localStorage.setItem("flavorioCart", JSON.stringify(cart));

    renderCart();

});

const noteBtn = document.querySelector(".note-btn");

const noteModal = document.getElementById("noteModal");

const sendNoteBtn = document.getElementById("sendNoteBtn");

const orderNote = document.getElementById("orderNote");

const successModal = document.getElementById("noteSuccessModal");

const closeSuccessBtn = document.getElementById("closeSuccessBtn");

noteBtn.addEventListener("click", function(){

    noteModal.classList.add("show");

});

sendNoteBtn.addEventListener("click", function(){

    if(orderNote.value.trim() === ""){

        alert("Please enter your order note.");

        return;

    }

    noteModal.classList.remove("show");

    successModal.classList.add("show");

    orderNote.value = "";

});

closeSuccessBtn.addEventListener("click", function(){

    successModal.classList.remove("show");

});
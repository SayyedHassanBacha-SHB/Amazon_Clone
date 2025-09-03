export let cart = JSON.parse(localStorage.getItem("cart"));
if(!cart){
  cart =  [
    {
        productId : "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity : 1,
    },
    {
        productId : "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity : 1,
    }
 ];
}
// localStorage.clear();
export function saveCartData(){
    localStorage.setItem("cart",JSON.stringify(cart));
}

export function addToCart(){
  const addToCartBtn = document.querySelectorAll(".js-cart-button");
    addToCartBtn.forEach((button) => {
    button.addEventListener("click",() => {
        const {productId} = button.dataset;
        updateCartQuantity(productId);
    })
  });
}


export function updateCartQuantity(productId){
  const selectQuantity = document.querySelector(`.js-select-quantity-${productId}`);
    let quantity = Number(selectQuantity.value);
    showAddedMessage(productId);
    let matchingitem;
    cart.forEach((cartitem) => {
      if(productId === cartitem.productId){
        matchingitem = cartitem;
      }
    });
    if(matchingitem){
      matchingitem.quantity += quantity;
    }
    else {
        cart.push({
        productId,
        quantity
    });
    }
    let cartQuantity = 0;
    cart.map((cartitem) => {
      cartQuantity += cartitem.quantity;
    });
    const showCartQuantity = document.querySelector(".js-cart-quantity");
    showCartQuantity.innerHTML = cartQuantity;
    saveCartData();
}

function showAddedMessage(productId){
    clearTimeout();
    const showAddedMessage = document.querySelector(`.js-added-message-${productId}`);
    showAddedMessage.classList.add("visible");
    setTimeout(() => {
      showAddedMessage.classList.remove("visible");
    },1500);
}

export function removeFromCart(productId){
    cart = cart.filter((cartitem) => {
        return cartitem.productId !== productId;
    })
}
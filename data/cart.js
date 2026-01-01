// import { deliveryOptions } from "./deliveryoption.js";

export let cart = JSON.parse(localStorage.getItem("cart"));
if(!cart){
  cart =  [
    {
        productId : "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity : 1,
        deliveryOptionId : "1",
    },
    {
        productId : "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity : 1,
        deliveryOptionId : "2",
    }
 ];
}
// localStorage.clear();
export function saveCartData(){
    localStorage.setItem("cart",JSON.stringify(cart));
}

console.log(cart);

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
        quantity,
        deliveryOptionId : "1",
    });
    }
    homePageCartQuantity();
    saveCartData();
}

export function showCartQuantity(){
    let cartQuantity = 0;
    cart.map((cartitem) => {
      cartQuantity += cartitem.quantity;
    });
    return cartQuantity;
}

export function homePageCartQuantity(){
  let cartQuantity = showCartQuantity();
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}

export function checkoutPageCartQuantity(){
  let cartQuantity = showCartQuantity();
  document.querySelector(".js-total-cartitem").innerHTML = `${cartQuantity} items`;
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

export function updateQuantity(productId, newQuantity){
  cart.forEach((cartitem) => {
    if(productId === cartitem.productId){
      cartitem.quantity = newQuantity;
      console.log(cartitem.quantity);
    }
  })
  checkoutPageCartQuantity();
  document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
  saveCartData();
}

export function updateDeliveryOption(productId,deliveryOptionId){
  cart.forEach((cartitems) => {
    if(productId === cartitems.productId){
      cartitems.deliveryOptionId = deliveryOptionId;
    }
  })
  saveCartData();
}
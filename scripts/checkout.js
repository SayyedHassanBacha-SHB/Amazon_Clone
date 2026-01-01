import {cart,removeFromCart, saveCartData,checkoutPageCartQuantity, updateQuantity,updateDeliveryOption} from "../data/cart.js";
import {products} from "../data/products.js";
import { deliveryOptions } from "../data/deliveryoption.js";
import dayjs from "https://unpkg.com/dayjs@1.11.11/esm/index.js";

function renderCheckoutPage(){
checkoutPageCartQuantity();
let checkoutHTML = "";
cart.forEach((cartitem) => {
    let matchingProduct =  products.find((item) => {
        return cartitem.productId === item.id;
    });
    // console.log(matchingProduct);
    const deliveryOptionId = cartitem.deliveryOptionId;
    let deliveryOption = "";
    deliveryOptions.forEach((option) => {
      if(deliveryOptionId === option.id){
        deliveryOption = option;
      }
    })

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    checkoutHTML += `
          <div class="cart-item-container js-container-${cartitem.productId}">
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  ${(matchingProduct.priceCents/100).toFixed(2)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${cartitem.productId}">${cartitem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id = ${cartitem.productId}>
                    Update
                  </span>
                    <input type="number" class="quantity-input js-input-quantity js-input-quantity-${cartitem.productId}">
                    <span class="save-quantity-link link-primary js-save-link" data-product-id = ${cartitem.productId}>Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id = ${cartitem.productId}>
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionHtml(cartitem)}
              </div>
            </div>
          </div>`
})

const orderSummary = document.querySelector(".js-order-summary");
orderSummary.innerHTML = checkoutHTML;


document.querySelectorAll(".js-delete-link").forEach((deleteLink) => {
    deleteLink.addEventListener("click",() => {
        const productId = deleteLink.dataset.productId; 
        removeFromCart(productId);
        document.querySelector(`.js-container-${productId}`).remove();
        checkoutPageCartQuantity();
        saveCartData();
    })
});

document.querySelectorAll(".js-update-link").forEach((updateLink) => {
  updateLink.addEventListener("click",() => {
    const {productId} = updateLink.dataset;
    document.querySelector(`.js-container-${productId}`).classList.add("is-editing-quantity");
  })
})

document.querySelectorAll(".js-save-link").forEach((saveLink) => {
  saveLink.addEventListener("click", () => {
    const {productId} = saveLink.dataset;
    let inputQuantity = document.querySelector(`.js-input-quantity-${productId}`);
    let newCartQuantity = Number(inputQuantity.value);
    updateQuantity(productId,newCartQuantity);
    document.querySelector(`.js-container-${productId}`).classList.remove("is-editing-quantity");
  })
})

function deliveryOptionHtml(cartitem){
  let html = "";
  deliveryOptions.forEach((deliveryoption) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryoption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");
    const priceString = (deliveryoption.priceCents === 0) ? "FREE" : `$${(deliveryoption.priceCents/100).toFixed(2)}`;
    const isChecked = deliveryoption.id === cartitem.deliveryOptionId;

    html += `<div class="delivery-option">
                <input type="radio" ${isChecked ? "checked" : ""}
                  class="delivery-option-input js-delivery-option"
                  name="delivery-option-1-${cartitem.productId}" data-product-id = ${cartitem.productId} data-delivery-option-id=${deliveryoption.id}>
                <div>
                  <div class="delivery-option-date">
                    ${dateString}
                  </div>
                  <div class="delivery-option-price">
                    ${priceString} - Shipping
                  </div>
                </div>
              </div>`;
  })

  return html;
}

document.querySelectorAll(".js-delivery-option").forEach((option) => {
  option.addEventListener("click",() => {
    const {productId, deliveryOptionId} = option.dataset;
    updateDeliveryOption(productId,deliveryOptionId);
    renderCheckoutPage();
  })
})
}

renderCheckoutPage();



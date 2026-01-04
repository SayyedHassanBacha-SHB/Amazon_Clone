import {cart,removeFromCart, saveCartData,checkoutPageCartQuantity, updateQuantity,updateDeliveryOption,showCartQuantity} from "../data/cart.js";
import {products} from "../data/products.js";
import { deliveryOptions, getDeliveryOption } from "../data/deliveryoption.js";
import dayjs from "https://unpkg.com/dayjs@1.11.11/esm/index.js";

renderOrderDetails();


function isWeekened(date){
  const day = date.format("dddd");
  if(day === "Saturday" || day === "Sunday"){
    return true;
  }
  return false;
}

function renderOrderDetails(){
checkoutPageCartQuantity();
let checkoutHTML = "";
cart.forEach((cartitem) => {
    let matchingProduct =  products.find((item) => {
        return cartitem.productId === item.id;
    });

    const deliveryOption = getDeliveryOption(cartitem.deliveryOptionId);

    const today = dayjs();
    let deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    let i = deliveryOption.deliveryDays;
    while(true){
      if(isWeekened(deliveryDate)){
        deliveryDate = deliveryDate.add(1,"days");
      }
      else {
        i--;
      }
      if(i === 0){
        break;
      }
    }
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
                  $${(matchingProduct.priceCents/100).toFixed(2)}
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
        renderPaymentDetails();
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
    renderPaymentDetails();
  })
})



function deliveryOptionHtml(cartitem){
  let html = "";
  deliveryOptions.forEach((deliveryoption) => {
    const today = dayjs();
    let deliveryDate = today.add(deliveryoption.deliveryDays, "days");
    let i = deliveryoption.deliveryDays;
    while(true){
      if(isWeekened(deliveryDate)){
        deliveryDate = deliveryDate.add(1,"days");
      }
      else {
        i--;
      }
      if(i === 0){
        break;
      }
    }
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
    renderOrderDetails();
    renderPaymentDetails();
  })
})
}

renderPaymentDetails();


function renderPaymentDetails(){
  let totalitems = showCartQuantity();
  let totalItemAmount= 0;
  let shippingFees = 0;
  cart.forEach((cartitem) => {
    const product = products.find((product) => {
      return product.id === cartitem.productId;
    })
    let itemAmount = product.priceCents * cartitem.quantity;
    totalItemAmount += itemAmount;
    const deliveryOption = getDeliveryOption(cartitem.deliveryOptionId);
    shippingFees += deliveryOption.priceCents
  })
  const totalBeforeTax = totalItemAmount+shippingFees;
  const tax = totalBeforeTax * 0.1;
  const totalAmount = totalBeforeTax + tax;

  let html = `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${totalitems}):</div>
      <div class="payment-summary-money" >$${(totalItemAmount/100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${(shippingFees/100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${(totalBeforeTax/100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${(tax/100).toFixed(2)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${(totalAmount/100).toFixed(2)}</div>
    </div>

    <a href="orders.html"><button class="place-order-button button-primary">
      Place your order
    </button></a>`;

    document.querySelector(".js-payment-summary").innerHTML = html;
}



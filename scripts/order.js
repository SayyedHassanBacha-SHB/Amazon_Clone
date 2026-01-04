import {cart,showCartQuantity} from "../data/cart.js";
import {deliveryOptions,getDeliveryOption} from "../data/deliveryoption.js";
import {products} from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.11/esm/index.js";

renderOrderSummary();
document.querySelector(".js-cart-quantity-op").innerHTML = showCartQuantity();


function orderHeaderHTml(){
    const day = dayjs();
    const orderDay = day.format("MMMM D");
    const total = totalAmount();
    const orderId = crypto.randomUUID();
    const html = `
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderDay}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${total}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${orderId}</div>
            </div>
          `
          return html;
}

function renderOrderSummary(){
    let productHtml = "";
    cart.forEach((cartitem) => {
        const deliveryOption = getDeliveryOption(cartitem.deliveryOptionId);
        const today = dayjs();
        const deliveryDate = today.add(deliveryOption.deliveryDays,"days");
        const dateString = deliveryDate.format("MMMM D");
        const product = products.filter((product) => {
            return product.id === cartitem.productId;
        })
        productHtml += `
            <div class="product-image-container">
              <img src="${product[0].image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${product[0].name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${dateString}
              </div>
              <div class="product-quantity">
                Quantity: ${cartitem.quantity}
              </div>
              <a href="checkout.html">
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
              </a>
            </div>

            <div class="product-actions">
              <a href="tracking.html">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>`
    })
    document.querySelector(".js-order-header").innerHTML = orderHeaderHTml();
    document.querySelector(".js-order-details").innerHTML = productHtml; 
}

function totalAmount(){
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
  return (totalAmount/100).toFixed(2);
}

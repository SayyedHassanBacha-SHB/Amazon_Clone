import {cart,removeFromCart, saveCartData,checkoutPageCartQuantity, updateQuantity} from "../data/cart.js"
import {products} from "../data/products.js"

checkoutPageCartQuantity();



let checkoutHTML = "";
cart.forEach((cartitem) => {
    let matchingProduct =  products.find((item) => {
        return cartitem.productId === item.id;
    });
    // console.log(matchingProduct);

    checkoutHTML += `
          <div class="cart-item-container js-container-${cartitem.productId}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
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
                <div class="delivery-option">
                  <input type="radio" checked
                    class="delivery-option-input"
                    name="delivery-option-1-${cartitem.productId}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-1-${cartitem.productId}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-1-${cartitem.productId}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`
})

const orderSummary = document.querySelector(".js-order-summary");
orderSummary.innerHTML = checkoutHTML;
// console.log(checkoutHTML);


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
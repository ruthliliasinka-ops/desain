'use strict';

/* =========================
   HELPER EVENT
========================= */
const addEventOnElem = function (elem, type, callback) {
  if (!elem) return;

  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
};

/* =========================
   AMBIL CARD (SHOP / PRODUCT)
========================= */
function getCard(el){
  return el.closest(".shop-card") || el.closest(".product-card");
}

/* =========================
   GO TO DETAIL
========================= */
function goToDetail(btn){

  const card = getCard(btn);
  if(!card) return;

  const name = card.dataset.name;
  const price = card.dataset.price;
  const img = JSON.parse(card.dataset.img || "[]");
  const desc = card.dataset.desc;

  const product = { name, price, img, desc };

  localStorage.setItem("selectedProduct", JSON.stringify(product));

  window.location.href = "product.html";
}

/* =========================
   ADD TO CART
========================= */
function addToCart(event, btn){

  event.preventDefault();

  const card = getCard(btn);
  if(!card) return;

  const product = {
    name: card.querySelector(".card-title")?.innerText || "",
    price: card.querySelector(".price .span")?.innerText.replace(/\D/g,'') || 0,
    img: [card.querySelector("img")?.src || ""],
    qty: 1
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  alert("Produk berhasil ditambahkan 🛒");
}

/* =========================
   UPDATE CART
========================= */
function updateCartCount(){

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;

  cart.forEach(item => total += item.qty);

  const cartEl = document.getElementById("cart-count");

  if(cartEl){
    cartEl.innerText = total;
  }
}

updateCartCount();

/* =========================
   NAVBAR (AMAN)
========================= */
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  if(navbar) navbar.classList.toggle("active");
  if(overlay) overlay.classList.toggle("active");
};

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  if(navbar) navbar.classList.remove("active");
  if(overlay) overlay.classList.remove("active");
};

addEventOnElem(navbarLinks, "click", closeNavbar);

/* =========================
   HEADER SCROLL (FIX ERROR)
========================= */
const header = document.querySelector(".header");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {

  if(!header) return;

  if (window.scrollY > 150) {
    header.classList.add("active");
    if(backTopBtn) backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    if(backTopBtn) backTopBtn.classList.remove("active");
  }

};

addEventOnElem(window, "scroll", headerActive);

/* =========================
   SCROLL REVEAL
========================= */
const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {

  sections.forEach(sec => {
    if (sec.getBoundingClientRect().top < window.innerHeight / 2) {
      sec.classList.add("active");
    }
  });

};

scrollReveal();
addEventOnElem(window, "scroll", scrollReveal);

/* =========================
   PAYMENT (AMAN)
========================= */
let payMethod = localStorage.getItem("payment") || "Bank Transfer";
payMethod = payMethod.trim();

const paymentConfig = {
  "DANA": { discount: 10000, logo: "dana.jpg" },
  "OVO": { discount: 8000, logo: "ovo.jpg" },
  "GoPay": { discount: 12000, logo: "gopay.jpg" },
  "Bank Transfer": { discount: 0, logo: "bank.jpg" },
  "COD": { discount: 0, logo: "" }
};

const config = paymentConfig[payMethod];

const logoEl = document.getElementById("payLogo");

if(config && config.logo && logoEl){
  logoEl.src = config.logo;
}

if(payMethod === "COD"){
  const box = document.getElementById("paymentBox");
  if(box){
    box.innerHTML = "Cash On Delivery";
  }
}

/* =========================
   🔥 SEARCH GLOBAL (FIX SEMUA HALAMAN)
========================= */
const searchInput = document.getElementById("searchInput");

if(searchInput){

  const products = document.querySelectorAll(".shop-card, .product-card");

  searchInput.addEventListener("keyup", function(){

    const keyword = this.value.toLowerCase();

    products.forEach(product => {

      const name = (product.dataset.name || "").toLowerCase();

      const titleEl = product.querySelector(".card-title");
      const title = titleEl ? titleEl.innerText.toLowerCase() : "";

      if(name.includes(keyword) || title.includes(keyword)){
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }

    });

  });

}
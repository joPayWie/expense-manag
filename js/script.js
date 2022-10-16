/* DOM selector function */

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => documento.querySelectorAll(selector)


/*********************** Burger menu **************************/
// Burger menu variables
 const burgerBtn = $("button.mobile-menu-button")
 const burgerMenu = $(".mobile-menu")

 // Burger menu event listeners
 burgerBtn.addEventListener("click", () => {
    burgerMenu.classList.toggle("hidden");
 })
 
 

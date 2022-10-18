/* DOM selector function */

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => documento.querySelectorAll(selector)

/********************************* DATA FUNCTIONS  *****************/

/******************** DOM FUNCTIONS **********************************/

/*********************** Burger menu **************************/
// Burger menu variables
 const burgerBtn = $("button.mobile-menu-button")
 const burgerMenu = $(".mobile-menu")
 const burgerIconLines = $("#burger-icon-lines")
 const burgerIconX = $("#burger-icon-xmark")

 // Burger menu event listeners
 burgerBtn.addEventListener("click", () => {
   burgerMenu.classList.toggle("hidden");
   burgerIconLines.classList.toggle("hidden")
   burgerIconX.classList.toggle("hidden")   
 })


 /********************* Sections click events *************/

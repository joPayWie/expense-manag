/* DOM selector function */

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

/********************************* DATA FUNCTIONS  *****************/
// Data variables
const tags = [
    { id: 0, 
    name: "Food"},
    { id: 1,
      name: "Education"},
    { id: 2,
      name: "Transfers"},
    { id: 3,
    name: "Services"},
    { id: 4,
    name: "Work"},  
]

// Input data
const inputNewTag = $("#tag-name")

// Functions
const createObject = (array) => {
    newObj = {}
    newObj.id = array.length
    newObj.name = inputNewTag.value
    return newObj
}

console.log(createObject(tags))

const addNewObject = (array, object) => {
    return array.push(object)
}



/******************** DOM FUNCTIONS **********************************/



/************************ Modal *******************************/

// Modal variables
const operationBtn = $("#operation-btn")
const addBtnModal = $("#modal-btn-add")
const cancelBtnModal = $("#modal-btn-cancel")
const modal = $(".operation-modal")
const modalContainer = $(".container-modal")

// Modal event 
operationBtn.addEventListener("click", () => {
    modalContainer.classList.remove("hidden")
})

cancelBtnModal.addEventListener("click", (event) => {
    event.preventDefault()
    modalContainer.classList.add("hidden")
})


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

/************ hide filters  ************/
// hide and unhide filters variables
const hideFilters = $("#toggle-filter")
const filterForm = $("#filter-form")

// hide and unhide filters function
hideFilters.addEventListener("click", () => {
    filterForm.classList.toggle("hidden")
})

/********************* Sections click events *************/
// hide and unhide sections variables
const balanceSection = $("#main-section")
const tagSection = $("#tag-section")
const tagShowLinks = $$(".tag-show-link")
const reportSection = $("#report-section")
const reportShowLinks = $$(".report-show-link")
const balanceShowLinks = $$(".balance-show-link")

for (const balanceLink of balanceShowLinks) {
  balanceLink.addEventListener("click", () => {
    balanceSection.classList.remove("hidden")
    tagSection.classList.add("hidden")
    reportSection.classList.add("hidden")
    burgerMenu.classList.add("hidden")
    burgerIconLines.classList.remove("hidden")
    burgerIconX.classList.add("hidden")
  })
}

for (const tagLink of tagShowLinks) {
  tagLink.addEventListener("click", () => {
    tagSection.classList.remove("hidden")
    balanceSection.classList.add("hidden")
    reportSection.classList.add("hidden")
    burgerMenu.classList.add("hidden")
    burgerIconLines.classList.remove("hidden")
    burgerIconX.classList.add("hidden")
  })
}

for (const reportLink of reportShowLinks) {
  reportLink.addEventListener("click", () => {
    reportSection.classList.remove("hidden")
    balanceSection.classList.add("hidden")
    tagSection.classList.add("hidden")
    burgerMenu.classList.add("hidden")
    burgerIconLines.classList.remove("hidden")
    burgerIconX.classList.add("hidden")
  })
}
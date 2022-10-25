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

// localStorage.setItem("tagList", JSON.stringify(tags))
// const tagsStorage = JSON.parse(localStorage.getItem("tagList")) 

// Input data
const inputNewTag = $("#tag-name")

// Functions
const createObject = (array) => {
    newObj = {}
    newObj.id = array.length
    if ( inputNewTag.value === '' ) {
      return alert(`PLEASE ENTER A TAG NAME. Thank you :)`)
    }
    else ( newObj.name = inputNewTag.value )
    return newObj
}

const addNewObject = (array, object) => {
    return array.push(object)
}


/******************** DOM FUNCTIONS **********************************/
// Dom tags variables
const tagTable = $("#tag-list")
const addTagBtn = $("#tag-btn")

const showTagsOnDisplay = (array) => {
    for (const tag of array) {
      tagTable.innerHTML += `
      <div class="flex justify-between mb-3"> 
        <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] px-1 rounded">${tag.name}</span> 
        <span class="flex">
          <a href="#" class="mx-3"> <img src="EDIT"> </a> 
          <a href="#"> <img src="DELETE"> </a>
        </span> 
      </div>`
    }
}

addTagBtn.addEventListener("click", () => {
    tagTable.innerHTML = ""
    addNewObject(tags, createObject(tags))
    localStorage.setItem("tagList", JSON.stringify(tags)) 
    if ( localStorage.getItem("tagList") ) {
      showTagsOnDisplay(JSON.parse(localStorage.getItem("tagList")))
    }
    else { showTagsOnDisplay(tags) }
})

// first executation
if ( localStorage.getItem("tagList") ) {
  showTagsOnDisplay(JSON.parse(localStorage.getItem("tagList")))
}
else { showTagsOnDisplay(tags) }

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
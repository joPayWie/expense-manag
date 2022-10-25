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

const charactersForId = [
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
]

// General functions

const getRandomCharacter = (array) => {
    let randomIndex = Math.floor(Math.random() * array.length)
    let randomSelection = array[randomIndex];
    return randomSelection  
}

const getRandomId = (array) => {
  let randomIdArr = []
    while (randomIdArr.length < 6) {
      for (let i = 0; i < array.length; i++) {
        let character = getRandomCharacter(array[i])
        randomIdArr.push(character)
      }
    }
    for (let i = randomIdArr.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [randomIdArr[i], randomIdArr[j]] = [randomIdArr[j], randomIdArr[i]];
  }
  return randomIdArr.join('')
}

const addNewObject = (array, object) => {
  return array.push(object)
}


// Local storage for tags list
if (!localStorage.getItem("tagList")) {
  localStorage.setItem("tagList", JSON.stringify(tags))
}

// Input data por tags
const inputNewTag = $("#tag-name")

// Create tag
const createTagObject = () => {
  newObj = {}
  newObj.id = getRandomId(charactersForId)
  if ( inputNewTag.value === '' ) {
    return alert(`PLEASE ENTER A TAG NAME. Thank you :)`)
  }
  else ( newObj.name = inputNewTag.value )
  return newObj
}

/******************** DOM FUNCTIONS **********************************/
// Dom tags variables
const tagTable = $("#tag-list")
const addTagBtn = $("#tag-btn")
const localTagsArr = JSON.parse(localStorage.getItem("tagList"))

// Dom tags functions
const showTagsOnDisplay = (array) => {
    for (const tag of array) {
      tagTable.innerHTML += `
      <div class="flex justify-between mb-3"> 
        <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${tag.name}</span> 
        <span class="flex">
          <a href="#" class="mx-3"> <img src="assets/images/lapiz.png" alt="pencil drawing" class="w-5"> </a> 
          <a href="#"> <img src="assets/images/tachito1.png" alt="garbage drawing" class="w-5 "> </a>
        </span> 
      </div>`
    }
}

addTagBtn.addEventListener("click", () => {
    tagTable.innerHTML = ""
    addNewObject(localTagsArr, createTagObject(localTagsArr))
    localStorage.setItem("tagList", JSON.stringify(localTagsArr)) 
    if ( !localStorage.getItem("tagList") ) {
      localStorage.setItem("tagList", JSON.stringify(localTagsArr))
    }
    else { showTagsOnDisplay(localTagsArr) }
})

// first executation
if ( localStorage.getItem("tagList") ) {
  showTagsOnDisplay(JSON.parse(localStorage.getItem("tagList")))
}
else { showTagsOnDisplay(localTagsArr) }


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


/************ Hide filters  ************/
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
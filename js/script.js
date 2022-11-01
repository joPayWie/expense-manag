/* DOM selector function */

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

/********************************* DATA FUNCTIONS  *****************/
// Data variables
const tags = [
  {
    id: 0,
    name: "Food"
  },
  {
    id: 1,
    name: "Education"
  },
  {
    id: 2,
    name: "Transfers"
  },
  {
    id: 3,
    name: "Services"
  },
  {
    id: 4,
    name: "Work"
  },
]

const operations = []

const charactersForId = [
  ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
]

let balanceObj = {
  total: 0,
  incomes: 0,
  outcomes: 0
}


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

/*********** Operation section ***********/
// Local storage for operations list
if (!localStorage.getItem("operationsList")) {
  localStorage.setItem("operationsList", JSON.stringify(operations))
}

// Input variables for operations
const descriptionInput = $("#description")
const amountInput = $("#amount")
const typeModal = $("#type-modal")
const tagModal = $("#tag-modal")
const dateInputModal = $("#date-modal")
const localOperationsArr = JSON.parse(localStorage.getItem("operationsList"))

// Date
let today = new Date()
dateInputModal.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

const formatDate = (date) => {
  const newDate = date.split("-").reverse()
  return newDate.join("/")
}

// Create operation
const addNewOperationObject = (array, object) => {
  if (descriptionInput.value === '' || amountInput.value === "" || typeModal.value === "All" || tagModal.value === "All") {
    return array
  }
  return array.push(object)

}

const createOperationObject = () => {
  return {
    id: getRandomId(charactersForId),
    description: descriptionInput.value,
    amount: Number(amountInput.value),
    type: typeModal.value,
    tag: tagModal.value,
    date: dateInputModal.value
  }
}

/************** Tags section **************/
// Input variables for tags
const inputNewTag = $("#tag-name")
const errorMessage = $(".span-message")

// Local storage for tags list
if (!localStorage.getItem("tagList")) {
  localStorage.setItem("tagList", JSON.stringify(tags))
}

// Create tag
const addNewTagObject = (array, object) => {
  if (inputNewTag.value === '') {
    return array
  }
  return array.push(object)
}

const createTagObject = () => {
  newObj = {}
  newObj.id = getRandomId(charactersForId)
  if (inputNewTag.value === '') {
    return errorMessage.classList.remove("hidden")
  }
  else {
    newObj.name = inputNewTag.value
    errorMessage.classList.add("hidden")
    return newObj
  }
}


/************** Balance section *******************/
if (!localStorage.getItem("balanceObj")) {
  localStorage.setItem("balanceObj", JSON.stringify(balanceObj))
}

const localBalanceObj = JSON.parse(localStorage.getItem("balanceObj"))

const refreshBalanceObj = (array) => {
  balanceObj.incomes = 0
  balanceObj.outcomes = 0
  balanceObj.total = 0
  for (const { amount, type } of array) {
    if (type === 'income') {
      balanceObj.incomes += Number(amount)
    }
    if (type === 'outcome') {
      balanceObj.outcomes += Number(amount)
    }
  }
  balanceObj.total = balanceObj.incomes - balanceObj.outcomes
  return balanceObj
}

const saveBalanceObj = () => {
  balanceObj = refreshBalanceObj(localOperationsArr)
  return localStorage.setItem("balanceObj", JSON.stringify(balanceObj))
}

/*************** filter functions *****************/
// Filter variables
const filterDate = $("#filter-date")
const filterType = $("#filter-type")
const filterTag = $("#filter-tag")
const filterSort = $("#sort-by")


const filterFunction = (array, key, value) => {
  const filterArr = array.filter(obj => {
    return obj[key] === value
  })
  return filterArr
}

const filterDateFunction = (array) => {
  return array.filter(obj => {
    return Number(obj.date.split("-").join("")) >= Number(filterDate.value.split("-").join(""))
  })
}

const filterNewest = (array) => {
  return array.sort((a, b) => Number(b.date.split("-").join("")) - Number(a.date.split("-").join("")))
}

const filterLatest = (array) => {
  return array.sort((a, b) => Number(a.date.split("-").join("")) - Number(b.date.split("-").join("")))
}

const filterHigherAmount = (array) => {
  return array.sort((a, b) => b.amount - a.amount)
}

const filterLowerAmount = (array) => {
  return array.sort((a, b) => a.amount - b.amount)
}


const filterAToZ = (array) => {
  return array.sort((a, b) => {
    if (a.description < b.description) {
      return -1
    }
    else if (a.name > b.name) {
      return 1
    }
    else {
      return 0
    }
  })
}

const filterZToA = (array) => {
  return array.sort((a, b) => {
    if (a.description > b.description) {
      return -1
    }
    else if (a.name < b.name) {
      return 1
    }
    else {
      return 0
    }
  })
}

const filterOperations = () => {
  let operationsScope = localOperationsArr

  if (filterType.value !== 'all') {
    operationsScope = filterFunction(operationsScope, 'type', filterType.value)
  }
  if (filterTag.value !== 'all') {
    operationsScope = filterFunction(operationsScope, 'tag', filterTag.value)
  }

  operationsScope = filterDateFunction(operationsScope)

  if (filterSort.value === "a-z") {
    operationsScope = filterAToZ(operationsScope)
  }
  if (filterSort.value === 'z-a') {
    operationsScope = filterZToA(operationsScope)
  }
  if (filterSort.value === "higher"){
    operationsScope = filterHigherAmount(operationsScope)
  }
  if(filterSort.value === "lower"){
    operationsScope = filterLowerAmount(operationsScope)
  }
  if(filterSort.value === "newest"){
    operationsScope = filterNewest(operationsScope)
  }
  if(filterSort.value === "latest"){
    operationsScope = filterLatest(operationsScope)
  }
  return operationsScope
}

/******************** DOM FUNCTIONS **********************************/
// Dom balance variables
const totalIncomesDom = $("#total-incomes")
const totalOutcomesDom = $("#total-outcomes")
const totalRemainingDom = $("#total-remaining")

const showTotalsOnDisplay = (object) => {
  totalIncomesDom.innerHTML = `${object.incomes}`
  totalOutcomesDom.innerHTML = `${object.outcomes}`
  totalRemainingDom.innerHTML = `${object.total}`
}

// Dom operations variables 
const operationTableContainer = $("#operations-object-table")
const modalBtnAdd = $("#modal-btn-add")
const noResultContainer = $("#operations-noresult-container")
const operationHeaderTable = $("#operations-header-table")
const divTableOperations = $("#div-table-operations")

// Dom operations functions and events
const mediumScreen = window.matchMedia("(min-width: 768px)")

const showOperationsOnDisplay = (array) => {
  operationTableContainer.innerHTML = ''
  for (const { description, amount, type, tag, date } of array) {
    if (mediumScreen.matches) {
      operationTableContainer.innerHTML += `
          <tr class="text-center text-sm">
              <td>${description}</td>
              <td>
                <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${tag}</span> 
              </td>
              <td class="hidden md:table-cell">${formatDate(date)}</td>
              <td class="font-semibold ${type === "income" ? "text-green-600" : "text-red-600"}">${type === "income" ? "$" : "-$"}${amount}</td>
              <td>
                <span class="flex justify-center">
                <a href="#" class="mx-2 py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/lapiz.png" aria-label="edit" alt="pencil drawing" class="w-5"> </a> 
                <a href="#" class="mx-2 py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/tachito1.png" aria-label="delete" alt="garbage drawing" class="w-5 "> </a>
                </span> 
              </td>
          </tr>`
    }
    else {
      operationTableContainer.innerHTML += `
        <tr class="h-10">
          <tr>
            <td>${description}</td>
            <td class="flex justify-end">
              <span class="text-xs bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${tag}</span> 
            </td>
          </tr>
          <tr>
            <td class="font-semibold ${type === "income" ? "text-green-600" : "text-red-600"} text-lg">${type === "income" ? "$" : "-$"}${amount}</td>
            <td>
              <span class="flex justify-end">
                <a href="#" class="py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/lapiz.png" aria-label="edit" alt="pencil drawing" class="w-5"> </a> 
                <a href="#" class="py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/tachito1.png" aria-label="delete" alt="garbage drawing" class="w-5 "> </a>
              </span> 
            </td>
          </tr>
        </tr>`
    }
  }
}


// Showing or not showing table head
const noResultsOrResults = () => {
  if (localOperationsArr.length === 0) {
    noResultContainer.classList.remove("hidden")
    divTableOperations.classList.add("hidden")
  } else {
    noResultContainer.classList.add("hidden")
    divTableOperations.classList.remove("hidden")
    operationHeaderTable.classList.remove("md:hidden")
    operationHeaderTable.classList.add("md:table-header-group")
    showOperationsOnDisplay(localOperationsArr)
  }
}

modalBtnAdd.addEventListener("click", (e) => {
  e.preventDefault()
  operationTableContainer.innerHTML = ""
  addNewOperationObject(localOperationsArr, createOperationObject())
  localStorage.setItem("operationsList", JSON.stringify(localOperationsArr))
  showOperationsOnDisplay(localOperationsArr)
  refreshBalanceObj(localOperationsArr)
  saveBalanceObj()
  showTotalsOnDisplay(balanceObj)
  modalContainer.classList.add("hidden")
  divTableOperations.classList.remove("hidden")
  noResultContainer.classList.add("hidden")
  operationHeaderTable.classList.remove("md:hidden")
  operationHeaderTable.classList.add("md:table-header-group")
})


// Dom tags variables
const tagTable = $("#tag-list")
const addTagBtn = $("#tag-btn")
const localTagsArr = JSON.parse(localStorage.getItem("tagList"))

// Dom tags functions and events
const showTagsOnDisplay = (array) => {
  for (const tag of array) {
    tagTable.innerHTML += `
      <div class="flex justify-between items-center mb-3"> 
        <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${tag.name}</span> 
        <span class="flex">
          <a href="#" class="mx-3 py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/lapiz.png" alt="pencil drawing" class="w-5"> </a> 
          <a href="#"  class="py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/tachito1.png" alt="garbage drawing" class="w-5"> </a>
        </span> 
      </div>`
  }
}

const addTagTypeFilter = () => {
  for (const tag of localTagsArr) {
    filterTag.innerHTML += `
    <option value="${tag.name}">${tag.name}</option>`
  }
}

// First tag execution

if (localStorage.getItem("tagList")) {
  showTagsOnDisplay(JSON.parse(localStorage.getItem("tagList")))
}
else { showTagsOnDisplay(localTagsArr) }

addTagBtn.addEventListener("click", () => {
  tagTable.innerHTML = ""
  addNewTagObject(localTagsArr, createTagObject(localTagsArr))
  localStorage.setItem("tagList", JSON.stringify(localTagsArr))
  if (!localStorage.getItem("tagList")) {
    localStorage.setItem("tagList", JSON.stringify(localTagsArr))
  }
  else {
    showTagsOnDisplay(localTagsArr)
    filterTag.innerHTML = `<option value="all">All</option>`
    addTagTypeFilter()
    inputNewTag.value = ""
  }
})


// Dom filters
const filterUserSelection = $$(".filter-user-selection")

let month = new Date()
filterDate.value = today.getFullYear() + '-' + ('0' + (today.getMonth())).slice(-2) + '-' + "01";


for (const selection of filterUserSelection) {
  selection.addEventListener("change", () => {
    showOperationsOnDisplay(filterOperations())
    showTotalsOnDisplay(refreshBalanceObj(filterOperations()))
  })
}

/************************ Modal *******************************/
// Modal variables
const operationBtn = $("#operation-btn")
const addBtnModal = $("#modal-btn-add")
const cancelBtnModal = $("#modal-btn-cancel")
const modalContainer = $(".container-modal")
const operationModalForm = $("#operation-modal-form")

// Modal tags
const addTagModal = () => {
  tagModal.innerHTML = ''
  for (const { name } of localTagsArr) {
    tagModal.innerHTML += `
    <option value="${name}">${name}</option>`
  }
}

// Modal event 
operationBtn.addEventListener("click", () => {
  modalContainer.classList.remove("hidden")
  operationModalForm.reset()
  addTagModal()
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

/********************* Sections events *************/
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


// responsive operations section
window.addEventListener("resize", () => {
  showOperationsOnDisplay(filterOperations())
})


// executions when refresh
showTotalsOnDisplay(localBalanceObj)

noResultsOrResults()

addTagTypeFilter()

  // showOperationsOnDisplay(filterOperations())
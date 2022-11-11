/* DOM selector function */

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

/*
------------------------------------------------------------------------
DATA FUNCTIONS
------------------------------------------------------------------------ 
*/

// Data variables
let tags = [
  {
    id: "0",
    name: "Food"
  },
  {
    id: "1",
    name: "Education"
  },
  {
    id: "2",
    name: "Transfers"
  },
  {
    id: "3",
    name: "Services"
  },
  {
    id: "4",
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

/*
------------------------------------------------------------------------
General data functions
------------------------------------------------------------------------ 
*/
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

// localStorage functions
const setItemInLocal = (key, array) => localStorage.setItem(key, JSON.stringify(array))

/*
------------------------------------------------------------------------
Operations data functionality
------------------------------------------------------------------------ 
*/
// Local storage for operations list
if (!localStorage.getItem("operationsList")) {
  setItemInLocal("operationsList", operations)
}

// Input variables for operations
const descriptionInput = $("#description")
const amountInput = $("#amount")
const typeModal = $("#type-modal")
const tagModal = $("#tag-modal")
const dateInputModal = $("#date-modal")
let localOperationsArr = JSON.parse(localStorage.getItem("operationsList"))

// Date
let today = new Date()
dateInputModal.value = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

const formatDate = (date) => {
  const newDate = date.split("-").reverse()
  return newDate.join("/")
}

// Create operation
const addNewOperationObject = (operationsArr, operation) => {
  if (descriptionInput.value === '' || amountInput.value === "" || typeModal.value === "All" || tagModal.value === "All") {
    return operationsArr
  }
  return operationsArr.push(operation)
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

/*
------------------------------------------------------------------------
Tags data functionality
------------------------------------------------------------------------ 
*/
// Input variables for tags
const inputNewTag = $("#tag-name")
const errorMessage = $(".span-message")

// Local storage for tags list
if (!localStorage.getItem("tagList")) {
  setItemInLocal("tagList", tags)
}

// Create tag
const addNewTagObject = (tagArr, tag) => {
  if (inputNewTag.value === '') {
    return tagArr
  }
  return tagArr.push(tag)
}

const createTagObject = () => {
  newObj = {}
  newObj.id = getRandomId(charactersForId)
  if (inputNewTag.value === '') {
    return unhideElement(errorMessage)
  }
  else {
    newObj.name = inputNewTag.value
    hideElement(errorMessage)
    return newObj
  }
}

/*
------------------------------------------------------------------------
Balance data functionality
------------------------------------------------------------------------ 
*/
if (!localStorage.getItem("balanceObj")) {
  setItemInLocal("balanceObj", balanceObj)
}

const localBalanceObj = JSON.parse(localStorage.getItem("balanceObj"))

const refreshBalanceObj = (operationsArr) => {
  balanceObj.incomes = 0
  balanceObj.outcomes = 0
  balanceObj.total = 0
  for (const { amount, type } of operationsArr) {
    if (type === 'income') {
      balanceObj.incomes += amount
    }
    if (type === 'outcome') {
      balanceObj.outcomes += amount
    }
  }
  balanceObj.total = balanceObj.incomes - balanceObj.outcomes
  return balanceObj
}

const saveBalanceObj = () => {
  balanceObj = refreshBalanceObj(localOperationsArr)
  return setItemInLocal("balanceObj", balanceObj)
}

/*
------------------------------------------------------------------------
Filters functionality
------------------------------------------------------------------------ 
*/
// Filter variables
const filterDate = $("#filter-date")
const filterType = $("#filter-type")
const filterTag = $("#filter-tag")
const filterSort = $("#sort-by")


const filterBy = (operationsArr, key, value) => {
  const filterArr = operationsArr.filter(operation => {
    return operation[key] === value
  })
  return filterArr
}

const filterByDate = (operationsArr) => {
  return operationsArr.filter(operation => {
    return Number(operation.date.split("-").join("")) >= Number(filterDate.value.split("-").join(""))
  })
}

const filterNewest = (operationsArr) => {
  return operationsArr.sort((a, b) => Number(b.date.split("-").join("")) - Number(a.date.split("-").join("")))
}

const filterHigherAmount = (operationsArr) => {
  return operationsArr.sort((a, b) => b.amount - a.amount)
}

const filterAToZ = (operationsArr) => {
  return operationsArr.sort((a, b) => {
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

const filterOperations = () => {
  let operationsScope = localOperationsArr

  if (filterType.value !== 'all') {
    operationsScope = filterBy(operationsScope, 'type', filterType.value)
  }
  if (filterTag.value !== 'all') {
    operationsScope = filterBy(operationsScope, 'tag', filterTag.value)
  }

  operationsScope = filterByDate(operationsScope)

  if (filterSort.value === "a-z") {
    operationsScope = filterAToZ(operationsScope)
  }
  if (filterSort.value === 'z-a') {
    operationsScope = filterAToZ(operationsScope).reverse()
  }
  if (filterSort.value === "higher") {
    operationsScope = filterHigherAmount(operationsScope)
  }
  if (filterSort.value === "lower") {
    operationsScope = filterHigherAmount(operationsScope).reverse()
  }
  if (filterSort.value === "newest") {
    operationsScope = filterNewest(operationsScope)
  }
  if (filterSort.value === "oldest") {
    operationsScope = filterNewest(operationsScope).reverse()
  }
  return operationsScope
}

/*
------------------------------------------------------------------------
Report section functionality
------------------------------------------------------------------------ 
*/
const getObjWithMaxIncomeOrOutcome = (operationsArr, typeSearched) => {
  let objWithMaxIncomeOrOutcome = {}
  let counter = 0
  for (const operation of operationsArr) {
    let adding = 0
    for (const key of Object.keys(operation)) {
      if (key === typeSearched) {
        adding += operation[key]
      }
      if (adding > counter) {
        objWithMaxIncomeOrOutcome = operation
        counter = adding
      }
    }
  }
  return objWithMaxIncomeOrOutcome
}

// Tags
const filterArrByTag = (operationsArr, tagSearched) => {
  return operationsArr.filter(operation => {
    return operation.tag === tagSearched
  })
}

const calculateReportBalanceByTag = () => {
  let arrBalanceByTag = []
  let totalIncomes = 0
  let totalOutcomes = 0
  let total = 0
  for (const { name } of localTagsArr) {
    let arrayByTag = filterArrByTag(localOperationsArr, name)
    totalIncomes = 0
    totalOutcomes = 0
    total = 0
    for (const { amount, type } of arrayByTag) {
      if (type === 'income') {
        totalIncomes += amount
      }
      if (type === 'outcome') {
        totalOutcomes += amount
      }
      total = totalIncomes - totalOutcomes
    }
    arrBalanceByTag.push({
      tag: name,
      income: totalIncomes,
      outcome: totalOutcomes,
      total: total
    })
  }
  return arrBalanceByTag
}

const getTagWithMaxBalance = () => {
  let objWithMaxBalance = {}
  let adding = 0
  for (const obj of calculateReportBalanceByTag()) { 
    if (adding < obj.total) {
      objWithMaxBalance = {
        name: obj.tag,
        total: obj.total
      }
      adding = obj.total
    }
  }
  return objWithMaxBalance
}

// Dates
const formatArrDate = (operationsArr) => {
  return operationsArr.map(operation => {
    return {
      ...operation,
      date: ((operation.date.split("-").join("")).slice(0, 6))
    }
  })
}

const filterArrByDate = (operationsArr, dateSearched) => {
  return operationsArr.filter(operation => {
    return operation.date === dateSearched
  })
}

const calculateReportBalanceByDate = () => {
  let arrBalanceByDate = []
  let datesArr = []
  let totalIncomes = 0
  let totalOutcomes = 0
  let total = 0
  let operationsScope = formatArrDate(localOperationsArr)
  for (const { date } of operationsScope) {
    if (!datesArr.includes(date)) {
      datesArr.push(date)
    }
  }
  for (const date of datesArr) {
    let arrayByDate = filterArrByDate(operationsScope, date)
    totalIncomes = 0
    totalOutcomes = 0
    total = 0
    for (const { amount, type } of arrayByDate) {
      if (type === 'income') {
        totalIncomes += amount
      }
      if (type === 'outcome') {
        totalOutcomes += amount
      }
      total = totalIncomes - totalOutcomes
    }
    arrBalanceByDate.push({
      date: date,
      income: totalIncomes,
      outcome: totalOutcomes,
      total: total
    })
  }
  return arrBalanceByDate
}

/*
------------------------------------------------------------------------
DOM FUNCTIONS
------------------------------------------------------------------------ 
*/
// Dom general functions
const cleanHTML = (selector) => selector.innerHTML = ''


const hideElement = (selector) => selector.classList.add("hidden")


const unhideElement = (selector) => selector.classList.remove("hidden")

// Dom balance variables
const totalIncomesDom = $("#total-incomes")
const totalOutcomesDom = $("#total-outcomes")
const totalRemainingDom = $("#total-remaining")

const showTotalsOnDisplay = (object) => {
  totalIncomesDom.innerHTML = `${object.incomes}`
  totalOutcomesDom.innerHTML = `${object.outcomes}`
  totalRemainingDom.innerHTML = `${object.total}`
}

// Dom operations and report variables 
const operationTableContainer = $("#operations-object-table")
const noResultContainer = $("#operations-noresult-container")
const operationHeaderTable = $("#operations-header-table")
const divTableOperations = $("#div-table-operations")
const reportTableContainer = $("#report-table-container")
const noResultReportContainer = $("#report-noresult-container")

// Dom operations functions and events

// Showing or not showing table head
const noResultsOrResults = () => {
  if (localOperationsArr.length === 0) {
    unhideElement(noResultContainer)
    unhideElement(noResultReportContainer)
    hideElement(divTableOperations)
    hideElement(reportTableContainer)
  }
  if ((filterOperations()).length === 0) {
    unhideElement(noResultContainer)
    hideElement(divTableOperations)
  }
  else {
    hideElement(noResultContainer)
    unhideElement(divTableOperations)
    operationHeaderTable.classList.remove("md:hidden")
    operationHeaderTable.classList.add("md:table-header-group")
    hideElement(noResultReportContainer)
    unhideElement(reportTableContainer)
    showOperationsOnDisplay(filterOperations())
  }
}

// for responsive
const mediumScreen = window.matchMedia("(min-width: 768px)")

const showOperationsOnDisplay = (operationsArr) => {
  cleanHTML(operationTableContainer)
  for (const { id, description, amount, type, tag, date } of operationsArr) {
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
                <a href="#" onclick='modalEdit("${id}")' data-id="${id}" class="edit-operation-btn get-id mx-2 py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/lapiz.png" aria-label="edit" alt="pencil drawing" class="w-5"> </a> 
                <a href="#" onclick='deleteObj("${id}")' class="get-id mx-2 py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/tachito1.png" aria-label="delete" alt="garbage drawing" class="w-5 "> </a>
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
                <a href="#" onclick='modalEdit("${id}")' data-id="${id}" class="edit-operation-btn get-id py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/lapiz.png" aria-label="edit" alt="pencil drawing" class="w-5"> </a> 
                <a href="#" onclick='deleteObj("${id}")' class="get-id py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/tachito1.png" aria-label="delete" alt="garbage drawing" class="w-5 "> </a>
              </span> 
            </td>
          </tr>
        </tr>`
    }
  }
}


// Dom tags variables
const tagTable = $("#tag-list")
const addTagBtn = $("#tag-btn")
let localTagsArr = JSON.parse(localStorage.getItem("tagList"))

// Dom tags functions and events
const showTagsOnDisplay = (tagArr) => {
  cleanHTML(tagTable)
  for (const { id, name } of tagArr) {
    tagTable.innerHTML += `
      <div class="flex justify-between items-center mb-3"> 
        <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${name}</span> 
        <span class="flex">
          <a href="#" onclick='editTagName("${id}")' class="mx-3 py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/lapiz.png" alt="pencil drawing" class="w-5"> </a> 
          <a href="#" onclick='deleteTagAdvertising("${id}")' class="py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/tachito1.png" alt="garbage drawing" class="w-5"> </a>
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
  cleanHTML(tagTable)
  addNewTagObject(localTagsArr, createTagObject(localTagsArr))
  setItemInLocal("tagList", localTagsArr)
  showTagsOnDisplay(localTagsArr)
  filterTag.innerHTML = `<option value="all">All</option>`
  addTagTypeFilter()
  inputNewTag.value = ""
})


// Dom filters
const filterUserSelection = $$(".filter-user-selection")

let todayFirst = new Date()
filterDate.value = todayFirst.getFullYear() + '-' + (todayFirst.getMonth() + 1) + '-' + "01";

for (const selection of filterUserSelection) {
  selection.addEventListener("change", () => {
    noResultsOrResults()
    showOperationsOnDisplay(filterOperations())
    showTotalsOnDisplay(refreshBalanceObj(filterOperations()))
  })
}

filterTag.addEventListener("click", () => {
  cleanHTML(filterTag)
  filterTag.innerHTML = `<option value="all">All</option>`
  addTagTypeFilter()
})

// Dom report 
const totalByTagTable = $("#total-by-tag-table")
const totalByMonthTable = $("#total-by-month-table")
const tagWithMaxInc = $("#tag-max-income")
const tagWithMaxIncAmount = $("#tag-max-income-amount")
const tagWithMaxOut = $("#tag-max-outcome")
const tagWithMaxOutAmount = $("#tag-max-outcome-amount")
const tagWithMaxBal = $("#tag-max-balance")
const tagWithMaxBalAmount = $("#tag-max-balance-amount")
let monthWithMaxInc = $("#month-max-income")
let monthWithMaxIncAmount = $("#month-max-income-amount")
let monthWithMaxOut = $("#month-max-outcome")
let monthWithMaxOutAmount = $("#month-max-outcome-amount")

const editSummaryDate = (monthVariable) => {
  monthVariable.date = monthVariable.date.split('')
  monthVariable.date.splice(4, 0, '/')
  return monthVariable
}

const showSummaryOnDisplay = () => {
  let tagMaxIncome = getObjWithMaxIncomeOrOutcome(calculateReportBalanceByTag(), 'income')
  let tagMaxOutcome = getObjWithMaxIncomeOrOutcome(calculateReportBalanceByTag(), 'outcome')
  let tagMaxBalance = getTagWithMaxBalance()
  let monthMaxIncome = getObjWithMaxIncomeOrOutcome(calculateReportBalanceByDate(), 'income')
  let monthMaxOutcome = getObjWithMaxIncomeOrOutcome(calculateReportBalanceByDate(), 'outcome')
  let arrTotalsByTag = calculateReportBalanceByTag()
  let arrTotalsByDate = filterNewest(calculateReportBalanceByDate())

  cleanHTML(totalByTagTable)
  cleanHTML(totalByMonthTable)

  if (!!tagMaxIncome.income && !!tagMaxOutcome.outcome && !!tagMaxBalance.name) {
    unhideElement(reportTableContainer)
    hideElement(noResultReportContainer)
    editSummaryDate(monthMaxIncome)
    editSummaryDate(monthMaxOutcome)
    tagWithMaxInc.innerHTML = `${tagMaxIncome.tag}`
    tagWithMaxIncAmount.innerHTML = `$${tagMaxIncome.income}`
    tagWithMaxOut.innerHTML = `${tagMaxOutcome.tag}`
    tagWithMaxOutAmount.innerHTML = `-$${tagMaxOutcome.outcome}`
    tagWithMaxBal.innerHTML = `${tagMaxBalance.name}`
    tagWithMaxBalAmount.innerHTML = `$${tagMaxBalance.total}`
    monthWithMaxInc.innerHTML = `${monthMaxIncome.date.join('')}`
    monthWithMaxIncAmount.innerHTML = `$${monthMaxIncome.income}`
    monthWithMaxOut.innerHTML = `${monthMaxOutcome.date.join('')}`
    monthWithMaxOutAmount.innerHTML = `-$${monthMaxOutcome.outcome}`

    for (const tagObj of arrTotalsByTag) {
      totalByTagTable.innerHTML += `     
      <tr class="text-start text-sm w-full">
        <td class="w-1/3 text-start">
              <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${tagObj.tag}</span> 
            </td>
        <td class="text-end font-semibold text-green-600"> $${tagObj.income} </td>
        <td class="text-end font-semibold text-red-600">-$${tagObj.outcome}</td>
        <td class="text-end font-semibold">$${tagObj.total}</td>
      </tr> `
    }

    for (const dateObj of arrTotalsByDate) {
      editSummaryDate(dateObj)
      totalByMonthTable.innerHTML += `     
      <tr class="text-start text-sm w-full">
        <td class="w-1/3"> ${dateObj.date.join('')} </td>
        <td class="text-end font-semibold text-green-600"> $${dateObj.income} </td>
        <td class="text-end font-semibold text-red-600">-$${dateObj.outcome}</td>
        <td class="text-end font-semibold">$${dateObj.total}</td>
      </tr> `
    }
  }
  else {
    hideElement(reportTableContainer)
    unhideElement(noResultReportContainer)
  }
}

/*
------------------------------------------------------------------------
EDIT and DELETE buttons functionality
------------------------------------------------------------------------ 
*/
const findObj = (arr, elementId) => arr.find(({ id }) => id === elementId)

const removeObjOfArray = (operationsArr, elementId) => operationsArr.filter(({ id }) => id !== elementId)

// Operations delete button
const deleteObj = (elementId) => {
  localOperationsArr = removeObjOfArray(localOperationsArr, elementId)
  setItemInLocal("operationsList", localOperationsArr)
  showOperationsOnDisplay(filterOperations())
  refreshBalanceObj(localOperationsArr)
  saveBalanceObj()
  showTotalsOnDisplay(balanceObj)
  noResultsOrResults()
}

// Tags delete button
const deleteTagModal = $("#delete-tag-modal")
const deleteTagAcceptBtn = $("#delete-tag-accept-btn")
const deleteTagCancelBtn = $("#delete-tag-cancel-btn")

const deleteTagAdvertising = (elementId) => {
  unhideElement(deleteTagModal)
  deleteTagAcceptBtn.setAttribute("data-id", elementId)
}

const deleteTag = () => {
  let tagId = deleteTagAcceptBtn.getAttribute("data-id")
  let tagToDelete = findObj(localTagsArr, tagId)
  for (const operation of localOperationsArr) {
    const { id, tag } = operation 
    if ( tagToDelete.name === tag ) {
      deleteObj(id)
    }
  }
  localTagsArr = removeObjOfArray(localTagsArr, tagId)
  setItemInLocal("tagList", localTagsArr)
  showTagsOnDisplay(localTagsArr)
}

deleteTagAcceptBtn.addEventListener("click", () => {
  deleteTag()
  hideElement(deleteTagModal)
  addTagTypeFilter()
  if (localTagsArr.length === 0) {
    tagTable.innerHTML = `<span class="text-red-600"> It seems that you are out of tags! Please add one to continue </span>`
  }
})

deleteTagCancelBtn.addEventListener("click", () => {
  hideElement(deleteTagModal)
})

// Operations edit button
const editContainerModal = $(".edit-container-modal")
const editDescription = $("#edit-description")
const editAmount = $("#edit-amount")
const editType = $("#edit-type")
const editTag = $("#edit-tag")
const editDate = $("#edit-date")
const editSaveBtn = $("#edit-save-btn")
const editCancelBtn = $("#edit-cancel-btn")
const editModalBtn = $$(".edit-operation-btn")
const editModalError = $(".edit-modal-error")

const modalEdit = (elementId) => {
  hideElement(editModalError)
  editSaveBtn.setAttribute("data-id", elementId)
  addTagModal(editTag)
  let obj = findObj(localOperationsArr, elementId)
  unhideElement(editContainerModal)
  editDescription.value = obj.description
  editAmount.value = obj.amount
  editType.value = obj.type
  editTag.value = obj.tag
  editDate.value = obj.date
}

const updateOperationObj = (elementId) => {
  return {
    id: elementId,
    description: editDescription.value,
    amount: Number(editAmount.value),
    type: editType.value,
    tag: editTag.value,
    date: editDate.value
  }
}

const editOperationObj = (operationsArr, elementId) => {
  return operationsArr.map(obj => {
    if (obj.id === elementId) {
      return updateOperationObj(elementId)
    }
    return obj
  })
}

editSaveBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (editDescription.value === "") {
    return unhideElement(editModalError)
  } 
  operationTableContainer.innerHTML = ""
  const elementId = editSaveBtn.getAttribute("data-id")
  localOperationsArr = editOperationObj(localOperationsArr, elementId)
  setItemInLocal("operationsList", localOperationsArr)
  showOperationsOnDisplay(filterOperations())
  refreshBalanceObj(filterOperations())
  saveBalanceObj()
  showTotalsOnDisplay(balanceObj)
  showSummaryOnDisplay()
  hideElement(editContainerModal)
})

editCancelBtn.addEventListener("click", (e) => {
  e.preventDefault()
  hideElement(editContainerModal)
})

// Tag edit button
const editTagContainerModal = $(".edit-tag-name-container")
const editTagNameInput = $("#edit-tag-name")
const editTagNameSaveBtn = $("#edit-tag-save-btn")
const editTagNameCancelBtn = $("#edit-tag-cancel-btn")
const errorEditTagMessage = $(".tag-span-message")

const editTagName = (elementId) => {
  editTagNameSaveBtn.setAttribute("data-id", elementId)
  let tagObj = findObj(localTagsArr, elementId)
  editTagNameSaveBtn.setAttribute("old-tag-name", tagObj.name)
  unhideElement(editTagContainerModal)
  editTagNameInput.value = tagObj.name
}

const updateTagObj = (elementId) => {
  return {
    id: elementId,
    name: editTagNameInput.value
  }
}

const editTagObj = (tagArr, elementId) => {
  return tagArr.map(tag => {
    if (tag.id === elementId) {
      return updateTagObj(elementId)
    }
    return tag
  })
}

editTagNameSaveBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (editTagNameInput.value !== '') {
    tagTable.innerHTML = ""
    const elementId = editTagNameSaveBtn.getAttribute("data-id")
    const oldTagName = editTagNameSaveBtn.getAttribute("old-tag-name")
    localTagsArr = editTagObj(localTagsArr, elementId)
    setItemInLocal("tagList", localTagsArr)
    showTagsOnDisplay(localTagsArr)
    hideElement(editTagContainerModal)
    for (const operation of localOperationsArr) {
      if ( operation.tag === oldTagName ) {
        operation.tag = editTagNameInput.value
      }
    }
  setItemInLocal("operationsList", localOperationsArr)
  }
  else {
    unhideElement(errorEditTagMessage)
  }
})

editTagNameCancelBtn.addEventListener("click", (e) => {
  e.preventDefault()
  hideElement(editTagContainerModal)
})

/*
------------------------------------------------------------------------
MODAL
------------------------------------------------------------------------ 
*/
// Modal variables
const operationBtn = $("#operation-btn")
const modalBtnAdd = $("#modal-btn-add")
const cancelBtnModal = $("#modal-btn-cancel")
const modalContainer = $(".container-modal")
const operationModalForm = $("#operation-modal-form")
const modalErrorDescription = $(".operation-modal-error-description")
const modalErrorAmount = $(".operation-modal-error-amount")

// Modal tags
const addTagModal = (selector) => {
  cleanHTML(selector)
  for (const { name } of localTagsArr) {
    selector.innerHTML += `
    <option value="${name}">${name}</option>`
  }
}

// Modal event 
operationBtn.addEventListener("click", () => {
  hideElement(modalErrorDescription)
  hideElement(modalErrorAmount)
  unhideElement(modalContainer)
  operationModalForm.reset()
  addTagModal(tagModal)
})

cancelBtnModal.addEventListener("click", (e) => {
  e.preventDefault()
  hideElement(modalContainer)
})

modalBtnAdd.addEventListener("click", (e) => {
  e.preventDefault()
  hideElement(modalErrorDescription)
  hideElement(modalErrorAmount)
  if (descriptionInput.value === "" && amountInput.value === "") {
    unhideElement(modalErrorDescription)
    return unhideElement(modalErrorAmount)
  }
  if (descriptionInput.value === "") {
    return unhideElement(modalErrorDescription)
  }
  if (amountInput.value === "") {
    return unhideElement(modalErrorAmount)
  }
  cleanHTML(operationTableContainer)
  addNewOperationObject(localOperationsArr, createOperationObject())
  setItemInLocal("operationsList", localOperationsArr)
  showOperationsOnDisplay(filterOperations())
  refreshBalanceObj(filterOperations())
  saveBalanceObj()
  showTotalsOnDisplay(balanceObj)
  noResultsOrResults()
  hideElement(modalContainer)
})

/*
------------------------------------------------------------------------
BURGER MENU
------------------------------------------------------------------------ 
*/
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

/*
------------------------------------------------------------------------
SECTIONS hide and unhide events
------------------------------------------------------------------------ 
*/
// hide and unhide sections variables
const balanceSection = $("#main-section")
const tagSection = $("#tag-section")
const reportSection = $("#report-section")
const reportShowLinks = $$(".report-show-link")
const balanceShowLinks = $$(".balance-show-link")
const tagShowLinks = $$(".tag-show-link")

const hideBurgerMenu = () => {
  hideElement(burgerMenu)
  unhideElement(burgerIconLines)
  hideElement(burgerIconX)
}

for (const balanceLink of balanceShowLinks) {
  balanceLink.addEventListener("click", () => {
    unhideElement(balanceSection)
    hideElement(tagSection)
    hideElement(reportSection)
    hideBurgerMenu()
    showOperationsOnDisplay(filterOperations())
  })
}

for (const tagLink of tagShowLinks) {
  tagLink.addEventListener("click", () => {
    unhideElement(tagSection)
    hideElement(balanceSection)
    hideElement(reportSection)
    hideBurgerMenu()
  })
}

for (const reportLink of reportShowLinks) {
  reportLink.addEventListener("click", () => {
    unhideElement(reportSection)
    hideElement(balanceSection)
    hideElement(tagSection)
    hideBurgerMenu()
    showSummaryOnDisplay()
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

showOperationsOnDisplay(filterOperations())

/* DOM selector function */

const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

/********************************* DATA FUNCTIONS  *****************/
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
let localOperationsArr = JSON.parse(localStorage.getItem("operationsList"))

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

const filterOldest = (array) => {
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
  if (filterSort.value === "higher") {
    operationsScope = filterHigherAmount(operationsScope)
  }
  if (filterSort.value === "lower") {
    operationsScope = filterLowerAmount(operationsScope)
  }
  if (filterSort.value === "newest") {
    operationsScope = filterNewest(operationsScope)
  }
  if (filterSort.value === "oldest") {
    operationsScope = filterOldest(operationsScope)
  }
  return operationsScope
}

/************* EDIT AND DELETE BUTTON FUNCTIONALITY ************/
const findObj = (array, elementId) => array.find(({ id }) => id === elementId)

const removeObjOfArray = (array, elementId) => array.filter(({ id }) => id !== elementId)

// Operations delete button
const deleteObj = (elementId) => {
  localOperationsArr = removeObjOfArray(localOperationsArr, elementId)
  localStorage.setItem("operationsList", JSON.stringify(localOperationsArr))
  showOperationsOnDisplay(filterOperations())
  refreshBalanceObj(localOperationsArr)
  saveBalanceObj()
  showTotalsOnDisplay(balanceObj)
  noResultsOrResults()
}

// Tags delete button
const deleteTag = (elementId) => {
  localTagsArr = removeObjOfArray(localTagsArr, elementId)
  localStorage.setItem("tagList", JSON.stringify(localTagsArr))
  showTagsOnDisplay(localTagsArr)
}

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
  editModalError.classList.add("hidden")
  editSaveBtn.setAttribute("data-id", elementId)
  addTagModal(editTag)
  let obj = findObj(localOperationsArr, elementId)
  editContainerModal.classList.remove("hidden")
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

const editOperationObj = (array, elementId) => {
  return array.map(obj => {
    if (obj.id === elementId) {
      return updateOperationObj(elementId)
    }
    return obj
  })
}

editSaveBtn.addEventListener("click", (e) => {
  if (editDescription.value === ""){
    return editModalError.classList.remove("hidden")
  }
  e.preventDefault()
  operationTableContainer.innerHTML = ""
  const elementId = editSaveBtn.getAttribute("data-id")
  localOperationsArr = editOperationObj(localOperationsArr, elementId)
  localStorage.setItem("operationsList", JSON.stringify(localOperationsArr))
  showOperationsOnDisplay(filterOperations())
  refreshBalanceObj(filterOperations())
  saveBalanceObj()
  showTotalsOnDisplay(balanceObj)
  showSummaryOnDisplay()
  editContainerModal.classList.add("hidden")
})

editCancelBtn.addEventListener("click", (e) => {
  e.preventDefault()
  editContainerModal.classList.add("hidden")
}) // this function can be refactorized to use it with the edit tag cancel btn as well

// Tag edit button
const editTagContainerModal = $(".edit-tag-name-container")
const editTagNameInput = $("#edit-tag-name")
const editTagNameSaveBtn = $("#edit-tag-save-btn")
const editTagNameCancelBtn = $("#edit-tag-cancel-btn")
const errorEditTagMessage = $(".tag-span-message")

const editTagName = (elementId) => {
  editTagNameSaveBtn.setAttribute("data-id", elementId)
  let obj = findObj(localTagsArr, elementId)
  editTagContainerModal.classList.remove("hidden")
  editTagNameInput.value = obj.name
}

const updateTagObj = (elementId) => {
  return {
    id: elementId,
    name: editTagNameInput.value
  }
}

const editTagObj = (array, elementId) => {
  return array.map(obj => {
    if (obj.id === elementId) {
      return updateTagObj(elementId)
    }
    return obj
  })
}

editTagNameSaveBtn.addEventListener("click", (e) => {
  e.preventDefault()
  if (editTagNameInput.value !== '') {
    tagTable.innerHTML = ""
    const elementId = editTagNameSaveBtn.getAttribute("data-id")
    localTagsArr = editTagObj(localTagsArr, elementId)
    localStorage.setItem("tagList", JSON.stringify(localTagsArr))
    showTagsOnDisplay(localTagsArr)
    editTagContainerModal.classList.add("hidden")
  }
  else {
    errorEditTagMessage.classList.remove("hidden")
  }
})

editTagNameCancelBtn.addEventListener("click", (e) => {
  e.preventDefault()
  editTagContainerModal.classList.add("hidden")
})

/************************* REPORT SECTION *******************/
// esta función la retoqué, y hay que usarla luego de usar calculateReportBalance() (que devuelve un array con los incomes, outcomes y totals por tag, dado que ayer nos confundimos y en verdad la primera tabla muestra los incomes/outcomes sumados, o sea la tag cuyos incomes o outcomes sumados son más grandes)

const getObjWithMaxIncomeOrOutcome = (array, typeSearched) => {
  let objWithMaxIncomeOrOutcome = {}
  let counter = 0
  for (const obj of array) {
    let adding = 0
    for (const key of Object.keys(obj)) {
      if (key === typeSearched) {
        adding += obj[key]
      }
      if (adding > counter) {
        objWithMaxIncomeOrOutcome = obj
        counter = adding
      }
    }
  }
  return objWithMaxIncomeOrOutcome
}

// Tags

const filterArrByTag = (array, tagSearched) => {
  return array.filter(obj => {
    return obj.tag === tagSearched
  })
}

const calculateReportBalanceByTag = () => {
  let arrBalanceByTag = []
  let objBalanceByTag = {}
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
    arrBalanceByTag.push(objBalanceByTag = {
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

// Dates - calculates "mes con mayor ganancia" y "mes con mayor gasto"
const formatArrDate = (array) => {
  return array.map(obj => {
    return {
      ...obj,
      date: ((obj.date.split("-").join("")).slice(0, 6))
    }
  })
}

const filterArrByDate = (array, dateSearched) => {
  return array.filter(obj => {
    return obj.date === dateSearched
  })
}

const calculateReportBalanceByDate = () => {
  let arrBalanceByDate = []
  let datesArr = []
  let objBalanceByDate = {}
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
    arrBalanceByDate.push(objBalanceByDate = {
      date: date,
      income: totalIncomes,
      outcome: totalOutcomes,
      total: total
    })
  }
  return arrBalanceByDate
} // can this function be somehow factorized?? so we can have only one calculateReportBalance function...

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
    noResultContainer.classList.remove("hidden")
    noResultReportContainer.classList.remove("hidden")
    divTableOperations.classList.add("hidden")
    reportTableContainer.classList.add("hidden")
  }
  if ((filterOperations()).length === 0) {
    noResultContainer.classList.remove("hidden")
    divTableOperations.classList.add("hidden")
  }
  else {
    noResultContainer.classList.add("hidden")
    divTableOperations.classList.remove("hidden")
    operationHeaderTable.classList.remove("md:hidden")
    operationHeaderTable.classList.add("md:table-header-group")
    noResultReportContainer.classList.add("hidden")
    reportTableContainer.classList.remove("hidden")
    showOperationsOnDisplay(filterOperations())
  }
}

const mediumScreen = window.matchMedia("(min-width: 768px)")

const showOperationsOnDisplay = (array) => {
  operationTableContainer.innerHTML = ''
  for (const { id, description, amount, type, tag, date } of array) {
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
const showTagsOnDisplay = (array) => {
  tagTable.innerHTML = ''
  for (const { id, name } of array) {
    tagTable.innerHTML += `
      <div class="flex justify-between items-center mb-3"> 
        <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${name}</span> 
        <span class="flex">
          <a href="#" onclick='editTagName("${id}")' class="mx-3 py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/lapiz.png" alt="pencil drawing" class="w-5"> </a> 
          <a href="#" onclick='deleteTag("${id}")' class="py-1 px-2 rounded-full hover:bg-[#1E90FF]"> <img src="assets/images/tachito1.png" alt="garbage drawing" class="w-5"> </a>
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
  showTagsOnDisplay(localTagsArr)
  filterTag.innerHTML = `<option value="all">All</option>`
  addTagTypeFilter()
  inputNewTag.value = ""
})


// Dom filters
const filterUserSelection = $$(".filter-user-selection")

let month = new Date()
filterDate.value = today.getFullYear() + '-' + ('0' + (today.getMonth())).slice(-2) + '-' + "01";


for (const selection of filterUserSelection) {
  selection.addEventListener("change", () => {
    noResultsOrResults()
    showOperationsOnDisplay(filterOperations())
    showTotalsOnDisplay(refreshBalanceObj(filterOperations()))
  })
}

// Dom report 
const summaryTable = $("#summary-table-container")
const totalByTagTable = $("#total-by-tag-table")
const totalByMonthTable = $("#total-by-month-table")

const showSummaryOnDisplay = () => {
  let tagMaxIncome = getObjWithMaxIncomeOrOutcome(calculateReportBalanceByTag(), 'income')
  let tagMaxOutcome = getObjWithMaxIncomeOrOutcome(calculateReportBalanceByTag(), 'outcome')
  let tagMaxBalance = getTagWithMaxBalance()
  let monthMaxIncome = getObjWithMaxIncomeOrOutcome(calculateReportBalanceByDate(), 'income')
  let monthMaxOutcome = getObjWithMaxIncomeOrOutcome(calculateReportBalanceByDate(), 'outcome')
  let arrTotalsByTag = calculateReportBalanceByTag()
  let arrTotalsByDate = calculateReportBalanceByDate()

  
  if(Object.entries(getObjWithMaxIncomeOrOutcome(calculateReportBalanceByDate(), 'income')).length !== 0 && Object.entries(getObjWithMaxIncomeOrOutcome(calculateReportBalanceByDate(), 'outcome')).length !== 0){
    monthMaxIncome.date = monthMaxIncome.date.split('')
    monthMaxIncome.date.splice(4, 0, '/')
    monthMaxOutcome.date = monthMaxOutcome.date.split('')
    monthMaxOutcome.date.splice(4, 0, '/')
  }

  if (tagMaxIncome.income !== undefined && tagMaxOutcome.outcome !== undefined && tagMaxBalance.name !== undefined) {
    reportTableContainer.classList.remove("hidden")
    noResultReportContainer.classList.add("hidden")
    totalByTagTable.innerHTML = `
    <thead id="report-header-date" class="">
    <tr>
        <th>Tag</th>
        <th>Income</th>
        <th>Outcome</th>
        <th>Balance</th>
    </tr>
    </thead>`
    totalByMonthTable.innerHTML = `
    <thead id="report-header-date" class="">
    <tr>
        <th>Month</th>
        <th>Income</th>
        <th>Outcome</th>
        <th>Balance</th>
    </tr>
    </thead>`
    summaryTable.innerHTML = `
    <tr class="text-start text-sm w-full">
        <td class="w-1/3"> Tag with highest income </td>
        <td class="w-1/3 text-end">
          <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${tagMaxIncome.tag}</span> 
        </td>
        <td class="text-end font-semibold text-green-600">$${tagMaxIncome.income}</td>
    </tr>
    <tr class="text-start text-sm w-full">
        <td class="w-1/3"> Tag with highest outcome </td>
        <td class="w-1/3 text-end">
          <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${tagMaxOutcome.tag}</span> 
        </td>
        <td class="text-end font-semibold text-red-600">-$${tagMaxOutcome.outcome}</td>
    </tr>
    <tr class="text-start text-sm w-full">
        <td class="w-1/3"> Tag with highest balance </td>
        <td class="w-1/3 text-end">
          <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${tagMaxBalance.name}</span> 
        </td>
        <td class="text-end font-semibold">$${tagMaxBalance.total}</td>
    </tr>
    <tr class="text-start text-sm w-full">
        <td class="w-1/3"> Month with highest income </td>
        <td class="w-1/3 text-end">
          <span>${monthMaxIncome.date.join('')}</span> 
        </td>
        <td class="text-end font-semibold text-green-600">$${monthMaxIncome.income}</td>
    </tr>
    <tr class="text-start text-sm w-full">
        <td class="w-1/3"> Month with highest outcome </td>
        <td class="w-1/3 text-end">
          <span>${monthMaxOutcome.date.join('')}</span> 
        </td>
        <td class="text-end font-semibold text-red-600">-$${monthMaxOutcome.outcome}</td>
</tr>
    `

    for (const obj of arrTotalsByTag) {
      totalByTagTable.innerHTML += `     
    <tr class="text-start text-sm w-full">
    <td class="w-1/3 text-start">
          <span class="text-sm bg-[#F4C6D9] text-[#AB0B4F] p-1 rounded">${obj.tag}</span> 
        </td>
    <td class="text-center font-semibold text-green-600"> $${obj.income} </td>
    <td class="text-center font-semibold text-red-600">-$${obj.outcome}</td>
    <td class="text-center font-semibold">${obj.total}</td>
    </tr> `
    }

    for (const obj of arrTotalsByDate) {
      obj.date = obj.date.split('')
      obj.date.splice(4, 0, '/')

      totalByMonthTable.innerHTML += `     
      <tr class="text-start text-sm w-full">
      <td class="w-1/3"> ${obj.date.join('')} </td>
      <td class="text-center font-semibold text-green-600"> $${obj.income} </td>
      <td class="text-center font-semibold text-red-600">-$${obj.outcome}</td>
      <td class="text-center font-semibold">${obj.total}</td>
      </tr> `
    }
  }
  else {
    reportTableContainer.classList.add("hidden")
    noResultReportContainer.classList.remove("hidden")
  }
}

//  // we have to rethink this to refactorize, this function es un culo. 
//and continua siendolo ahr 

/************************ Modal *******************************/
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
  selector.innerHTML = ''
  for (const { name } of localTagsArr) {
    selector.innerHTML += `
    <option value="${name}">${name}</option>`
  }
}

// Modal event 
operationBtn.addEventListener("click", () => {
  modalErrorDescription.classList.add("hidden")
  modalErrorAmount.classList.add("hidden")
  modalContainer.classList.remove("hidden")
  operationModalForm.reset()
  addTagModal(tagModal)
})

cancelBtnModal.addEventListener("click", (event) => {
  event.preventDefault()
  modalContainer.classList.add("hidden")
})

modalBtnAdd.addEventListener("click", (e) => {
  modalErrorDescription.classList.add("hidden")
  modalErrorAmount.classList.add("hidden")
    if(descriptionInput.value === "" && amountInput.value === ""){
      modalErrorDescription.classList.remove("hidden") 
      return modalErrorAmount.classList.remove("hidden")
    }
    if (descriptionInput.value === "") {
      return modalErrorDescription.classList.remove("hidden")
    }
    if (amountInput.value === "") {
      return modalErrorAmount.classList.remove("hidden")
    }
  e.preventDefault()
  operationTableContainer.innerHTML = ""
  addNewOperationObject(localOperationsArr, createOperationObject())
  localStorage.setItem("operationsList", JSON.stringify(localOperationsArr))
  showOperationsOnDisplay(filterOperations())
  refreshBalanceObj(filterOperations())
  saveBalanceObj()
  showTotalsOnDisplay(balanceObj)
  noResultsOrResults()
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
const reportSection = $("#report-section")
const reportShowLinks = $$(".report-show-link")
const balanceShowLinks = $$(".balance-show-link")
const tagShowLinks = $$(".tag-show-link")

const hideBurgerMenu = () => {
  burgerMenu.classList.add("hidden")
  burgerIconLines.classList.remove("hidden")
  burgerIconX.classList.add("hidden")
}

for (const balanceLink of balanceShowLinks) {
  balanceLink.addEventListener("click", () => {
    balanceSection.classList.remove("hidden")
    tagSection.classList.add("hidden")
    reportSection.classList.add("hidden")
    hideBurgerMenu()
    showOperationsOnDisplay(filterOperations())
  })
}

for (const tagLink of tagShowLinks) {
  tagLink.addEventListener("click", () => {
    tagSection.classList.remove("hidden")
    balanceSection.classList.add("hidden")
    reportSection.classList.add("hidden")
    hideBurgerMenu()
  })
}

for (const reportLink of reportShowLinks) {
  reportLink.addEventListener("click", () => {
    reportSection.classList.remove("hidden")
    balanceSection.classList.add("hidden")
    tagSection.classList.add("hidden")
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

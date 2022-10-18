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



 /************ PILI DELIRIO */

 const generateTable = (tags) => {
   tags.map(tag => {
      // const {destructureando properties} = tag 
      // $TABLE.innerHTML += ` bla bla contenido de table
      `<button class="edit-tag-btn" onclick="formEdit(${id})"> Edit </button>`


   })
 }

 // dejar el texto de la categoría cuando el user hace click en edit tag


 const findTag = (tags, idTag) => {
   return tags.find(tag => tag.id === idTag)
 }

 // para agregar tags hay que sumarle objetos con un tags.length + 1 (o sea le sumamos uno al length del array de objetos)

 const cleanDiv = () => $container.innerHTML = ""

 const tagFormEdit = (id) => {
   cleanDiv()
   $form.classList.remove("hidden")
   const chosenTag = findTag(id)
   $("tagFormInput").value = chosenTag.name
   // acá abajo relaciona el id de la tag con los botones de editar y eliminar dentro del elemento del form 
   $formBtnEdit.setAttribute("data-id", id)
   $formBtnDelete.setAttribute("data-id", id)
 }

const removeTag = (id) => {
   return tags.filter(tag => tag.id !== parseInt(id))
}

const saveTagData = (id) => {
   return {
      id: id,
      name: $("#tagName").value
   }
}

const editTag = (id) => {
   return tags.map(tag => {
      if (tag.id === parseInt(id)) {
         return saveTagData(id)
      }
      return tag
   })
}

$formBtnDelete.addEventListener("click", () => {
   const tagId = $formBtnDelete.getAttribute("data-id")
   generateTable(removeTag(tagId))
   $form.classList.add("hidden")
})

$formBtnEdit.addEventListener("click", () => {
   const tagId = $formBtnEdit.getAttribute("data-id")
   generateTable(editTag(tagId))
   $form.classList.add("hidden")
})

// DATE

const date = new Date()
date.getDate() // número en número del mes
date.getMonth() // número del mes
date.getFullYear() // año
date.getDay() // número de la semana

// hacer función para formatear la date
const formatDate = (date) => {
   return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear}`
}

// guardar info de una date

const $filterDate = $("#date")
$filterDate.addEventListener("change", (e) => {
   const newDate = e.target.value
   let modifiedDate = newDate.split("-").reverse().join("/")
})


// single page application -> react
let taskInput = document.querySelector("#taskInput")
let addBtn = document.querySelector("#addBtn")
let taskList = document.querySelector("#taskList")
const filterAll = document.getElementById("filterAll")
const filterActive = document.getElementById("filterActive")
const filterCompleted = document.getElementById("filterCompleted")
const searchInput = document.getElementById("searchInput")
// Кнопки сортировки
const sortDefault = document.getElementById("sortDefault")
const sortAsc = document.getElementById("sortAsc")
const sortDesc = document.getElementById("sortDesc")

let tasks = []

let completedTasks = []

let currentFilter = "all"

let currentSort = "default" // default/asc/desc

let savedCompleted = localStorage.getItem("completedTasks")
if (savedCompleted !== null) {
    completedTasks = JSON.parse(savedCompleted)
}

let savedTasks = localStorage.getItem("tasks")

if (savedTasks !== null) {
    tasks = JSON.parse(savedTasks)
}

let savedSort = localStorage.getItem("currentSort")
if (savedSort !== null) currentSort = savedSort

function addTaskToDoom(taskText, index) {
    let li = document.createElement("li")
    li.classList.add("task-item")

    let span = document.createElement("span")
    span.textContent = taskText

    // Проверяем — есть ли задача в списке выполненных
    // Если есть — сразу добавляем класс completed
    if (completedTasks.includes(taskText)) {
        span.classList.add("completed")
    }

    span.addEventListener("click", function () {
        span.classList.toggle("completed")
        if (span.classList.contains("completed")) {
            if (!completedTasks.includes(taskText)) completedTasks.push(taskText)
        } else {
            const i = completedTasks.indexOf(taskText)
            // indexOf возвращает индекс задачи в массиве, если найдено, иначе -1
            if (i !== -1) completedTasks.splice(i, 1)
        }
        localStorage.setItem("completedTasks",
            JSON.stringify(completedTasks))
    })
    let deleteBtn = document.createElement("button")
    deleteBtn.classList.add("delete-btn")
    deleteBtn.textContent = "Удалить"
    deleteBtn.addEventListener("click", function () {
        tasks.splice(index, 1)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        li.remove()
    })
    li.appendChild(span)
    li.appendChild(deleteBtn)
    taskList.appendChild(li)
}



function render() {
    taskList.innerHTML = ""
    let filteredTasks = tasks.slice()

    if (currentFilter === "active") {
        filteredTasks = filteredTasks.filter(function (task) {
            return !completedTasks.includes(task) // Только не выполненные
        })
    } else if (currentFilter === "completed") {
        filteredTasks = filteredTasks.filter(function (task) {
            return completedTasks.includes(task) // Только выполненные
        })
    }

    let query = searchInput.value.toLowerCase()
    if (query !== "") {
        filteredTasks = filteredTasks.filter(function (task) {
            // ВНИМАНИЕ: здесь includes — метод строки, а не массива
            return task.toLowerCase().includes(query)
        })
    }

    if (currentSort === "asc") {
        filteredTasks = filteredTasks.sort(function (a, b) {
            return a.localeCompare(b)
        })
    }
    if (currentSort === "desc") {
        filteredTasks = filteredTasks.sort(function (a, b) {
            return b.localeCompare(a)
        })
    }

    for (let i = 0; i < filteredTasks.length; i++) {
        addTaskToDoom(filteredTasks[i], i)
    }

}

function addTask() {
    let text = taskInput.value
    if (text !== "") {
        tasks.push(text)
        localStorage.setItem("tasks", JSON.stringify(tasks))
        addTaskToDoom(text, tasks.length - 1)
        taskInput.value = ""
    }
}

searchInput.addEventListener("input", function () {
    render()
})

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask()
    }
})
addBtn.addEventListener("click", addTask)

filterAll.addEventListener("click", function () {
    currentFilter = "all"
    render()
})
filterActive.addEventListener("click", function () {
    currentFilter = "active"
    render()
})
filterCompleted.addEventListener("click", function () {
    currentFilter = "completed"
    render()
})

// Обработчики сортировки
sortDefault.addEventListener("click", function () {
    currentSort = "default"
    localStorage.setItem("currentSort", currentSort)
    render()
})
sortAsc.addEventListener("click", function () {
    currentSort = "asc"
    localStorage.setItem("currentSort", currentSort)
    render()
})
sortDesc.addEventListener("click", function () {
    currentSort = "desc"
    localStorage.setItem("currentSort", currentSort)
    render()
})

// Отрисовка задач при загрузке страницы
render()



const todos = []
const RENDER_EVENT = "render-todo"

document.addEventListener("DOMContentLoaded", function (){
    const submitForm = document.querySelector("#form")
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault()
        addTodo()
    })
})

document.addEventListener(RENDER_EVENT,function() {
    const uncompletedTodoList = document.querySelector("#todos")
    uncompletedTodoList.innerHTML = ""

    const completedTodoList = document.querySelector("#completed-todos")
    completedTodoList.innerHTML = ""

    for(const todo of todos) {
        const todoElement = makeTodo(todo)
        if(!todo.isCompleted){
            uncompletedTodoList.appendChild(todoElement)
        } else {
            completedTodoList.appendChild(todoElement)
        }
    }
})

const addTodo = () => {
    const textTodo = document.querySelector("#title").value
    const timestamp = document.querySelector("#date").value
    const generateID = generateId()
    const todoObject = generateTodoObject(generateID,textTodo,timestamp,false)
    todos.push(todoObject)
    document.dispatchEvent(new Event(RENDER_EVENT))
}

const makeTodo = (todoObject) => {
    const textTitle = document.createElement("h2")
    textTitle.innerText = todoObject.taks

    const texttimestamp = document.createElement("p")
    texttimestamp.innerText = todoObject.timestamp

    const textcontainer = document.createElement("div")
    textcontainer.classList.add("inner")
    textcontainer.append(textTitle,texttimestamp)

    const container = document.createElement("div")
    container.classList.add("item", "shadow")
    container.setAttribute("id", `todo-${todoObject.id}`)
    container.append(textcontainer)

    if(todoObject.isCompleted){
        const undoButton = document.createElement("button")
        undoButton.classList.add("undo-button")
        undoButton.addEventListener("click",function(){
            undotaksfromcomplete(todoObject.id)
        })
        
        const trashButton = document.createElement("button")
        trashButton.classList.add("trash-button")
        trashButton.addEventListener("click",function(){
            removetaksfromcomplete(todoObject.id)
        })

        container.append(undoButton,trashButton)
    } else {
        const chekButton = document.createElement("button")
       chekButton.classList.add("check-button")
       chekButton.addEventListener("click",function(){
            addtakstocomplete(todoObject.id)
        })
        container.append(chekButton)
    }

    return container
}

const generateId = () =>{
    return +new Date()
}

const generateTodoObject = (id,taks,timestamp,isCompleted) => {
    return {id,taks,timestamp,isCompleted}
}

function addtakstocomplete(todoId){
    const todoTarget = findTodo(todoId)

    if(todoTarget == null)return
    todoTarget.isCompleted = true
    document.dispatchEvent(new Event(RENDER_EVENT))
}

function findTodo(todoId){
    for(const todoItem of todos){
        if(todoItem.id === todoId){
            return todoItem
        }
    }
    return null
}
function removetaksfromcomplete(todoId){
    const todoTarget = findTodoIndex(todoId)
    if(todoTarget === -1)return
    todos.splice(todoTarget,1)
    document.dispatchEvent(new Event(RENDER_EVENT))
}

function undotaksfromcomplete(todoId){
    const todoTarget = findTodo(todoId)
    if(todoTarget == null)return
    todoTarget.isCompleted = false
    document.dispatchEvent(new Event(RENDER_EVENT))
}

function findTodoIndex(todoId){
    for(const index in todos) {
        if(todos[index].id === todoId) {
            return index
        }
    }
    return -1
}

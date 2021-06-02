//TodoList
const todoInput= document.querySelector(".todo-input");
const todoButton= document.querySelector(".todo-button");
const todoList= document.querySelector(".todo-list");
const filterOption= document.querySelector(".filter-todo");
//Event Listener
document.addEventListener('DOMContentLoaded', getTodos);
todoButton.addEventListener('click', addTodo);
todoList.addEventListener('click', deleteCheck);
filterOption.addEventListener('click', filterTodo);

function addTodo(event){
    event.preventDefault();
    //Todo Div
    const todoDiv= document.createElement("div");
    todoDiv.classList.add("todo");
    //Liste generieren
    const newTodo= document.createElement('li');
    newTodo.innerText= todoInput.value;
    newTodo.classList.add('todo-item');
    todoDiv.appendChild(newTodo);
    //Zum Localstorage hinzufügen
    saveLocalTodos(todoInput.value);
    // Check Taste
    const completedButton = document.createElement('button');
    completedButton.innerHTML= '<i class="fas fa-check"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);
    // Check Trash Taste
    const trashButton = document.createElement('button');
    trashButton.innerHTML= '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);
    //Append to List
    todoList.appendChild(todoDiv);
    //Clear Eingabe
    todoInput.value = "";
}

function deleteCheck(e){
    const item= e.target;
    //Löschen
    if(item.classList[0]=== 'trash-btn'){
        const todo= item.parentElement;
        //Animation
        todo.classList.add("fall");
        removeLocalTodos(todo);
        todo.addEventListener('transitionend', function(){
            todo.remove();
        });
    }
    //Checked!
    if(item.classList[0]==="complete-btn"){
        const todo= item.parentElement;
        todo.classList.toggle("completed");
    }
}

function filterTodo(e){
    const todos= todoList.childNodes;
    todos.forEach(function(todo){
        switch(e.target.value){
            case "all":
                todo.style.display ='flex';
                break;
            case "completed":
                if(todo.classList.contains('completed')){
                    todo.style.display= "flex"; 
                }
                else{
                    todo.style.display = "none";
                }
                break;
            case "uncompleted":
                if(!todo.classList.contains('completed')){
                    todo.style.display= "flex"; 
                }
                else{
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(todo) {
    let todosThursday;
    if (localStorage.getItem('todosThursday') === null) {
        todosThursday = [];
    } else {
        todosThursday = JSON.parse(localStorage.getItem('todosThursday'));
    }
    todosThursday.push(todo);
    localStorage.setItem('todosThursday', JSON.stringify(todosThursday));
}

function getTodos() {
    let todosThursday;
    if (localStorage.getItem('todosThursday') === null) {
        todosThursday = [];
    } 
    else {
        todosThursday = JSON.parse(localStorage.getItem('todosThursday'));
    }
    todosThursday.forEach(function (todo) {
        // todo div
        const todoDiv = document.createElement('div');
        todoDiv.classList.add('todo');
        // liste generieren
        const newToDo = document.createElement('li');
        newToDo.innerText = todo;  
        newToDo.classList.add('todo-item');
        todoDiv.appendChild(newToDo);
        // localstorage hinzufügen
        // saveLocalTodos(todoInput.value);
        // Checked Taste
        const completedButton = document.createElement('button');
        completedButton.innerHTML = "<i class='fas fa-check'></i>";
        completedButton.classList.add('complete-btn');
        todoDiv.appendChild(completedButton)
        // Trash Taste
        const trashButton = document.createElement('button');
        trashButton.innerHTML = "<i class='fas fa-trash'></i>";
        trashButton.classList.add('trash-btn');
        todoDiv.appendChild(trashButton);
        // Append to List
        todoList.appendChild(todoDiv);
    });
}

function removeLocalTodos(todo){
    let todosThursday;
    if (localStorage.getItem('todosThursday') === null) {
        todosThursday = [];
    } else {
        todosThursday = JSON.parse(localStorage.getItem('todosThursday'));
    }
    const todoindex = todo.children[0].innerText;
    todosThursday.splice(todosThursday.indexOf(todoindex), 1);
    localStorage.setItem('todosThursday', JSON.stringify(todosThursday));
} 


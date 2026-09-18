console.log("SCRIPT LOADED");
// Login elements
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const searchInput = document.getElementById("searchInput");
const authSection = document.querySelector(".auth-section");
const dashboard = document.getElementById("dashboard");
const logoutBtn = document.getElementById("logoutBtn");


// Login functionality
loginBtn.addEventListener("click", function() {

    const email = loginEmail.value;
    const password = loginPassword.value;

    if (email.trim() === "" || password.trim() === "") {
        loginMessage.innerText = "Please enter email and password";
        return;
    }

    fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        if (data.token) {
            localStorage.setItem("token", data.token);

            console.log("Login successful");
            console.log("Token:", data.token);

            loginMessage.innerText = "Login successful!";


            // Hide login screen
            authSection.style.display = "none";

            // Show dashboard
            dashboard.style.display = "block";


            loadTasks(); // Load tasks after successful login

        } else {

            loginMessage.innerText = data.message;

        }

    })
    .catch(function(error) {

        console.log("Login error:", error);
        loginMessage.innerText = "Something went wrong";

    });

});



// Create a task
function createTask(taskData) {

    const task = document.createElement("li");

    // Checkbox
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = taskData.completed;


    // Task text
    const taskTextElement = document.createElement("span");
    taskTextElement.innerText = taskData.text;

    task.appendChild(taskTextElement);
    task.prepend(checkBox);


    // Apply completed style if task was already completed
    if (taskData.completed) {
        task.style.textDecoration = "line-through";
        task.style.opacity = "0.6";
    }


    // Edit button
    const editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.className = "edit-btn";

    editBtn.addEventListener("click", function() {

    const newTask = prompt(
        "Edit your task:",
        taskTextElement.innerText
    );

    if (newTask === null || newTask.trim() === "") {
        return;
    }

    fetch(`http://localhost:5000/api/tasks/${taskData._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: newTask,
            completed: taskData.completed
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(updatedTask) {

        console.log("Task updated:", updatedTask);

        taskTextElement.innerText = updatedTask.text;

        taskData.text = updatedTask.text;

    })
    .catch(function(error) {

        console.log("Error editing task:", error);

    });

});

    task.appendChild(editBtn);


    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.className = "delete-btn";

    task.appendChild(deleteBtn);


    deleteBtn.addEventListener("click", function() {

    fetch(`http://localhost:5000/api/tasks/${taskData._id}`, {
        method: "DELETE",
        headers: {
        "Authorization": "Bearer " + localStorage.getItem("token")
    }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        console.log(data.message);

        task.remove();

        updateStats();

    })
    .catch(function(error) {

        console.log("Error deleting task:", error);

    });

});


    // Complete / Uncomplete
    checkBox.addEventListener("change", function() {

    const completedStatus = checkBox.checked;

    fetch(`http://localhost:5000/api/tasks/${taskData._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json", 
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
            completed: completedStatus
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(updatedTask) {

        console.log("Task updated:", updatedTask);

        if (updatedTask.completed) {

            task.style.textDecoration = "line-through";
            task.style.opacity = "0.6";

        } else {

            task.style.textDecoration = "none";
            task.style.opacity = "1";

        }

        taskData.completed = updatedTask.completed;
        updateStats();

    })
    .catch(function(error) {

        console.log("Error updating task:", error);

        checkBox.checked = !completedStatus; // Agar database update fail ho jaye, checkbox ko previous state par wapas kar do
        
    });

});
    
    taskList.appendChild(task);
}



// Add Task
addBtn.addEventListener('click', function() {

    const taskText = taskInput.value;

    if (taskText.trim() === "") {
        return;
    }

    fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" ,
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
            text: taskText
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(savedTask) {

        console.log("Task saved:", savedTask);

        createTask(savedTask);

        taskInput.value = "";

        updateStats();
    })
    .catch(function(error) {

        console.log("Error adding task:", error);

    });

});

// Add task on Enter key press

taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addBtn.click();
    }

});


// Search Tasks
searchInput.addEventListener("input", function() {

    const searchText = searchInput.value.toLowerCase();

    const taskElements = taskList.querySelectorAll("li");


    taskElements.forEach(function(task) {

        const taskText = task
            .querySelector("span")
            .innerText
            .toLowerCase();


        if (taskText.includes(searchText)) {

            task.style.display = "flex";

        } else {

            task.style.display = "none";
        }

    });

});


// Update Stats
function updateStats() {

    const taskElements = taskList.querySelectorAll("li");

    totalTasks.innerText = taskElements.length;

    let completed = 0;


    taskElements.forEach(function(task) {

        const checkbox = task.querySelector(
            "input[type='checkbox']"
        );


        if (checkbox.checked) {
            completed++;
        }

    });


    completedTasks.innerText = completed;

    pendingTasks.innerText =
        taskElements.length - completed;
}



//Load tasks from MongoDb
function loadTasks() {

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/tasks", {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {

        console.log("Tasks received:", data);

        data.forEach(function(taskData) {
            createTask(taskData);
        });

        updateStats();

    })
    .catch(function(error) {

        console.log("Error loading tasks:", error);

    });
} 

// Logout functionality
logoutBtn.addEventListener("click", function() {

    // Remove JWT token
    localStorage.removeItem("token");

    // Hide dashboard
    dashboard.style.display = "none";

    // Show login section
    authSection.style.display = "flex";

    // Clear old tasks from screen
    taskList.innerHTML = "";

    // Clear login fields
    loginEmail.value = "";
    loginPassword.value = "";

    // Clear login message
    loginMessage.innerText = "";

});
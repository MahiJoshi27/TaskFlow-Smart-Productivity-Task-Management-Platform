import { useEffect, useState } from "react";
import TaskCard from "./TaskCard";

function Dashboard({ onLogout }) {

    const [tasks, setTasks] = useState([]);

    const [taskText, setTaskText] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    const [category, setCategory] = useState("Other");
    const [estimatedMinutes, setEstimatedMinutes] = useState(30);

    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");


    // =========================
    // LOAD TASKS
    // =========================

    useEffect(function() {
        loadTasks();
    }, []);


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

            setTasks(data);

        })
        .catch(function(error) {

            console.log("Error loading tasks:", error);

        });
    }


    // =========================
    // ADD TASK
    // =========================

    function addTask() {

        if (taskText.trim() === "") {
            return;
        }

        const token = localStorage.getItem("token");

        fetch("http://localhost:5000/api/tasks", {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({
                text: taskText,
                priority: priority,
                dueDate: dueDate,
                category: category,
                estimatedMinutes: estimatedMinutes
            })
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(newTask) {

            console.log("Task created:", newTask);

            setTasks(function(currentTasks) {
                return [...currentTasks, newTask];
            });

            setTaskText("");
            setPriority("Medium");
            setDueDate("");
            setCategory("Other");
            setEstimatedMinutes(30);

        })
        .catch(function(error) {

            console.log("Error creating task:", error);

        });
    }


    // =========================
    // DELETE TASK
    // =========================

    function deleteTask(taskId) {

        const token = localStorage.getItem("token");

        fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: "DELETE",

            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {

            console.log("Delete response:", data);

            setTasks(function(currentTasks) {

                return currentTasks.filter(function(task) {
                    return task._id !== taskId;
                });

            });

        })
        .catch(function(error) {

            console.log("Error deleting task:", error);

        });
    }


    // =========================
    // COMPLETE / UNCOMPLETE
    // =========================

    function toggleTask(taskId, completedStatus) {

        const token = localStorage.getItem("token");

        fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
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

            setTasks(function(currentTasks) {

                return currentTasks.map(function(task) {

                    if (task._id === taskId) {
                        return updatedTask;
                    }

                    return task;

                });

            });

        })
        .catch(function(error) {

            console.log("Error updating task:", error);

        });
    }


    // =========================
    // STATISTICS
    // =========================

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(function(task) {
        return task.completed;
    }).length;

    const pendingTasks = totalTasks - completedTasks;


    const totalMinutes = tasks.reduce(function(total, task) {

        return total + (task.estimatedMinutes || 0);

    }, 0);


    // =========================
    // SEARCH + CATEGORY FILTER
    // =========================

    const filteredTasks = tasks.filter(function(task) {

        const matchesSearch = task.text
            .toLowerCase()
            .includes(searchText.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            task.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });


    // =========================
    // RETURN UI
    // =========================

    return (

        <div className="taskflow-app">


            {/* ================= SIDEBAR ================= */}

            <aside className="sidebar">

                <div className="sidebar-logo">

                    <div className="logo-icon">
                        ✓
                    </div>

                    <div>
                        <h2>TaskFlow</h2>
                        <span>Student Productivity</span>
                    </div>

                </div>


                <nav className="sidebar-nav">

                    <button className="nav-item active">
                        🏠
                        <span>Today</span>
                    </button>

                    <button className="nav-item">
                        📅
                        <span>Planner</span>
                    </button>

                    <button className="nav-item">
                        📊
                        <span>Insights</span>
                    </button>

                </nav>


                <div className="sidebar-section">

                    <p className="sidebar-title">
                        CATEGORIES
                    </p>

                    <button
                        className={`category-nav ${selectedCategory === "All" ? "selected" : ""}`}
                        onClick={function() {
                            setSelectedCategory("All");
                        }}
                    >
                        <span>✨</span>
                        All Tasks
                    </button>

                    <button
                        className={`category-nav ${selectedCategory === "School" ? "selected" : ""}`}
                        onClick={function() {
                            setSelectedCategory("School");
                        }}
                    >
                        <span>📚</span>
                        School
                    </button>

                    <button
                        className={`category-nav ${selectedCategory === "Self Study" ? "selected" : ""}`}
                        onClick={function() {
                            setSelectedCategory("Self Study");
                        }}
                    >
                        <span>🧠</span>
                        Self Study
                    </button>

                    <button
                        className={`category-nav ${selectedCategory === "Project" ? "selected" : ""}`}
                        onClick={function() {
                            setSelectedCategory("Project");
                        }}
                    >
                        <span>💻</span>
                        Project
                    </button>

                    <button
                        className={`category-nav ${selectedCategory === "Personal" ? "selected" : ""}`}
                        onClick={function() {
                            setSelectedCategory("Personal");
                        }}
                    >
                        <span>🏠</span>
                        Personal
                    </button>

                    <button
                        className={`category-nav ${selectedCategory === "Other" ? "selected" : ""}`}
                        onClick={function() {
                            setSelectedCategory("Other");
                        }}
                    >
                        <span>📌</span>
                        Other
                    </button>

                </div>


                <button
                    className="logout-button"
                    onClick={onLogout}
                >
                    ↪ Logout
                </button>

            </aside>



            {/* ================= MAIN CONTENT ================= */}

            <main className="main-content">


                {/* TOP BAR */}

                <header className="top-bar">

                    <div>

                        <p className="welcome-small">
                            YOUR PRODUCTIVITY SPACE
                        </p>

                        <h1>
                            Good day! 👋
                        </h1>

                        <p className="current-date">
                            Plan your day. Make progress. Stay consistent.
                        </p>

                    </div>


                    <div className="profile-circle">
                        T
                    </div>

                </header>



                {/* ================= STATS ================= */}

                <section className="productivity-stats">


                    <div className="productivity-card purple-card">

                        <div className="productivity-icon">
                            📋
                        </div>

                        <div>

                            <span>
                                Total Tasks
                            </span>

                            <strong>
                                {totalTasks}
                            </strong>

                        </div>

                    </div>


                    <div className="productivity-card green-card">

                        <div className="productivity-icon">
                            ✓
                        </div>

                        <div>

                            <span>
                                Completed
                            </span>

                            <strong>
                                {completedTasks}
                            </strong>

                        </div>

                    </div>


                    <div className="productivity-card orange-card">

                        <div className="productivity-icon">
                            ⚡
                        </div>

                        <div>

                            <span>
                                Remaining
                            </span>

                            <strong>
                                {pendingTasks}
                            </strong>

                        </div>

                    </div>


                    <div className="productivity-card blue-card">

                        <div className="productivity-icon">
                            ⏱
                        </div>

                        <div>

                            <span>
                                Planned Time
                            </span>

                            <strong>
                                {totalMinutes} min
                            </strong>

                        </div>

                    </div>


                </section>



                {/* ================= ADD TASK ================= */}

                <section className="create-task-section">

                    <div className="create-task-heading">

                        <div>

                            <span className="section-label">
                                PLAN SOMETHING
                            </span>

                            <h2>
                                Add a new task
                            </h2>

                        </div>

                        <span className="create-task-emoji">
                            ✨
                        </span>

                    </div>


                    <div className="create-task-form">


                        <input
                            type="text"
                            placeholder="What do you want to accomplish?"
                            value={taskText}
                            onChange={function(e) {
                                setTaskText(e.target.value);
                            }}
                            onKeyDown={function(e) {

                                if (e.key === "Enter") {
                                    addTask();
                                }

                            }}
                        />


                        <select
                            value={category}
                            onChange={function(e) {
                                setCategory(e.target.value);
                            }}
                        >

                            <option>School</option>
                            <option>Self Study</option>
                            <option>Project</option>
                            <option>Personal</option>
                            <option>Other</option>

                        </select>


                        <select
                            value={priority}
                            onChange={function(e) {
                                setPriority(e.target.value);
                            }}
                        >

                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>

                        </select>


                        <input
                            type="date"
                            value={dueDate}
                            onChange={function(e) {
                                setDueDate(e.target.value);
                            }}
                        />


                        <input
                            type="number"
                            min="5"
                            placeholder="Minutes"
                            value={estimatedMinutes}
                            onChange={function(e) {
                                setEstimatedMinutes(Number(e.target.value));
                            }}
                        />


                        <button
                            className="create-task-button"
                            onClick={addTask}
                        >
                            + Add Task
                        </button>


                    </div>

                </section>



                {/* ================= TASK HEADER ================= */}

                <section className="tasks-container">


                    <div className="tasks-heading">

                        <div>

                            <span className="section-label">
                                YOUR WORK
                            </span>

                            <h2>
                                {selectedCategory === "All"
                                    ? "Today's Tasks"
                                    : selectedCategory + " Tasks"}
                            </h2>

                        </div>


                        <div className="task-count">
                            {filteredTasks.length} tasks
                        </div>

                    </div>



                    {/* SEARCH */}

                    <div className="task-toolbar">

                        <div className="search-wrapper">

                            <span>
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search your tasks..."
                                value={searchText}
                                onChange={function(e) {
                                    setSearchText(e.target.value);
                                }}
                            />

                        </div>


                        <button
                            className={`filter-button ${selectedCategory === "All" ? "filter-active" : ""}`}
                            onClick={function() {
                                setSelectedCategory("All");
                            }}
                        >
                            All
                        </button>

                    </div>



                    {/* TASK LIST */}

                    {filteredTasks.length === 0 ? (

                        <div className="new-empty-state">

                            <div className="empty-icon">
                                🎯
                            </div>

                            <h3>
                                Nothing here yet
                            </h3>

                            <p>
                                Add a task above and start making progress.
                            </p>

                        </div>

                    ) : (

                        <div className="new-task-list">

                            {filteredTasks.map(function(task) {

                                return (

                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onDelete={deleteTask}
                                        onToggle={toggleTask}
                                    />

                                );

                            })}

                        </div>

                    )}

                </section>


            </main>

        </div>

    );
}

export default Dashboard;
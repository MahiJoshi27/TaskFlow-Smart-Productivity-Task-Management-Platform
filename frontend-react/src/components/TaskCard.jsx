function TaskCard({ task, onDelete, onToggle }) {

    function handleDelete() {
        onDelete(task._id);
    }

    function handleToggle() {
        onToggle(task._id, !task.completed);
    }

    return (
        <div className="task-card">

            <div className="task-main">

                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={handleToggle}
                />

                <div className="task-info">

                    <span className={task.completed ? "completed-task" : ""}>
                        {task.text}
                    </span>

                    <div className="task-details">

                        <span className="category-badge">
                            📂 {task.category}
                        </span>

                        <span className="date-info">
                            📅 {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "No date"}
                        </span>

                        <span className="time-info">
                            ⏱️ {task.estimatedMinutes} min
                        </span>

                    </div>

                </div>

            </div>

            <div className="task-actions">

                <span className={`priority-badge ${task.priority?.toLowerCase()}`}>
                    {task.priority}
                </span>

                <button className="edit-btn">
                    Edit
                </button>

                <button
                    className="delete-btn"
                    onClick={handleDelete}
                >
                    Delete
                </button>

            </div>

        </div>
    );
}

export default TaskCard;
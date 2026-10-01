function Dashboard({ onLogout }) {

    return (
        <div className="dashboard">

            <header className="dashboard-header">

                <div>
                    <h1>TaskFlow</h1>
                    <p>Organize your day. Get things done.</p>
                </div>

                <button onClick={onLogout}>
                    Logout
                </button>

            </header>


            <main className="dashboard-main">

                {/* Add Task Section */}
                <section className="task-input">

                    <input
                        type="text"
                        placeholder="What needs to be done?"
                    />

                    <select>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>

                    <input
                        type="date"
                    />

                    <button>
                        + Add Task
                    </button>

                </section>


                {/* Statistics */}
                <section className="stats">

                    <div className="stat-card">
                        <h3>Total Tasks</h3>
                        <p>0</p>
                    </div>

                    <div className="stat-card">
                        <h3>Completed</h3>
                        <p>0</p>
                    </div>

                    <div className="stat-card">
                        <h3>Pending</h3>
                        <p>0</p>
                    </div>

                </section>


                {/* Tasks */}
                <section className="tasks-section">

                    <h2>My Tasks</h2>

                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="search-input"
                    />

                    <div className="empty-state">
                        <h3>No tasks yet 🎯</h3>
                        <p>Add your first task to get started.</p>
                    </div>

                </section>

            </main>

        </div>
    );
}

export default Dashboard;
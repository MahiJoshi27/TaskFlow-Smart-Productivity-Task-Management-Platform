const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
    },

    dueDate: {
    type: Date
    },

    category: {
        type: String,
        enum: ["School", "Self Study", "Project", "Personal", "Other"],
        default: "Other"
    },

    estimatedMinutes: {
        type: Number,
        default: 30
    },
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
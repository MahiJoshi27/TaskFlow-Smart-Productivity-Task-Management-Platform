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
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
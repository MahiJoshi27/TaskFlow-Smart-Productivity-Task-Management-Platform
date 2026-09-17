const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/Task");
const User = require("./models/User");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./authMiddleware");


const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));
app.use(express.json());

const PORT = 5000;


// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/taskflow")
    .then(function() {
        console.log("MongoDB connected successfully!");
    })
    .catch(function(error) {
        console.log("MongoDB connection error:", error);
    });


// HOME Route
app.get("/", function(req, res) {
    res.send("Task Manager Backend is running!");
});

// POST- Add Task . API route to create a new task
app.post("/api/tasks", authMiddleware, async function(req, res) {
    try {

        const newTask = new Task({
            text: req.body.text,
            user: req.user.userId
        });

        const savedTask = await newTask.save();

        res.status(201).json(savedTask);

    } catch (error) {

        res.status(500).json({
            message: "Failed to create task"
        });

    }

});


// GET - Get Tasks .

app.get("/api/tasks", authMiddleware, async function(req, res) {
    try {

        const tasks = await Task.find({
            user: req.user.userId
    });

        res.json(tasks);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch tasks"
        });

    }

});

//DELETE - Delete Task. 
app.delete("/api/tasks/:id", authMiddleware, async function(req, res) {
    try {

        const deletedTask = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete task"
        });

    }
});


// PUT - Update Task
app.put("/api/tasks/:id", authMiddleware, async function(req, res) {

    try {

        const updatedTask = await Task.findOneAndUpdate(
    {
        _id: req.params.id,
        user: req.user.userId
    },
    {
        text: req.body.text,
        completed: req.body.completed
    },
    { new: true }
);
    if (!updatedTask) {
    return res.status(404).json({
        message: "Task not found"
    });
}
       
    res.json(updatedTask);

    } catch (error) {

        res.status(500).json({
            message: "Failed to update task"
        });

    }

});

//POST - Register User
// POST - Register User
app.post("/api/register", async function(req, res) {

    try {

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Create new user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword
    });

        const savedUser = await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: savedUser
        });

    } catch (error) {

        res.status(500).json({
            message: "Registration failed"
        });

    }

});

//POST - Login User
// POST - Login User
app.post("/api/login", async function(req, res) {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user._id
            },
            "taskflow_secret_key",
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Login failed"
        });
    }
});

//Temporary Route to test authMiddleware
app.get("/api/protected", authMiddleware, function(req, res) {

    res.json({
        message: "You are authenticated!",
        user: req.user
    });

});


//SERVER 
app.listen(PORT, function() {
    console.log(`Server running on http://localhost:${PORT}`);
});
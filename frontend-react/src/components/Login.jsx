import { useState } from "react";

function Login({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    function handleLogin() {

        if (email.trim() === "" || password.trim() === "") {
            setMessage("Please enter email and password");
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

            console.log("Login response:", data);

            if (data.token) {

                localStorage.setItem("token", data.token);

                setMessage("Login successful!");

                console.log("JWT Token:", data.token);

                onLogin();

            } else {

                setMessage(data.message);

            }

        })
        .catch(function(error) {

            console.log("Login error:", error);
            setMessage("Something went wrong");

        });
    }

    return (
        <section className="auth-section">

            <div className="auth-box">

                <h2>Welcome to TaskFlow</h2>

                <p>Login to manage your tasks</p>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button onClick={handleLogin}>
                    Login
                </button>

                <p>{message}</p>

            </div>

        </section>
    );
}

export default Login;
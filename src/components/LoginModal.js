import React, { useState } from "react";
import "../styles/LoginModal.css";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  if (!open) return null;

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate login process
        setTimeout(() => {
        console.log("Login attempted with:", { email, password });
        setIsLoading(false);
        // Add your login logic here
        }, 1000);
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate login process
        setTimeout(() => {
        console.log("Login attempted with:", { email, password });
        setIsLoading(false);
        // Add your login logic here
        }, 1000);
    };

    const handleOverlayClick = (e) => {
        if (e.target.className === "login-overlay") {
            onClose();
        }
    };

  return (
    <div className="login-overlay" onClick={handleOverlayClick}>
      <div className="login-modal">

        <h2 className="divider">Welcome Back</h2>
        {!isRegister && (
            <form onSubmit={handleLogin} className="login-form" id="login-form">
            <label>Email address<small>*</small></label>
            <input
                type="email"
                className="input"
        
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label>Password<small>*</small></label>
            <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button 
                type="submit" 
                className="new-chat-btn"
                disabled={isLoading}
            >
                {isLoading ? "Logging in..." : "Login"}
            </button>
            </form>
        )}
        {isRegister && (
            <form onSubmit={handleRegister} className="login-form" id="register-form">
            <label>Name<small>*</small></label>
            <input
                type="text"
                className="input"
                readOnly
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />

            <label>Email address<small>*</small></label>
            <input
                type="email"
                className="input"
                readOnly
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label>Password<small>*</small></label>
            <input
                type="password"
                className="input"
                value={password}
                
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <div className="d-flex justify-content-between align-items-center">
                <button 
                   type="button" 
                   className="new-chat-btn"
                   disabled={isLoading}
                   onClick={(e) => setIsRegister(false)}
               >Back</button>

                <button 
                type="submit" 
                className="new-chat-btn"
                disabled={isLoading}
            >
                {isLoading ? "Processing..." : "Go"}
            </button>

            </div>
            </form>
        )}

        {!isRegister && (
            <div className="divider">OR</div>
             
        )}
        {!isRegister && (
            <GoogleLogin
                onSuccess={(res) => {
                    const user = jwtDecode(res.credential);
                    if (user.name && user.email) {
                        setName(user.name);
                        setEmail(user.email);
                        setIsRegister(true);
                    }else{
                        setIsRegister(false);
                    }
                }}
                onError={() => {
                    console.log("Login Failed");
                }}
            />
        )}

        
        
      </div>
    </div>
  );
}
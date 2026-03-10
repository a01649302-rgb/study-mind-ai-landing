import { useState } from "react";
import SummarizeForm from "../components/SummarizeForm";

export default function Home() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const subscribe = async (e) => {
    e.preventDefault();

    try {

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (data.success) {
        setMessage("You are on the waitlist 🚀");
        setEmail("");
      } else {
        setMessage("Error saving email");
      }

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", padding: "100px" }}>

      <h1>StudyMind AI</h1>
      <p>The AI that studies for you</p>

      <form onSubmit={subscribe}>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", width: "250px" }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            background: "black",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Join Waitlist
        </button>

      </form>

      <p>{message}</p>

      <hr style={{ margin: "50px 0" }} />

      <SummarizeForm />

    </div>
  );
}
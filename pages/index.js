import { useState } from "react"

export default function Home() {

  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()

    if (res.ok) {
      setMessage("✅ Thanks for joining the StudyMind AI waitlist!")
      setEmail("")
    } else {
      setMessage("❌ Something went wrong")
    }
  }

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      flexDirection: "column",
      fontFamily: "Arial"
    }}>

      <h1>StudyMind AI</h1>

      <p>The AI that helps you study smarter.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "10px",
            fontSize: "16px",
            marginRight: "10px"
          }}
        />

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          Join Waitlist
        </button>

      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}

    </div>
  )
}
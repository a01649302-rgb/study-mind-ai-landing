import { useState } from "react";

export default function SummarizeForm() {

  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const summarize = async () => {

    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    setSummary(data.summary);
  };

  return (
    <div style={{ marginTop: "50px" }}>

      <h2>AI Study Summarizer</h2>

      <textarea
        rows="6"
        cols="50"
        placeholder="Paste your study notes..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />

      <button
        onClick={summarize}
        style={{ marginTop: "10px" }}
      >
        Summarize
      </button>

      <p>{summary}</p>

    </div>
  );
}
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { text } = req.body

  try {

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Resume textos de estudio en puntos claros"
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    })

    const data = await response.json()

    const summary = data.choices[0].message.content

    await supabase
      .from("summaries")
      .insert([{ original: text, summary }])

    res.status(200).json({ summary })

  } catch (error) {

    res.status(500).json({ error: "Error generating summary" })

  }
}
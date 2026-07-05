import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { messages, system } = await request.json();

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: system },
        ...messages
      ],
      max_tokens: 200,
      temperature: 0.9
    });

    const reply = completion.choices[0]?.message?.content || "Hey! \ud83d\ude0a";
    return Response.json({ reply });
  } catch (error) {
    console.error("Groq error:", error);
    return Response.json({ reply: "Oops! Try again \ud83d\ude05" }, { status: 500 });
  }
}

import Groq from "groq-sdk";

export const runtime = "edge";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST() {
  try {
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return Response.json({
      text: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Groq API error:", error);

    return Response.json(
      { message: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}

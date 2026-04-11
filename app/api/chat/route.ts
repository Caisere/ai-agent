// import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY can't be found");
}

const client = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: NextRequest) {

  const { message, chatHistory } = await req.json();

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      "You are a helpful assistant called Aria. You are friendly, concise and straight to the point.",
  });

  const chat = model.startChat({
    history: chatHistory.map((msg: {role: string, content: string}) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{text: msg.content}]
    }))
  })

  const result = await chat.sendMessage(message);

  const text = result.response.text();

  return NextResponse.json({ 
    message: text 
  });

}

// const API_KEY = process.env.ANTHROPIC_API_KEY

// const client = new Anthropic({
//   apiKey: GEMINI_API_KEY
// })

// const { message } = await req.json();

// const response = await client.messages.create({
//   model: "claude-opus-4-5",
//   max_tokens: 1024,
//   system: "You are a helpful assistant called Aria...",
//   messages: [{ role: "user", content: message }],
// });

// const text =
//   response.content[0].type === "text" ? response.content[0].text : "";

// return NextResponse.json({
//   message: text,
// });

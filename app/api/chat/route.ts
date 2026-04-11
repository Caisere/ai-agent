// import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getMovies, addMovie, markAsWatched, removeMovie } from "@/lib/movies";
import { tools } from "@/lib/tools";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY can't be found");
}

const client = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: NextRequest) {
  const { message, chatHistory } = await req.json();

  const model = client.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: `You are Aria, a helpful movie watchlist assistant. 
    You help users manage their movie watchlist.
    When a user wants to mark a movie as watched or remove it, always call getMovies first to get the correct id, then perform the action.
    Always confirm what action you took after using a tool.`,
    tools: [{ functionDeclarations: tools }],
  });

  const chat = model.startChat({
    history: chatHistory.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
  });

  const result = await chat.sendMessage(message);

  const response = result.response;

  const toolCall = response.candidates?.[0]?.content?.parts?.find(
    (p) => p.functionCall,
  );

  if (toolCall?.functionCall) {
    const { name, args } = toolCall.functionCall;
    const fnArgs = args as Record<string, string>;

    let toolResult;

    if (name === "getMovies") {
      toolResult = await getMovies();
    } else if (name === "addMovie") {
      toolResult = await addMovie(fnArgs.title);
    } else if (name === "markAsWatched") {
      toolResult = await markAsWatched(fnArgs.id);
    } else if (name === "removeMovie") {
      toolResult = await removeMovie(fnArgs.id);
    }

    const followUp = await chat.sendMessage([
      {
        functionResponse: {
          name,
          response: { result: toolResult },
        },
      },
    ]);

    return NextResponse.json({
      message: followUp.response.text(),
    });
  }

  return NextResponse.json({
    message: response.text(),
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

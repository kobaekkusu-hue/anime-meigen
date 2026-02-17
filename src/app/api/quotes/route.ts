
import { model } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { keyword, character, count } = await req.json();

        if (!keyword) {
            return NextResponse.json(
                { error: "Keyword is required" },
                { status: 400 }
            );
        }

        const prompt = `
      You are an anime quote finder for a Japanese audience.
      The user has provided the following keyword: "${keyword}".
      ${character ? `The user also specified the character: "${character}".` : ""}

      **Task:**
      Find ${count || 3} anime quotes that match the provided keyword.
      - If the keyword is an **Anime Title** (e.g. "NARUTO"), find quotes from that anime.
      - If the keyword is a **Mood, Emotion, or Situation** (e.g. "passionate", "sad", "when you want to give up"), find quotes from *various* anime that match that vibe.
      ${character ? `- Since a character was specified, strictly find quotes by "${character}" that match the keyword/anime.` : ""}
      
      **IMPORTANT rules:**
      1.  **Language**: The quote text MUST be in **Japanese** (original Japanese text).
      2.  **Output**: Return ONLY a JSON array of objects with the following keys:
          - quote: The quote text in Japanese.
          - character: The character who said it (in Japanese).
          - anime: The anime title (in Japanese).
      
      Do not include any markdown formatting like \`\`\`json. Just the raw JSON array.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if present
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const quotes = JSON.parse(cleanedText);
            return NextResponse.json({ quotes });
        } catch (e) {
            console.error("Failed to parse JSON:", text);
            return NextResponse.json(
                { error: "Failed to generate valid JSON response from AI" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error generating quotes:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

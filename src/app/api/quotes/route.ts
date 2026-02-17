
import { model } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { keyword, character, count, category = 'anime' } = await req.json();

        if (!keyword) {
            return NextResponse.json(
                { error: "Keyword is required" },
                { status: 400 }
            );
        }

        let context = "";
        switch (category) {
            case 'great_person':
                context = "Search for quotes by **historical figures, celebrities, or philosophers**.";
                break;
            case 'movie':
                context = "Search for quotes from **movies or cinema**.";
                break;
            case 'anime':
            default:
                context = "Search for quotes from **anime**.";
                break;
        }

        const prompt = `
      You are a quote finder for a Japanese audience.
      Target Category: ${context}
      The user has provided the following keyword: "${keyword}".
      ${character ? `The user also specified the speaker/character: "${character}".` : ""}

      **Task:**
      Find ${count || 3} quotes that match the provided keyword within the target category.
      - If the keyword is a **Title/Name** (e.g. "Steve Jobs", "Titanic"), find quotes from that source.
      - If the keyword is a **Mood, Emotion, or Situation** (e.g. "passionate", "business", "romance"), find quotes that match that vibe.
      ${character ? `- Strictly find quotes by "${character}".` : ""}
      
      **IMPORTANT rules:**
      1.  **Language**: The quote text MUST be in **Japanese** (original Japanese text).
      2.  **Output**: Return ONLY a JSON array of objects with the following keys:
          - quote: The quote text in Japanese.
          - character: The speaker/character name (in Japanese).
          - anime: The source title (Anime name, Movie title, or specific context for great figures if applicable, otherwise just '偉人' or the specific affiliation).
      
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

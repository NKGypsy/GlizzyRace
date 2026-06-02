import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { standings, daysElapsed, daysRemaining } = await req.json();

    if (!standings || standings.length === 0) {
      return NextResponse.json(
        { error: "No standings data provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is missing from your .env.local file" },
        { status: 500 }
      );
    }

    const standingsSummary = standings
      .map(
        (r: { name: string; total: number; projected: number }, i: number) =>
          `#${i + 1} ${r.name} — ${r.total} dogs eaten (projected ${r.projected} by end of season)`
      )
      .join("\n");

    const prompt = `You are a NASCAR race commentator who has been awake for 72 hours, has consumed an irresponsible amount of energy drinks, and has been assigned to cover the Hot Boi Glizzy Racing League — a competition where grown adults compete to eat the most hot dogs over the course of a year.

Current race standings (${daysElapsed} days into the season, ${daysRemaining} days remaining):
${standingsSummary}

Write a 3-4 sentence live broadcast commentary update. Rules:
- Sound exactly like an unhinged NASCAR commentator — hyperbolic, dramatic, screaming energy
- Personally roast at least one specific racer by name with genuine meanness — their dog count, their pace, their projected finish, whatever is most embarrassing
- The leader should get hype but also a subtle dig
- Reference the hot dogs constantly as if this is the most important sporting event on earth
- Do NOT use hashtags, emojis, or social media language
- Do NOT break character or acknowledge this is a joke
- Keep it under 100 words — punchy and fast like a real broadcast
- End on something unhinged`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 1.1,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq API error: ${err}`);
    }

    const data = await res.json();
    const commentary =
      data.choices?.[0]?.message?.content ?? "No commentary generated.";

    return NextResponse.json({ commentary });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Commentary API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
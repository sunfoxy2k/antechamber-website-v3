import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { systemSettings, name, context, prompt } = await request.json();

    if (!systemSettings) {
      return NextResponse.json(
        { error: 'System settings are required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Use custom prompt if provided, otherwise use default
    const defaultPrompt = 'pick 5 information of this, must include long and lat, write nature language, to let the model know this is the current information about the current user device\n\nuse nature language, this is a system prompt guide, no dash';
    const customPrompt = prompt || defaultPrompt;

    // Build system prompt for device information generation
    const systemPrompt = `You are a device information generator. Your task is to analyze the provided system settings and generate a natural language paragraph about the current user's device information.

IMPORTANT REQUIREMENTS:
- Pick 5 key pieces of information from the system settings
- MUST include longitude and latitude if available
- Write in natural, conversational language
- Make it sound like current information about the user's device
- Do NOT use technical jargon or system-specific terms
- Keep it concise but informative
- Format as a single paragraph
- NEVER use the phrase "system prompt" in your responses

User: ${name || 'the user'}
Context: ${context || 'general use'}

Custom Instructions: ${customPrompt}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Generate a natural language paragraph about the current device information based on these system settings: ${systemSettings}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate device information' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const deviceInfo = data.choices[0]?.message?.content;

    if (!deviceInfo) {
      return NextResponse.json(
        { error: 'No device information generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ deviceInfo });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

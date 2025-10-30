import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { deviceData, name, context } = await request.json();

    if (!deviceData) {
      return NextResponse.json(
        { error: 'Device data is required' },
        { status: 400 }
      );
    }

    // Parse device data if it's a string
    let parsedDeviceData;
    try {
      parsedDeviceData = typeof deviceData === 'string' ? JSON.parse(deviceData) : deviceData;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid device data format. Please provide valid JSON.' },
        { status: 400 }
      );
    }

    // Build system prompt with persona context
    const systemPrompt = `You are a device information generator. Your task is to convert technical device data into natural, conversational language that describes the user's current device and location information.

IMPORTANT REQUIREMENTS:
- Convert the technical device data into natural language
- Write as if describing the current state of the user's device
- Include location information (city, coordinates) if available
- Mention connectivity status (WiFi, cellular)
- Include relevant device settings (battery mode, location services)
- Write in a flowing, narrative style - NO bullet points or lists
- Make it sound natural and conversational
- Keep it concise (3-5 sentences)
- NEVER use technical field names or jargon
- NEVER mention "system prompt" or "device data"

USER CONTEXT:
${context ? `The user is: ${context}` : 'User information not provided'}
${name ? `Their name is: ${name}` : ''}

Write the device information naturally, as if you're describing this person's current situation and location.`;

    const deviceDataString = JSON.stringify(parsedDeviceData, null, 2);

    // Use OpenAI SDK with GPT-5
    const completion = await openai.chat.completions.create({
      model: 'gpt-5',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `Convert this device data into natural language:\n\n${deviceDataString}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
      reasoning_effort: 'medium',
    });

    const deviceInfo = completion.choices[0]?.message?.content;

    if (!deviceInfo) {
      return NextResponse.json(
        { error: 'No device information generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ deviceInfo, deviceData: parsedDeviceData });

  } catch (error) {
    // Better error handling with OpenAI SDK
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API error:', error.status, error.message);
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      );
    }
    
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

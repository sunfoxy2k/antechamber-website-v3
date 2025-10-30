import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { content, prompt, name, context, systemSettings, mustHaveContent } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Build enhanced system prompt
    let systemPrompt = `You are a professional content paraphrasing assistant. Your task is to paraphrase the provided content while ensuring it is suitable for the specific context and user. 

IMPORTANT REQUIREMENTS:
- Reword and change word order while keeping all existing nouns and entities exactly the same
- Ensure the paraphrased content is appropriate and suitable for the given context
- Make sure the content is tailored for the specific user (${name || 'the user'})
- Maintain the original meaning and intent while improving clarity and flow
- Format the output with each paragraph separated by "========\n[paraphrased content]\n========"
- NEVER use the phrase "system prompt" in your responses`;

    // Always include context as it's essential for generating suitable content
    if (context) {
      systemPrompt += `\n\nCONTEXT (CRITICAL): ${context}\nThe generated content must be appropriate and suitable for this specific context.`;
    }
    
    if (systemSettings) {
      systemPrompt += `\n\nADDITIONAL SYSTEM REQUIREMENTS: ${systemSettings}`;
    }
    
    if (mustHaveContent) {
      systemPrompt += `\n\nCONTENT THAT MUST BE INCLUDED: ${mustHaveContent}`;
    }

    // Add custom prompt if provided
    if (prompt && prompt !== 'Please paraphrase the following content by rewording and changing word order, but keep all existing nouns and entities exactly the same. Format the output with each paragraph separated by "========\n[paraphrased content]\n========"') {
      systemPrompt += `\n\nCUSTOM INSTRUCTIONS: ${prompt}`;
    }

    // Use OpenAI SDK with GPT-5 (latest model released August 2025)
    const completion = await openai.chat.completions.create({
      model: 'gpt-5', // Latest GPT-5 model with advanced capabilities
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: content
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      reasoning_effort: 'medium', // GPT-5 feature: control thinking time
    });

    const paraphrasedContent = completion.choices[0]?.message?.content;

    if (!paraphrasedContent) {
      return NextResponse.json(
        { error: 'No paraphrased content received' },
        { status: 500 }
      );
    }

    // Split the paraphrased content into paragraphs
    const paragraphs = paraphrasedContent
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    return NextResponse.json({ paragraphs });

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

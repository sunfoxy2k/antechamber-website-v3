import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { content, prompt, name, context, systemSettings, mustHaveContent } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }


    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Build enhanced system prompt
    let systemPrompt = `You are a professional content paraphrasing assistant. Your task is to paraphrase the provided content while ensuring it is suitable for the specific context and user. 

IMPORTANT REQUIREMENTS:
- Reword and change word order while keeping all existing nouns and entities exactly the same
- Ensure the paraphrased content is appropriate and suitable for the given context
- Make sure the content is tailored for the specific user (${name || 'the user'})
- Maintain the original meaning and intent while improving clarity and flow
- Format the output with each paragraph separated by "========\n[paraphrased content]\n========"`;

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
            content: content
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to paraphrase content' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const paraphrasedContent = data.choices[0]?.message?.content;

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
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import * as dotenv from 'dotenv'
dotenv.config()

import { OpenAI } from "openai"

export async function POST(req) {
    try {

        const data = await req.json();

        const image = data.image;

        const openai = new OpenAI({
            apiKey: process.env.OPEN_AI_API_KEY
        });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Identify the ingredient in the photo in only one word"
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: image,
                            }
                        }
                    ]
                }
            ],
            max_tokens: 1000,
        })
        
        return new Response(JSON.stringify({ response: response.choices[0] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
        
    } catch (error) {
        console.error('Error analyzing image:', error);

        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
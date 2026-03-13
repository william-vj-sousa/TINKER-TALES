const axios = require("axios");
const readline = require("readline");

// Setup CLI input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// specialized system prompt
const SYSTEM_PROMPT = `
 You are a strict text formatter.

Your task:
- Do NOT change any words.
- Do NOT add any words.
- Do NOT remove any words.
- Do NOT correct grammar.
- Only insert paragraph breaks.
Return the exact same text with paragraph breaks added at appropriate places.
If you change any word, the task is incorrect.

Text:
`;

async function sendToModel(userInput) {
    try {
        const response = await axios.post(
            "http://localhost:4891/v1/chat/completions",
            {
                model: "Llama 3.2 1B Instruct",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: userInput }
                ],
                temperature: 0.7,
                max_tokens: 500
            }
        );

        return response.data.choices[0].message.content;

    } catch (error) {
        console.error("Error communicating with model:");
        console.error(error.message);
        process.exit(1);
    }
}

// Ask user for input
rl.question("Enter your message: ", async (input) => {
    const reply = await sendToModel(input);
    console.log("\nModel Response:\n");
    console.log(reply);
    rl.close();
});

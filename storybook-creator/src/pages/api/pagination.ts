import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  console.log("Request received:", req.body);
  
  const { user_input, curr_page, bookStructure,appending_text} = req.body;  
  console.log(`USER INPUT PAGE NUMBER ${curr_page}`)
  console.log(`USER INPUT PAGE NUMBER ${curr_page}`)
  console.log(`USER INPUT PAGE NUMBER ${curr_page}`)
  console.log(`USER INPUT PAGE NUMBER ${curr_page}`)
  console.log(`USER INPUT PAGE NUMBER ${curr_page}`)
  
  if (!user_input || typeof user_input !== "string") {
    return res.status(400).json({ error: "User input is required and must be a string" });
  }

  const instructions = `
    You are helping in structuring a children's storybook. The book has the following structure:
    - THERE SHOULD ONLY BE 1-2 SENTENCES PER PAGE
    - The book contains multiple pages, each with a page number, text content, illustration, and a status.
    - The goal is to help the author create a story, split it across multiple pages if needed, and determine if a page is complete.
    - The assistant will receive new user input and decide whether to append it to an existing page or split it across new pages.
    - The assistant will determine if the page is "complete" or "incomplete" given a set of criteria (specified below)
    - Do NOT remove any existing data.
    - Update the text_content of the relevant page OR create a new page if necessary.
    - Return ONLY the modified pages and their statuses. Do NOT return the entire book.
    - IF YOU ARE CREATING A NEW PAGE, IT'S PAGE NUMBER MUST BE AN EVEN NUMBER
    - If the provided user text does not currently fit anywhere in the story naturally, you should create a new page, where the page number is ${curr_page}
    - Again, split the content into multiple pages, there should not be large groups of text on one page. 
    - If appending_text is true, then append to the page ${curr_page}, otherwise create a new page. This means the returned value should be an updated page with pagenumber ${curr_page}
    - Returned page numbers must be an even number no matter what. (Starting with 2).
    
    Here is how to determine page status:
    - "complete" if the page is >=2 sentences long.
    - "in_progress" if the page is  <2 sentences long. 

    
    NOTE: Even if a page is "complete" it can still be appended to, if the content is relevant to the page, and helps with the overall structure of the story. 
    AGAIN - THERE SHOULD ONLY BE 1-2 SENTENCES PER PAGE

    Here is the inputted data:

    Current book:
    ${JSON.stringify(bookStructure)}

    User input:
    ${user_input}

    If the provided user text does not currently fit anywhere in the story naturally, you should create a new page, where the page number is ${curr_page}
   ""

    Please return an object with ONLY updated pages in this format:
    {
        "updatedPages": [
        {
            "pageNumber": "number",
            "text_content": "string",
            "page_status": "complete | in_progress"
            "page_type": "text"
        }
        ]
    }


    If the user input already exists in the book (i.e it is duplicate) return nothing. The nothing return format should be:
    {
      "updatedPages": []
    }


    If the provided user text does not currently fit anywhere in the story naturally, you should create a new page, where the page number is ${curr_page}

`;

try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [{ role: "system", content: instructions }],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "PaginationSchema", 
            schema: { 
              type: "object",
              properties: {
                updatedPages: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      pageNumber: { type: "number" },
                      text_content: { type: "string" },
                      page_status: { type: "string", enum: ["complete", "in_progress"] },
                      page_type:{ type: "string" }
                    },
                    required: ["pageNumber", "text_content", "page_status", "page_type"]
                  }
                }
              },
              required: ["updatedPages"]
            }
          }
        }
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(response.status).json({ error: data.error?.message || "OpenAI request failed" });
    }

    const content = data.choices[0]?.message?.content;
    
    if (content) {
      try {
        const parsedData = JSON.parse(content); 
        const updatedPages = parsedData.updatedPages;
        console.log(updatedPages);
        if (!updatedPages) {
          throw new Error("Invalid response format from OpenAI");
        }
        
        res.status(200).json({ updatedPages });
        
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.log("No content received.");
    }
  } catch (error: any) {
    console.error("Error processing response:", error.message);
    res.status(500).json({ error: error.message || "Failed to process response" });
  }

}

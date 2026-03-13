// import { NextApiRequest, NextApiResponse } from "next";
// import path from "path";
// import fs from "fs";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   const { prompt } = req.body;
//   console.log('prompt:', prompt)
//   if (!prompt || typeof prompt !== "string") {
//     return res.status(400).json({ error: "Prompt is required and must be a string" });
//   }

//   const promptForOpenAI = `In the style of a childrens book make an image of the following: ${prompt}`;
  
//   try {
//     const response = await fetch("https://api.openai.com/v1/responses", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "dall-e-3",  // the model that supports image_generation tool
//         input: promptForOpenAI,
//       }),
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       return res.status(response.status).json({ error: data.error?.message || "OpenAI request failed" });
//     }

//     const imageBase64 = data.output.find((o: any) => o.type === "image_generation_call")?.result;
//     if (!imageBase64) {
//       throw new Error("Image data not found");
//     }

//     // Prepare file path and name
//     const fileName = `generated-${Date.now()}.png`;
//     const dir = path.join(process.cwd(), "public", "generated-images");

//     // Make sure directory exists
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }

//     const filePath = path.join(dir, fileName);

//     // Write the base64 image to file (strip prefix if exists)
//     const base64Data = imageBase64.replace(/^data:image\/png;base64,/, "");
//     fs.writeFileSync(filePath, base64Data, "base64");

//     // Return the public URL path to client
//     const publicUrl = `/generated-images/${fileName}`;
//     res.status(200).json({ imageUrl: publicUrl });
    
//   } catch (error: any) {
//     console.error("Error generating image:", error.message);
//     res.status(500).json({ error: error.message || "Failed to generate image" });
//   }
// }






import { NextApiRequest, NextApiResponse } from "next";
import { useBookStore } from "../../store/useBookStore";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  
  const { prompt } = req.body;
  const promptForOpenAI = `In the style of a childrens book make an image of the following make sure that it is cartoon style: ${prompt}`;
  console.log(`sending the following prompt to openai for iamge gen: ${promptForOpenAI}`)

  if (!prompt || typeof prompt !== "string") {
    console.error("Invalid prompt:", prompt);
    return res.status(400).json({ error: "Prompt is required and must be a string" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Make sure this is set in .env.local
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: promptForOpenAI,
        n: 1,
        size: "1024x1024",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(response.status).json({ error: data.error?.message || "OpenAI request failed" });
    }

    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error("Invalid response from OpenAI");
    }

    console.log("Image generated successfully:", data.data[0].url);

    res.status(200).json({ imageUrl: data.data[0].url });

  } catch (error: any) {
    console.error("Error generating image:", error.message);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
}

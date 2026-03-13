import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { imageUrl, bookname, filename, pageNumber }: { imageUrl: string; bookname: string; filename: string; pageNumber: number } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: "Missing imageUrl parameter" });
    }

    // Base origin for relative URLs
    const origin = process.env.SITE_ORIGIN || "http://localhost:3000";

    // Convert relative URLs to absolute URLs for fetch
    const fullUrl = imageUrl.startsWith("http") ? imageUrl : `${origin}${imageUrl}`;

    // Fetch the image from full URL
    const response = await fetch(fullUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch image: ${response.statusText}` });
    }

    const buffer = await response.arrayBuffer();

    // Ensure 'public/generated_img/bookname/pageNumber' directory exists
    const saveDir = path.join(process.cwd(), "public", "generated_img", bookname, `${pageNumber}`);
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    // Count the current number of files in the directory
    const filesInDir = fs.readdirSync(saveDir);
    const fileCount = filesInDir.length + 1;

    // Generate a unique filename: filename_fileCount_fileCount.png
    const uniqueFilename = `${filename}_${fileCount}_${fileCount}.png`;

    // Rename existing files to include fileCount (optional, per your original logic)
    filesInDir.forEach((oldName) => {
      const oldPath = path.join(saveDir, oldName);

      const ext = path.extname(oldName);
      const parts = oldName.split('_');
      if (parts.length >= 3) {
        const newName = `${parts[0]}_${parts[1]}_${parts[2]}_${fileCount}${ext}`;
        const newPath = path.join(saveDir, newName);

        try {
          fs.renameSync(oldPath, newPath);
        } catch (err) {
          console.warn(`Failed to rename ${oldName} to ${newName}`, err);
        }
      }
    });

    // Save the fetched image buffer to file
    const filePath = path.join(saveDir, uniqueFilename);
    await fs.promises.writeFile(filePath, Buffer.from(buffer));

    console.log("✅ Image saved at:", filePath);

    // Return the public-accessible relative URL to the client
    const publicPath = `/generated_img/${bookname}/${pageNumber}/${uniqueFilename}`;
    res.status(200).json({ localPath: publicPath });

  } catch (error: any) {
    console.error("❌ Error saving image:", error);
    res.status(500).json({ error: error.message || "Failed to save image" });
  }
}





// import { NextApiRequest, NextApiResponse } from "next";
// import fs from "fs";
// import path from "path";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     const {imageUrl,bookname,filename,pageNumber}: {imageUrl: string; bookname:string, filename: string; pageNumber:number} = req.body;

//     if (!imageUrl) {
//       return res.status(400).json({ error: "Missing imageUrl parameter" });
//     }

//     // Fetch the image
//     const response = await fetch(imageUrl);
//     const buffer = await response.arrayBuffer();

//     // Ensure 'public/generated/bookTitle/pageNumber' directory exists
//     // Make it if it doesn't
//     const saveDir = path.join(process.cwd(), "public", "generated_img", `${bookname}`,`${pageNumber}`);
//     if (!fs.existsSync(saveDir)) {
//       fs.mkdirSync(saveDir, { recursive: true });
//     }

//     // Count the Current Number of Files in the directory
//     const filesInDir = fs.readdirSync(saveDir);
//     const fileCount = filesInDir.length + 1;

//     // Generate a timestamped filename
//     // Filename before this code is bookName_pageNumber
//     // Filename after should be bookName_pageNumber_fileCount.png
//     // const timestamp = Date.now(); // Current timestamp in milliseconds
//     // const uniqueFilename = `${filename}_${newfileCount}_${timestamp}.png`;
//     const uniqueFilename = `${filename}_${fileCount}_${fileCount}.png`;

//     filesInDir.forEach((oldName, index) => {
//       const oldPath = path.join(saveDir, oldName);

//       // Preserve original extension
//       const ext = path.extname(oldName);
    
//       const newName = `${oldName.split('_')[0]}_${oldName.split('_')[1]}_${oldName.split('_')[2]}_${fileCount}${ext}`;
//       const newPath = path.join(saveDir, newName);

//       fs.renameSync(oldPath, newPath);
//     });

//     // Save the image 
//     const filePath = path.join(saveDir, uniqueFilename);
//     await fs.promises.writeFile(filePath, Buffer.from(buffer));

//     console.log("✅ Image saved at:", filePath);

//     // Return the public-accessible path
//     res.status(200).json({localPath: `/generated_img/${bookname}/${pageNumber}/${uniqueFilename}`});
//   } catch (error) {
//     console.error("❌ Error saving image:", error);
//     res.status(500).json({ error: "Failed to save image" });
//   }
// }

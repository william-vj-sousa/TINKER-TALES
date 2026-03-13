import { useBookStore } from "../store/useBookStore";
import saveImage from "./saveImage";



const generateImage = async (prompt: string, bookName: string, pageNumber: number): Promise<void> => {
  
  try {
    const store = useBookStore.getState();
    if (!store || !store.book) {
      console.error("❌ Store is not initialized properly.");
      return;
    }

    store.updatePage(pageNumber, { illustration_loading: true });
    console.log("🚀 Sending request to API with prompt:", prompt);

    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: prompt }),
    });

    console.log("📩 Raw response:", response);
    const data = await response.json();
    console.log("📦 Response JSON:", data);

    if (data.imageUrl) {
      saveImage(data.imageUrl,bookName, pageNumber);
      console.log("🖼️ Generated Image URL:", data.imageUrl);
    } else {
      console.error("❌ No image URL in response:", data);
    }
  } catch (error) {
    console.error("❌ Error generating image:", error);
  }
};

export default generateImage;

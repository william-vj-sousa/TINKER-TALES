import { useBookStore } from "../store/useBookStore";


const saveImage = async (imageUrl: string, bookName: string, pageNumber: number): Promise<void> => {
    const store = useBookStore.getState();
    
    if (!store || !store.book) {
      console.error("❌ Store is not initialized properly.");
      return;
    }

    try {
      const response = await fetch("/api/save-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, bookname:bookName, filename: `${bookName}_${pageNumber}`,pageNumber }),
      });
  
      const data = await response.json();
      
      if (data.localPath) {
        console.log(`✅ Image saved at ${data.localPath} for pageNumber:${pageNumber}`);
        
        store.updatePage(pageNumber, {
          illustration: data.localPath,
          illustration_loading: false,
          page_status: "complete"
        });
  
        console.log("📖 Page updated with new image path");
        console.log(`STORE: ${store.book}`)
      } else {
        console.error("❌ Failed to get localPath from API response.");
      }
    } catch (error) {
      console.error("❌ Error saving image:", error);
    }
  };
  
  export default saveImage;



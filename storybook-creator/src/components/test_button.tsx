import { useState } from "react";
import { useBookStore,bookPage } from "../store/useBookStore"; 
import generateImage from "@/utils/generateImage";
import paginate_input from "@/utils/pagination";

const user_input = `
Once upon a time, there was a brave knight who set off on an adventure. 
Clad in gleaming armor and armed with a sword forged in dragon fire, 
Sir Aldric rode through misty forests and treacherous mountain paths in search of the fabled Heartstone, 
a gem said to hold the power of eternal wisdom. 
Legends whispered that the stone lay hidden in the ruins of Eldoria, a cursed kingdom where shadows danced without light. 
As he ventured deeper into the forgotten land, the air grew thick with enchantment, and an eerie silence settled around him. 
Yet, with unwavering determination, Sir Aldric pressed on, unaware that unseen eyes watched his every move from the darkness.

`

export default function TestStoryButton() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const bookStructure = useBookStore((state) => state.book);
  const updatePage = useBookStore((state) => state.updatePage);
  const addPage = useBookStore((state) => state.addPage);

  if (!bookStructure) return;
  const leftPageIndex  = (2 * bookStructure.nav_index)
  const rightPageIndex = (2 * bookStructure.nav_index) + 1


  return (
    <div className="p-4">
      <button
        onClick={() => {
          const latestBookState = useBookStore.getState().book;
          if (!latestBookState) {return}
          console.log("Book Pages:", JSON.stringify(latestBookState?.pages, null, 2));
          paginate_input(bookStructure.bookTitle, user_input,leftPageIndex+1, bookStructure, false, updatePage, addPage)
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Processing..." : "Test Story API"}
      </button>

      {response && (
        <div className="mt-4 p-2 bg-green-100 border border-green-400 rounded">
          <strong>Response:</strong>
          <pre className="text-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

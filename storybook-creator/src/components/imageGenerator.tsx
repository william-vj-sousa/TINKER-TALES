import { useBookStore } from "../store/useBookStore";
import generateImage from "@/utils/generateImage";
import paginate_input from "@/utils/pagination";
import { updatePromptWithCharDesc } from "@/utils/pagination";

const ImageGenerator = () => {
  const book        = useBookStore((state) => state.book);
  const store = useBookStore.getState();
  const updatePage = useBookStore((state) => state.updatePage);
  const addPage = useBookStore((state) => state.addPage);

  if (!book) return;
  const leftPageIndex  = (2 * book?.nav_index);
  const rightPageIndex  = (2 * book?.nav_index + 1);

  const goNext = () => { 
    const curr_img_path     =  book.pages[leftPageIndex].illustration;
    const split_path        =  curr_img_path?.split("_")
    const max_page_idx      = Number(split_path?.[4].split('.')[0])
    var new_page_idx        = Number(split_path?.[3]) + 1

    if (new_page_idx >= max_page_idx) {
      new_page_idx = max_page_idx
    }

    const new_img_page = `${split_path?.[0]}_${split_path?.[1]}_${Number(split_path?.[2])}_${new_page_idx}_${split_path?.[4]}`
    
    store.updatePage(leftPageIndex + 1, {
      illustration: new_img_page,
    });
  };
  
    const goPrev = () => {
      const curr_img_path     =  book.pages[leftPageIndex].illustration;
      const split_path        =  curr_img_path?.split("_")
      var new_page_idx        = Number(split_path?.[3]) - 1

      if (new_page_idx <= 1) {
        new_page_idx = 1
      }
  
      const new_img_page = `${split_path?.[0]}_${split_path?.[1]}_${Number(split_path?.[2])}_${new_page_idx}_${split_path?.[4]}`
      
      store.updatePage(leftPageIndex + 1, {
        illustration: new_img_page,
      });
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center">
      {/* LEFT ARROW */}
      <svg onClick={()=>goPrev()} className = "focus:outline-none cursor-pointer m-12" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      <div onClick={() => {
        const new_prompt = updatePromptWithCharDesc(book.pages[rightPageIndex].text_content || "")
        generateImage(new_prompt, book.bookTitle ,leftPageIndex + 1)}
        } className="cursor-pointer bg-white text-black text-sm px-8 py-4 rounded-md">
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.0329 5.36924H14.9309L12.447 2.99184C11.6473 2.22691 10.6512 1.67683 9.55881 1.3969C8.46639 1.11697 7.31619 1.11705 6.22382 1.39714C5.13145 1.67722 4.13541 2.22745 3.33584 2.99249C2.53628 3.75753 1.96135 4.71043 1.66887 5.75539M0.852099 13.0594V9.33083M0.852099 9.33083H4.75013M0.852099 9.33083L3.33522 11.7082C4.13491 12.4732 5.13103 13.0232 6.22344 13.3032C7.31585 13.5831 8.46606 13.583 9.55843 13.3029C10.6508 13.0228 11.6468 12.4726 12.4464 11.7076C13.246 10.9425 13.8209 9.98964 14.1134 8.94468M14.9309 1.64069V5.36774" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* RIGHT ARROW */}
      <svg onClick={()=>goNext()}  className = "focus:outline-none cursor-pointer m-12" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    
    </div>
  );
};

export default ImageGenerator;






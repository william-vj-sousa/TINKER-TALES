import { useState } from 'react';
import Image from 'next/image';
import SpeechRecognitionComponent from "./audioRecorder";
import { useBookStore, bookPage } from "../store/useBookStore";
import ImageGenerator from "./imageGenerator";
import LoadingIcon from "./loadingIcon";
import TestStoryButton  from './test_button';
import { Jacques_Francois } from 'next/font/google';
import EditableTextBox from './editableTextbox';
import CharacterModal from './characterDescriptionModal';


const BookViewer = () => {
    const [isEditing, setisEditing] = useState(false);
    const book        = useBookStore((state) => state.book);
    const setBook     = useBookStore((state) => state.setBook);
    const setNavIndex = useBookStore((state) => state.setNavIndex);
    const updatePage  = useBookStore((state) => state.updatePage);
    const addPage = useBookStore((state) => state.addPage);
   
   
    const [isTurning, setIsTurning] = useState(false);
    const [turnDirection, setTurnDirection] = useState<'right' | 'left' | null>(null);

    if (!book) return <p>Loading...</p>;

    const leftPageIndex  = (2 * book?.nav_index)
    const rightPageIndex = (2 * book?.nav_index) + 1
    const NumNavPages = Math.floor(book?.pages.length / 2);
    const flipImagePageIndex = isTurning && turnDirection === 'right' ? leftPageIndex + 1 : leftPageIndex;
    
    const goNext = () => { 
      setNavIndex(Math.min((book.nav_index + 1), NumNavPages - 1));
    };

    const goPrev = () => { 
      setNavIndex(Math.max((book.nav_index - 1), 0));
    };

 


    
    const createNewFold = () => {
        const blankIllustrationPage: bookPage = {
            pageNumber: rightPageIndex + 2,
            page_status: "blank",
            illustration: "",
            chapter: 1,
            page_type: "illustration",
          };
          const blankTextPage: bookPage = {
            pageNumber: rightPageIndex + 3,
            page_status: "in_progress",
            text_content: "",
            chapter: 1,
            page_type: "text",
          };
       

        addPage(blankIllustrationPage);
        addPage(blankTextPage);
        setNavIndex(book.nav_index + 1);
        const latestBookState = useBookStore.getState().book;
        if (!latestBookState) {return}
        console.log("Book Pages:", JSON.stringify(latestBookState?.pages, null, 2));
    }


    return(
          <div className="relative flex flex-row justify-center ">
            
            {/* BACK ARROW */}
            <div className="flex justify-center items-center cursor-pointer  p-6" onClick={()=>goPrev()}>
              <svg className = "focus:outline-none" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.75 19.5L8.25 12L15.75 4.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* LEFT PAGE */}            
            <div className={`relative w-4/12 aspect-[8.5/11] bg-slate-50 rounded-lg shadow-lg `}>
              {/* Gradient Div*/}
              
              <div className="absolute z-10 top-0 right-[-1px] w-6 h-full [background:linear-gradient(270deg,_rgba(255,_255,_255,_0)_0%,_#717171_300%)] transform -rotate-180"></div>

              {/* Content Div */}
             

              { !(book.pages[leftPageIndex]?.illustration)  ? (
                
                <div className="group absolute inset-0 m-auto w-11/12 aspect-[8.5/11] border-4 border-dashed bg-slate-50 border-gray-300 rounded z-0">
                  <ImageGenerator />
                  <div className="flex justify-center items-center w-full h-full">
                      {book.pages[leftPageIndex]?.illustration_loading ? (
                        <LoadingIcon />
                      ) : (
                        <svg width="32" height="25" viewBox="0 0 32 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M1.03369 17.659L8.78332 9.90941C9.09717 9.59555 9.46977 9.34659 9.87983 9.17674C10.2899 9.00688 10.7294 8.91946 11.1733 8.91946C11.6171 8.91946 12.0566 9.00688 12.4667 9.17674C12.8767 9.34659 13.2493 9.59555 13.5632 9.90941L21.3128 17.659M19.0596 15.4058L21.1761 13.2893C21.49 12.9754 21.8626 12.7264 22.2726 12.5566C22.6827 12.3867 23.1222 12.2993 23.5661 12.2993C24.0099 12.2993 24.4494 12.3867 24.8595 12.5566C25.2695 12.7264 25.6421 12.9754 25.956 13.2893L30.3258 17.659M3.28693 23.2921H28.0725C28.6701 23.2921 29.2432 23.0547 29.6658 22.6322C30.0884 22.2096 30.3258 21.6365 30.3258 21.0389V3.013C30.3258 2.41541 30.0884 1.84229 29.6658 1.41972C29.2432 0.997159 28.6701 0.759766 28.0725 0.759766H3.28693C2.68933 0.759766 2.11621 0.997159 1.69365 1.41972C1.27109 1.84229 1.03369 2.41541 1.03369 3.013V21.0389C1.03369 21.6365 1.27109 22.2096 1.69365 22.6322C2.11621 23.0547 2.68933 23.2921 3.28693 23.2921ZM19.0596 6.39286H19.0716V6.40487H19.0596V6.39286ZM19.6229 6.39286C19.6229 6.54226 19.5635 6.68554 19.4579 6.79118C19.3523 6.89682 19.209 6.95617 19.0596 6.95617C18.9102 6.95617 18.7669 6.89682 18.6613 6.79118C18.5556 6.68554 18.4963 6.54226 18.4963 6.39286C18.4963 6.24346 18.5556 6.10018 18.6613 5.99454C18.7669 5.8889 18.9102 5.82955 19.0596 5.82955C19.209 5.82955 19.3523 5.8889 19.4579 5.99454C19.5635 6.10018 19.6229 6.24346 19.6229 6.39286Z"
                            stroke="#6B7280"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>  
                </div>
              ):( 
                
              isTurning ? (
                // if turning, need to render the previous page momentarily so animation doesnt look janky
                <div className="relative group w-full h-full">
                {book.pages[leftPageIndex - 2].illustration_loading ?
                <LoadingIcon />
                :
                <Image
                src={book.pages[leftPageIndex - 2].illustration || "IMAGE PATH IS BROKEN"}
                alt={book.pages[leftPageIndex - 2].illustration_prompt || "There should be an image here"}
                layout="fill"
                objectFit="cover"
              />
                }
                <ImageGenerator/>
              </div>
              ) : (
                <div className="relative group w-full h-full">
                {book.pages[leftPageIndex].illustration_loading ?
                <LoadingIcon />
                :
                <Image
                src={book.pages[leftPageIndex].illustration || "IMAGE PATH IS BROKEN"}
                alt={book.pages[leftPageIndex].illustration_prompt || "There should be an image here"}
                layout="fill"
                objectFit="cover"
              />
                }
                <ImageGenerator/>
              </div>
              )


              )}
            </div>
            
            {isTurning && (
            <div
                className="absolute top-0 left-1/2 w-4/12 aspect-[8.5/11] rounded-lg shadow-lg"
                style={{
                  perspective: "3000px", // camera stays here
                  transformOrigin: "left",
                  zIndex: 500,
                }}>
                {/* Flipping layer that gets animated */}
                <div
                  className="relative w-full h-full"
                  style={{ transformStyle: "preserve-3d", transformOrigin: "left", animation: "pageTurn 1s forwards"}}
                  onAnimationEnd={() => { setIsTurning(false);}}>
                  <div className="absolute inset-0 bg-white flex items-center justify-center text-black"
                    style={{ backfaceVisibility: "hidden" }}>
                    {/* Front of page */}
                    <EditableTextBox pageNumber={book?.pages[2 * book?.nav_index - 1].pageNumber} isEditing={false}/>
                  </div>

                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-black"
                    style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden"}}>
                    {/* Back of page */}
                    <div className="relative group w-full h-full">
                    
                    { book.pages[leftPageIndex].illustration_loading ?
                    <LoadingIcon />
                    : book.pages[leftPageIndex]?.illustration ? (
                      // Flipping page, image exists
                      <Image
                      src={book.pages[leftPageIndex].illustration || "IMAGE PATH IS BROKEN"}
                      alt={book.pages[leftPageIndex].illustration_prompt || "There should be an image here"}
                      layout="fill"
                      objectFit="cover"/>
                    ) : (
                      // Flipping page, but there is no image
                      <Image
                      src={'/assets/blank_page.png'}
                      alt={book.pages[leftPageIndex].illustration_prompt || "There should be an image here"}
                      layout="fill"
                      objectFit="cover"/>
                    )

                    }
                    <ImageGenerator/>
                  </div>
                </div>
                  
              </div>

            </div>
            )}

            {/* RIGHT PAGE */}
            <div className="relative w-4/12  aspect-[8.5/11] bg-slate-50 rounded-lg shadow-lg">
              {/* Gradient Div*/}
              <div className="absolute z-10 top-0  w-8 h-full [background:linear-gradient(270deg,_rgba(255,_255,_255,_0)_0%,_#717171_300%)]"></div>
              
              {/* Content Div */}
              <div>
                <div className="absolute top-0 right-0 bottom-0 left-0">
                  <SpeechRecognitionComponent />
                  {/* <TestStoryButton/> */}
                </div>
              </div>
            </div>

            {/* FORWARD ARROW */}
            { ((book.nav_index === NumNavPages - 1) )  ? 
              <div className="flex flex-col justify-center items-center cursor-pointer w-24" onClick={() => {createNewFold();}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-gray-500 size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <div className='text-gray-500'>New Page</div>
              </div> 
              :
              <div className="flex justify-center items-center cursor-pointer w-24" onClick={()=>{goNext();setIsTurning(true);}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.25 4.5L15.75 12L8.25 19.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            }


          </div>
    )
};

export default BookViewer;

"use client";

import Button from "./button";
import { useBookStore,bookPage, book } from "../store/useBookStore";
import { jsPDF } from "jspdf";

interface CircleProps {
    color?: string; 
    highlighted?: Boolean;
    onClick?: () => void;
}

const Circle: React.FC <CircleProps> = ({color = 'bg-gray-300', highlighted = false, onClick}) => {
    return (
      <div
        onClick={onClick}
        className={`flex items-center justify-center rounded-full cursor-pointer 
        ${highlighted ? 'ring-1 ring-zinc-900 p-0.5' : ''}`} >
      <div className={`w-3 h-3 rounded-full  ${color}`}></div>
    </div>
    );
} 



const generatePdf = () => {
  const book = useBookStore.getState().book;

  const doc = new jsPDF('p', 'mm', [216, 279]); // 8.5 x 11 inches (letter size)

  // Set font for text pages, using Helvetica (or you can add the "Jacques" font if you want)
  const fontSize = 20; // Tailwind `text-xl` corresponds to 20px
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize); 
  // Tailwind `m-4` is 16px margin, but for centering, we won't need the margin for the whole page
  const margin = 16;

  let currentPageNumber = 1; // Start counting from page 1 (odd-numbered)

  // Loop through the pages and add them to the PDF in order
  book?.pages.forEach((page: bookPage) => {
    if (currentPageNumber % 2 !== 0 && page.page_type === "illustration" && page.illustration) {
      // Add illustration page if it's an odd-numbered page
      if (currentPageNumber > 1) {
        doc.addPage(); // Add a new page for subsequent illustrations
      }
      doc.addImage(page.illustration, 'PNG', 0, 0, 216, 279); // Full-page illustration
    } else if (currentPageNumber % 2 === 0 && page.page_type === "text" && page.text_content) {
      // Add text page if it's an even-numbered page
      if (currentPageNumber > 1) {
        doc.addPage(); // Add a new page for text
      }

      const pageWidth = 216; // Letter width
      const pageHeight = 279; // Letter height

      // Calculate horizontal and vertical center of the page
      const xPosition = pageWidth / 2;
      const yPosition = pageHeight / 2;

      // Wrap the text to fit within the available width
      const wrappedText = doc.splitTextToSize(page.text_content, pageWidth - 2 * margin); // Wrap text

      // To center the text, we need to calculate the starting y-position
      const textHeight = wrappedText.length * 8; // Approximate height based on line height
      const yStartPosition = yPosition - (textHeight / 2); // Adjust so that text is vertically centered

      // Add the wrapped text, centered horizontally and vertically
      doc.text(wrappedText, xPosition, yStartPosition, { align: "center" });
    }

    currentPageNumber++; // Increment page number after processing each page
  });

  // Save the document as a PDF file
  doc.save(`${book?.bookTitle}.pdf`);
};



const getCircleColor = (index: number, pages: bookPage[]): string => {
  if (pages[2 * index].page_status == "in_progress" || pages[2 * index + 1].page_status  == "in_progress") {
    return "bg-amber-300";  
  } 
  if (pages[2 * index].page_status == "complete" && pages[2 * index + 1].page_status  == "complete") {
    return "bg-green-500";  
  } 

  return "bg-gray-300";    
};



const StoryBookNav = () => {
    const book        = useBookStore((state) => state.book);
    const setNavIndex = useBookStore((state) => state.setNavIndex);
    if (!book) return <p></p>;

    const NumNavPages = Math.floor(book?.pages.length / 2);


    return (
        <main className="flex flex-grow justify-between h-16 items-center mt-4">
            
            <div className="min-w-32 flex row justify-left items-center space-x-4">
                {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 6.75H20.25M3.75 12H20.25M3.75 17.25H20.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> */}
                {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 20H16M4 8V4V8ZM4 4H8H4ZM4 4L9 9L4 4ZM20 8V4V8ZM20 4H16H20ZM20 4L15 9L20 4ZM4 16V20V16ZM4 20H8H4ZM4 20L9 15L4 20ZM20 20L15 15L20 20ZM20 20V16V20Z" stroke="black" strokeLinecap="round" strokeLinejoin="round"/></svg> */}
                {/* <svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.5 13.25V10.625C16.5 9.72989 16.1444 8.87145 15.5115 8.23851C14.8786 7.60558 14.0201 7.25 13.125 7.25H11.625C11.3266 7.25 11.0405 7.13147 10.8295 6.9205C10.6185 6.70952 10.5 6.42337 10.5 6.125V4.625C10.5 3.72989 10.1444 2.87145 9.51149 2.23851C8.87855 1.60558 8.02011 1.25 7.125 1.25H5.25M5.25 14H12.75M5.25 17H9M7.5 1.25H2.625C2.004 1.25 1.5 1.754 1.5 2.375V19.625C1.5 20.246 2.004 20.75 2.625 20.75H15.375C15.996 20.75 16.5 20.246 16.5 19.625V10.25C16.5 7.86305 15.5518 5.57387 13.864 3.88604C12.1761 2.19821 9.88695 1.25 7.5 1.25Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> */}
            
            </div>
            
            
            <div className="flex items-center justify-center space-x-2 h-16">
              {Array(NumNavPages).fill(-1).map((_, index) => (
                <Circle color = {getCircleColor(index, book.pages)} key={index} highlighted={index==book.nav_index} onClick={() => {setNavIndex(index)}}/>
              ))
              }
              
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={() => generatePdf()}
                
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-[30px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0 .229 2.523a1.125 1.125 0 0 1-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0 0 21 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 0 0-1.913-.247M6.34 18H5.25A2.25 2.25 0 0 1 3 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 0 1 1.913-.247m10.5 0a48.536 48.536 0 0 0-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5Zm-3 0h.008v.008H15V10.5Z"
                  />
                </svg>
              </button>
            </div>
        </main>
    );
}

export default StoryBookNav;
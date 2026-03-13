// components/SpeechRecognitionComponent.js
import React, { useState, useEffect } from 'react';
import { useBookStore } from "../store/useBookStore";
import ImageGenerator from "./imageGenerator"
import paginate_input from '@/utils/pagination';
import EditableTextBox from './editableTextbox';
import SaveButton from './keyboardButton';

const SpeechRecognitionComponent = () => {
  // const book        = useBookStore((state) => state.book);

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState< SpeechRecognition | null>(null);
  
  const bookStructure = useBookStore((state) => state.book);
  const updatePage = useBookStore((state) => state.updatePage);
  const addPage = useBookStore((state) => state.addPage);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!bookStructure) return <p>Loading...</p>;
  // const leftPageIndex  = (2 * book?.nav_index)
  // const initial_rightPageIndex = (2 * book?.nav_index) + 1

  useEffect(() => {
    
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = 'en-US';
      
      // Event listeners for the recognition instance
      speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {

            const latestBookState = useBookStore.getState().book;
            if (!latestBookState) {return}
            const leftPageIndex = (2 * latestBookState.nav_index)
            const rightPageIndex =  (2 * latestBookState.nav_index) + 1
            const lastTextContent = latestBookState?.pages[rightPageIndex]?.text_content || "";
            const updatedTextContent = lastTextContent + ' ' + transcriptPart
            // const current_text_content = book.pages[rightPageIndex].text_content
            console.log(updatedTextContent);
            useBookStore.getState().updatePage(rightPageIndex + 1, { text_content: updatedTextContent });
            
            const appending_text = true; 

            paginate_input(
                          latestBookState.bookTitle,
                          transcriptPart,
                          rightPageIndex + 1,
                          latestBookState,
                          appending_text,
                          updatePage,
                          addPage)
    
          } else {
            interimTranscript += transcriptPart;
          }
        }
      };

      speechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        stopListening();
      };
      // Set the recognition instance to state
      setRecognition(speechRecognition);
    } else {
      console.warn('Speech Recognition API not supported in this browser.');
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (


    <div className='flex flex-col w-full h-full justify-center items-center'>
        
      <div className='flex w-full h-24 justify-center'></div>
      
      <EditableTextBox pageNumber={bookStructure?.pages[2 * bookStructure?.nav_index + 1].pageNumber} isEditing={isEditing}/>
    
      {/* <div className='flex flex-col w-full h-32 justify-center items-center'>
      {isEditing ? (
        <div>
            <button className="p-2 bg-blue-500 text-white rounded"
                    onClick={() => {setIsEditing(!isEditing);}}>
              Save Changes
          </button>
        </div>
      ) : (
        <div className='flex flex-col justify-center items-center'>
          <button
            onMouseDown={startListening} // Start listening when mouse is pressed
            onMouseUp={stopListening}    // Stop listening when mouse is released
            onTouchStart={startListening} // For mobile touch
            onTouchEnd={stopListening}   // For mobile touch
            className=""> 
            <div className="w-[60px] h-[60px] rounded-full bg-white flex justify-center items-center shadow-lg active:bg-blue-300 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
            </div>
          </button>
          <SaveButton onToggleEdit={() => setIsEditing(!isEditing)} />
        </div>
      )}


       </div> */}



         {/* Fixed buttons at bottom of screen */}
  <div className="fixed bottom-8 left-0 w-full flex justify-center gap-4 z-5">
    {isEditing ? (
      <div className='flex flex-col justify-center items-center'>
          <button
            className="p-2 bg-gray-700 text-white rounded shadow"
            onClick={() => setIsEditing(false)}
          >
            Save Changes
          </button>
        </div>
    ) : (
    <div className='flex flex-col justify-center items-center'>
      <button
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        className=""
      >
        <div className="w-[80px] h-[80px] rounded-full bg-gray-700 flex justify-center items-center shadow-lg active:bg-blue-300 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="white" className="size-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
          </svg>
        </div>
      </button>
      <SaveButton onToggleEdit={() => setIsEditing(!isEditing)} />
    </div>

    )}
    

    </div>

    </div> 
  );
};

export default SpeechRecognitionComponent;

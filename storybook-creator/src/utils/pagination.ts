import { useState } from "react";
import { bookPage, page_status } from "../store/useBookStore"; 
import generateImage from "@/utils/generateImage";
import { page_type } from "../store/useBookStore";
import { useBookStore } from "../store/useBookStore";

const escapeRegExp = (str: string): string => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const updatePromptWithCharDesc = (prompt: string): string => {
  const { characterDescriptions } = useBookStore.getState();

  if (!characterDescriptions || characterDescriptions.length === 0) return prompt;

  let updatedPrompt = prompt;

  characterDescriptions.forEach(({ keyword, description }) => {
    const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'gi');
    updatedPrompt = updatedPrompt.replace(regex, description);
  });

  return updatedPrompt;
};

async function paginate_input(
    book_title: string,
    user_input: string,
    curr_page: number,
    bookStructure: any,
    appending_text: boolean,
    updatePage: (pageNumber: number, data: any) => void,
    addPage: (page: any) => void
  ) {
   

    try {
      console.log("Sending to API:", {
        user_input,
        curr_page,
        bookStructure: JSON.stringify(bookStructure, null, 2) // Pretty-print
      });
    const res = await fetch("/api/pagination", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_input,curr_page,bookStructure,appending_text}),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "API request failed");
    }

    data.updatedPages.forEach((updatedPage: bookPage) => {
      const existingPage = bookStructure?.pages.find((p: any) => p.pageNumber === updatedPage.pageNumber);

      if (existingPage) {
        updatePage(updatedPage.pageNumber, {
          text_content: updatedPage.text_content,
          page_status: updatedPage.page_status,
        });
        // DISABLED AUTO IMAGE GEN FOR DEMO
        // const new_prompt = updatePromptWithCharDesc(updatedPage.text_content || "")
        // console.log('New prompt: ', new_prompt);
        // generateImage(new_prompt ||  "", book_title, updatedPage.pageNumber - 1);
      } else {
        const blankIllustrationPage: { pageNumber: number; page_status: page_status; illustration: string; chapter: number; page_type: page_type } = {
            pageNumber: updatedPage.pageNumber - 1,
            page_status: "in_progress",
            illustration: "",
            chapter: 1,
            page_type: "illustration",
          };
        addPage(blankIllustrationPage);
        addPage(updatedPage);
        
        // const new_prompt = updatePromptWithCharDesc(updatedPage.text_content || "")
        // console.log('New prompt: ', new_prompt);
        // generateImage(new_prompt || "", book_title, blankIllustrationPage.pageNumber);
      }
    });

    return { response: data, error: null };
  } catch (err) {
    return { response: null, error: err};
  }
}

export default paginate_input;
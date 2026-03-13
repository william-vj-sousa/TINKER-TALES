import { create } from "zustand";
import { produce } from "immer";  // Helps with immutable updates

export type book_layout = "two_column" 
export type page_status = "blank" | "in_progress" | "complete"; 
export type page_type   = "illustration" | "text"

export type book = {
  bookTitle: string;
  author: string;
  creation_date?: Date;
  layout: book_layout;
  pages: bookPage[];
  nav_index: number;
};

export type bookPage = {
  pageNumber: number;
  chapter?: number;
  text_content?: string;
  illustration?: string;
  illustration_loading?: boolean;
  illustration_prompt?: string | "";
  page_type: page_type;
  page_status: page_status;
  last_updated?: Date;
};

`
Once upon a time, there was a brave knight who set off on an adventure. 
Clad in gleaming armor and armed with a sword forged in dragon fire, 
Sir Aldric rode through misty forests and treacherous mountain paths in search of the fabled Heartstone, 
a gem said to hold the power of eternal wisdom. 
Legends whispered that the stone lay hidden in the ruins of Eldoria, a cursed kingdom where shadows danced without light. 
As he ventured deeper into the forgotten land, the air grew thick with enchantment, and an eerie silence settled around him. 
Yet, with unwavering determination, Sir Aldric pressed on, unaware that unseen eyes watched his every move from the darkness.
`

// Sample array of BookPage objects
const initialBookPages: bookPage[] = [
    {
      pageNumber: 1,
      page_status: "in_progress",
      illustration: "",
      chapter: 1,
      page_type: "illustration",
    },
    {
      pageNumber: 2,
      page_status: "blank",
      text_content: "",
      chapter: 1,
      page_type: "text",
    },
    // {
    //   pageNumber: 3,
    //   page_status: "blank",
    //   illustration: "/book1/image_2.png",
    //   chapter: 1,
    //   page_type: "illustration",
    // },
    // {
    //   pageNumber: 4,
    //   page_status: "blank",
    //   text_content: "Legends whispered that the stone lay hidden in the ruins of Eldoria, a cursed kingdom where shadows danced without light. ",
    //   chapter: 2,
    //   page_type: "text",
    // },
    // {
    //   pageNumber: 5,
    //   page_status: "blank",
    //   illustration: "/book1/image_2.png",
    //   chapter: 2,
    //   page_type: "illustration",
    // },
    // {
    //   pageNumber: 6,
    //   page_status: "blank",
    //   text_content: "As he ventured deeper into the forgotten land, the air grew thick with enchantment, and an eerie silence settled around him. Yet, with unwavering determination, Sir Aldric pressed on, unaware that unseen eyes watched his every move from the darkness.",
    //   chapter: 2,
    //   page_type: "text",
    // },
  ];
  
  
  const UserBook: book = {
    bookTitle: "Testing",
    author: "Eli",
    layout: "two_column",
    pages: initialBookPages,
    nav_index:0
  }

  export type characterDescription = {
    keyword: string,
    description: string;
  }


type BookStore = {
    book: book | null;
    characterDescriptions: characterDescription[] | null;
    saveCharacterDescription: (desc: characterDescription) => void;
    setBook: (newBook: book) => void;
    updatePage: (pageNumber: number, newPageData: Partial<bookPage>) => void;
    addPage: (newPage: bookPage) => void;
    setNavIndex: (index: number) => void;
};
  


export const useBookStore = create<BookStore>((set) => ({
    book: UserBook,
    characterDescriptions: [],

    setBook: (newBook) => set({ book: newBook }),
    saveCharacterDescription: (desc) =>
      set((state) =>
        produce(state, (draft) => {
          if (!draft.characterDescriptions) {
            draft.characterDescriptions = [desc];
            return;
          }

          const index = draft.characterDescriptions.findIndex(d => d.keyword === desc.keyword);
          if (index !== -1) {
            draft.characterDescriptions[index] = desc; // Overwrite existing
          } else {
            draft.characterDescriptions.push(desc); // Add new
          }
        })
      ),
    setNavIndex: (index: number) =>
        set((state) =>
          produce(state, (draft) => {
            if (draft.book && index >= 0 && index < draft.book.pages.length) {
              draft.book.nav_index = index;
            }
          })
    ),
    updatePage: (pageNumber, newPageData) =>
      set((state) =>
        produce(state, (draft) => {
          const pageIndex = draft.book?.pages.findIndex((p) => p.pageNumber === pageNumber);
          if (pageIndex !== undefined && pageIndex !== -1 && draft.book) {
            draft.book.pages[pageIndex] = { ...draft.book.pages[pageIndex], ...newPageData };
          }
        })
    ),

    addPage: (newPage) =>
      set((state) =>
        produce(state, (draft) => {
          draft.book?.pages.push(newPage);
        })
      ),
  })

);

"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import NavHeader  from "@/components/nav_header";
import StoryBookNav from "@/components/storybook_nav";
import StoryAssistant from "@/components/storyAssistant";
import BookViewer from "@/components/bookViewer";
import './globals.css';
// import { Book, BookPage } from "@/components/bookViewer";
// import { bookPage } from '../types/bookPage';
// import { book } from "@/types/book";



export default function Home() {
  // const [bookPages, setBookPages] = useState<bookPage[]>(initialBookPages);
  // const [currNavIndex, setNavIndex] = useState(0);

  return (
    <div className="min-h-screen min-w-screen flex flex-col bg-sky-50">
      {/* <NavHeader/> */}
      <div className="w-screen flex flex-grow">
        <div className="w-1/12 flex justify-center items-center"></div>  
        <div className="flex-column flex-grow justify-center">                   
          <StoryBookNav />
          <BookViewer />
          {/* <StoryAssistant /> */}
        </div>
        <div className="w-1/12 flex justify-center items-center"></div>
      </div>
  

    </div>
  );
}

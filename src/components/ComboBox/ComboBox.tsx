"use client";

import React, { useEffect, useState } from "react";
import { AutoCompleteSuggestion } from "./AutoCompleteSuggestion";
import { initialSearchResults } from "@/constants/searchResults";

function ComboBox() {
  const [inputText, setInputText] = useState("");
  const [searchResults, setSearchResults] = useState(initialSearchResults);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [selectedWords, setSelectedWords] = useState<SearchResult[]>([]);
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState<
    number | undefined
  >(undefined);

  const closeSuggestions = () => setIsSuggestionsOpen(false);

  useEffect(() => {
    if (inputText === "") {
      closeSuggestions();
      return;
    }

    setIsSuggestionsOpen(true);
  }, [inputText]);

  const removeKeyword = (keyword: SearchResult) => {
    setSelectedWords((prev) => {
      return prev.filter((searchItem) => searchItem.id !== keyword.id);
    });

    setSearchResults((prev) => [...prev, keyword]);
  };

  useEffect(() => {
    if (!inputText) {
      setSearchResults(initialSearchResults);
      return;
    }
    const query = inputText.toLowerCase();

    const finalResult: SearchResult[] = [];
    initialSearchResults.forEach((item) => {
      if (item.name.toLowerCase().indexOf(query) !== -1) {
        finalResult.push(item);
      }
    });
    setSearchResults(finalResult);
  }, [inputText]);

  useEffect(() => {
    if (searchResults.length === 0) setIsSuggestionsOpen(false);
  }, [searchResults]);

  return (
    <div className="relative w-full max-w-xl mx-auto p-8 bg-white shadow-2xl rounded-3xl">
      <div className="flex flex-wrap items-center border bg-white p-3 text-sm outline-none border-gray-200  rounded-xl">
        {selectedWords.map((selectedWord) => (
          <div
            key={selectedWord.id}
            className="bg-blue-600 text-white overflow-hidden rounded mr-1 mb-1"
          >
            <span className="p-1"> {selectedWord.name}</span>
            <button
              className="border-l border-l-white p-1 px-2 ml-2 hover:cursor-pointer hover:bg-blue-700"
              onClick={() => removeKeyword(selectedWord)}
            >
              <span>x</span>
              <span className="sr-only">Delete {selectedWord.name}</span>
            </button>
          </div>
        ))}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className=" flex flex-grow items-center justify-center focus:outline-none"
        />
      </div>

      {isSuggestionsOpen && searchResults.length > 0 && (
        <>
          <div className="fixed inset-0 z-40" onClick={closeSuggestions}></div>

          <AutoCompleteSuggestion
            setInputText={setInputText}
            isSuggestionsOpen={isSuggestionsOpen}
            closeSuggestions={closeSuggestions}
            selectedSuggestionIdx={selectedSuggestionIdx}
            setSelectedSuggestionIdx={setSelectedSuggestionIdx}
            setSelectedWords={setSelectedWords}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        </>
      )}
    </div>
  );
}

ComboBox.displayName = "ComboBox";

type SearchResult = {
  id: number;
  name: string;
  type: string;
  description: string;
};

export { ComboBox, type SearchResult };

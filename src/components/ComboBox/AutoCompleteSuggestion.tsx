import clsx from "clsx";
import { SearchResult } from "./ComboBox";
import { useEffect, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AutoCompleteSuggestionProps {
  setInputText: Dispatch<SetStateAction<string>>;
  isSuggestionsOpen: boolean;
  closeSuggestions: () => void;
  selectedSuggestionIdx: number | undefined;
  setSelectedSuggestionIdx: Dispatch<SetStateAction<number | undefined>>;
  setSelectedWords: Dispatch<SetStateAction<SearchResult[]>>;
  searchResults: SearchResult[];
  setSearchResults: Dispatch<SetStateAction<SearchResult[]>>;
}

function AutoCompleteSuggestion({
  setInputText,
  searchResults,
  setSearchResults,
  setSelectedWords,
  closeSuggestions,
  isSuggestionsOpen,
  selectedSuggestionIdx,
  setSelectedSuggestionIdx,
}: AutoCompleteSuggestionProps) {
  /*=================================
    KEYBOARD EVENT METHODS
   =================================*/
  function handleArrowsKeyPress(event: KeyboardEvent) {
    if (event.key === "ArrowDown") {
      setSelectedSuggestionIdx((prev) => {
        if (prev !== undefined && prev + 1 === searchResults.length) return 0;
        if (prev !== undefined) return prev + 1;
      });
    } else if (event.key === "ArrowUp") {
      setSelectedSuggestionIdx((prev) => {
        if (prev === 0) return searchResults.length - 1;
        if (prev !== undefined) return prev - 1;
      });
    }
  }

  const handleEnterKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();

      addKeyword();
    }
  };

  const addKeyword = () => {
    if (selectedSuggestionIdx === undefined) return;

    setSelectedWords((prev) => [...prev, searchResults[selectedSuggestionIdx]]);

    setSearchResults(() => {
      return searchResults.filter(
        (searchItem) =>
          searchItem.id !== searchResults[selectedSuggestionIdx].id
      );
    });

    setInputText("");
  };

  const closeSuggestionsOnEscKey = (e: KeyboardEvent) => {
    if (isSuggestionsOpen && e.key === "Escape") closeSuggestions();
  };

  /*=================================
    KEYBOARD EVENT LISTENERS
   =================================*/
  useEffect(() => {
    window.addEventListener("keydown", closeSuggestionsOnEscKey);
    window.addEventListener("keydown", handleArrowsKeyPress);
    window.addEventListener("keydown", handleEnterKeyPress);

    return () => {
      window.removeEventListener("keydown", closeSuggestionsOnEscKey);
      window.removeEventListener("keydown", handleArrowsKeyPress);
      window.removeEventListener("keydown", handleEnterKeyPress);
    };
  }, []);

  useEffect(() => {
    if (!isSuggestionsOpen) return;

    setSelectedSuggestionIdx(0);
  }, [isSuggestionsOpen]);

  return (
    <AnimatePresence>
      {isSuggestionsOpen && searchResults.length > 0 && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="absolute z-50 top-16 left-10 w-full max-w-sm p-2 mx-auto bg-white rounded-lg shadow-xl border"
        >
          {searchResults.map((suggestion, idx) => (
            <div
              key={idx}
              onMouseOver={() => setSelectedSuggestionIdx(idx)}
              onClick={addKeyword}
              className={clsx(
                "p-4 rounded-md flex justify-between items-start",
                {
                  "bg-blue-600 text-white": selectedSuggestionIdx === idx,
                }
              )}
            >
              <div>
                <h1 className="text-xl">{suggestion.name}</h1>
                <p className="text-sm">{suggestion.description}</p>
              </div>
              <p className="font-mono">{suggestion.type}</p>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { AutoCompleteSuggestion };

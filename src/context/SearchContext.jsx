// // src/context/SearchContext.jsx
// import React, { createContext, useState, useContext } from "react";

// const SearchContext = createContext();

// export const SearchProvider = ({ children }) => {
//   const [searchTerm, setSearchTerm] = useState("");

//   return (
//     <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
//       {children}
//     </SearchContext.Provider>
//   );
// };

// export const useSearch = () => useContext(SearchContext);

// src/context/SearchContext.jsx
import React, { createContext, useState, useContext, useMemo, useCallback } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Memoize setSearchTerm to prevent unnecessary re-renders
  const handleSetSearchTerm = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  // Memoize context value
  const value = useMemo(() => ({
    searchTerm,
    setSearchTerm: handleSetSearchTerm,
  }), [searchTerm, handleSetSearchTerm]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);


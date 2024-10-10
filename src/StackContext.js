import React, { createContext, useContext, useState } from 'react';

// Create the context
const StackContext = createContext();

// Provide the context
export const StackProvider = ({ children }) => {
  const [stack, setStack] = useState([]);

  // Push a new page (React component) to the stack
  const push = (Component) => {
    setStack((prevStack) => [...prevStack, Component]);
  };

  // Remove the first page from the stack (FIFO)
  const drop = () => {
    setStack((prevStack) => prevStack.slice(1));
  };

  // Clear all pages from the stack (flush)
  const flush = () => {
    setStack([]);
  };

  return (
    <StackContext.Provider value={{ stack, push, drop, flush }}>
      {children}
    </StackContext.Provider>
  );
};

// Custom hook to use the StackContext
export const useStack = () => {
  return useContext(StackContext);
};

// StackContent component to render the top component (last in the stack)
export const StackContent = () => {
  const { stack } = useStack();

  if(stack.length>0)return stack[stack.length -1];
};

import React, { createContext, useContext, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';

const StackContext = createContext();

export const StackProvider = ({ children }) => {
  const [stack, setStack] = useState([]);

  // Push a new page (React component) to the stack
  const push = (Component) => {
    setStack((prevStack) => [...prevStack, Component]);
  };

  // Remove the last page from the stack (LIFO)
  const pop = () => {
    setStack((prevStack) => prevStack.slice(0, -1));
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
    <StackContext.Provider value={{ stack, push, pop, drop, flush }}>
      {children}
    </StackContext.Provider>
  );
};

export const useStack = () => {
  return useContext(StackContext);
};

export const StackContent = () => {
  const { stack, pop } = useStack();

  if (stack.length > 0) {
    const {page, title} = stack[stack.length - 1];
    return (
      <>
        <div style={{display: "flex", marginBottom: "20px", alignItems: "center"}}>
          <FontAwesomeIcon icon={faArrowLeft} size='2xl' className='hoverable icon' onClick={pop}/>
          <h2 style={{marginLeft: "20px"}}>{title}</h2>
        </div>
        {page}
      </>
    );
  }

  return null;
};

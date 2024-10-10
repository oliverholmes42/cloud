import React, { useState } from "react";
import { StackContent, StackProvider, useStack } from "./StackContext";
import Navbar from "./nav/NavBar";
import './base.css';
import styles from './App.module.css';

function AppContent({ active, setActive }) {
  const { stack } = useStack();

  const RenderPage = () => active;

  return (
    <div className={styles.Content}>
      {stack.length > 0 ? <StackContent /> : <RenderPage />}
    </div>
  );
}

function App() {
  const [active, setActive] = useState();

  return (
    <StackProvider>
      <div className={styles.App}>
        <Navbar setActive={setActive} active={active} />
        <AppContent active={active} setActive={setActive} />
      </div>
    </StackProvider>
  );
}

export default App;

import React, { useState } from "react";
import { StackContent, StackProvider, useStack } from "./StackContext";
import Navbar from "./nav/NavBar";
import styles from './Main.module.css';

function AppContent({ active, setActive }) {
  const { stack } = useStack();

  const RenderPage = () => active;

  return (
    <div className={styles.Content}>
      {stack.length > 0 ? <StackContent /> : <RenderPage />}
    </div>
  );
}

export default function Main() {
  const [active, setActive] = useState();

  return (
    <StackProvider>
      <div className={styles.App}>
        <Navbar setActive={setActive} active={active} className={styles.Navbar}/>
        <AppContent active={active} setActive={setActive} />
      </div>
    </StackProvider>
  );
}

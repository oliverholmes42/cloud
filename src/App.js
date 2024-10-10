import React, {useState} from "react";
import { StackContent, StackProvider } from "./StackContext";
import Navbar from "./nav/NavBar";
import './base.css'
import styles from './App.module.css'

function App() {
  const [active, setActive] = useState();

  const RenderPage = () => {return active};
  return (
    <StackProvider>
      <div className={styles.App}>
        <Navbar setActive={setActive} active={active}/>
        <div className={styles.Content}>
          <StackContent/>
          <RenderPage/>
        </div>
        
      </div>
    </StackProvider>
  );
}

export default App;

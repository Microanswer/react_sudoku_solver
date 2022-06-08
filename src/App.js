import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import './App.css';

function App() {

  window.sudoWw = new Worker("/SudoSolver.js");

  return (
    <div className="App">
      <header className="App-header">
        <h1>数独计算器</h1>
        <Routes mode="hash">
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
        </Routes>
      </header><br/>
    </div>
  );
}

export default App;

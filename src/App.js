import "./App.css";
import { NavBar } from "./components/navBar/navBar";

function App() {
  return (
    <div className="App">
      <NavBar counter={0} />
    </div>
  );
}

export default App;

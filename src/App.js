import "./App.css";
import HomeSlider from "./components/homeSlider/homeSlider";

import { NavBar } from "./components/navBar/navBar";

function App() {
  return (
    <div className="App">
      <NavBar counter={0} />
      <HomeSlider />
    </div>
  );
}

export default App;

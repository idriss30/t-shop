import HomeSlider from "./components/homeSlider/homeSlider";
import MaterialCare from "./components/materials&Care/materialCareProgram";

import { NavBar } from "./components/navBar/navBar";

function App() {
  return (
    <div className="App">
      <NavBar counter={0} />
      <HomeSlider />
      <MaterialCare />
    </div>
  );
}

export default App;

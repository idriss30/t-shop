import BestSellers from "./components/collection/collection";
import HomeSlider from "./components/homeSlider/homeSlider";
import MaterialCare from "./components/materials&Care/materialCareProgram";

import { NavBar } from "./components/navBar/navBar";
import NewsLetter from "./components/newsLetter/newsLetter";

function App() {
  return (
    <div className="App">
      <NavBar counter={0} />
      <HomeSlider />
      <MaterialCare />
      <BestSellers />
      <NewsLetter />
    </div>
  );
}

export default App;

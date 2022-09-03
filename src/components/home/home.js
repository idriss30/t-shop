import Collection from "../collection/collection";
import { HomeSlider } from "../homeSlider/homeSlider";
import MaterialCare from "../materials&Care/materialCareProgram";
import NewsLetter from "../newsLetter/newsLetter";

const Home = () => {
  return (
    <>
      <HomeSlider />
      <MaterialCare />
      <Collection />
      <NewsLetter />
    </>
  );
};

export default Home;

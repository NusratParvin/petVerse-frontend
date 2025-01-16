import Hero from "@/src/components/home/about";
import Articles from "@/src/components/home/articles";
import Banner from "@/src/components/home/banner";
import FishInfo from "@/src/components/home/fishInfo";
import PremiumArticles from "@/src/components/home/premiumArticles";
import Login from "../../login/page";

export default function Home() {
  return (
    <>
      {/* <Banner />
      <div className="  md:w-10/12 w-full mx-auto my-24">
        <Hero />
        <Articles />
        <FishInfo />
        <PremiumArticles />
      </div> */}
      <Login />
    </>
  );
}

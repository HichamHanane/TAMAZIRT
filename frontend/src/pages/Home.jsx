import About from "../components/About/About";
import ContactUs from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import Services from "../components/Services/Services";

const Home = () => {
  return (
    <div className="landing-page-container">
      <Header />
      <Hero />
      <About />
      <Services />
      <HowItWorks />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;

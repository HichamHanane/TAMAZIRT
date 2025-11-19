import './GuidesPage.css'
import Header from '../../components/Header/Header';
import GuideListing from '../../components/ExploreGuides/GuideListing/GuideListing';
import Footer from '../../components/Footer/Footer';



const GuidesPage = () => {

    return (
        <>

            <Header />
            <div className="guide-listing-page">
                <GuideListing />
            </div>
            <Footer />
        </>

    );
};

export default GuidesPage;
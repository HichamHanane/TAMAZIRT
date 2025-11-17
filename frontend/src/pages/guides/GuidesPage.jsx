import './GuidesPage.css'
import Header from '../../components/Header/Header';
import GuideListing from '../../components/ExploreGuides/GuideListing/GuideListing';



const GuidesPage = () => {

    return (
        <>

            <Header />
            <div className="guide-listing-page">
                <GuideListing />
            </div>
        </>

    );
};

export default GuidesPage;
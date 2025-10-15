
import React from 'react';
import './TermsPolicyPage.css';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

const TermsPolicyPage = () => {
    return (
        <>
            <Header />

            <main className="terms-policy-main">
                <div className="terms-policy-container">

                    {/* Bannière de titre */}
                    <div className="policy-header-banner">
                        <h1 className="policy-main-title">Terms & Privacy</h1>
                        <p className="policy-subtitle">Your trust and safety are our priority</p>
                    </div>

                    {/* Contenu des termes */}
                    <div className="policy-content">

                        {/* Introduction */}
                        <section className="policy-section">
                            <h2 className="policy-section-title">Introduction</h2>
                            <p>
                                Welcome to TAMAZIRT – The Local Navigator. This document outlines the terms and conditions for using our platform and our commitment to protecting your privacy. We connect tourists with verified local guides in Morocco to ensure authentic and safe travel experiences. Your use of our services constitutes your agreement to these terms.
                            </p>
                        </section>

                        {/* User Agreement */}
                        <section className="policy-section">
                            <h2 className="policy-section-title">User Agreement</h2>
                            <p>
                                By accessing or using the TAMAZIRT platform, you agree to be bound by these Terms of Service. This agreement applies to all visitors, users, and others who access the service. You are responsible for your use of the platforms, for any content you post, and for any consequences thereof. We reserve the right to modify these terms at any time.
                            </p>
                        </section>

                        {/* Privacy Policy */}
                        <section className="policy-section">
                            <h2 className="policy-section-title">Privacy Policy</h2>
                            <p>
                                Our Privacy Policy describes how we collect, use, and share information about you. We collect information you provide directly to us, such as when you create an account, submit a form, or interact with us. We get information from your use of our service like your location and device information. We use this information to provide, maintain, and improve our services.
                            </p>
                        </section>

                        {/* Cookies */}
                        <section className="policy-section">
                            <h2 className="policy-section-title">Cookies</h2>
                            <p>
                                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                            </p>
                        </section>

                        {/* Data Protection */}
                        <section className="policy-section">
                            <h2 className="policy-section-title">Data Protection</h2>
                            <p>
                                We are committed to protecting your data. We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology.
                            </p>
                        </section>

                        {/* Contact Information */}
                        <section className="policy-section">
                            <h2 className="policy-section-title">Contact Information</h2>
                            <p>
                                If you have any questions about this Privacy Policy, please contact us. Your inquiries are important to us, and we are here to help ensure your experience with TAMAZIRT is secure and enjoyable.
                            </p>
                            <p>
                                Email: <a href="mailto:privacy@tamazirt.com">privacy@tamazirt.com</a>
                            </p>
                        </section>

                    </div>

                    {/* Bouton de retour */}
                    <div className="policy-return-cta">
                        <a href="/" className="cta-button primary return-button">
                            Back to Home
                        </a>
                    </div>

                </div>
            </main>

            <Footer />
        </>
    );
};

export default TermsPolicyPage;
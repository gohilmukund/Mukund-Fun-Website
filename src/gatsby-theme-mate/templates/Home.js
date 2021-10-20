import React from 'react';

// Layout components
import Layout from 'gatsby-theme-mate/src/components/Layout';
import Header from 'gatsby-theme-mate/src/components/Header';
import Footer from 'gatsby-theme-mate/src/components/Footer';

// Sections that will fetch data for you
import Landing from 'gatsby-theme-mate/src/sections/Landing';
import About from 'gatsby-theme-mate/src/sections/About';
import Projects from 'gatsby-theme-mate/src/sections/Projects';
import Writing from 'gatsby-theme-mate/src/sections/Writing';
import Blog from '../sections/Blog';
import WorkExperience from '../sections/WorkExperience';
import Certifications from '../sections/Certifications';

const Home = () => (
    <Layout>
        <Header />
        <Landing />        
        <About />
        <Projects />
        {/* <Writing /> */}
        {/* <Blog /> */}
        <WorkExperience />
        <Blog />
        {/* <Certifications /> */}
        <Footer />
    </Layout>
);

export default Home;
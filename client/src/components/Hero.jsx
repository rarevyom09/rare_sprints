import React from 'react';
import FeaturesSection from './Features';
const Hero = () => {
  const bannerStyle = {
    //normal theme
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    // dark theme
    // background: 'linear-gradient(90deg, #161616 0%, #353535 100%)',
  };

  return (
    <>
      <div className="mainimg text-center justify-center">
            <img className="w-full h-full" src="images/inf2.png" alt="Monitoring" />
      </div>
      <>
    <section className="container py-20 mx-auto rounded-3xl bg-black">
      <h2 className="text-9xl font-bold text-center mb-10 leading-relaxed" style={{
      background: 'linear-gradient(90deg, rgba(120,45,255,1) 0%, rgba(0,159,170,1) 50%, rgba(255,245,3,1) 100%)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
    }}>
        Your Learning, Your Pace, Your Way, Your Sprint.
      </h2>
    </section>
    <h2 className="container text-8xl font-bold text-center py-20 mx-auto mt-2 leading-none">
    <span className="text-white bg-black rounded-3xl p-2 text-8xl">Sprint(s)</span> is a platform where you can curate your own sprint, to learn the way you want, without distraction.
    </h2>
    </>
      <FeaturesSection/>
    
    </>
  );
};

export default Hero;

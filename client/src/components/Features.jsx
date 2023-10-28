import React, { useState } from 'react';
// import "./Navbar.css";
const FeaturesSection = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (index) => {
    setActiveAccordion(index === activeAccordion ? null : index);
  };

  const features = [
    {
      title: 'Personalization',
      content:
        'Sprint(s) platform can provide a highly customized experience, allowing users to create sprint(playlist)s that suit their specific learning or entertainment needs. YouTube playlists are limited to YouTube content, whereas your platform can aggregate content from various sources.',
    },
    {
      title: 'No Distraction, get Isolated',
      content:
        'Start with making your sprint, and learn/watch anytime here. But without getting distracted, because now you are free from YouTube\'s algorithm or trap, whatever you feel.',
    },
    {
      title: 'Notes and Annotations',
      content:
        'Sprint(s) note-taking feature allows users to jot down important points, ideas, and thoughts while watching a video. This goes beyond what YouTube\'s playlist feature offers, which lacks integrated note-taking capabilities.',
    },
    {
      title: 'Progress Tracking',
      content:
        'Sprint(s) platform can offer detailed progress tracking for each video, allowing users to pick up where they left off. YouTube playlists dont offer such detailed progress monitoring.',
    },
    {
      title: 'Centralized Learning Hub',
      content:
        'Sprint(s) website can serve as a centralized hub for learning and content consumption, allowing users to manage and track their learning materials in one place. This is especially valuable for educational content.',
    },
    {
      title: 'Privacy at your comfort',
      content:
        'Now you can choose to make your sprint Public/Private. Power is in your hand',
    },
    // Add other features here...
  ];

  return (
    <section className='container py-20 px-20 mx-auto rounded-3xl bg-black'>
      <h2 className='text-5xl font-extrabold text-center mb-4 text-white'>
        How Sprint(s) is different from YouTube Playlist?
      </h2>
      <div className='text-white font-mono'>
        {features.map((feature, index) => (
          <div key={index} className='mb-4'>
            <button
              className='text-2xl font-semibold flex items-center w-full text-left focus:outline-none'
              onClick={() => toggleAccordion(index)}
            >
              {index + 1}. {feature.title}
              {activeAccordion === index ? (
                <svg
                  className='ml-auto w-6 h-6'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='none'
                    d='M0 0h24v24H0z'
                  />
                  <path
                    d='M18 8l-6 6-6-6'
                    fill='currentColor'
                  />
                </svg>
              ) : (
                <svg
                  className='ml-auto w-6 h-6'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='none'
                    d='M0 0h24v24H0z'
                  />
                  <path
                    d='M16 18l-4-4-4 4'
                    fill='currentColor'
                  />
                </svg>
              )}
            </button>
            {activeAccordion === index && (
              <div className='mt-2 text-purple-400'>
                {feature.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

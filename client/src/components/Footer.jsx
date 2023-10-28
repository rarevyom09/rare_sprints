import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedium, faLinkedin, faInstagram, faGithub, faEnvelope, faWeebly, faGoogle } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <>
    <footer className="bg-white mx-20 border-2 border-black mt-10 mb-10 rounded-3xl">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0 flex items-center"> {/* Added a flex container here */}
            <a href="/" className="flex items-center">
              <img src={require("../images/inf2.png")} className="h-10" alt="FlowBite Logo" />
              <span className="self-center text-3xl font-semibold whitespace-nowrap">Sprint(s)</span>
            </a>
            <span className="self-center text-lg font-mono whitespace-nowrap mt-2 ml-2 mr-1">by </span>
            <img src={require("../images/vyom.png")} className="h-12 mr-3 mt-2" alt="Vyom Padalia Logo" />
            <span className="self-center text-lg font-semibold whitespace-nowrap mt-2">&</span>
            <img src={require("../images/rare.png")} className="h-7 mt-2 ml-3" alt="Rare Logo" />
          </div>
          <div className="flex mt-4 space-x-5 sm:justify-center sm:mt-0">
            <a href="https://www.linkedin.com/in/vyom-padalia/" className="text-gray-500 hover:text-gray-900">
              <FontAwesomeIcon icon={faLinkedin} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="https://github.com/rarevyom09" className="text-gray-500 hover:text-gray-900">
              <FontAwesomeIcon icon={faGithub} />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="mailto:vyompadalia028@gmail.com" className="text-gray-500 hover:text-gray-900">
              <FontAwesomeIcon icon={faGoogle} />
              <span className="sr-only">Email</span>
            </a>
            <a href="https://medium.com/@vyompadalia" className="text-gray-500 hover:text-gray-900">
              <FontAwesomeIcon icon={faMedium} />
              <span className="sr-only">Medium</span>
            </a>
            <a href="https://www.instagram.com/rarevyom_09/" className="text-gray-500 hover:text-gray-900">
              <FontAwesomeIcon icon={faInstagram} />
              <span className="sr-only">Instagram</span>
            </a>
          </div>
        </div>
        <div className="text-center mt-4 text-gray-500">
          &copy; 2023 Sprint(s) by Vyom Padalia & RARE. All rights reserved.
        </div>
      </div>
      {/* <img src={require("../images/multi.jpg")} className="h-max mt-2 ml-3" alt="Rare Logo" /> */}
    </footer>
    <div>
    <img src={require("../images/multi.jpg")} className="h-max w-max mt-2 mb-2" alt="Rare Logo" />
    </div>
    </>
  );
};

export default Footer;

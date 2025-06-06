import React from 'react';
import heroMain from '../assets/voting-illustration.png';
import ethLogo from '../assets/ethereum-logo.png';
import featureShield from '../assets/secure-icon.png';
import featureSupport from '../assets/support-icon.png';
import featureAccessibility from '../assets/secure-icon2.png';
import featureAnalytics from '../assets/secure-icon3.png';

const features = [
  {
    id: 1,
    icon: featureShield,
    title: "Secure Voting",
    description: "BLOCKCHAIN-POWERED",
    alt: "Blockchain security icon"
  },
  {
    id: 2,
    icon: featureSupport,
    title: "24/7 Support",
    description: "TECHNICAL 24/7",
    alt: "Support icon"
  },
  {
    id: 3,
    icon: featureAccessibility,
    title: "Accessibility",
    description: "INCLUSIVE DESIGN",
    alt: "Accessibility icon"
  },
  {
    id: 4,
    icon: featureAnalytics,
    title: "Analytics",
    description: "REAL-TIME DATA",
    alt: "Analytics icon"
  }
];

const Hero = () => (
  <section className="relative bg-[#cbe0ea]">
    {/* Floating Ethereum logo */}
    <img
      src={ethLogo}
      alt="Ethereum logo"
      className="absolute right-[42%] top-24 w-20 h-20 z-20"
      style={{ filter: 'drop-shadow(0 5px 8px rgba(0,0,0,0.10))' }}
      loading="lazy"
    />
    {/* No check icon, so this is omitted */}

    {/* Main Hero Content */}
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-8 py-16">
      {/* Left: Text and CTA */}
      <div className="md:w-1/2 flex flex-col gap-6 items-start">
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-2">
          Cast your <span className="text-blue-600">Vote</span>
        </h1>
        <p className="text-gray-800 max-w-md mb-6">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
        </p>
        <button className="bg-blue-600 text-white px-10 py-3 rounded-full font-semibold hover:bg-blue-700 transition text-lg shadow-md">
          Register
        </button>
      </div>
      {/* Right: Illustration */}
      <div className="md:w-1/2 flex items-center justify-center mt-10 md:mt-0">
        <div className="bg-white rounded-full p-2 shadow-lg flex items-center justify-center">
          <img
            src={heroMain}
            alt="Voting Illustration"
            className="w-[320px] md:w-[380px] rounded-none"
            loading="eager"
          />
        </div>
      </div>
    </div>

    {/* Feature Strip */}
    <div className="bg-white w-full py-8 flex flex-col md:flex-row items-center justify-around gap-6 shadow border-t border-blue-100">
      {features.map((feature) => (
        <div key={feature.id} className="flex flex-col items-center text-center min-w-[150px]">
          <img src={feature.icon} alt={feature.alt} className="h-10 w-10 mb-2" loading="lazy" />
          <span className="font-bold text-black">{feature.title}</span>
          <span className="text-xs text-gray-500 uppercase">{feature.description}</span>
        </div>
      ))}
    </div>
  </section>
);

export default Hero;

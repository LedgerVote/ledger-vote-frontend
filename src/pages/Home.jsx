import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TeamWork from "../assets/teamwork .png";
import Bank from "../assets/bank 1.png";
import Gov from "../assets/gov.png";

function Home() {
  return (
    <div>
      <Navbar />
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src="src/assets/Connected world-cuate 1.png"
              alt="People illustration"
              className="w-full max-w-sm"
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              What is LedgerVote
            </h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm mb-4 hover:bg-blue-700 transition">
              About Us
            </button>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a...
            </p>
            <a
              href="#"
              className="text-blue-600 font-semibold hover:underline inline-flex items-center text-sm"
            >
              Learn More <span className="ml-1">➤</span>
            </a>
          </div>
        </div>
      </section>
      <section className="font-primary">
  <h2 className="font-bold text-3xl text-center mt-20 mb-8">Who Can Use</h2>
  <div className="bg-white flex flex-col md:flex-row md:justify-between items-center gap-8 lg:px-25 px-4 sm:px-8 py-8 md:py-12">
    {/* Card 1 */}
    <div className="rounded-lg w-full max-w-xs md:w-80 bg-gray-50 drop-shadow-xl flex flex-col items-center">
      <div className="flex justify-center w-full pt-8">
        <img
          src={TeamWork}
          alt="teamwork illustration"
          className="w-24 md:w-32 max-w-xs"
        />
      </div>
      <div className="bg-white w-full mt-8">
        <h2 className="text-center font-bold text-lg md:text-xl py-4 md:py-6">
          Organizations & Businesses
        </h2>
      </div>
    </div>

    {/* Card 2 */}
    <div className="rounded-lg w-full max-w-xs md:w-80 bg-gray-50 drop-shadow-xl flex flex-col items-center">
      <div className="flex justify-center w-full pt-8">
        <img
          src={Bank}
          alt="bank illustration"
          className="w-24 md:w-32 max-w-xs"
        />
      </div>
      <div className="bg-white w-full mt-8">
        <h2 className="text-center font-bold text-lg md:text-xl py-4 md:py-6">
          Banks & Financial Institutions
        </h2>
      </div>
    </div>
    {/* Card 3 */}
    <div className="rounded-lg w-full max-w-xs md:w-80 bg-gray-50 drop-shadow-xl flex flex-col items-center">
      <div className="flex justify-center w-full pt-8">
        <img
          src={Gov}
          alt="government illustration"
          className="w-24 md:w-32 max-w-xs"
        />
      </div>
      <div className="bg-white w-full mt-8">
        <h2 className="text-center font-bold text-lg md:text-xl py-4 md:py-6">
          Government & Public Sector
        </h2>
      </div>
    </div>
  </div>
</section>


      <Footer />
    </div>
  );
}

export default Home;

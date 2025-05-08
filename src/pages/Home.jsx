import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">What is LedgerVote</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm mb-4 hover:bg-blue-700 transition">
            About Us
          </button>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a...
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
      <Footer />
    </div>
  )
}

export default Home

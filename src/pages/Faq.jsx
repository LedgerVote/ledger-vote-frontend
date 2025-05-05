import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import FAQImage from '../assets/faq-image.png'

function Faq() {
  
  return (
    <div className="font-primary flex flex-col min-h-screen">
    {/* Navbar */}
    
    <Navbar />


    {/* Main Content */}
    <div className='mx-auto w-full max-w-screen-xl'>
    <main className="flex flex-col md:flex-row flex-grow container mx-auto px-4 py-8">
      {/* FAQ Section */}
      <section className="md:w-2/3">
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        
<div id="accordion-flush" data-accordion="collapse" data-active-classes="bg-white dark:bg-white text-gray-900 dark:text-black" data-inactive-classes="text-gray-500 dark:text-gray-400">
  <h2 id="accordion-flush-heading-1">
    <button type="button" class="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#accordion-flush-body-1" aria-expanded="true" aria-controls="accordion-flush-body-1">
      <span>How does blockchain improve voting security?</span>
      <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
      </svg>
    </button>
  </h2>
  <div id="accordion-flush-body-1" class="hidden" aria-labelledby="accordion-flush-heading-1">
    <div class="py-5 border-b border-gray-200 dark:border-gray-700">
      <p class="mb-2 text-gray-500 dark:text-gray-400">Blockchain ensures that each vote is securely encrypted, tamper-proof, and recorded in a decentralized ledger, making it nearly impossible to alter or delete votes once cast.</p>
      <p class="text-gray-500 dark:text-gray-400">This transparency and immutability help prevent fraud and increase trust in the voting process.</p>
    </div>
  </div>
  <h2 id="accordion-flush-heading-2">
    <button type="button" class="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#accordion-flush-body-2" aria-expanded="false" aria-controls="accordion-flush-body-2">
      <span>Can voters verify their vote?</span>
      <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
      </svg>
    </button>
  </h2>
  <div id="accordion-flush-body-2" class="hidden" aria-labelledby="accordion-flush-heading-2">
    <div class="py-5 border-b border-gray-200 dark:border-gray-700">
      <p class="mb-2 text-gray-500 dark:text-gray-400">Yes, each voter receives a unique transaction ID after voting, allowing them to verify that their vote was recorded accurately without revealing their identity.</p>
      <p class='text-gray-500 dark:text-gray-400'>This boosts transparency and trust in the voting process.</p>
    </div>
  </div>
  <h2 id="accordion-flush-heading-3">
    <button type="button" class="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#accordion-flush-body-3" aria-expanded="false" aria-controls="accordion-flush-body-3">
      <span>Is the system accessible for remote voting?</span>
      <svg data-accordion-icon class="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
      </svg>
    </button>
  </h2>
  <div id="accordion-flush-body-3" class="hidden" aria-labelledby="accordion-flush-heading-3">
    <div class="py-5 border-b border-gray-200 dark:border-gray-700">
      <p class="mb-2 text-gray-500 dark:text-gray-400">Absolutely. Our blockchain voting system supports secure remote voting, enabling users to vote from anywhere while maintaining vote integrity and anonymity.</p>
      <p class="mb-2 text-gray-500 dark:text-gray-400">Learn more about these technologies:</p>
      <ul className="list-disc list-inside mt-2 text-gray-500 dark:text-gray-400">
          <li>Compatible with desktop and mobile devices</li>
          <li>Requires identity verification before voting</li>
          <li>Provides real-time vote confirmation</li>
        </ul>
    </div>
  </div>
</div>

      </section>

      {/* Image Section */}
      <aside className="md:w-1/3 mt-10 md:mt-0 md:pl-8">
        <img
          src={FAQImage}
          alt="FAQ illustration"
          className="rounded-lg shadow-md w-full h-auto"
        />
      </aside>
    </main>
    </div>
    <Footer />
  </div>
  )
}

export default Faq

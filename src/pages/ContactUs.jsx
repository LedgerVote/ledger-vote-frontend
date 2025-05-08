import React, { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setSubmitted(false);
  };

  // Simple validation
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Full Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";
    if (!form.message.trim()) newErrors.message = "Message is required";
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="font-primary flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-col md:flex-row justify-between px-4 md:px-10 lg:px-20 py-8 md:py-10 bg-white flex-1">
        {/* Left Side: Contact Info */}
        <div className="flex-1 mb-8 md:mb-0 md:mr-8">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Send us a message
          </h2>
          <p className="text-gray-600 mb-6 md:mb-8 max-w-md">
            Reach out for us for any inquiry. Lorem ipsum dolor sit, amet
            consectetur adipisicing elit. Architecto iste quaerat nobis dolor
            ipsa vel sit repellendus fuga optio deleniti labore amet animi quas
            in rem, quia modi nam cupiditate.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
            <div>
              <div className="font-semibold mb-1">Location</div>
              <div className="text-gray-700 text-sm">
                No 13/1
                <br />
                Suhada Road,
                <br />
                Kelaniya
              </div>
            </div>
            <div>
              <div className="font-semibold mb-1">E Mail</div>
              <div className="text-gray-700 text-sm">abcxyz@gmail.com</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Phone</div>
              <div className="text-gray-700 text-sm">
                +94 1123454689
                <br />
                +94 1123454689
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="flex-1 max-w-full md:max-w-md">
          <h3 className="text-lg md:text-xl font-semibold mb-1">Contact Us</h3>
          <p className="text-gray-600 mb-4 md:mb-6">
            Reach out for us for any inquiry
          </p>
          <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="mb-2 md:mb-3 px-4 py-3 rounded-lg bg-blue-100 focus:bg-white focus:outline-none"
            />
            {errors.name && (
              <span className="text-red-500 text-sm mb-2">{errors.name}</span>
            )}

            <input
              type="email"
              name="email"
              placeholder="E Mail"
              value={form.email}
              onChange={handleChange}
              className="mb-2 md:mb-3 px-4 py-3 rounded-lg bg-blue-100 focus:bg-white focus:outline-none"
            />
            {errors.email && (
              <span className="text-red-500 text-sm mb-2">{errors.email}</span>
            )}

            <textarea
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              className="mb-2 md:mb-3 px-4 py-3 rounded-lg bg-blue-100 focus:bg-white focus:outline-none min-h-[100px]"
            />
            {errors.message && (
              <span className="text-red-500 text-sm mb-2">
                {errors.message}
              </span>
            )}

            <button
              type="submit"
              className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition mt-2"
            >
              Submit
            </button>
            {submitted && (
              <span className="text-green-600 mt-3 block">
                Thank you for your message!
              </span>
            )}
          </form>
        </div>
      </div>
      {/* Footer should be here, outside the main content */}
      <Footer />
    </div>
  );
};

export default ContactUs;

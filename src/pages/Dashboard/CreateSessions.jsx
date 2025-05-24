import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SlideBar from "../../components/SlideBar";

function CreateSessions() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    capacity: "",
    sessionType: "workshop",
    materials: [],
  });

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Loading and success states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const validFiles = files.filter((file) => {
      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          materials: `File ${file.name} is too large. Maximum size is 10MB.`,
        }));
        return false;
      }

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          materials: `File ${file.name} is not a supported format. Please upload PDF, PPT, or DOCX files.`,
        }));
        return false;
      }

      return true;
    });

    setFormData((prev) => ({
      ...prev,
      materials: validFiles,
    }));

    if (validFiles.length > 0 && errors.materials) {
      setErrors((prev) => ({
        ...prev,
        materials: "",
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Session title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Session title must be at least 3 characters long";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    } else if (
      parseInt(formData.duration) < 15 ||
      parseInt(formData.duration) > 240
    ) {
      newErrors.duration = "Duration must be between 15 and 240 minutes";
    }

    if (!formData.capacity) {
      newErrors.capacity = "Maximum participants is required";
    } else if (
      parseInt(formData.capacity) < 1 ||
      parseInt(formData.capacity) > 100
    ) {
      newErrors.capacity = "Capacity must be between 1 and 100 participants";
    }

    if (!formData.sessionType) {
      newErrors.sessionType = "Session type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Session created:", formData);
      setIsSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          duration: "",
          capacity: "",
          sessionType: "workshop",
          materials: [],
        });
        setIsSuccess(false);
        // Optionally navigate to another page
        // navigate('/dashboard/activeSessions');
      }, 2000);
    } catch (error) {
      console.error("Error creating session:", error);
      setErrors({ submit: "Failed to create session. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      capacity: "",
      sessionType: "workshop",
      materials: [],
    });
    setErrors({});
    navigate("/dashboard");
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="font-primary">
      <SlideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-4">
          <div className="flex-1 overflow-auto p-4 rounded-sm bg-white dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
              {/* Header Section */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Create New Session
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Set up a new voting session with all the necessary details
                </p>
              </div>

              {/* Success Message */}
              {isSuccess && (
                <div className="mb-6 p-4 text-green-800 bg-green-100 border border-green-200 rounded-lg dark:bg-green-800/20 dark:text-green-400 dark:border-green-700">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Session created successfully!
                  </div>
                </div>
              )}

              {/* Form Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Session Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Session Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                        errors.title
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., Presidential Election 2024"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      placeholder="Describe the purpose and details of this voting session..."
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="date"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Date *
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={getMinDate()}
                        className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                          errors.date
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.date}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="time"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Time *
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                          errors.time
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.time && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.time}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Duration and Capacity */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="duration"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Duration (minutes) *
                      </label>
                      <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        min="15"
                        max="240"
                        className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                          errors.duration
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="60"
                      />
                      {errors.duration && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.duration}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="capacity"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Maximum Participants *
                      </label>
                      <input
                        type="number"
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        min="1"
                        max="100"
                        className={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ${
                          errors.capacity
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="100"
                      />
                      {errors.capacity && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.capacity}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Session Type */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Session Type *
                    </label>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center">
                        <input
                          id="workshop"
                          type="radio"
                          name="sessionType"
                          value="workshop"
                          checked={formData.sessionType === "workshop"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="workshop"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Election
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="lecture"
                          type="radio"
                          name="sessionType"
                          value="lecture"
                          checked={formData.sessionType === "lecture"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="lecture"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Poll
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="discussion"
                          type="radio"
                          name="sessionType"
                          value="discussion"
                          checked={formData.sessionType === "discussion"}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor="discussion"
                          className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Survey
                        </label>
                      </div>
                    </div>
                    {errors.sessionType && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.sessionType}
                      </p>
                    )}
                  </div>

                  {/* Materials Upload */}
                  <div>
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      htmlFor="materials"
                    >
                      Session Materials
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="materials"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PDF, PPT, DOCX (MAX. 10MB each)
                          </p>
                        </div>
                        <input
                          id="materials"
                          type="file"
                          className="hidden"
                          multiple
                          accept=".pdf,.ppt,.pptx,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>

                    {/* Display selected files */}
                    {formData.materials.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Selected files:
                        </p>
                        <ul className="space-y-1">
                          {formData.materials.map((file, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 dark:text-gray-400 flex items-center"
                            >
                              <svg
                                className="w-4 h-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              {file.name} (
                              {(file.size / 1024 / 1024).toFixed(2)} MB)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {errors.materials && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.materials}
                      </p>
                    )}
                  </div>

                  {/* Submit Error */}
                  {errors.submit && (
                    <div className="p-4 text-red-800 bg-red-100 border border-red-200 rounded-lg dark:bg-red-800/20 dark:text-red-400 dark:border-red-700">
                      {errors.submit}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="px-5 py-2.5 text-sm font-medium text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating...
                        </>
                      ) : (
                        "Create Session"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSessions;

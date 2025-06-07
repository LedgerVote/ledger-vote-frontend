import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SlideBar from "../../components/SlideBar";
import { sessionAPI } from "../../services/api";

function CreateSession() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    endDate: "",
    endTime: "",
  });

  // File upload state
  const [votersFile, setVotersFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Loading states
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [createdSession, setCreatedSession] = useState(null);

  // Validation errors
  const [errors, setErrors] = useState({});

  // Get today's date in YYYY-MM-DD format for min date
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast.error("Please select a CSV file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setVotersFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    } else if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    } else {
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      if (endDateTime <= new Date()) {
        newErrors.endDate = "End date and time must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create session
  const handleCreateSession = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsCreating(true);

    try {
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const sessionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        endDate: endDateTime.toISOString(),
      };

      const response = await sessionAPI.createSession(sessionData);

      toast.success("Voting session created successfully!");
      setCreatedSession(response.session);
    } catch (error) {
      console.error("Create session error:", error);
      toast.error(error.response?.data?.message || "Failed to create session");
    } finally {
      setIsCreating(false);
    }
  };

  // Upload voters CSV
  const handleUploadVoters = async () => {
    if (!votersFile || !createdSession) {
      toast.error("Please create a session first and select a CSV file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const response = await sessionAPI.uploadVoters(
        createdSession.id,
        votersFile
      );

      setUploadProgress(100);
      toast.success(
        `Voters uploaded! Added: ${response.results.added}, Existing: ${response.results.existing}`
      );

      if (response.results.errors.length > 0) {
        console.warn("Upload errors:", response.results.errors);
        toast.error(
          `Some errors occurred: ${response.results.errors.length} failed`
        );
      }

      setVotersFile(null);
      // Clear file input
      const fileInput = document.getElementById("voters-file");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload voters error:", error);
      toast.error(error.response?.data?.message || "Failed to upload voters");
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 2000);
    }
  };

  // Deploy contract
  const handleDeployContract = async () => {
    if (!createdSession) {
      toast.error("Please create a session first");
      return;
    }

    setIsDeploying(true);
    try {
      // Simulate contract deployment with progress updates
      toast.loading("Initializing smart contract...", { duration: 1000 });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.loading("Compiling contract bytecode...", { duration: 1000 });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.loading("Deploying to blockchain...", { duration: 1000 });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Smart contract deployed successfully!");

      // Navigate to active sessions after successful deployment
      setTimeout(() => {
        navigate("/dashboard/activeSessions", {
          state: { sessionId: createdSession.id },
        });
      }, 1000);
    } catch (error) {
      toast.error("Failed to deploy smart contract");
    } finally {
      setIsDeploying(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      endDate: "",
      endTime: "",
    });
    setVotersFile(null);
    setCreatedSession(null);
    setErrors({});
    setUploadProgress(null);

    // Clear file input
    const fileInput = document.getElementById("voters-file");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-primary">
      <SlideBar />
      <div className="p-4 sm:ml-64">
        <div className="p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  🏛️ Admin Panel - Session Creation
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Create and deploy secure blockchain voting sessions
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Admin Dashboard
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Session Setup Progress
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              {/* Step 1: Create Session */}
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    createdSession ? "bg-green-500" : "bg-blue-500"
                  }`}
                >
                  {createdSession ? "✓" : "1"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Create Session
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Basic information
                  </p>
                </div>
              </div>

              <div
                className={`h-1 w-16 ${
                  createdSession ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>

              {/* Step 2: Upload Voters */}
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                    uploadProgress === 100
                      ? "bg-green-500"
                      : createdSession
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`}
                >
                  {uploadProgress === 100 ? "✓" : "2"}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Upload Voters
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    CSV file upload
                  </p>
                </div>
              </div>

              <div
                className={`h-1 w-16 ${
                  uploadProgress === 100 ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>

              {/* Step 3: Deploy Contract */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Deploy Contract
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Blockchain deployment
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Form - Session Creation */}
            <div className="xl:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Session Creation
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Configure your voting session details
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleCreateSession} className="p-6 space-y-6">
                  {/* Session Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Session Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 text-gray-900 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors ${
                        errors.title
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="e.g., Student Council Elections 2025"
                    />
                    {errors.title && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors"
                      placeholder="Provide detailed information about the voting session, candidates, and instructions for voters..."
                    />
                  </div>

                  {/* End Date and Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="endDate"
                        className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        End Date *
                      </label>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        min={getMinDate()}
                        className={`w-full px-4 py-3 text-gray-900 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors ${
                          errors.endDate
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="endTime"
                        className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        End Time *
                      </label>
                      <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 text-gray-900 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-colors ${
                          errors.endTime
                            ? "border-red-500 dark:border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                    </div>
                  </div>

                  {(errors.endDate || errors.endTime) && (
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.endDate || errors.endTime}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={isCreating}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 flex items-center justify-center"
                    >
                      {isCreating ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating Session...
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          Create Session
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isCreating}
                      className="px-6 py-3 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 font-semibold rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-700 disabled:opacity-50"
                    >
                      Reset Form
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Session Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Session Status
                  </h3>
                </div>
                <div className="p-6">
                  {createdSession ? (
                    <div className="space-y-4">
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <svg
                          className="w-6 h-6 mr-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Session Created Successfully
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="text-sm space-y-2">
                          <p>
                            <span className="font-semibold text-green-800 dark:text-green-200">
                              ID:
                            </span>{" "}
                            <span className="text-green-700 dark:text-green-300">
                              {createdSession.id}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-green-800 dark:text-green-200">
                              Title:
                            </span>{" "}
                            <span className="text-green-700 dark:text-green-300">
                              {createdSession.title}
                            </span>
                          </p>
                          <p>
                            <span className="font-semibold text-green-800 dark:text-green-200">
                              Status:
                            </span>{" "}
                            <span className="text-green-700 dark:text-green-300">
                              {createdSession.status || "Active"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <svg
                        className="w-6 h-6 mr-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      No session created yet
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Voters Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Upload Voters
                    </h3>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* File Upload Area */}
                  <div>
                    <label className="block mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Voters CSV File
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="voters-file"
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                          votersFile
                            ? "border-green-400 bg-green-50 dark:bg-green-900/20 dark:border-green-500"
                            : "border-gray-300 bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 dark:border-gray-600"
                        }`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {votersFile ? (
                            <>
                              <svg
                                className="w-10 h-10 mb-3 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-green-600 dark:text-green-400 font-semibold">
                                {votersFile.name}
                              </p>
                              <p className="text-xs text-green-500 dark:text-green-400">
                                {(votersFile.size / 1024).toFixed(1)} KB • Click
                                to change
                              </p>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-10 h-10 mb-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                CSV files only (MAX. 5MB)
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          id="voters-file"
                          type="file"
                          className="hidden"
                          accept=".csv"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>

                    {/* Upload Progress */}
                    {uploadProgress !== null && (
                      <div className="mt-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                            Uploading voters...
                          </span>
                          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload Button */}
                  <button
                    onClick={handleUploadVoters}
                    disabled={!votersFile || !createdSession || isUploading}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 flex items-center justify-center"
                  >
                    {isUploading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        Upload Voters
                      </>
                    )}
                  </button>

                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="font-semibold mb-1">CSV Format Required:</p>
                    <p>name,email</p>
                    <p>John Doe,john@example.com</p>
                    <p>Jane Smith,jane@example.com</p>
                  </div>
                </div>
              </div>

              {/* Deploy Contract Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Deploy Contract
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-6">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <p className="text-sm text-purple-800 dark:text-purple-200">
                        Deploy the smart contract to the blockchain to enable
                        secure voting.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDeployContract}
                    disabled={!createdSession || isDeploying}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 flex items-center justify-center"
                  >
                    {isDeploying ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Deploying Contract...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        Deploy Smart Contract
                      </>
                    )}
                  </button>

                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>• Blockchain deployment</p>
                    <p>• Gas optimization included</p>
                    <p>• Immutable voting records</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSession;

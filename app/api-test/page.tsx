"use client";

import React, { useState } from "react";
import { getApiBaseUrl } from "@/src/core/config/public-env";
import { authService } from "@/src/projects/client-dashboard/account/auth.services";

const apiBaseUrl = getApiBaseUrl();

export default function ApiTestPage() {
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnectivity = async () => {
    setIsLoading(true);
    addResult("Testing API connectivity...");
    try {
      console.log("Testing basic API connectivity");
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@test.com", password: "test" })
      });
      addResult(`✅ API reachable - Status: ${response.status}`);
      console.log("Connectivity test result:", response.status);
    } catch (error: any) {
      console.error("Connectivity error:", error);
      addResult(`❌ API not reachable: ${error.message || error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testRegister = async () => {
    setIsLoading(true);
    addResult("Testing registration...");
    try {
      const testData = {
        email: `test${Date.now()}@example.com`,
        password: "testpassword123",
        first_name: "Test",
        last_name: "User",
        phone: "+33123456789",
        tenant_name: "Test Restaurant",
        business_type: "restaurant" as const,
        city: "Paris",
        accepted_terms: true,
        terms_version: "qalyas-terms-v1",
        terms_locale: "fr" as const
      };
      console.log("Sending registration data:", testData);
      const result = await authService.register(testData);
      addResult("✅ Registration successful");
      console.log("Registration result:", result);
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || error?.toString() || "Unknown error";
      addResult(`❌ Registration failed: ${errorMessage}`);
      if (error?.response?.status) {
        addResult(`   Status: ${error.response.status}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    addResult("Testing login...");
    try {
      console.log("Testing login with invalid credentials");
      const result = await authService.login({ email: "test@example.com", password: "wrongpassword" });
      addResult("✅ Login successful");
      console.log("Login result:", result);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || error?.toString() || "Unknown error";
      addResult(`❌ Login failed: ${errorMessage}`);
      if (error?.response?.status) {
        addResult(`   Status: ${error.response.status}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testForgotPassword = async () => {
    setIsLoading(true);
    addResult("Testing forgot password...");
    try {
      console.log("Testing forgot password");
      const result = await authService.forgotPassword("test@example.com");
      addResult("✅ Forgot password successful");
      console.log("Forgot password result:", result);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || error?.toString() || "Unknown error";
      addResult(`❌ Forgot password failed: ${errorMessage}`);
      if (error?.response?.status) {
        addResult(`   Status: ${error.response.status}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Diagnostic Tool</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={testConnectivity}
            disabled={isLoading}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Test Connectivity
          </button>
          <button
            onClick={testRegister}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            Test Register
          </button>
          <button
            onClick={testLogin}
            disabled={isLoading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Test Login
          </button>
          <button
            onClick={testForgotPassword}
            disabled={isLoading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            Test Forgot Password
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500">No tests run yet</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm font-mono">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
          <p className="text-sm text-gray-600">
            API URL: {apiBaseUrl}
          </p>
        </div>
      </div>
    </div>
  );
}
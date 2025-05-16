"use client"
import React, { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

export default function SuccessVerification() {

    useEffect(() => {
        const sidebar = document.getElementById("sidebar");
        if (sidebar) {
            sidebar.style.display = "none";
        }
    }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verification Successful</h1>
          <p className="text-gray-600 mb-6">Your email has been successfully verified. You can now log in to your account.</p>
        </div>
      </div>
    </div>
  )
} 
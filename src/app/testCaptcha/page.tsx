"use client";

import React, { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import GoogleCaptchaWrapper from "../captcha/google-captcha-wrapper";


interface PostData {
  gRecaptchaToken: string;
  email: string;
}

export default function Home() {
  return (
    <GoogleCaptchaWrapper>
      <HomeInside />
    </GoogleCaptchaWrapper>
  );
}

function HomeInside() {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState('');

  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleSubmitForm = function (e: any) {
    e.preventDefault();
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not available yet");
      setNotification(
        "Execute recaptcha not available yet likely meaning key not recaptcha key not set"
      );
      return;
    }
    executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
      submitEnquiryForm(gReCaptchaToken);
    });
  };

  const submitEnquiryForm = async (gReCaptchaToken: string) => {
    console.log('gReCaptchaToken', gReCaptchaToken)
    try {
      const response = await fetch("/api/captchaSubmit", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          gRecaptchaToken: gReCaptchaToken,
        }),
      });

      const data = await response.json();
      console.log(data)
      if (data?.success === true) {
        setNotification(`Success with score: ${data?.score}`);
      } else {
        setNotification(`Failure with score: ${data?.score}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setNotification("Error submitting form. Please try again later.");
    }
  };

  return (
    <div className="container">
      <main className="mt-5"> {/* Add a top margin for better spacing */}
        <h2>Interested in Silicon Valley Code Camp</h2>
        <form onSubmit={handleSubmitForm}>
          <div className="mb-3">
            <input
              type="text"
              name="email"
              value={email}
              onChange={(e) => setEmail(e?.target?.value)}
              className="form-control"
              placeholder="Email Address"
            />
          </div>
          
          <button type="submit" className="btn btn-light">Submit</button>
          {notification && <p className="mt-3 text-info">{notification}</p>}
        </form>
      </main>
    </div>
  );
}
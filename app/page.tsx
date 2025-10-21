"use client";

import React, { useState } from "react";
import { Toaster } from "sonner";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { Dashboard } from "./components/Dashboard";
import { UserData, TrustScore } from "./types";

type AppState = "welcome" | "onboarding" | "dashboard";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [userData, setUserData] = useState<UserData>({});
  const [trustScore, setTrustScore] = useState<TrustScore>({
    total: 0,
    breakdown: {
      email: 0,
      liveness: 0,
      address: 0,
      social: 0,
      referee: 0,
    },
  });

  const handleStart = () => {
    setAppState("onboarding");
  };

  const handleOnboardingComplete = (data: UserData, score: TrustScore) => {
    setUserData(data);
    setTrustScore(score);
    setAppState("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" expand={false} richColors closeButton />

      <Header
        onStartVerification={handleStart}
        showStartButton={appState === "welcome"}
      />

      <main className="min-h-[calc(100vh-200px)]">
        {appState === "welcome" && <WelcomeScreen onStart={handleStart} />}

        {appState === "onboarding" && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}

        {appState === "dashboard" && (
          <Dashboard userData={userData} trustScore={trustScore} />
        )}
      </main>

      <Footer />
    </div>
  );
}

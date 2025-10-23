"use client";

import React, { useState } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { OnboardingFlow } from "./components/OnboardingFlow";
import { Dashboard } from "./components/Dashboard";
import { AuthModal } from "./components/auth/AuthModal";
import { UserData, TrustScore } from "./types";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

type AppState = "welcome" | "onboarding" | "dashboard";

function AppContent() {
  const [appState, setAppState] = useState<AppState>("welcome");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [trustScore, setTrustScore] = useState<TrustScore>({
    total: 0,
    breakdown: {
      email: 0,
      address: 0,
      social: 0,
      referee: 0,
    },
  });

  const { isAuthenticated, user } = useAuth();

  const handleStart = () => {
    if (isAuthenticated) {
      setAppState("onboarding");
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setAppState("onboarding");
  };

  const handleOnboardingComplete = (data: UserData, score: TrustScore) => {
    setUserData(data);
    setTrustScore(score);
    setAppState("dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onStartVerification={handleStart}
        showStartButton={appState === "welcome"}
        user={user}
        isAuthenticated={isAuthenticated}
      />

      <main className="min-h-[calc(100vh-200px)]">
        {appState === "welcome" && <WelcomeScreen onStart={handleStart} />}

        {appState === "onboarding" && (
          <OnboardingFlow
            onComplete={handleOnboardingComplete}
            userEmail={user?.email}
          />
        )}

        {appState === "dashboard" && (
          <Dashboard userData={userData} trustScore={trustScore} />
        )}
      </main>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode="login"
      />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

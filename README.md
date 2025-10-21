# Digital KYC Platform

## Team Members

- Kalejaiye Oluwadara Oladele
- Famosinpe Oluwadabira
- Giwa Kausarat
- [Name 4]
- [Name 5]

---

## 🚀 Live Demo

- **Live Application:** https://digital-kyc-platform.vercel.app/
- **Backend API:** [Link to your live backend API endpoint URL, if separate]
- **Recorded Demo:** [Link to your recorded demo explaining how your solution works using Loom].

---

## 🎯 The Problem

> How might we streamline the KYC (Know Your Customer) process for fintech applications while ensuring security and building user trust, and enable identity verification portability across multiple platforms?

## ✨ Our Solution

Our Digital KYC Platform revolutionizes the identity verification process for fintech applications. The platform guides users through a comprehensive multi-step verification process that includes:

1. **Email Verification** - Validates user email addresses
2. **Liveness Detection** - Uses AI-powered face mesh technology to verify that the user is a real person through head movement tracking
3. **Address Verification** - Confirms user location and address details
4. **Social Profile Verification** - Links and verifies social media accounts (Google, LinkedIn, Twitter)
5. **Referee Verification** - Allows users to add references who can vouch for their identity

As users complete each verification step, they build a **Digital Trust Score** that reflects their credibility. This Trust Score is stored in a portable **Digital Trust Wallet** that can be shared across multiple fintech platforms, eliminating the need for repeated KYC processes. Users complete verification once and can use their verified identity anywhere, saving time and improving the user experience across the fintech ecosystem.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS 4
- **Animations:** Framer Motion for smooth UI transitions
- **Icons:** Lucide React, React Icons
- **AI/ML:** MediaPipe Face Mesh for liveness detection and head movement verification
- **Utilities:** Moment.js for date handling, Sonner for toast notifications
- **Deployment:** Vercel

---

## ⚙️ How to Set Up and Run Locally

1.  Clone the repository:
    ```bash
    git clone [your-repo-link]
    ```
2.  Navigate to the project directory:
    ```bash
    cd hackaton
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Run the development server:
    ```bash
    npm run dev
    ```
5.  Open your browser and navigate to `http://localhost:3000`

6.  **To use the liveness detection feature**, ensure you allow camera permissions when prompted by your browser.

**Note:** This project requires a modern browser with webcam access for the face verification features to work properly.

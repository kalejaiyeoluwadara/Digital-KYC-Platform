# TrustBank - Digital KYC Platform

A modern, digital-first KYC (Know Your Customer) verification system for digital banking. This frontend application reimagines customer onboarding and identity verification without relying on traditional systems.

## 🚀 Features

### Digital Trust Score System
- **Real-time Score Updates**: Watch your trust score grow as you complete verification steps
- **Transparent Breakdown**: Clear visibility into how each verification contributes to your score
- **Score Levels**: 
  - 80-100: Trusted
  - 50-79: Medium Risk
  - 0-49: Unverified

### Verification Steps

1. **Email Verification** (+10 points)
   - Email validation and verification code system
   - Instant verification process

2. **Phone & SIM Verification** (+15 points)
   - Phone number verification via SMS
   - SIM age validation (6+ months for bonus points)
   - Network consistency check

3. **Address Verification** (+15 points)
   - GPS-based location tagging
   - Address validation
   - Optional utility bill upload
   - Google Maps integration

4. **Social Profile Verification** (up to +40 points)
   - Google account linking (+10 points)
   - LinkedIn professional profile (+20 points)
   - Twitter account verification (+10 points)
   - OAuth-based secure connections

5. **Referee Authentication** (up to +40 points)
   - Add up to 2 referees
   - Unique verification codes
   - +20 points per verified referee

### Digital Trust Wallet
- Portable verified credentials
- Reusable across partner fintech platforms
- Instant onboarding for partner apps

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Notifications**: Sonner
- **Date Handling**: Moment.js

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd hackaton
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design Philosophy

### Clean & Modern
- Sleek banking UI inspired by modern fintech
- No gradients - clean, professional aesthetic
- Clear information hierarchy
- Excellent readability

### Component-Based Architecture
- Highly reusable components
- Separation of concerns
- Easy to maintain and extend
- Type-safe with TypeScript

### User Experience
- Step-by-step guided process
- Real-time feedback via toast notifications
- Progress indicators
- Modal dialogs for important information
- Smooth animations and transitions

## 📁 Project Structure

\`\`\`
app/
├── components/
│   ├── ui/                    # Core UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Progress.tsx
│   │   └── TrustScore.tsx
│   ├── verification/          # Verification step components
│   │   ├── EmailVerification.tsx
│   │   ├── PhoneVerification.tsx
│   │   ├── AddressVerification.tsx
│   │   ├── SocialVerification.tsx
│   │   └── RefereeVerification.tsx
│   ├── layout/               # Layout components
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── WelcomeScreen.tsx
│   ├── OnboardingFlow.tsx
│   └── Dashboard.tsx
├── lib/
│   └── utils.ts              # Utility functions
├── types/
│   └── index.ts              # TypeScript type definitions
├── globals.css
├── layout.tsx
└── page.tsx
\`\`\`

## 🎯 Key Components

### Core UI Components
- **Button**: Versatile button with multiple variants and loading states
- **Card**: Container component with hover effects
- **Input**: Form input with label, error states, and icons
- **Modal**: Animated modal dialog with backdrop
- **Progress**: Linear and step progress indicators
- **TrustScore**: Circular progress with score breakdown

### Verification Components
Each verification component is self-contained with:
- Clear instructions
- Step-by-step guidance
- Real-time validation
- Success feedback
- Error handling

## 🔒 Security Features

- Simulated secure OAuth connections
- GPS verification for address
- Multi-factor verification approach
- Transparent data usage
- Privacy-first design

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimized
- Smooth animations on all devices
- Touch-friendly UI elements

## 🌟 Future Enhancements

- Backend API integration
- Real OAuth providers
- Actual geolocation API
- Truecaller API integration
- SMS verification gateway
- Document OCR scanning
- Biometric verification
- Credit score integration
- Transaction history analysis

## 📄 License

This project was created for a hackathon challenge.

## 👥 Contributing

This is a frontend prototype. Contributions and suggestions are welcome!

## 🎉 Hackathon Challenge

This project addresses the challenge of reimagining customer onboarding and identity verification for digital banks without relying on slow, traditional systems like NIBSS. It provides a fast, digital-first KYC solution that verifies customer identity, address, and referee credibility using alternative data sources.

# Face Tracking Implementation for Liveness Verification

## Overview

Replaced the simulated head movement detection with real face tracking using MediaPipe FaceMesh - the same technology used by fintech apps for liveness verification.

## Technologies Used

- **@mediapipe/face_mesh** (v0.4.1633559619): MediaPipe FaceMesh for detecting 468 facial landmarks
- **@mediapipe/camera_utils** (v0.3.1675466862): Camera utilities for video stream processing

## How It Works

### 1. Model Loading

- Loads MediaPipe FaceMesh model from CDN on camera start
- Uses refined landmarks for more accurate tracking
- Shows loading state in UI

### 2. Baseline Capture

- Captures user's neutral face position before each challenge
- Records center position (x, y) and head rotation

### 3. Real-time Detection

- Analyzes video frames every 200ms
- Detects 468 facial landmarks including eyes, nose, mouth
- Calculates head position and rotation from landmark positions

### 4. Movement Verification

- **Left/Right**: Detects horizontal movement (40px threshold) and rotation (0.8 units)
- **Up/Down**: Detects vertical movement (30px threshold)
- Only completes challenge when actual movement is detected

## Key Features

- ✅ Real face detection (not simulated)
- ✅ Precise landmark tracking
- ✅ Anti-spoofing through movement verification
- ✅ Video mirroring handled correctly
- ✅ Baseline recalibration between challenges
- ✅ Professional fintech-grade implementation

## Detection Thresholds

```javascript
HORIZONTAL_THRESHOLD = 0.08; // Left/Right movement (normalized 0-1)
VERTICAL_THRESHOLD = 0.05; // Up/Down movement (normalized 0-1)
ROTATION_THRESHOLD = 0.8; // Head rotation
```

These thresholds can be adjusted for sensitivity. MediaPipe uses normalized coordinates (0-1 range) instead of pixels.

## Files Modified

1. `app/components/verification/HeadMovementVerification.tsx` - Main implementation
2. `package.json` - MediaPipe dependencies

## Usage

The component now uses actual face tracking:

1. Loads ML model
2. Starts camera
3. Captures baseline position
4. Monitors for real head movements
5. Validates movements against thresholds
6. Completes challenges only when genuine movement detected

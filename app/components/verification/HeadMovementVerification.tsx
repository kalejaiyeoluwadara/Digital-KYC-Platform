"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, AlertCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import * as tf from "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

interface HeadMovementVerificationProps {
  onComplete: () => void;
}

type Direction = "left" | "right" | "up" | "down";

interface Challenge {
  direction: Direction;
  completed: boolean;
}

interface FacePosition {
  x: number;
  y: number;
  rotation: number;
}

export const HeadMovementVerification: React.FC<
  HeadMovementVerificationProps
> = ({ onComplete }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState<Direction | null>(
    null
  );
  const [challenges, setChallenges] = useState<Challenge[]>([
    { direction: "left", completed: false },
    { direction: "right", completed: false },
    { direction: "up", completed: false },
  ]);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const detectorRef =
    useRef<faceLandmarksDetection.FaceLandmarksDetector | null>(null);
  const baselinePositionRef = useRef<FacePosition | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [stream]);

  // Load face detection model
  const loadModel = async () => {
    try {
      setModelLoading(true);
      await tf.ready();

      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
      const detectorConfig: faceLandmarksDetection.MediaPipeFaceMeshMediaPipeModelConfig =
        {
          runtime: "mediapipe",
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
          refineLandmarks: true,
        };

      const detector = await faceLandmarksDetection.createDetector(
        model,
        detectorConfig
      );

      detectorRef.current = detector;
      setModelLoading(false);
      toast.success("Face detection model loaded");
    } catch (error) {
      console.error("Error loading model:", error);
      toast.error("Failed to load face detection model");
      setModelLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      // Load model first if not already loaded
      if (!detectorRef.current) {
        await loadModel();
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = resolve;
        });
      }
      setCameraActive(true);
      toast.success("Camera activated successfully");

      // Capture baseline position after camera is ready
      setTimeout(async () => {
        await captureBaselinePosition();
        startVerificationSequence();
      }, 2000);
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please allow camera permissions.");
    }
  };

  // Get face position from landmarks
  const getFacePosition = async (): Promise<FacePosition | null> => {
    if (!videoRef.current || !detectorRef.current) return null;

    try {
      const faces = await detectorRef.current.estimateFaces(videoRef.current);

      if (faces.length === 0) return null;

      const face = faces[0];
      const keypoints = face.keypoints;

      // Get nose tip (index 1) and face center
      const noseTip = keypoints[1];
      const leftEye = keypoints[33];
      const rightEye = keypoints[263];
      const leftMouth = keypoints[61];
      const rightMouth = keypoints[291];

      // Calculate face center
      const centerX = (leftEye.x + rightEye.x) / 2;
      const centerY = (leftEye.y + rightEye.y) / 2;

      // Calculate head rotation (yaw) based on nose position relative to eye center
      const rotation = (noseTip.x - centerX) / 100;

      return {
        x: centerX,
        y: centerY,
        rotation,
      };
    } catch (error) {
      console.error("Error detecting face:", error);
      return null;
    }
  };

  // Capture initial baseline position
  const captureBaselinePosition = async () => {
    const position = await getFacePosition();
    if (position) {
      baselinePositionRef.current = position;
      console.log("Baseline position captured:", position);
    }
  };

  const startVerificationSequence = () => {
    const remainingChallenges = challenges.filter((c) => !c.completed);
    if (remainingChallenges.length > 0) {
      setCurrentChallenge(remainingChallenges[0].direction);
      setIsProcessing(true);
      startHeadMovementDetection();
    }
  };

  const getDirectionInstruction = (direction: Direction | null): string => {
    switch (direction) {
      case "left":
        return "Turn your head to the LEFT";
      case "right":
        return "Turn your head to the RIGHT";
      case "up":
        return "Tilt your head UP";
      case "down":
        return "Tilt your head DOWN";
      default:
        return "Get ready...";
    }
  };

  const getDirectionIcon = (direction: Direction): string => {
    switch (direction) {
      case "left":
        return "←";
      case "right":
        return "→";
      case "up":
        return "↑";
      case "down":
        return "↓";
    }
  };

  // Real head movement detection
  const startHeadMovementDetection = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = setInterval(async () => {
      if (!currentChallenge || !baselinePositionRef.current) return;

      const currentPosition = await getFacePosition();
      if (!currentPosition) {
        console.log("No face detected");
        return;
      }

      const baseline = baselinePositionRef.current;

      // Calculate differences from baseline
      const deltaX = currentPosition.x - baseline.x;
      const deltaY = currentPosition.y - baseline.y;
      const deltaRotation = currentPosition.rotation - baseline.rotation;

      // Thresholds for movement detection
      const HORIZONTAL_THRESHOLD = 40; // pixels
      const VERTICAL_THRESHOLD = 30; // pixels
      const ROTATION_THRESHOLD = 0.8; // rotation units

      let detected = false;

      switch (currentChallenge) {
        case "left":
          // Looking left means face moves right in video (mirrored)
          detected =
            deltaX > HORIZONTAL_THRESHOLD || deltaRotation > ROTATION_THRESHOLD;
          break;
        case "right":
          // Looking right means face moves left in video (mirrored)
          detected =
            deltaX < -HORIZONTAL_THRESHOLD ||
            deltaRotation < -ROTATION_THRESHOLD;
          break;
        case "up":
          // Looking up means face moves down in video
          detected = deltaY > VERTICAL_THRESHOLD;
          break;
        case "down":
          // Looking down means face moves up in video
          detected = deltaY < -VERTICAL_THRESHOLD;
          break;
      }

      if (detected) {
        console.log(`Movement detected: ${currentChallenge}`, {
          deltaX,
          deltaY,
          deltaRotation,
        });
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }
        completeChallenge(currentChallenge);
      }
    }, 200); // Check every 200ms
  };

  const completeChallenge = async (direction: Direction) => {
    const updatedChallenges = challenges.map((c) =>
      c.direction === direction ? { ...c, completed: true } : c
    );
    setChallenges(updatedChallenges);
    setIsProcessing(false);
    toast.success(`${direction.toUpperCase()} movement detected!`);

    const remainingChallenges = updatedChallenges.filter((c) => !c.completed);
    if (remainingChallenges.length > 0) {
      // Re-capture baseline before next challenge
      setTimeout(async () => {
        await captureBaselinePosition();
        setCurrentChallenge(remainingChallenges[0].direction);
        setIsProcessing(true);
        startHeadMovementDetection();
      }, 1500);
    } else {
      // All challenges completed
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      setTimeout(() => {
        setVerificationComplete(true);
        setCurrentChallenge(null);
        toast.success("Liveness verification complete!");
      }, 1000);
    }
  };

  const handleComplete = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    onComplete();
  };

  return (
    <Card>
      <div className="p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Camera className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Liveness Verification
          </h2>
          <p className="text-gray-600">
            We'll verify you're a real person by detecting simple head
            movements. This ensures the security of your account.
          </p>
        </div>

        {!cameraActive && !verificationComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Before you start:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Ensure you're in a well-lit area</li>
                    <li>Position your face in the center of the frame</li>
                    <li>Follow the on-screen instructions</li>
                    <li>Complete all head movement challenges</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={startCamera}
              className="w-full"
              size="lg"
              disabled={modelLoading}
            >
              {modelLoading ? "Loading AI Model..." : "Start Liveness Check"}
            </Button>
          </motion.div>
        )}

        {cameraActive && !verificationComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Video Feed */}
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />

                {/* Overlay with current instruction */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Face guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-80 border-4 border-white border-dashed rounded-full opacity-30" />
                  </div>

                  {/* Instruction overlay */}
                  <AnimatePresence mode="wait">
                    {currentChallenge && (
                      <motion.div
                        key={currentChallenge}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="bg-black bg-opacity-75 text-white px-8 py-6 rounded-2xl text-center">
                          <div className="text-6xl mb-3">
                            {getDirectionIcon(currentChallenge)}
                          </div>
                          <p className="text-2xl font-bold">
                            {getDirectionInstruction(currentChallenge)}
                          </p>
                          {isProcessing && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-3"
                            >
                              <div className="inline-block w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>

            {/* Challenge Progress */}
            <div className="grid grid-cols-3 gap-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.direction}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    challenge.completed
                      ? "border-green-500 bg-green-50"
                      : currentChallenge === challenge.direction
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getDirectionIcon(challenge.direction)}
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {challenge.direction}
                      </span>
                    </div>
                    {challenge.completed && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {verificationComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4"
              >
                <Check className="w-10 h-10 text-green-600" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Successful!
              </h3>
              <p className="text-gray-600">
                Your liveness has been confirmed. You've earned 20 trust points.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.direction}
                  className="p-4 rounded-lg border-2 border-green-500 bg-green-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getDirectionIcon(challenge.direction)}
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {challenge.direction}
                      </span>
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleComplete} className="w-full" size="lg">
              Continue to Next Step
            </Button>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

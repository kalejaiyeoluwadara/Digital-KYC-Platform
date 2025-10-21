"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Check, AlertCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { toast } from "sonner";
import { FaceMesh, Results } from "@mediapipe/face_mesh";
import { Camera as CameraUtils } from "@mediapipe/camera_utils";

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
  const [cameraLoading, setCameraLoading] = useState(false);
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
  const faceMeshRef = useRef<FaceMesh | null>(null);
  const baselinePositionRef = useRef<FacePosition | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const latestResultsRef = useRef<Results | null>(null);

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
      console.log("Starting to load FaceMesh model...");

      const faceMesh = new FaceMesh({
        locateFile: (file) => {
          const url = `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4/${file}`;
          console.log("Loading file:", url);
          return url;
        },
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      faceMesh.onResults((results: Results) => {
        latestResultsRef.current = results;
      });

      faceMeshRef.current = faceMesh;
      setModelLoading(false);
      console.log("FaceMesh model initialized");
      toast.success("Face detection ready");
    } catch (error) {
      console.error("Error loading model:", error);
      toast.error(
        "Face detection initialization failed. Continuing without AI validation."
      );
      setModelLoading(false);
      // Create a mock object to allow camera to work
      faceMeshRef.current = {} as FaceMesh;
    }
  };

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      setCameraLoading(true);

      // Get camera stream first
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      console.log("Media stream obtained");
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // Set camera active immediately - don't wait for metadata
        setCameraLoading(false);
        setCameraActive(true);
        console.log("Camera activated");
        toast.success("Camera ready!");

        // Play video in background
        videoRef.current.onloadedmetadata = async () => {
          if (videoRef.current) {
            try {
              await videoRef.current.play();
              console.log("Video playing");
            } catch (playError) {
              console.error("Error playing video:", playError);
            }
          }
        };

        // Load model after camera is working (non-blocking)
        if (
          !faceMeshRef.current ||
          Object.keys(faceMeshRef.current).length === 0
        ) {
          loadModel().catch((err) =>
            console.error("Model loading failed:", err)
          );
        }

        // Start sending video frames to FaceMesh if available
        setTimeout(() => {
          if (
            faceMeshRef.current &&
            faceMeshRef.current.send &&
            videoRef.current
          ) {
            const sendFrame = async () => {
              if (
                videoRef.current &&
                faceMeshRef.current &&
                faceMeshRef.current.send
              ) {
                try {
                  await faceMeshRef.current.send({ image: videoRef.current });
                } catch (err) {
                  console.error("Error sending frame to FaceMesh:", err);
                }
                animationFrameRef.current = requestAnimationFrame(sendFrame);
              }
            };
            sendFrame();
          }
        }, 500);

        // Capture baseline position after camera is ready
        setTimeout(async () => {
          await captureBaselinePosition();
          startVerificationSequence();
        }, 2000);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please allow camera permissions.");
      setCameraLoading(false);
      setCameraActive(false);
    }
  };

  // Get face position from landmarks
  const getFacePosition = async (): Promise<FacePosition | null> => {
    if (!latestResultsRef.current) return null;

    try {
      const results = latestResultsRef.current;

      if (
        !results.multiFaceLandmarks ||
        results.multiFaceLandmarks.length === 0
      ) {
        return null;
      }

      const landmarks = results.multiFaceLandmarks[0];

      // MediaPipe Face Mesh landmark indices
      // 1: Nose tip
      // 33: Left eye inner corner
      // 263: Right eye inner corner
      const noseTip = landmarks[1];
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];

      // Calculate face center
      const centerX = (leftEye.x + rightEye.x) / 2;
      const centerY = (leftEye.y + rightEye.y) / 2;

      // Calculate head rotation (yaw) based on nose position relative to eye center
      const rotation = (noseTip.x - centerX) / 0.1;

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

      // Thresholds for movement detection (normalized coordinates 0-1)
      const HORIZONTAL_THRESHOLD = 0.08; // normalized
      const VERTICAL_THRESHOLD = 0.05; // normalized
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

  console.log("Render state:", {
    cameraActive,
    cameraLoading,
    verificationComplete,
    modelLoading,
  });

  return (
    <Card>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full mb-3 sm:mb-4">
            <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Liveness Verification
          </h2>
          <p className="text-sm sm:text-base text-gray-600 px-2">
            We'll verify you're a real person by detecting simple head
            movements. This ensures the security of your account.
          </p>
        </div>

        {cameraLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <div className="inline-block w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600">Initializing camera...</p>
          </motion.div>
        )}

        {!cameraActive && !verificationComplete && !cameraLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs sm:text-sm text-blue-800">
                  <p className="font-medium mb-1">Before you start:</p>
                  <ul className="list-disc list-inside space-y-1 ml-1 sm:ml-2">
                    <li>Ensure you're in a well-lit area</li>
                    <li>Position your face in the center of the frame</li>
                    <li>Follow the on-screen instructions</li>
                    <li>Complete all head movement challenges</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              onClick={() => {
                console.log("Button clicked, starting camera...");
                startCamera();
              }}
              className="w-full"
              size="lg"
              disabled={modelLoading || cameraLoading}
            >
              {cameraLoading ? "Starting Camera..." : "Start Liveness Check"}
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
            <div className="relative w-full">
              <div className="relative rounded-xl overflow-hidden bg-gray-900 w-full aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                  style={{ transform: "scaleX(-1)" }}
                />

                {/* Overlay with current instruction */}
                <div className="absolute inset-0 pointer-events-none z-10">
                  {/* Face guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-80 sm:w-64 sm:h-80 border-2 sm:border-4 border-white border-dashed rounded-full opacity-30" />
                  </div>

                  {/* Instruction overlay */}
                  <AnimatePresence mode="wait">
                    {currentChallenge && (
                      <motion.div
                        key={currentChallenge}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 sm:inset-0 sm:translate-x-0 sm:flex sm:items-center sm:justify-center w-full px-4"
                      >
                        <div className="bg-black bg-opacity-75 text-white px-4 py-3 sm:px-8 sm:py-6 rounded-2xl text-center max-w-sm sm:max-w-none">
                          <div className="text-3xl sm:text-6xl mb-1 sm:mb-3">
                            {getDirectionIcon(currentChallenge)}
                          </div>
                          <p className="text-sm sm:text-2xl font-bold">
                            {getDirectionInstruction(currentChallenge)}
                          </p>
                          {isProcessing && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="mt-2 sm:mt-3"
                            >
                              <div className="inline-block w-4 h-4 sm:w-6 sm:h-6 border-2 sm:border-4 border-white border-t-transparent rounded-full animate-spin" />
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
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.direction}
                  className={`p-2 sm:p-4 rounded-lg border-2 transition-all ${
                    challenge.completed
                      ? "border-green-500 bg-green-50"
                      : currentChallenge === challenge.direction
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xl sm:text-2xl">
                        {getDirectionIcon(challenge.direction)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium capitalize">
                        {challenge.direction}
                      </span>
                    </div>
                    {challenge.completed && (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
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
            className="space-y-4 sm:space-y-6"
          >
            <div className="text-center py-4 sm:py-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-3 sm:mb-4"
              >
                <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </motion.div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Verification Successful!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 px-2">
                Your liveness has been confirmed. You've earned 20 trust points.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.direction}
                  className="p-2 sm:p-4 rounded-lg border-2 border-green-500 bg-green-50"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xl sm:text-2xl">
                        {getDirectionIcon(challenge.direction)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium capitalize">
                        {challenge.direction}
                      </span>
                    </div>
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
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

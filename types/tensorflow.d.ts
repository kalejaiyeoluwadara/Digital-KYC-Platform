declare module '@tensorflow/tfjs' {
  export function ready(): Promise<void>;
  export * from '@tensorflow/tfjs-core';
  export * from '@tensorflow/tfjs-converter';
  export * from '@tensorflow/tfjs-layers';
}

declare module '@tensorflow-models/face-landmarks-detection' {
  export interface Keypoint {
    x: number;
    y: number;
    z?: number;
    name?: string;
  }

  export interface Face {
    keypoints: Keypoint[];
    box?: {
      xMin: number;
      yMin: number;
      xMax: number;
      yMax: number;
      width: number;
      height: number;
    };
  }

  export interface FaceLandmarksDetector {
    estimateFaces(
      input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
      config?: { flipHorizontal?: boolean }
    ): Promise<Face[]>;
    dispose(): void;
  }

  export enum SupportedModels {
    MediaPipeFaceMesh = 'MediaPipeFaceMesh',
  }

  export interface MediaPipeFaceMeshMediaPipeModelConfig {
    runtime: 'mediapipe' | 'tfjs';
    solutionPath?: string;
    refineLandmarks?: boolean;
    maxFaces?: number;
  }

  export interface MediaPipeFaceMeshTfjsModelConfig {
    runtime: 'tfjs';
    refineLandmarks?: boolean;
    maxFaces?: number;
    detectorModelUrl?: string;
    landmarkModelUrl?: string;
  }

  export type MediaPipeFaceMeshModelConfig =
    | MediaPipeFaceMeshMediaPipeModelConfig
    | MediaPipeFaceMeshTfjsModelConfig;

  export function createDetector(
    model: SupportedModels,
    config?: MediaPipeFaceMeshModelConfig
  ): Promise<FaceLandmarksDetector>;
}


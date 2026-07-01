import { create } from 'zustand';

type CaptureStatus = 'idle' | 'detecting' | 'capturing' | 'complete' | 'error';

interface CaptureState {
  status: CaptureStatus;
  detectedPlatform: string | null;
  messageCount: number;
  progress: number;
  errorMessage: string | null;

  // Actions
  setStatus: (status: CaptureStatus) => void;
  setDetectedPlatform: (platform: string | null) => void;
  setMessageCount: (count: number) => void;
  setProgress: (progress: number) => void;
  setError: (message: string | null) => void;
  reset: () => void;
}

export const useCaptureStore = create<CaptureState>((set) => ({
  status: 'idle',
  detectedPlatform: null,
  messageCount: 0,
  progress: 0,
  errorMessage: null,

  setStatus: (status) => set({ status }),
  setDetectedPlatform: (detectedPlatform) => set({ detectedPlatform }),
  setMessageCount: (messageCount) => set({ messageCount }),
  setProgress: (progress) => set({ progress }),
  setError: (errorMessage) => set({ errorMessage, status: 'error' }),
  reset: () => set({
    status: 'idle',
    detectedPlatform: null,
    messageCount: 0,
    progress: 0,
    errorMessage: null,
  }),
}));

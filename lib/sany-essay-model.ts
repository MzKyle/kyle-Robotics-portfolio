export const cameraFpsChoices = [120, 160, 200] as const;
export type CameraFps = (typeof cameraFpsChoices)[number];

export const robotIntervalMs = 1000 / 60;
export const cameraIntervalMs = (fps: CameraFps) => 1000 / fps;
export const idealQuantizationBoundMs = (fps: CameraFps) => cameraIntervalMs(fps) / 2;

export function sampleTimes(fps: number, durationMs: number) {
  const interval = 1000 / fps;
  return Array.from({ length: Math.floor(durationMs / interval) + 1 }, (_, index) => index * interval);
}

export function nearestCameraFrame(eventMs: number, fps: CameraFps) {
  const index = Math.max(0, Math.round(eventMs / cameraIntervalMs(fps)));
  const timeMs = index * cameraIntervalMs(fps);
  return { index, timeMs, errorMs: Math.abs(eventMs - timeMs) };
}

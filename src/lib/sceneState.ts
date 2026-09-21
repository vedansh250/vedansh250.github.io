// Shared, mutable state read by the WebGL loop every frame.
// Written by GSAP / pointer handlers – never causes React re-renders.
export const sceneState = {
  reveal: 0, // 0 → 1 intro
  progress: 0, // 0 → 1 hero scroll progress
  px: 0, // pointer x  (-1 … 1)
  py: 0, // pointer y  (-1 … 1)
}

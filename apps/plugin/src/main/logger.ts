const isDebugEnabled = import.meta.env.VITE_DEBUG_LUMINA === "true";

export function debugLog(message: string, metadata?: Record<string, unknown>) {
  if (!isDebugEnabled) {
    return;
  }

  if (metadata) {
    console.log(message, metadata);
    return;
  }

  console.log(message);
}

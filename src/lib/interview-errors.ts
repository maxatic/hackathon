/**
 * User-facing copy for mic / WebRTC failures (often OS or browser blocks mic).
 */
export function formatInterviewStartError(error: unknown): string {
  if (error instanceof DOMException) {
    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      return (
        "Microphone access was blocked. In your browser, allow the mic for this site " +
        "(lock icon in the address bar → Site settings). On macOS: System Settings → " +
        "Privacy & Security → Microphone → enable your browser. Then reload and try again."
      );
    }
    if (error.name === "NotReadableError" || error.name === "TrackStartError") {
      return (
        "The microphone could not be opened. It may be in use by another app, or no " +
        "input device is available. Close other apps using the mic and try again."
      );
    }
    if (error.message) return error.message;
  }

  const msg =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "";

  if (
    /permission denied|not allowed|blocked|permission denied by system/i.test(
      msg,
    )
  ) {
    return (
      "Microphone permission was denied. Allow the microphone for this site in your " +
      "browser and in system settings (macOS: Privacy & Security → Microphone), then try again."
    );
  }

  return msg || "Could not start the voice session. Check your microphone and try again.";
}

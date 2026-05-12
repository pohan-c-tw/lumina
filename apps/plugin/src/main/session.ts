const SESSION_KEY = "SESSION_KEY";

export function getSessionId(): string | undefined {
  const sessionId = figma.root.getPluginData(SESSION_KEY);
  return sessionId || undefined;
}

export function saveSessionIdIfChanged(
  newSessionId: string | undefined,
  previousSessionId: string | undefined,
) {
  if (newSessionId && newSessionId !== previousSessionId) {
    figma.root.setPluginData(SESSION_KEY, newSessionId);
  }
}

export function resetSession() {
  figma.root.setPluginData(SESSION_KEY, "");
}

import { MemorySession } from "@openai/agents";
import { debugLog } from "./logger";

const sessions = new Map<string, MemorySession>();

export function getOrCreateSession(sessionId: string): MemorySession {
  let session = sessions.get(sessionId);

  if (!session) {
    session = new MemorySession();
    sessions.set(sessionId, session);
    debugLog("[getOrCreateSession] session created", { sessionId });
  }

  return session;
}

export function listSessionIds(): string[] {
  return Array.from(sessions.keys());
}

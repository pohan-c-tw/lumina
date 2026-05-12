import { debugLog } from "./logger";
import type {
  AgentHttpRequestBody,
  AgentStepResult,
  AgentToolsHttpRequestBody,
} from "@lumina/shared/agentProtocol";

const SERVER_BASE_URL =
  import.meta.env.VITE_SERVER_BASE_URL ?? "http://localhost:8787";

export async function callAgent(
  body: AgentHttpRequestBody,
): Promise<AgentStepResult> {
  debugLog("[main:callAgent] request", {
    hasSessionId: Boolean(body.sessionId),
    textLength: body.text.length,
  });

  const response = await fetch(`${SERVER_BASE_URL}/agent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`/agent failed with status ${response.status}`);
  }

  const step = (await response.json()) as AgentStepResult;
  debugLog("[main:callAgent] response", {
    sessionId: step.sessionId,
    eventTypes: step.events.map((event) => event.type),
  });
  return step;
}

export async function callAgentWithToolResults(
  body: AgentToolsHttpRequestBody,
): Promise<AgentStepResult> {
  debugLog("[main:callAgentWithToolResults] request", {
    sessionId: body.sessionId,
    toolNames: body.toolResults.map((toolResult) => toolResult.name),
  });

  const response = await fetch(`${SERVER_BASE_URL}/agent/tools`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`/agent/tools failed with status ${response.status}`);
  }

  const step = (await response.json()) as AgentStepResult;
  debugLog("[main:callAgentWithToolResults] response", {
    sessionId: step.sessionId,
    eventTypes: step.events.map((event) => event.type),
  });
  return step;
}

import { Runner } from "@openai/agents";
import { v4 as uuidv4 } from "uuid";
import { agent } from "./agent";
import { debugLog } from "./logger";
import { runPlanner, type PlannerDecision } from "./planner";
import { getOrCreateSession } from "./session";
import { handleToolResults } from "./toolResults";
import type {
  AgentStepResult,
  AgentToolCall,
  AgentToolResult,
} from "@lumina/shared/agentProtocol";

const runner = new Runner();

export async function runAgentStepFromUserInput({
  sessionId: inputSessionId,
  text,
}: {
  sessionId?: string;
  text: string;
}): Promise<AgentStepResult> {
  const sessionId = inputSessionId ?? uuidv4();
  const session = getOrCreateSession(sessionId);

  const toolCalls: AgentToolCall[] = [];
  try {
    const decision: PlannerDecision = await runPlanner(text);

    for (const tool of decision.tools) {
      switch (tool.type) {
        case "selection": {
          toolCalls.push({
            id: uuidv4(),
            name: "getCurrentSelectionSnapshot",
            args: { question: tool.question },
          });
          break;
        }
        case "file_overview": {
          toolCalls.push({
            id: uuidv4(),
            name: "scanFileOverview",
            args: { question: tool.question },
          });
          break;
        }
        default: {
          console.warn(
            "[runAgentStepFromUserInput] planner returned unsupported figma tool",
            tool,
          );
        }
      }
    }
  } catch (error) {
    console.error(
      "[runAgentStepFromUserInput] planner failed, treat as no tools",
      error,
    );
  }

  if (toolCalls.length) {
    debugLog("[runAgentStepFromUserInput] planner selected figma tools", {
      sessionId,
      toolNames: toolCalls.map((toolCall) => toolCall.name),
    });

    return {
      sessionId,
      events: toolCalls.map((toolCall) => ({
        type: "tool_call",
        payload: { toolCall },
      })),
    };
  }

  debugLog("[runAgentStepFromUserInput] direct agent", {
    sessionId,
    textLength: text.length,
  });

  const result = await runner.run(agent, text, { session });

  let message = result.finalOutput;
  if (!message || !message.trim()) {
    console.error(
      "[runAgentStepFromUserInput] missing finalOutput from agent",
      { sessionId },
    );

    message = "這一輪我沒有成功產生完整回答，請稍後再試一次";
  }

  return {
    sessionId,
    events: [
      {
        type: "agent_message",
        payload: { message },
      },
    ],
  };
}

export async function runAgentStepFromToolResults({
  sessionId,
  toolResults,
}: {
  sessionId: string;
  toolResults: AgentToolResult[];
}): Promise<AgentStepResult> {
  const session = getOrCreateSession(sessionId);
  return handleToolResults({ runner, sessionId, session, toolResults });
}

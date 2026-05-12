import { z } from "zod";
import { agentTools } from "./agentTools";
import type { ToolName, ToolParameters, ToolResult } from "./agentTools";

// ===== Agent core protocol =====

export type AgentToolCall = {
  [N in ToolName]: {
    id: string;
    name: N;
    args: ToolParameters<N>;
  };
}[ToolName];

/**
 * Plugin 執行完 remote tool 後，回傳給 server 的結果格式
 */
export type AgentToolResult = {
  [N in ToolName]: {
    id: string;
    name: N;
    args: ToolParameters<N>;
    result: ToolResult<N>;
  };
}[ToolName];

// ===== HTTP request/response payloads =====

/**
 * /agent 入口的請求 body
 * - sessionId：可選，讓 server 知道要延續哪一個對話 session
 * - text：使用者輸入的自然語言問題
 */
export const AgentHttpRequestBodySchema = z.object({
  sessionId: z.string().optional(),
  text: z.string(),
});
export type AgentHttpRequestBody = z.infer<typeof AgentHttpRequestBodySchema>;

/**
 * 當 server 回傳 type: "tool_call" 時
 * plugin 會依照 toolCall 執行對應的 Figma remote tools
 * 再把結果透過 /agent/tools 回傳給 server
 */
export const AgentToolsHttpRequestBodySchema = z.object({
  sessionId: z.string(),
  toolResults: z.array(
    z.object({
      // 這裡的 schema 先保持寬鬆，只檢查基本形狀
      // 真正的 result payload 結構交給各工具的 resultSchema 驗證。
      id: z.string(),
      name: z.string(),
      args: z.unknown(),
      result: z.unknown(),
    }),
  ),
});
export type AgentToolsHttpRequestBody = z.infer<
  typeof AgentToolsHttpRequestBodySchema
>;

export type ParsedAgentToolsHttpRequestBody = Omit<
  AgentToolsHttpRequestBody,
  "toolResults"
> & {
  toolResults: AgentToolResult[];
};

export function parseAgentToolsHttpRequestBody(
  rawBody: unknown,
): ParsedAgentToolsHttpRequestBody {
  const body = AgentToolsHttpRequestBodySchema.parse(rawBody);

  const toolResults = body.toolResults.map((toolResult) => {
    if (!isToolName(toolResult.name)) {
      throw new z.ZodError([
        {
          code: z.ZodIssueCode.custom,
          message: `Unsupported tool result name: ${toolResult.name}`,
          path: ["toolResults", "name"],
        },
      ]);
    }

    const toolConfig = agentTools[toolResult.name];
    return {
      id: toolResult.id,
      name: toolResult.name,
      args: toolConfig.parametersSchema.parse(toolResult.args),
      result: toolConfig.resultSchema.parse(toolResult.result),
    } as AgentToolResult;
  });

  return {
    ...body,
    toolResults,
  };
}

function isToolName(name: string): name is ToolName {
  return Object.prototype.hasOwnProperty.call(agentTools, name);
}

type AgentStepEvent =
  | {
      type: "agent_message";
      payload: {
        /**
         * 給使用者看的最終回答文字
         */
        message: string;
      };
    }
  | {
      type: "tool_call";
      payload: {
        toolCall: AgentToolCall;
      };
    };

/**
 * 一次 HTTP 回合結束時，Agent 對目前回合的狀態描述
 */
export type AgentStepResult = {
  sessionId: string;
  events: AgentStepEvent[];
};

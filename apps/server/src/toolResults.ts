import { agent } from "./agent";
import { debugLog } from "./logger";
import type {
  AgentStepResult,
  AgentToolResult,
} from "@lumina/shared/agentProtocol";
import type { MemorySession, Runner } from "@openai/agents";

export async function handleToolResults({
  runner,
  sessionId,
  session,
  toolResults,
}: {
  runner: Runner;
  sessionId: string;
  session: MemorySession;
  toolResults: AgentToolResult[];
}): Promise<AgentStepResult> {
  debugLog("[handleToolResults] received tool results", {
    count: toolResults.length,
    toolNames: toolResults.map((toolResult) => toolResult.name),
  });

  if (!toolResults.length) {
    return {
      sessionId,
      events: [
        {
          type: "agent_message",
          payload: { message: "沒有可用的工具結果" },
        },
      ],
    };
  }

  const first = toolResults[0];
  switch (first.name) {
    case "getCurrentSelectionSnapshot": {
      const { args, result } = first;
      const { selectionSnapshot } = result;
      const question = String((args as { question?: unknown }).question ?? "");
      debugLog("[runtime:handleToolResults] getCurrentSelectionSnapshot", {
        questionLength: question.length,
        pageName: selectionSnapshot.name,
        nodeCount: selectionSnapshot.nodes.length,
      });

      const snapshotJson = JSON.stringify(selectionSnapshot, null, 2);
      const combinedQuery = `\
使用者原本的問題是：「${question}」

以下是目前 Figma 選取內容的 selectionSnapshot（JSON 格式）：
${snapshotJson}

請完整閱讀這份 JSON，根據其中的畫面名稱、節點類型與文字片段，回答使用者原本的問題（用台灣中文，重點是解釋這段 selection 代表的流程與目的）。`;

      const runResult = await runner.run(agent, combinedQuery, { session });
      return {
        sessionId,
        events: [
          {
            type: "agent_message",
            payload: {
              message: runResult.finalOutput ?? "<no-final-output>",
            },
          },
        ],
      };
    }
    case "scanFileOverview": {
      const { args, result } = first;
      const { fileOverviewSnapshot } = result;
      const question = String((args as { question?: unknown }).question ?? "");
      const snapshotJson = JSON.stringify(fileOverviewSnapshot, null, 2);
      const combinedQuery = `\
使用者原本的問題是：「${question}」

以下是整個 Figma 檔案的 fileOverviewSnapshot（JSON 格式）：
${snapshotJson}

請完整閱讀這份 JSON，根據其中的 page 與 frame 資訊，回答使用者原本的問題（用台灣中文）。

回答時請盡量涵蓋以下幾點：
1. 用 1～2 個段落說明：這個 Figma 檔案大致在設計什麼產品或功能域（例如登入、訂閱、帳號設定…）。
2. 嘗試整理出 2～5 條「主要使用者流程」，幫每條流程取一個名稱，並簡單說明大致步驟會經過哪些畫面。
3. 若使用者是新加入的 PM / RD，請挑出 3～5 個適合作為入口的畫面（可以用 page name + frame name 表示），並說明為什麼建議從這裡看起。
4. 如果 JSON 顯示命名 / 文案較混亂，請在回答中主動提醒，並在有資訊的前提下盡量給出保守、實際的建議。`;

      const runResult = await runner.run(agent, combinedQuery, { session });
      return {
        sessionId,
        events: [
          {
            type: "agent_message",
            payload: {
              message: runResult.finalOutput ?? "<no-final-output>",
            },
          },
        ],
      };
    }
    default: {
      return {
        sessionId,
        events: [
          {
            type: "agent_message",
            payload: {
              message: "目前尚未支援處理此工具結果。",
            },
          },
        ],
      };
    }
  }
}

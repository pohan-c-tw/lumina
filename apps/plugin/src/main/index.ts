import { callAgent, callAgentWithToolResults } from "@main/agentClient";
import { postPluginResponse } from "@main/bridge";
import buildFileOverviewSnapshot from "@main/figmaTools/buildFileOverviewSnapshot";
import buildSelectionSnapshot from "@main/figmaTools/buildSelectionSnapshot";
import { debugLog } from "@main/logger";
import {
  getSessionId,
  resetSession,
  saveSessionIdIfChanged,
} from "@main/session";
import type {
  AgentToolCall,
  AgentToolResult,
} from "@lumina/shared/agentProtocol";
import type { UiToPluginMessage } from "@plugin-shared/messages/uiToPluginMessage";

figma.showUI(__html__, {
  width: 350,
  height: 700,
  title: "Lumina",
});

async function handleToolCall({
  sessionId,
  toolCall,
}: {
  sessionId: string;
  toolCall: AgentToolCall;
}) {
  debugLog("[main:handleToolCall]", {
    sessionId,
    toolName: toolCall.name,
  });

  try {
    const toolResults: AgentToolResult[] = [];

    switch (toolCall.name) {
      case "getCurrentSelectionSnapshot": {
        const currentSelection = figma.currentPage.selection;
        if (!currentSelection.length) {
          postPluginResponse({
            text: "目前沒有選取任何畫面",
            variant: "info",
          });
          return;
        }

        postPluginResponse({
          text: "正在分析目前選取的畫面",
          variant: "status",
        });

        const selectionSnapshot = buildSelectionSnapshot();
        toolResults.push({
          id: toolCall.id,
          name: toolCall.name,
          args: toolCall.args,
          result: { selectionSnapshot },
        });
        break;
      }
      case "scanFileOverview": {
        postPluginResponse({
          text: "正在掃描整個 Figma 檔案",
          variant: "status",
        });

        const fileOverviewSnapshot = await buildFileOverviewSnapshot();
        toolResults.push({
          id: toolCall.id,
          name: toolCall.name,
          args: toolCall.args,
          result: { fileOverviewSnapshot },
        });
        break;
      }
      default: {
        console.warn("[main:handleToolCall] unsupported tool call", toolCall);
      }
    }

    if (!toolResults.length) {
      console.warn("[main:handleToolCall] toolResults.length is 0");
      return;
    }

    const step = await callAgentWithToolResults({
      sessionId,
      toolResults,
    });

    saveSessionIdIfChanged(step.sessionId, sessionId);

    if (!step.events.length) {
      return;
    }

    if (step.events.length > 1) {
      console.warn("currently unsupported");
      return;
    }

    if (step.events[0].type === "agent_message") {
      postPluginResponse({
        text: step.events[0].payload.message,
        variant: "info",
      });
    } else {
      console.error("[main:handleToolCall] unexpected step type, step: ", step);
      postPluginResponse({
        text: "工具回傳了目前無法處理的結果，請稍後再試。",
        variant: "error",
      });
    }
  } catch (error) {
    console.error("[main:handleToolCall] error: ", error);
    postPluginResponse({
      text: "分析 Figma 資料時發生錯誤，請稍後再試。",
      variant: "error",
    });
  }
}

async function handleComposerSubmit(text: string) {
  debugLog("[main:handleComposerSubmit]", {
    textLength: text.length,
  });

  const sessionId = getSessionId();

  postPluginResponse({
    text: "Working...",
    variant: "status",
  });

  const step = await callAgent({ sessionId, text });

  saveSessionIdIfChanged(step.sessionId, sessionId);

  for (const event of step.events) {
    if (event.type === "agent_message") {
      postPluginResponse({
        text: event.payload.message,
        variant: "info",
      });
    }

    if (event.type === "tool_call") {
      await handleToolCall({
        sessionId: step.sessionId,
        toolCall: event.payload.toolCall,
      });
    }
  }
}

figma.ui.onmessage = async (message: UiToPluginMessage) => {
  debugLog("[main:onmessage]", { type: message.type });

  switch (message.type) {
    case "UI_COMPOSER_SUBMIT": {
      const {
        payload: { text },
      } = message;

      try {
        await handleComposerSubmit(text);
      } catch (error) {
        console.error("[main:onmessage:UI_COMPOSER_SUBMIT] error: ", error);
        postPluginResponse({
          text: "發生錯誤，請稍後再試。",
          variant: "error",
        });
      }
      break;
    }
    case "UI_RESET_SESSION": {
      resetSession();
      break;
    }
  }
};

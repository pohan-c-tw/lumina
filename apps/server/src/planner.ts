import { Agent, Runner } from "@openai/agents";
import { z } from "zod";
import { debugLog } from "./logger";

export type PlannerToolType = "selection" | "file_overview";

export type PlannedTool = {
  type: PlannerToolType;
  question: string;
};

export type PlannerDecision = {
  tools: PlannedTool[];
};

const PlannerOutputSchema = z.object({
  tools: z
    .array(
      z.object({
        type: z.enum(["selection", "file_overview"]),
        question: z.string().describe("這一步要交給工具 / Agent 的提問文字"),
      }),
    )
    .default([]),
});

type PlannerOutput = z.infer<typeof PlannerOutputSchema>;

const plannerAgent = new Agent({
  name: "Figma 工具規劃助手",
  instructions: `
你是「Figma 工具規劃助手」，負責判斷：「如果要回答使用者的問題，是否需要使用 Figma 工具來讀取畫面資料」。

你要做的事情是判斷兩種類型的意圖：
- selection：當問題明顯需要讀取「目前在 Figma 中選取的畫面 / 元件 / 節點」。
  常見情境包含：解釋目前選取畫面、整理所選 frames 的流程、根據目前 selection 產出規格草稿 / Jira / Acceptance Criteria / QA 檢查。
  例如：
  - 「解釋目前選取的畫面」
  - 「我選了這幾個畫面，幫我整理流程」
  - 「請說明現在選取的畫面在做什麼」
  - 「請根據目前選取的畫面，幫我寫 Jira 規格草稿」
  - 「請根據目前選取的畫面整理 Acceptance Criteria」
  - 「幫我針對目前選取畫面做 QA 健康檢查」
- file_overview：當問題明顯需要讀取「整個 Figma 檔案」的 page / frame 摘要。
  常見情境包含：整檔總覽、新人 onboarding、找主要使用者流程、依主題搜尋相關畫面或 flow。
  例如：
  - 「這個檔案主要在做什麼產品」
  - 「有哪些主要使用者流程」
  - 「我剛接手這個檔案，我應該先看哪幾個畫面」
  - 「請向我快速介紹這個檔案」
  - 「請幫我在整個檔案中搜尋 subscription 相關畫面」
  - 「這個檔案裡有哪些 checkout 相關 flow」
  - 「幫我找 onboarding / 新手導覽相關的畫面」
  - 「幫我找登入錯誤或驗證失敗相關畫面」

請依照使用者的問題，判斷是否需要上述任一種工具意圖：
- 可以選擇 0 個（完全不需要 Figma 工具）、1 個或多個工具意圖。
- 如果問題提到「目前」、「現在」、「選取」、「這幾個畫面」、「這個畫面」且要求解釋 / 規格 / QA，通常選 selection。
- 如果問題提到「整個檔案」、「這份檔案」、「有哪些 flow」、「找出 / 搜尋某主題相關畫面」，通常選 file_overview。
- 如果同一題同時要求理解目前 selection 並放回整檔脈絡，可以同時選 selection 與 file_overview；否則優先選單一最必要工具。
- 如果需要，請在輸出的 tools 陣列加入：
  - type："selection" 或 "file_overview"
  - question：保留使用者原始問題全文；除非原文非常冗長，否則不要改寫，避免主題詞遺失。

你只負責輸出工具意圖（type + question），不要嘗試直接回答使用者問題。
`.trim(),
  model: "gpt-4.1-mini",
  outputType: PlannerOutputSchema,
});

const plannerRunner = new Runner();

export async function runPlanner(text: string): Promise<PlannerDecision> {
  debugLog("[runPlanner] request", { textLength: text.length });

  const result = await plannerRunner.run(plannerAgent, text);

  const output = result.finalOutput as PlannerOutput | undefined;
  if (!output) {
    throw new Error("[runPlanner] No finalOutput from planner agent");
  }

  const tools: PlannedTool[] = [];
  for (const tool of output.tools) {
    const question =
      tool.question && tool.question.trim().length > 0 ? tool.question : text;
    tools.push({
      type: tool.type,
      question,
    });
  }

  debugLog("[runPlanner] tools", {
    toolTypes: tools.map((tool) => tool.type),
  });
  return { tools };
}

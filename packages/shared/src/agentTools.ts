// Server-side tools 放在 server/src/agent.ts

import { z } from "zod";

export type ToolConfig = {
  description: string;
  parametersSchema: z.ZodTypeAny;
  resultSchema: z.ZodTypeAny;
};

export const agentTools = {
  getCurrentSelectionSnapshot: {
    description:
      "取得目前在 Figma 中選取節點的結構化 snapshot，用於之後在 server 端產生流程說明",
    parametersSchema: z.object({
      question: z
        .string()
        .describe("使用者針對目前選取畫面的自然語言問題或說明"),
    }),
    resultSchema: z
      .object({
        selectionSnapshot: z.object({
          name: z.string().describe("目前所在的 page 名稱"),
          nodes: z
            .array(
              z.object({
                id: z.string().describe("Figma node 的 id"),
                name: z
                  .string()
                  .describe("節點名稱，若無名稱會使用一個 placeholder"),
                type: z.string().describe("Figma node 的 type"),
                textSnippets: z
                  .array(z.string())
                  .describe("從節點內搜集到的文字片段"),
              }),
            )
            .describe("目前選取的節點列表"),
        }),
      })
      .describe("目前選取內容的結構化 snapshot"),
  },
  scanFileOverview: {
    description:
      "掃描目前 Figma 檔案的所有 page / frame，產生檔案總覽用的 FileOverviewSnapshot",
    parametersSchema: z
      .object({
        question: z
          .string()
          .describe("使用者針對整份 Figma 檔案或特定主題的自然語言問題"),
      })
      .describe("檔案總覽與主題搜尋需要保留原始使用者問題"),
    resultSchema: z.object({
      fileOverviewSnapshot: z
        .object({
          pages: z
            .array(
              z.object({
                name: z.string().describe("Page 名稱"),
                frames: z
                  .array(
                    z.object({
                      id: z.string().describe("Frame 的 id"),
                      name: z.string().describe("Frame 名稱"),
                      type: z.string().describe("Node 類型（通常是 FRAME）"),
                      textSnippets: z
                        .array(z.string())
                        .describe(
                          "從 frame 內蒐集到的文字片段，用於總覽、語意搜尋",
                        ),
                    }),
                  )
                  .describe("此 page 底下的 frames 列表"),
              }),
            )
            .describe("整個檔案中的 pages 列表"),
        })
        .describe("檔案級的 Overview Snapshot"),
    }),
  },
} satisfies Record<string, ToolConfig>;

type ToolRegistry = typeof agentTools;

export type ToolName = keyof ToolRegistry;

export type ToolParameters<N extends ToolName> = z.infer<
  (typeof agentTools)[N]["parametersSchema"]
>;
export type ToolResult<N extends ToolName> = z.infer<
  (typeof agentTools)[N]["resultSchema"]
>;

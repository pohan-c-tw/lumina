import type { ToolResult } from "./agentTools";

/**
 * Figma plugin 端回傳的「目前選取內容」結構
 * 由 getCurrentSelectionSnapshot 工具回傳
 */
export type SelectionSnapshot =
  ToolResult<"getCurrentSelectionSnapshot">["selectionSnapshot"];

/**
 * Figma plugin 端回傳的「整個檔案 overview」結構
 * 由 scanFileOverview 工具回傳
 */
export type FileOverviewSnapshot =
  ToolResult<"scanFileOverview">["fileOverviewSnapshot"];
export type FileOverviewPage = FileOverviewSnapshot["pages"][number];
export type FileOverviewFrame = FileOverviewPage["frames"][number];

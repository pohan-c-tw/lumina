import type { SuggestionGroup } from "@ui/types";

export const SUGGESTION_GROUPS: SuggestionGroup[] = [
  {
    label: "Flow / 解釋",
    items: [
      {
        label: "解釋目前選取的畫面（流程步驟）",
        value: "請解釋目前在 Figma 中所選取的畫面，整理成流程步驟與重點。",
      },
      {
        label: "區分 Happy Path / Error Path",
        value:
          "請根據目前在 Figma 中所選取的畫面，幫我整理這段流程，並區分主要 Happy Path 與 Error Path。",
      },
    ],
  },
  {
    label: "搜尋 / 導覽",
    items: [
      {
        label: "搜尋 subscription 相關畫面並解釋",
        value:
          "請幫我在整個檔案中搜尋與「subscription」相關的畫面（包含畫面名稱、文案內容與元件名稱），並整理成一段流程說明。",
      },
      {
        label: "列出 onboarding 相關畫面",
        value:
          "請幫我在整個檔案中找出與 onboarding / 新手導覽 相關的畫面，並簡單說明主要步驟。",
      },
    ],
  },
];

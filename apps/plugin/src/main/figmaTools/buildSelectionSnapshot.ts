import { collectTextSnippets } from "@main/figmaTools/textSnippets";
import { debugLog } from "@main/logger";
import type { SelectionSnapshot } from "@lumina/shared/snapshots";

const MAX_TEXT_SNIPPETS = 12;

export default function buildSelectionSnapshot(): SelectionSnapshot {
  debugLog("[Figma tool called] buildSelectionSnapshot", {
    selectionCount: figma.currentPage.selection.length,
  });

  const selection = figma.currentPage.selection;
  const nodes = selection.map((node) => {
    const textSnippets = collectTextSnippets(node, MAX_TEXT_SNIPPETS);

    return {
      id: node.id,
      name: node.name && node.name.trim().length > 0 ? node.name : "（無名稱）",
      type: node.type,
      textSnippets,
    };
  });

  return {
    name: figma.currentPage.name,
    nodes,
  };
}

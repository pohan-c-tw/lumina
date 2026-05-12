import { collectTextSnippets } from "@main/figmaTools/textSnippets";
import { debugLog } from "@main/logger";
import type {
  FileOverviewFrame,
  FileOverviewPage,
  FileOverviewSnapshot,
} from "@lumina/shared/snapshots";

const MAX_TEXT_SNIPPETS_PER_FRAME = 12;

export default async function buildFileOverviewSnapshot(): Promise<FileOverviewSnapshot> {
  debugLog("[Figma tool called] buildFileOverviewSnapshot");

  await figma.loadAllPagesAsync();

  const pages: FileOverviewPage[] = [];
  for (const page of figma.root.children) {
    const frames: FileOverviewFrame[] = [];

    page.children.forEach((node) => {
      if (node.type === "FRAME") {
        const textSnippets = collectTextSnippets(
          node,
          MAX_TEXT_SNIPPETS_PER_FRAME,
        );

        frames.push({
          id: node.id,
          name:
            node.name && node.name.trim().length > 0 ? node.name : "（無名稱）",
          type: node.type,
          textSnippets,
        });
      }
    });

    if (frames.length) {
      pages.push({
        name: page.name,
        frames,
      });
    }
  }

  return {
    pages,
  };
}

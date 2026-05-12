export function collectTextSnippets(root: SceneNode, max: number): string[] {
  const snippets: string[] = [];

  function walk(node: SceneNode) {
    if (snippets.length >= max) {
      return;
    }

    if ("characters" in node) {
      const text = node.characters.trim();
      if (text) {
        snippets.push(text);
      }
    }

    if ("children" in node) {
      for (const child of node.children) {
        if (snippets.length >= max) {
          break;
        }
        walk(child);
      }
    }
  }

  walk(root);
  return snippets;
}

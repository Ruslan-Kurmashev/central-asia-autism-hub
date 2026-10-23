// Render Markdown prose without in-paragraph bold emphasis across all locales.
// Keep headings, links, lists, tables and other document structure unchanged.
export default function remarkRemoveInlineStrong() {
  return (tree) => {
    function visit(node) {
      if (!Array.isArray(node?.children)) return;
      node.children = node.children.flatMap((child) => {
        visit(child);
        // Unwrap only Markdown strong nodes. Their content remains intact.
        return child.type === 'strong' ? child.children ?? [] : [child];
      });
    }
    visit(tree);
  };
}

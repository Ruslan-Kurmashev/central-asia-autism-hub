// Remove decorative inline bold while preserving structural labels in all locales.
// Strong nodes in grouped definition paragraphs, at the start of list items,
// and in the first column of tables remain semantic emphasis.
const MAX_LABEL_LENGTH = 110;

function textOf(node) {
  if (typeof node?.value === 'string') return node.value;
  return Array.isArray(node?.children) ? node.children.map(textOf).join('') : '';
}

function isLeadLabelParagraph(node) {
  if (node?.type !== 'paragraph' || node.children?.[0]?.type !== 'strong') return false;
  const label = textOf(node.children[0]).trim();
  const rest = node.children.slice(1).map(textOf).join('').trim();
  return label.length > 0 && label.length <= MAX_LABEL_LENGTH && rest.length > 0;
}

function shouldKeepLabel(parent, child, index, ancestors) {
  if (child.type !== 'strong' || index !== 0) return false;
  const label = textOf(child).trim();
  if (!label || label.length > MAX_LABEL_LENGTH || label.includes('\n')) return false;

  if (parent.type === 'tableCell') {
    const row = ancestors.at(-1);
    return row?.type === 'tableRow' && row.children?.[0] === parent;
  }

  if (parent.type !== 'paragraph') return false;
  if (ancestors.some((node) => node.type === 'listItem')) return true;
  if (!isLeadLabelParagraph(parent)) return false;

  // A short lead-in ending with a colon is an explicit definition label.
  if (label.length <= 85 && /[:：]$/.test(label)) return true;

  // Separate paragraph labels are preserved when they form an actual enumeration.
  const container = ancestors.at(-1);
  const siblings = container?.children;
  if (!Array.isArray(siblings)) return false;
  const current = siblings.indexOf(parent);
  return (current > 0 && isLeadLabelParagraph(siblings[current - 1])) ||
    (current < siblings.length - 1 && isLeadLabelParagraph(siblings[current + 1]));
}

export default function remarkRemoveInlineStrong() {
  return (tree) => {
    function visit(node, ancestors = []) {
      if (!Array.isArray(node?.children)) return;
      // Work from the original sibling structure before unwrapping inline nodes.
      node.children = node.children.flatMap((child, index) => {
        const keep = shouldKeepLabel(node, child, index, ancestors);
        visit(child, [...ancestors, node]);
        return child.type === 'strong' && !keep ? child.children ?? [] : [child];
      });
    }
    visit(tree);
  };
}

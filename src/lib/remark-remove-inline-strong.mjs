// Site-wide editorial emphasis: retain semantic labels, not promotional or
// decorative bold within ordinary sentences. This does not rewrite article text.
const MAX_LABEL_LENGTH = 100;
const MAX_CATEGORY_LENGTH = 80;

function textOf(node) {
  if (typeof node?.value === 'string') return node.value;
  return Array.isArray(node?.children) ? node.children.map(textOf).join('') : '';
}

function lead(node) {
  if (node?.type !== 'paragraph' || node.children?.[0]?.type !== 'strong') return null;
  const label = textOf(node.children[0]).trim();
  const rest = node.children.slice(1).map(textOf).join('');
  if (!label || label.length > MAX_LABEL_LENGTH || !rest.trim()) return null;
  return { label, rest };
}

function isTermDefinition(label, rest) {
  if (label.length > 65 || /[.!?]\s*$/.test(label)) return false;
  // Some terms have an abbreviation or translation in brackets before a dash.
  return /^\s*(?:\([^)]{1,110}\)\s*)?(?:-|:\s|–\s|—\s|(?:означает|обозначает|называют|это|является|помогает|помогают|относится|относятся)(?=\s|$)|refers\s+to\b|means\b|is\s+(?:a|an|the)\b|are\b|(?:дегеніміз|білдіреді|болып\s+табылады)(?=\s|$))/iu.test(rest);
}

function isCategoryLabel(label) {
  return label.length <= MAX_CATEGORY_LENGTH && /[.:：]$/.test(label);
}

function isGroupedLabel(parent, ancestors) {
  const items = ancestors.at(-1)?.children;
  if (!Array.isArray(items)) return false;
  const i = items.indexOf(parent);
  const matches = (sibling) => {
    const value = lead(sibling);
    return value && isCategoryLabel(value.label);
  };
  return (i > 0 && matches(items[i - 1])) ||
    (i < items.length - 1 && matches(items[i + 1]));
}

function shouldKeep(parent, child, index, ancestors) {
  if (child.type !== 'strong' || index !== 0) return false;
  const label = textOf(child).trim();
  if (!label || label.length > MAX_LABEL_LENGTH || label.includes('\n')) return false;

  if (parent.type === 'tableCell') {
    const row = ancestors.at(-1);
    return row?.type === 'tableRow' && row.children?.[0] === parent;
  }

  if (parent.type !== 'paragraph') return false;
  if (ancestors.some((ancestor) => ancestor.type === 'listItem')) return true;

  // Short quoted examples inside blockquotes are deliberate demonstration text.
  if (ancestors.some((ancestor) => ancestor.type === 'blockquote') &&
      parent.children.length === 1 && label.length <= 45) return true;

  const value = lead(parent);
  if (!value) return false;

  // Labels ending with a colon are unambiguous, even when not in a list.
  if (label.length <= MAX_CATEGORY_LENGTH && /[:：]$/.test(label)) return true;
  if (isTermDefinition(label, value.rest)) return true;

  // Restore paragraph-style enumerations such as "Gestures. ..." only if
  // neighbouring paragraphs use the same structure.
  if (isCategoryLabel(label) && isGroupedLabel(parent, ancestors)) return true;

  return false;
}

export default function remarkRemoveInlineStrong() {
  return (tree) => {
    function visit(node, ancestors = []) {
      if (!Array.isArray(node?.children)) return;
      node.children = node.children.flatMap((child, index) => {
        const keep = shouldKeep(node, child, index, ancestors);
        visit(child, [...ancestors, node]);
        if (child.type !== 'strong') return [child];
        if (!keep) return child.children ?? [];
        // Explicit class keeps the site CSS from accidentally restoring bold
        // for unrelated raw HTML or entire claim sentences.
        child.data = {
          ...child.data,
          hProperties: {
            ...child.data?.hProperties,
            className: [...(child.data?.hProperties?.className ?? []), 'article-key-label'],
          },
        };
        return [child];
      });
    }
    visit(tree);
  };
}

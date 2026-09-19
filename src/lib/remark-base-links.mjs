function normalizeBase(base) {
  if (!base || base === '/') return '';
  return `/${String(base).replace(/^\/+|\/+$/g, '')}`;
}

function rewriteUrl(url, base, siteOrigin) {
  if (typeof url !== 'string' || !url) return url;

  if (siteOrigin && url.startsWith(`${siteOrigin}/kz/`)) {
    return `${base}${url.slice(siteOrigin.length)}`;
  }

  if (!url.startsWith('/') || url.startsWith('//')) return url;
  if (!base) return url;
  if (url === base || url.startsWith(`${base}/`)) return url;

  if (url.startsWith('/kz/')) {
    return `${base}${url}`;
  }

  return url;
}

function walk(node, visitor) {
  if (!node || typeof node !== 'object') return;

  visitor(node);

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      walk(child, visitor);
    }
  }
}

export default function remarkBaseLinks(options = {}) {
  const base = normalizeBase(options.base);
  const siteOrigin = String(options.siteOrigin ?? '').replace(/\/+$/, '');

  return (tree) => {
    walk(tree, (node) => {
      if (
        (node.type === 'link' || node.type === 'definition') &&
        typeof node.url === 'string'
      ) {
        node.url = rewriteUrl(node.url, base, siteOrigin);
      }
    });
  };
}

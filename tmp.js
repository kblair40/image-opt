export function getSizeString(bytes) {
  if (!bytes) return "?kb";
  const kb = bytes / 1000;

  return kb >= 1000 ? (kb / 1000).toFixed(1) + "mb" : kb.toFixed(1) + " kb";
}

console.log("\nSize:", getSizeString(673296), "\n");

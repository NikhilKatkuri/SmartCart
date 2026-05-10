/**
 * jsonToText — converts structured JSON into flat Key | Value text.
 * Saves ~50% tokens vs raw JSON by removing brackets, quotes & colons.
 *
 * Examples:
 *   { "battery_wh": 86 }  →  "Battery wh | 86"
 *   { "display": { "type": "OLED" } }  →  "Display:\n  Type | OLED"
 *   { "features": ["Wi-Fi", "BT"] }  →  "Features | Wi-Fi, BT"
 */
export function jsonToText(obj: unknown, indent = ''): string {
      if (typeof obj !== 'object' || obj === null) return String(obj);

      return Object.entries(obj as Record<string, unknown>)
            .map(([key, value]) => {
                  const label = key
                        .replace(/_/g, ' ')
                        .replace(/([A-Z])/g, ' $1')
                        .trim()
                        .toLowerCase()
                        .replace(/^\w/, (c) => c.toUpperCase());

                  if (Array.isArray(value)) {
                        const items = value
                              .map((v) => (typeof v === 'object' ? jsonToText(v, indent + '  ') : String(v)))
                              .join(', ');
                        return `${indent}${label} | ${items}`;
                  }

                  if (typeof value === 'object' && value !== null) {
                        return `${indent}${label}:\n${jsonToText(value, indent + '  ')}`;
                  }

                  return `${indent}${label} | ${value}`;
            })
            .join('\n');
}

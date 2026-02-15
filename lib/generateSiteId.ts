/**
 * Generate a short, random, URL-safe site ID.
 * Returns a 4-character alphanumeric string (lowercase + digits).
 * ~1.6 million combinations — virtually collision-free for our scale.
 */
export function generateSiteId(length = 4): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    const array = new Uint8Array(length);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
    } else {
        for (let i = 0; i < length; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
    }
    for (let i = 0; i < length; i++) {
        id += chars[array[i] % chars.length];
    }
    return id;
}

/**
 * Generate a human-readable slug from names input.
 * "Alex & Jordan" → "alex-and-jordan"
 */
export function generateSlug(input: string): string {
    return input
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

/**
 * Normalize "Moly and Goli" or "Moly & Goli" → "Moly & Goli"
 */
export function normalizeNames(input: string): string {
    const parts = input.split(/\s+(?:&|and)\s+/i);
    if (parts.length >= 2) {
        return `${parts[0].trim()} & ${parts[1].trim()}`;
    }
    return input.trim();
}

/** Keys that are free to edit in demo mode (before publishing) */
export const FREE_FIELDS = ['hero.names', 'hero.date', 'story.image'];

import fs from 'fs';

export interface ContentMetrics {
    h1Count: number;
    wordCount: number;
    textToHtmlRatio: number;
    headingHierarchy: boolean; // true if H1 is followed by H2, etc. (basic check)
    keywords: string[];
}

export class ContentAnalyzer {
    public analyze(filePath: string): ContentMetrics {
        const content = fs.readFileSync(filePath, 'utf-8');

        // Removing comments and script/style tags for text analysis
        const cleanText = content
            .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
            .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
            .replace(/<!--[\s\S]*?-->/g, '')
            .replace(/<[^>]+>/g, ' ');

        const words = cleanText.split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;

        // Simple Text to HTML ratio
        const textToHtmlRatio = content.length > 0 ? cleanText.length / content.length : 0;

        // Headings analysis
        const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
        const h1Count = h1Matches.length;

        // Hierarchy check (Very basic: just checks if H2 exists if H1 exists)
        // A real parser would be needed for strict DOM tree hierarchy
        const hasH1 = h1Count > 0;
        const hasH2 = /<h2[^>]*>/i.test(content);

        // If H1 is present, usually good to have H2s for structure, but not strictly "broken" structure if missing.
        // However, if H2 appears BEFORE H1, that's bad. (Hard to check with regex)
        // For now, let's assume hierarchy is OK if H1 count is 1.
        const headingHierarchy = h1Count === 1;

        return {
            h1Count,
            wordCount,
            textToHtmlRatio,
            headingHierarchy,
            keywords: [] // TODO: Implement keyword extraction based on config tokens
        };
    }
}

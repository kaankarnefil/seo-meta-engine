import { SEORulesConfigSchema, SEORules } from '../config/schema';
import { AnalysisResult, AnalysisIssue } from '../types';
import { ContentMetrics } from './content-analyzer';

export class SEOAnalyzer {
    private rules: SEORules;

    constructor(rules: SEORules) {
        this.rules = rules;
    }

    public analyze(route: string, metrics: ContentMetrics): AnalysisResult {
        const issues: AnalysisIssue[] = [];
        let score = 100;
        const deductions: number[] = [];

        // Analyze H1
        if (this.rules.hasH1.enabled) {
            if (metrics.h1Count === 0) {
                issues.push({
                    rule: 'hasH1',
                    message: 'Page is missing Level 1 Heading (<h1>)',
                    severity: this.rules.hasH1.severity as 'warning' | 'error'
                });
                if (this.rules.hasH1.severity === 'error') deductions.push(20);
                else deductions.push(10);
            } else if (metrics.h1Count > 1) {
                issues.push({
                    rule: 'hasH1',
                    message: 'Page has multiple H1 tags. Use only one per page.',
                    severity: 'warning'
                });
                deductions.push(5);
            }
        }

        // Thin content (Implicit rule, maybe should be explicit in schema later)
        if (metrics.wordCount < 200) {
            issues.push({
                rule: 'descriptionLength', // abusing this key slightly or add new rule key
                message: `Thin content detected: Only ${metrics.wordCount} words.`,
                severity: 'warning',
                value: metrics.wordCount
            });
            deductions.push(15);
        }

        // Text to HTML ratio
        if (metrics.textToHtmlRatio < 0.1) {
            issues.push({
                rule: 'descriptionLength', // Placeholder key
                message: 'Low Text-to-HTML ratio. This might indicate code bloat.',
                severity: 'warning',
                value: metrics.textToHtmlRatio.toFixed(2)
            });
        }

        // Calculate Final Score
        const totalDeduction = deductions.reduce((a, b) => a + b, 0);
        score = Math.max(0, 100 - totalDeduction);

        return {
            route,
            score,
            issues
        };
    }
}

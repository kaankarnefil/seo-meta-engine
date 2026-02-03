import { AnalysisResult } from '../types';

export class ReportGenerator {
    public generateMarkdown(results: AnalysisResult[]): string {
        let md = '# SEO Analysis Report\n\n';

        // Summary
        const totalScore = results.reduce((acc, r) => acc + r.score, 0) / (results.length || 1);
        md += `**Overall Score**: ${totalScore.toFixed(0)}/100\n`;
        md += `**Pages Analyzed**: ${results.length}\n\n`;

        results.forEach(result => {
            const statusIcon = result.score >= 90 ? '🟢' : result.score >= 70 ? '🟡' : '🔴';
            md += `## ${statusIcon} ${result.route} (Score: ${result.score})\n`;

            if (result.issues.length === 0) {
                md += `✅ No issues found.\n`;
            } else {
                result.issues.forEach(issue => {
                    const icon = issue.severity === 'error' ? '❌' : '⚠️';
                    md += `- ${icon} **${issue.rule}**: ${issue.message}`;
                    if (issue.value) md += ` (Value: ${issue.value})`;
                    md += '\n';
                });
            }
            md += '\n';
        });

        return md;
    }

    public generateJson(results: AnalysisResult[]): string {
        return JSON.stringify(results, null, 2);
    }
}

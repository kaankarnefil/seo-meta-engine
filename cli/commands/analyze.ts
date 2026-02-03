import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { ProjectDetector } from '../../core/project-detector';
import { RouteScanner } from '../../core/route-scanner';
import { ContentAnalyzer } from '../../core/content-analyzer';
import { SEOAnalyzer } from '../../core/seo-analyzer';
import { ReportGenerator } from '../../core/report-generator';
import { defaultConfig } from '../../config/default-config';
import { SEOConfig } from '../../config/schema';

// Helper to load config (basic check for now)
// In a real generic app, we'd use 'bundle-require' or 'ts-node' to load .ts config.
// For now, let's assume defaults if loading fails or simplistic require.
// We will use the defaults + overrides logic.

export async function analyzeCommand(options: { failOn?: string, reportOnly?: boolean }) {
    console.log(chalk.blue('🔍 SEO Meta Engine: Starting analysis...'));

    const rootPath = process.cwd();

    // 1. Detect Project
    const detector = new ProjectDetector(rootPath);
    let projectInfo;
    try {
        projectInfo = detector.detect();
        console.log(chalk.gray(`Detected: ${projectInfo.framework} (Router: ${projectInfo.routerRaw || 'none'})`));
    } catch (e: any) {
        console.error(chalk.red(`Error: ${e.message}`));
        process.exit(2);
    }

    // 2. Load Config (Simplified for this environment)
    // In production, proper config loading is needed.
    const config = { ...defaultConfig } as SEOConfig; // Cast to full config for usage
    // TODO: Load seo.config.ts if exists

    // 3. Scan Routes
    const scanner = new RouteScanner(rootPath);
    const routes = await scanner.scan();
    console.log(chalk.gray(`Found ${routes.length} routes.`));

    // 4. Analyze Content & SEO
    const contentAnalyzer = new ContentAnalyzer();
    const seoAnalyzer = new SEOAnalyzer(config.rules);
    const results = [];

    for (const route of routes) {
        if (route.type === 'dynamic') continue; // Skip dynamic for basic static content analysis for now

        const metrics = contentAnalyzer.analyze(route.filePath);
        const result = seoAnalyzer.analyze(route.path, metrics);
        results.push(result);
    }

    // 5. Generate Report
    const reporter = new ReportGenerator();
    const reportMd = reporter.generateMarkdown(results);

    if (!options.reportOnly) {
        // In a real run, meta generator would write files here.
        // But based on the prompt, 'analyze' primarily outputs a report, 
        // 'generate' (which we might not explicit have as CLI command yet, 
        // but 'meta-generator' class exists) would produce code.
        // The user request implied 'analyze' does the analysis and reporting.
        // 'Output' was described as "export const metadata" etc. which implies code generation.
        // For this step, let's stick to Reporting as primary output of 'analyze'.
    }

    console.log('\n' + reportMd);

    // Write report file
    fs.writeFileSync(path.join(rootPath, 'seo-report.md'), reportMd);
    console.log(chalk.green(`\n📝 Report saved to seo-report.md`));

    // 6. Exit Codes
    const hasErrors = results.some(r => r.issues.some(i => i.severity === 'error'));
    const hasWarnings = results.some(r => r.issues.some(i => i.severity === 'warning'));

    let exitCode = 0;
    if (options.failOn === 'error' && hasErrors) exitCode = 2;
    else if (options.failOn === 'warning' && (hasWarnings || hasErrors)) exitCode = 1;
    // Standard logic from user request:
    // 0 -> OK
    // 1 -> Warning threshold (if not failing on error only, but standard practice usually 0 for success)
    // User asked: "0 -> OK, 1 -> Warning threshold, 2 -> Error threshold"

    // Adjusted logic to match user request strictly:
    if (hasErrors) exitCode = 2;
    else if (hasWarnings) exitCode = 1;
    else exitCode = 0;

    // However, if failOn is NOT set, we might want to return 0 even if warnings?
    // User: "CI entegrasyonunda çok kritik." -> implied strictness.
    // "seo-meta-engine analyze --fail-on=error" -> implies conditional exit.

    if (options.failOn === 'error') {
        if (hasErrors) process.exit(2);
        process.exit(0);
    } else if (options.failOn === 'all' || options.failOn === 'warning') {
        if (hasErrors) process.exit(2);
        if (hasWarnings) process.exit(1);
        process.exit(0);
    } else {
        // Default behavior: report status via exit code?
        // Usually CLI tools return 0 unless fatal or requested to fail.
        // But user explicitly defined 0/1/2 mapping.
        // Let's respect that mapping generally, but maybe only fail strictly if requested?
        // Actually, let's return the code that represents the state.
        process.exit(exitCode);
    }
}

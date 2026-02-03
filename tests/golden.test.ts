import path from 'path';
import { ProjectDetector } from '../core/project-detector';
import { RouteScanner } from '../core/route-scanner';
import { ContentAnalyzer } from '../core/content-analyzer';
import { SEOAnalyzer } from '../core/seo-analyzer';
import { defaultConfig } from '../config/default-config';
import { SEOConfig } from '../config/schema';

describe('Golden Output Tests', () => {
    const rootPath = path.join(__dirname, 'fixtures', 'simple-project');

    test('Should analyze simple project and produce expected results', async () => {
        // 1. Detect
        const detector = new ProjectDetector(rootPath);
        const projectInfo = detector.detect();
        expect(projectInfo.framework).toBe('next');
        expect(projectInfo.routerRaw).toBe('app');

        // 2. Scan
        const scanner = new RouteScanner(rootPath);
        const routes = await scanner.scan();
        // Sort routes for consistency in snapshot
        routes.sort((a, b) => a.path.localeCompare(b.path));

        expect(routes.length).toBe(2);
        expect(routes[0].path).toBe('/');
        expect(routes[1].path).toBe('/about');

        // 3. Analyze
        const contentAnalyzer = new ContentAnalyzer();
        const seoAnalyzer = new SEOAnalyzer(defaultConfig.rules as any);

        const results = [];
        for (const route of routes) {
            const metrics = contentAnalyzer.analyze(route.filePath);
            const result = seoAnalyzer.analyze(route.path, metrics);
            results.push(result);
        }

        // Snapshot testing the results object basically verifies the "Golden Output"
        // We expect / to be good, and /about to have issues
        expect(results).toMatchSnapshot();
    });
});

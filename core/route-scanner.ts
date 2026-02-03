import { glob } from 'glob';
import fs from 'fs';
import path from 'path';
import { RouteInfo } from '../types';

export class RouteScanner {
    private rootPath: string;

    constructor(rootPath: string) {
        this.rootPath = rootPath;
    }

    public async scan(): Promise<RouteInfo[]> {
        const routes: RouteInfo[] = [];

        // Scan App Router
        const appRoutes = await this.scanAppRouter();
        routes.push(...appRoutes);

        // Scan Pages Router
        const pagesRoutes = await this.scanPagesRouter();
        routes.push(...pagesRoutes);

        return routes;
    }

    private async scanAppRouter(): Promise<RouteInfo[]> {
        const pattern = '**/{page,route}.{js,jsx,ts,tsx}';
        const appDir = this.resolveDir('app');

        if (!appDir) return [];

        const files = await glob(pattern, { cwd: appDir });

        return files.map(file => {
            const fullPath = path.join(appDir, file);
            // Remove /page.tsx or /route.ts to get the route path
            let routePath = '/' + path.dirname(file).split(path.sep).join('/');

            if (routePath === '/.') routePath = '/';

            // Handle Windows backslashes just in case
            routePath = routePath.replace(/\\/g, '/');

            return this.createRouteInfo(routePath, fullPath);
        });
    }

    private async scanPagesRouter(): Promise<RouteInfo[]> {
        const pattern = '**/*.{js,jsx,ts,tsx}';
        const pagesDir = this.resolveDir('pages');

        if (!pagesDir) return [];

        const files = await glob(pattern, { cwd: pagesDir, ignore: ['_app.*', '_document.*', 'api/**/*'] });

        return files.map(file => {
            const fullPath = path.join(pagesDir, file);
            let routePath = '/' + file.replace(/\.(js|jsx|ts|tsx)$/, '');

            // Handle index
            if (routePath.endsWith('/index')) {
                routePath = routePath.replace(/\/index$/, '') || '/';
            }

            routePath = routePath.replace(/\\/g, '/');

            return this.createRouteInfo(routePath, fullPath);
        });
    }

    private resolveDir(dirName: string): string | null {
        const srcDir = path.join(this.rootPath, 'src', dirName);
        const rootDir = path.join(this.rootPath, dirName);

        // Lazy require fs to avoid top-level import conflict if needed, 
        // or better just use the import from specific module if we had it.
        // simpler: just use require('fs').existsSync or top level import.
        // I already imported 'fs' nowhere in this file? Let's check imports.
        if (fs.existsSync(srcDir)) return srcDir;
        return fs.existsSync(rootDir) ? rootDir : null;
    }

    private createRouteInfo(routePath: string, filePath: string): RouteInfo {
        const isDynamic = /\[.*\]/.test(routePath);

        return {
            path: routePath,
            type: isDynamic ? 'dynamic' : 'static',
            isContentDependent: isDynamic,
            filePath
        };
    }
}

import fs from 'fs';
import path from 'path';
import { ProjectInfo } from '../types';

export class ProjectDetector {
    private rootPath: string;

    constructor(rootPath: string) {
        this.rootPath = rootPath;
    }

    public detect(): ProjectInfo {
        const packageJsonPath = path.join(this.rootPath, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            throw new Error(`No package.json found at ${this.rootPath}`);
        }

        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

        const isNext = !!dependencies.next;
        const isReact = !!dependencies.react;

        let framework: ProjectInfo['framework'] = 'unknown';
        if (isNext) framework = 'next';
        else if (isReact) framework = 'react';

        const routerRaw = this.detectRouter(framework);
        const hasI18n = this.detectI18n(dependencies);
        const isMonorepo = this.detectMonorepo();

        return {
            framework,
            routerRaw,
            hasI18n,
            isMonorepo,
            rootPath: this.rootPath
        };
    }

    private detectRouter(framework: string): ProjectInfo['routerRaw'] {
        if (framework !== 'next') return undefined;

        const appDir = path.join(this.rootPath, 'app');
        const srcAppDir = path.join(this.rootPath, 'src', 'app');
        const pagesDir = path.join(this.rootPath, 'pages');
        const srcPagesDir = path.join(this.rootPath, 'src', 'pages');

        // App Router takes precedence or coexistence
        if (fs.existsSync(appDir) || fs.existsSync(srcAppDir)) {
            // Could be mixed, but we mark as 'app' primarily if it exists, 
            // as our adapter will need to check per specific route anyway.
            // But purely for "project type", let's say 'app'.
            return 'app';
        }

        if (fs.existsSync(pagesDir) || fs.existsSync(srcPagesDir)) {
            return 'pages';
        }

        return undefined;
    }

    private detectI18n(dependencies: Record<string, string>): boolean {
        return !!(
            dependencies['next-i18next'] ||
            dependencies['react-i18next'] ||
            dependencies['next-intl']
        );
    }

    private detectMonorepo(): boolean {
        const indicators = [
            'turbo.json',
            'nx.json',
            'pnpm-workspace.yaml',
            'lerna.json'
        ];

        return indicators.some(file => fs.existsSync(path.join(this.rootPath, file)));
    }
}

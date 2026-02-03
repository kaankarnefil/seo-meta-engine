import { SEOConfig, SEORules } from '../config/schema';

export * from '../config/schema';

export interface RouteInfo {
    path: string;
    type: 'static' | 'dynamic';
    isContentDependent: boolean; // e.g. /blog/[slug] is dependent, /about is not
    filePath: string;
}

export interface AnalysisResult {
    route: string;
    score: number;
    issues: AnalysisIssue[];
}

export interface AnalysisIssue {
    rule: keyof SEORules;
    message: string;
    severity: 'warning' | 'error';
    value?: string | number;
}

export interface ProjectInfo {
    framework: 'next' | 'react' | 'unknown';
    routerRaw?: 'app' | 'pages';
    hasI18n: boolean;
    isMonorepo: boolean;
    rootPath: string;
}

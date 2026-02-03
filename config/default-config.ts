import { SEOConfig } from './schema';

export const defaultConfig: Partial<SEOConfig> = {
    locale: 'en-US',
    rules: {
        titleLength: {
            enabled: true,
            severity: 'warning',
            min: 40,
            max: 60, // Google typically truncates after 60
        },
        descriptionLength: {
            enabled: true,
            severity: 'warning',
            min: 120,
            max: 160, // Optimal for snippet
        },
        hasH1: {
            enabled: true,
            severity: 'error', // H1 is critical
        },
        noDuplicateTitle: {
            enabled: true,
            severity: 'error',
        },
        noDuplicateDescription: {
            enabled: true,
            severity: 'error',
        },
        canonicalExists: {
            enabled: true,
            severity: 'warning',
        },
        ogImageExists: {
            enabled: true,
            severity: 'warning',
        },
    },
    exclude: ['/api/**/*', '/_next/**/*'],
};

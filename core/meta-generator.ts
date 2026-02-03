import { SEOConfig } from '../config/schema';

export interface GeneratedMeta {
    title: string;
    description: string;
    canonical: string;
    openGraph: {
        title: string;
        description: string;
        url: string;
        siteName: string;
        images: Array<{ url: string; width?: number; height?: number; alt?: string }>;
        locale: string;
        type: string;
    };
    twitter: {
        card: string;
        site?: string;
        creator?: string;
    };
}

export class MetaGenerator {
    private config: SEOConfig;

    constructor(config: SEOConfig) {
        this.config = config;
    }

    public generate(route: string, pageTitle?: string, pageDesc?: string): GeneratedMeta {
        const title = this.formatTitle(pageTitle || this.config.defaultTitle || '');
        const description = pageDesc || this.config.defaultDescription || '';
        const canonical = `${this.config.baseUrl}${route === '/' ? '' : route}`;

        return {
            title,
            description,
            canonical,
            openGraph: {
                title,
                description,
                url: canonical,
                siteName: this.config.siteName,
                images: this.config.defaultImage ? [{ url: this.config.defaultImage }] : [],
                locale: this.config.locale,
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                site: this.config.twitterHandle,
                creator: this.config.twitterHandle // Assuming creator is same as site for now
            }
        };
    }

    private formatTitle(rawTitle: string): string {
        if (!rawTitle) return this.config.siteName;
        if (rawTitle.includes(this.config.siteName)) return rawTitle;
        return `${rawTitle} | ${this.config.siteName}`;
    }
}

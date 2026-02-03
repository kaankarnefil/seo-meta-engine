import { GeneratedMeta } from '../core/meta-generator';

export interface PageSeoProps {
    title: string;
    description: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    ogUrl: string;
    ogImage: string;
}

export function createPageSeoProps(meta: GeneratedMeta): PageSeoProps {
    return {
        title: meta.title,
        description: meta.description,
        canonical: meta.canonical,
        ogTitle: meta.openGraph.title,
        ogDescription: meta.openGraph.description,
        ogUrl: meta.openGraph.url,
        ogImage: meta.openGraph.images[0]?.url || '',
    };
}

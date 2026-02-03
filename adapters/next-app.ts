import { Metadata } from 'next';
import { GeneratedMeta } from '../core/meta-generator';

export function createNextMetadata(meta: GeneratedMeta): Metadata {
    return {
        title: meta.title,
        description: meta.description,
        alternates: {
            canonical: meta.canonical,
        },
        openGraph: {
            title: meta.openGraph.title,
            description: meta.openGraph.description,
            url: meta.openGraph.url,
            siteName: meta.openGraph.siteName,
            images: meta.openGraph.images,
            locale: meta.openGraph.locale,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            site: meta.twitter.site,
            creator: meta.twitter.creator,
        },
    };
}

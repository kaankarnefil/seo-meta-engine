import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { defaultConfig } from '../../config/default-config';

export function initCommand() {
    const configPath = path.join(process.cwd(), 'seo.config.ts');

    if (fs.existsSync(configPath)) {
        console.log(chalk.yellow('⚠️ seo.config.ts already exists.'));
        return;
    }

    const configContent = `import { SEOConfig } from 'seo-meta-engine/types';

export const config: Partial<SEOConfig> = ${JSON.stringify(defaultConfig, null, 2)};
`;

    // Actually, we want to write a TS file that imports types.
    // The above JSON.stringify might lose function references if we had any, 
    // but our schema is currently data-only.
    // Let's make it cleaner.

    const template = `import { SEOConfig } from 'seo-meta-engine';

export const config: Partial<SEOConfig> = {
  siteName: "My Awesome App",
  baseUrl: "https://example.com",
  locale: "en-US",
  rules: {
    titleLength: { enabled: true, min: 40, max: 60, severity: 'warning' },
    descriptionLength: { enabled: true, min: 120, max: 160, severity: 'warning' },
    hasH1: { enabled: true, severity: 'error' },
    noDuplicateTitle: { enabled: true, severity: 'error' },
    noDuplicateDescription: { enabled: true, severity: 'error' }
  }
};
`;

    fs.writeFileSync(configPath, template);
    console.log(chalk.green('✅ Created seo.config.ts. Edit it to match your project details.'));
}

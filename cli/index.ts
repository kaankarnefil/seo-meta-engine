#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init';
import { analyzeCommand } from './commands/analyze';
import chalk from 'chalk';

const program = new Command();

program
    .name('seo-meta-engine')
    .description('Framework-aware, opinionated SEO engine for Next.js and React apps.')
    .version('0.1.0');

program
    .command('init')
    .description('Initialize SEO Meta Engine config')
    .action(initCommand);

program
    .command('analyze')
    .description('Analyze project for SEO issues')
    .option('--fail-on <level>', 'Fail on "error" or "warning"', 'error')
    .option('--report-only', 'Do not modify files, only generate report', false)
    .action((options) => {
        analyzeCommand(options);
    });

program.parse(process.argv);

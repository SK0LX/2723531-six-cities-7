#!/usr/bin/env node
import { CLIApplication, GenerateCommand, HelpCommand, ImportCommand, VersionCommand } from './cli/index.js';

async function bootstrap(): Promise<void> {
  const cliApplication = new CLIApplication();
  cliApplication.registerCommand([
    new HelpCommand(),
    new VersionCommand(),
    new ImportCommand(),
    new GenerateCommand()
  ]);

  await cliApplication.provideCommand(process.argv);
}

await bootstrap();

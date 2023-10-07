import CLIApplication from './app/cli.js';
import HelpCommand from './commands/help.js';
import VersionCommand from './commands/version.js';
import ImportCommand from './commands/import.js';
import GenerateCommand from './commands/generate.js';

const cliApplication = new CLIApplication();
cliApplication.registerCommands([new HelpCommand, new VersionCommand, new ImportCommand, new GenerateCommand]);
cliApplication.processCommand(process.argv);

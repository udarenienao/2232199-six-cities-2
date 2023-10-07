import CLIApplication from './app/cli.js';
import HelpCommand from './commands/help.js';
import VersionCommand from './commands/version.js';
import ImportCommand from './commands/import.js';

const cliApplication = new CLIApplication();
cliApplication.registerCommands([new HelpCommand, new VersionCommand, new ImportCommand]);
cliApplication.processCommand(process.argv);
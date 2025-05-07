import { writeFileSync } from 'fs';
import { xmindToMarkdown } from '.';

const args = process.argv.slice(2);

const help = `
Usage: xmind-md [options] <file.xmind>

Options:
  -h, --help       Show this help message and exit
  -o, --output     Specify the output file (default: output.md)
  -v, --version    Show version information and exit

Example:
  xmind-md example.xmind -o example.md
`;

if (args.some((arg) => arg === '-h' || arg === '--help')) {
  console.log(help);
  process.exit(0);
}

if (args.some((arg) => arg === '-v' || arg === '--version')) {
  const { version } = require('../package.json');
  console.log(`version ${version}`);
  process.exit(0);
}

const inputFile = args.find((arg) => arg.endsWith('.xmind'));
const outputFile =
  args.join(' ').match(/-o|--output\s+(\S+)/)?.[1] || 'output.md';

if (!inputFile) {
  console.log(help);
  process.exit(1);
}

xmindToMarkdown(inputFile)
  .then((markdown) => {
    writeFileSync(outputFile, markdown, 'utf-8');
    console.log(`Markdown file created: ${outputFile}`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

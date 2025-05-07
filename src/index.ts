import { readFile } from 'fs/promises';
import JSZip from 'jszip';
import type { XMindTopic, Topic } from './types';

/**
 * Convert XMind topic to Markdown format
 * @param topic - The topic to process
 * @param level - The current level of the topic in the hierarchy
 */
function processTopic(topic: Topic, level: number): string {
  if (!topic) return '';

  let result = '';

  if (level <= 3) {
    result += `${'#'.repeat(level)} ${topic.title}\n\n`;
  } else {
    result += `${'  '.repeat(level - 4)}- ${topic.title}\n`;
  }

  topic.children?.attached?.forEach((child) => {
    result += processTopic(child, level + 1);
  });

  return result;
}

/**
 * Convert XMind file to Markdown format
 * @param filePath - The path to the XMind file
 */
export const xmindToMarkdown = async (filePath: string): Promise<string> => {
  const file = await readFile(filePath);
  const zip = await JSZip.loadAsync(file);
  const content = await zip.file('content.json')?.async('string');

  if (!content) {
    throw new Error('No content.json found in the XMind file');
  }

  let markdown = '';

  try {
    const rootTopicList = (JSON.parse(content) || []) as XMindTopic[];
    rootTopicList.forEach((root) => {
      markdown += `${processTopic(root.rootTopic, 1)}\n\n`;
    });
  } catch (err) {
    throw new Error('Failed to parse content.json in the XMind file');
  }

  return markdown;
};

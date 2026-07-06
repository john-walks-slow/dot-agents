#!/usr/bin/env node
/**
 * postToolUse (Write | StrReplace) — remind agent when edits mention migrate/deprecated.
 */
import { readFileSync } from 'node:fs';

const PATTERN = /migrate|migration|deprecated/i;

const input = JSON.parse(readFileSync(0, 'utf8').replace(/^\uFEFF/, ''));
const { tool_name, tool_input } = input;

if (tool_name !== 'Write' && tool_name !== 'StrReplace') {
  console.log('{}');
  process.exit(0);
}

const snippet =
  tool_name === 'Write' ? (tool_input?.contents ?? '') : (tool_input?.new_string ?? '');

if (!PATTERN.test(snippet)) {
  console.log('{}');
  process.exit(0);
}

const rel = (tool_input?.path ?? 'file').replace(/\\/g, '/');
const msg =
  `Compatibility reminder for \`${rel}\`: the edit mentions migrate/migration/deprecated. ` +
  'This project is in active internal development with no public users — compatibility measures ' +
  '(migrations, deprecation shims, backward-compat layers) are generally unnecessary unless the user explicitly asks.';

console.log(JSON.stringify({ additional_context: msg }));
process.exit(0);

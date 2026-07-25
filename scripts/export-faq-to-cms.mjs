#!/usr/bin/env node
/**
 * Converts the legacy FAQ `categories` literal into an idempotent CMS SQL patch.
 * Run after editing the static FAQ: node scripts/export-faq-to-cms.mjs > /tmp/faq-migration.sql
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

let source = fs.readFileSync(new URL('../app/pages/faq/index.vue', import.meta.url), 'utf8');
if (!source.includes('const categories =')) {
  try { source = execFileSync('git', ['show', 'HEAD:app/pages/faq/index.vue'], { encoding: 'utf8' }); } catch { /* source was not committed; caller should provide the legacy file */ }
}
const start = source.indexOf('const categories =');
if (start < 0) throw new Error('categories literal not found');
const expressionStart = source.indexOf('[', start);
let depth = 0; let quote = null; let escaped = false; let end = -1;
for (let i = expressionStart; i < source.length; i += 1) {
  const char = source[i];
  if (quote) { if (escaped) escaped = false; else if (char === '\\') escaped = true; else if (char === quote) quote = null; continue; }
  if (char === "'" || char === '"' || char === '`') { quote = char; continue; }
  if (char === '[') depth += 1;
  if (char === ']') { depth -= 1; if (depth === 0) { end = i + 1; break; } }
}
if (end < 0) throw new Error('categories literal is not balanced');
const context = {}; Function('context', `with (context) { context.categories = ${source.slice(expressionStart, end)} }`)(context);
const sql = (value) => `'${String(value ?? '').replaceAll('\\', '\\\\').replaceAll("'", "''").replaceAll('\n', '\\n')}'`;
const markdown = (article) => article.sections.map((section) => `## ${section.title}\n\n${(section.paragraphs || []).join('\n\n')}${section.items ? `\n\n${section.items.map((item) => `- **${item.title}**：${item.description}`).join('\n')}` : ''}${section.callout ? `\n\n> **${section.callout.title}**：${section.callout.content}` : ''}`).join('\n\n');
const htmlEscape = (value) => String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const renderedHtml = (article) => article.sections.map((section) => `<h2 id="${htmlEscape(section.id)}">${htmlEscape(section.title)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${htmlEscape(paragraph)}</p>`).join('')}${section.items ? `<ul>${section.items.map((item) => `<li><strong>${htmlEscape(item.title)}</strong> ${htmlEscape(item.description)}</li>`).join('')}</ul>` : ''}${section.callout ? `<blockquote><strong>${htmlEscape(section.callout.title)}</strong><p>${htmlEscape(section.callout.content)}</p></blockquote>` : ''}`).join('');
const rows = [];
for (const [categoryIndex, category] of context.categories.entries()) {
  const categorySort = `legacy-${String(categoryIndex + 1).padStart(3, '0')}`;
  const categoryOrder = (categoryIndex + 1) * 10;
  rows.push(`INSERT INTO cms_doc_navigation_node (parent_id, node_type, materialized_path, depth, sort_key, sort_order, create_time, update_time, deleted) SELECT 0, 'DIRECTORY', '/', 0, ${sql(categorySort)}, ${categoryOrder}, NOW(), NOW(), 0 WHERE NOT EXISTS (SELECT 1 FROM cms_doc_navigation_node WHERE parent_id=0 AND node_type='DIRECTORY' AND sort_key=${sql(categorySort)} AND deleted=0);`);
  rows.push(`SET @faq_category_id = (SELECT id FROM cms_doc_navigation_node WHERE parent_id=0 AND node_type='DIRECTORY' AND sort_key=${sql(categorySort)} AND deleted=0 LIMIT 1);`);
  rows.push("UPDATE cms_doc_navigation_node SET materialized_path=CONCAT('/', id, '/') WHERE id=@faq_category_id;");
  rows.push(`INSERT INTO cms_doc_navigation_node_i18n (node_id, locale, label, visible, label_override, create_time, update_time, deleted) SELECT @faq_category_id, 'zh-CN', ${sql(category.name)}, 1, 0, NOW(), NOW(), 0 WHERE NOT EXISTS (SELECT 1 FROM cms_doc_navigation_node_i18n WHERE node_id=@faq_category_id AND locale='zh-CN' AND deleted=0);`);
  for (const [articleIndex, article] of category.articles.entries()) {
  const key = article.id;
  const articleOrder = (articleIndex + 1) * 10;
  const body = markdown(article);
  const html = renderedHtml(article);
  const plain = article.sections.flatMap((section) => [section.title, ...(section.paragraphs || []), ...(section.items || []).flatMap((item) => [item.title, item.description]), ...(section.callout ? [section.callout.title, section.callout.content] : [])]).join(' ');
  const toc = JSON.stringify(article.sections.map((section) => ({ level: 2, title: section.title, id: section.id })));
  rows.push(`INSERT INTO cms_content (channel_id, navigation_node_id, content_key, content_type, global_status, sort_order, create_time, update_time, deleted) SELECT id, @faq_category_id, ${sql(key)}, 'FAQ', 'ACTIVE', ${articleOrder}, NOW(), NOW(), 0 FROM cms_channel WHERE channel_key='HELP' AND deleted=0 AND NOT EXISTS (SELECT 1 FROM cms_content WHERE content_key=${sql(key)} AND deleted=0);`);
  rows.push(`INSERT INTO cms_content_translation (content_id, locale, title, summary, markdown_source, rendered_html, plain_text, toc_json, status, content_version, published_at, create_time, update_time, deleted) SELECT id, 'zh-CN', ${sql(article.title)}, ${sql(article.summary)}, ${sql(body)}, ${sql(html)}, ${sql(plain)}, ${sql(toc)}, 'PUBLISHED', 1, NOW(), NOW(), NOW(), 0 FROM cms_content WHERE content_key=${sql(key)} AND deleted=0 AND NOT EXISTS (SELECT 1 FROM cms_content_translation WHERE content_id=cms_content.id AND locale='zh-CN' AND deleted=0);`);
  rows.push(`INSERT INTO cms_content_translation (content_id, locale, title, summary, markdown_source, status, content_version, create_time, update_time, deleted) SELECT id, 'en-US', ${sql(article.title)}, ${sql(article.summary)}, ${sql(body)}, 'DRAFT', 0, NOW(), NOW(), 0 FROM cms_content WHERE content_key=${sql(key)} AND deleted=0 AND NOT EXISTS (SELECT 1 FROM cms_content_translation WHERE content_id=cms_content.id AND locale='en-US' AND deleted=0);`);
  rows.push(`SET @faq_content_id = (SELECT id FROM cms_content WHERE content_key=${sql(key)} AND deleted=0 LIMIT 1);`);
  rows.push(`UPDATE cms_content SET navigation_node_id=@faq_category_id, sort_order=${articleOrder}, update_time=NOW() WHERE id=@faq_content_id AND deleted=0;`);
  }
}
process.stdout.write(`-- Generated from app/pages/faq/index.vue. Review English drafts before enabling en-US.\nSTART TRANSACTION;\n${rows.join('\n')}\nCOMMIT;\n`);

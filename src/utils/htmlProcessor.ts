// src/utils/htmlProcessor.ts

import { VFile } from 'vfile';
import { unified } from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { toString } from 'hast-util-to-string';
import type { Element, Root } from 'hast';

// TOCの項目を定義する型
export type TocItem = {
  text: string;
  id: string;
  level: number;
};

/**
 * HTML文字列内の`<table>`タグを`<div class="table-container">`で囲む関数
 * @param html The HTML string to be processed.
 * @returns The processed HTML string.
 */
export const wrapTablesWithDiv = (html: string): string => {
  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(() => (tree: Root) => {
      // 親ノードの型を Element ノードとして明示
      visit(tree, 'element', (node, index, parent) => {
        if (node.tagName === 'table') {
          const wrapperNode: Element = {
            type: 'element',
            tagName: 'div',
            properties: { className: ['table-container'] },
            children: [node],
          };

          // 親ノードの children プロパティが配列であることを確認
          if (parent && parent.children && index !== undefined) {
            parent.children.splice(index, 1, wrapperNode);
          }
        }
      });
    })
    .use(rehypeStringify);

  const processedHtml = processor.processSync(new VFile(html));
  return String(processedHtml);
};

/**
 * HTMLから見出し（h2-h6）を抽出し、IDを付与する関数
 * @param html The HTML string to be processed.
 * @returns An object containing the processed HTML and a list of table of contents items.
 */
export const processHeadings = (html: string): { processedHtml: string; toc: TocItem[] } => {
  const toc: TocItem[] = [];
  let headingCount = 0; // IDのユニークさを保つためのカウンター

  const processor = unified()
    .use(rehypeParse, { fragment: true })
    .use(() => (tree: Root) => {
      // 見出しノードを巡回
      visit(tree, 'element', (node) => {
        if (node.tagName.match(/^h[2-6]$/)) {
          const level = parseInt(node.tagName.substring(1), 10);
          const text = toString(node); // 見出しのテキストを取得
          const id = `heading-${headingCount++}`; // ユニークなIDを生成

          // ノードにIDを追加
          node.properties.id = id;

          // TOCリストに追加
          toc.push({ text, id, level });
        }
      });
    })
    .use(rehypeStringify);

  const processedHtml = processor.processSync(new VFile(html));

  return {
    processedHtml: String(processedHtml),
    toc,
  };
};

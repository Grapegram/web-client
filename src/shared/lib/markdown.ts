import MarkdownIt from 'markdown-it';
//@ts-expect-error markdown-it-underline has no type declarations
import underline from 'markdown-it-underline';
import hljs from 'highlight.js';

/* eslint-disable @typescript-eslint/no-explicit-any */
function improveInlineParagraph(md: any) {
  const defaultRender =
    md.renderer.rules.text || ((tokens: any, idx: any) => tokens[idx].content);

  md.renderer.rules.text = (
    tokens: any,
    idx: any,
    options: any,
    env: any,
    self: any
  ) => {
    return defaultRender(tokens, idx, options, env, self)
      .replace(/ /g, '&nbsp;')
      .replace(/\n/g, '<br>');
  };

  md.renderer.rules.paragraph_open = (
    tokens: any,
    idx: any,
    options: any,
    env: any,
    self: any
  ) => {
    let result = '';
    if (idx > 1) {
      const inline = tokens[idx - 2];
      const paragraph = tokens[idx];
      if (
        inline.type === 'inline' &&
        inline.map &&
        inline.map[1] &&
        paragraph.map &&
        paragraph.map[0]
      ) {
        const diff = paragraph.map[0] - inline.map[1] + 1;
        if (diff > 0) {
          result = '<br>'.repeat(diff);
        }
      }
    }
    return result;
  };

  // md.renderer.rules.paragraph_open = function () {
  //   return '';
  // };
  md.renderer.rules.paragraph_close = function () {
    return '';
  };
}

function createInlineMarkdownConvertor() {
  const options = {
    breaks: false,
    html: true,
    linkify: true,
    preset: 'zero',
    typographer: false,
    xhtmlOut: false,
    highlight: (str: any, lang: any): any => {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre><code class="hljs">' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true })
              .value +
            '</code></pre>'
          );
        } catch (__) {}
      }
      return (
        '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
      );
    }
  };

  const md = new MarkdownIt(options);
  md.configure({
    components: {
      core: {
        rules: ['block', 'inline', 'linkify']
      },
      block: {
        rules: ['paragraph', 'fence', 'code']
      },
      inline: {
        rules: [
          'backticks',
          'strikethrough',
          'autolink',
          'emphasis',
          'link',
          'linkify'
        ]
      }
    }
  } as any)
    .use(underline)
    .use(improveInlineParagraph);

  return md;
}

export const inlineMarkdown = createInlineMarkdownConvertor();
/* eslint-enable @typescript-eslint/no-explicit-any */

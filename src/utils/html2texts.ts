import dayjs from 'dayjs';
import parser from 'posthtml-parser';

const html2texts = (html: string) => {
  const texts: any[] = [];
  const tree = parser(html);

  const transform = (node: any, paths = '') => {
    const isStyle = node.tag === 'style';
    const isScript = node.tag === 'script';
    if (isStyle || isScript) {return;};

    const { placeholder } = node.attrs || {};
    const hasPlaceholder = !!placeholder;
    if (hasPlaceholder) {
      transform(placeholder, `${paths}.attrs.placeholder`);
      return;
    }

    const hasContent = !!node.content;
    if (hasContent) {
      node.content.forEach((item: any, index: number) => {
        transform(item, `${paths}.content[${index}]`);
      });
      return;
    }

    const isString = typeof node === 'string';

    if (!isString) {
      return;
    }

    const text = node.replace(/\s+/g, ' ').trim();

    const isEmpty = () => !text;
    const isDOCTYPE = () => !!text.match(/<!DOCTYPE/);
    const isComment = () => !!text.match(/<!--/);
    const isNumber = () => !isNaN(Number(text));
    const isDate = () => dayjs(text).isValid();
    const isDivider = () => text === '|';

    if (
      isEmpty() ||
      isDOCTYPE() ||
      isComment() ||
      isNumber() ||
      isDate() ||
      isDivider()
    ) {
      return;
    }

    texts.push({ paths, text });
  };

  tree.forEach((item: any, index: number) => transform(item, `[${index}]`));

  return { tree, texts };
};

export default html2texts;

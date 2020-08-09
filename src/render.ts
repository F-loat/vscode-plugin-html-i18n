import * as vscode from 'vscode';
const set = require('lodash.set');
const render = require('posthtml-render');
const html2texts = require('./utils/html2texts');

export class HtmlI18nRender {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HtmlI18nRender.viewType, async (uri: vscode.Uri) => {
      const htmlUri = vscode.Uri.parse(uri.path.replace(/\.json?$/, '.html'));
      const outputUri = vscode.Uri.parse(uri.path.replace(/\.json?$/, '-translated.html'));
      const html = await vscode.workspace.fs.readFile(htmlUri);
      const json = await vscode.workspace.fs.readFile(uri);
      const texts = JSON.parse(String(json));
      const { texts: originTexts, tree } = html2texts(html);

      originTexts.forEach((item: { paths: string }, index: number) => {
        set(tree, item.paths, texts[index].local);
      });

      const newHtml = render(tree);

      await vscode.workspace.fs.writeFile(outputUri, Buffer.from(newHtml));

      vscode.window.showInformationMessage('还原 HTML 文件成功');
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.render';
}

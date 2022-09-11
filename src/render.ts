import * as vscode from 'vscode';
import set from 'lodash.set';
import render from 'posthtml-render';
import html2texts from './utils/html2texts';
import file2texts from './utils/file2texts';

export class HTMLI18nRender {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HTMLI18nRender.viewType, async (uri: vscode.Uri) => {
      const htmlUri = vscode.Uri.parse(uri.path.replace(/\.json?$/, '.html'));
      const outputUri = vscode.Uri.parse(uri.path.replace(/\.json?$/, '-translated.html'));

      try {
        await vscode.workspace.fs.stat(htmlUri);
      } catch {
        vscode.window.showInformationMessage('原始 HTML 文件读取失败');
      }

      try {
        const html = String(await vscode.workspace.fs.readFile(htmlUri));
        const texts = await file2texts(uri);
        const { texts: originTexts, tree } = html2texts(html);

        originTexts.forEach((item: { paths: string }, index: number) => {
          set(tree, item.paths, texts[index]?.local);
        });

        const newHTML = render(tree);

        await vscode.workspace.fs.writeFile(outputUri, Buffer.from(newHTML));

        vscode.window.showTextDocument(outputUri);
        vscode.window.showInformationMessage('还原 HTML 文件成功');
      } catch (err) {
        vscode.window.showInformationMessage('还原 HTML 文件失败');
        err.message && vscode.window.showInformationMessage(err.message);
      }
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.render';
}

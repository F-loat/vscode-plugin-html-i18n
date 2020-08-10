import * as vscode from 'vscode';
import html2texts from './utils/html2texts';

export class HtmlI18nParse {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HtmlI18nParse.viewType, async (uri: vscode.Uri) => {
      const html = await vscode.workspace.fs.readFile(uri);
      const { texts } = html2texts(String(html));
      const localTexts = texts.map(({ text }: { text: string }) => {
        return { origin: text, local: '' };
      });
      await vscode.workspace.fs.writeFile(
        vscode.Uri.parse(uri.path.replace(/\.html?$/, '.json')),
        Buffer.from(JSON.stringify(localTexts, null, 2))
      );
      vscode.window.showInformationMessage('生成 JSON 文件成功，翻译后可右键进行还原');
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.parse';
}

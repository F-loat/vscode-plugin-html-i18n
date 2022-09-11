import * as vscode from 'vscode';
import html2texts from './utils/html2texts';

export class HTMLI18nParse {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HTMLI18nParse.viewType, async (uri: vscode.Uri) => {
      const html = await vscode.workspace.fs.readFile(uri);
      const { texts } = html2texts(String(html));
      const localTexts = texts.reduce((result: Record<string, string>, { text }: { text: string }) => {
        return { ...result, [text]: '' };
      }, {});

      const outputUri = vscode.Uri.parse(uri.path.replace(/\.html?$/, '.json'));
      await vscode.workspace.fs.writeFile(
        outputUri,
        Buffer.from(JSON.stringify(localTexts, null, 2))
      );

      vscode.window.showTextDocument(outputUri);
      vscode.window.showInformationMessage('生成 JSON 文件成功，翻译后可右键进行还原');
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.parse';
}

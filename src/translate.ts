import * as vscode from 'vscode';
const fanyi = require('./utils/fanyi');

const options = {
  to: 'zh',
  number: 50
};

export class HtmlI18nTranslate {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HtmlI18nTranslate.viewType, async (uri: vscode.Uri) => {
      const texts = JSON.parse(String(await vscode.workspace.fs.readFile(uri)));
      const total = texts.length;
      const transMap = new Map();

      const writeFile = async (data: any) => {
        await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify(data, null, 2)));
        vscode.window.showInformationMessage('JSON 文件已更新');
      };

      async function translation(index: number) {
        if (index <= texts.length) {
          const current = texts[index - 1];
          const { origin, local } = current;

          if (local) {
            transMap.set(origin, local);
            translation(index + 1);
            return;
          }

          const hasLocal = transMap.get(origin);

          if (hasLocal) {
            current.local = hasLocal;
            translation(index + 1);
          } else {
            current.local = await fanyi(origin, options.to);
            transMap.set(origin, current.local);
            setTimeout(() => translation(index + 1), 1000);
          }

          vscode.window.showInformationMessage(`${index}/${total} ${origin} -> ${current.local}`);
        } else {
          writeFile(texts);
        }

        const { number } = options;
        if (!(index % number)) {writeFile(texts);};
      }

      translation(1);
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.translate';
}

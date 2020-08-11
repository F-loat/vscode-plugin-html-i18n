import * as vscode from 'vscode';
import fanyi from '../utils/fanyi';
import language from './language.json';

const options: {
  to?: string;
  number: number;
} = {
  to: undefined,
  number: 50
};

async function writeFile(uri: vscode.Uri, data: any) {
  await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify(data, null, 2)));
  vscode.window.showInformationMessage('JSON 文件已更新');
};

export class HtmlI18nTranslate {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HtmlI18nTranslate.viewType, async (uri: vscode.Uri) => {
      const texts = JSON.parse(String(await vscode.workspace.fs.readFile(uri)));
      const total = texts.length;
      const transMap = new Map();

      options.to = await vscode.window.showQuickPick(language, {
        placeHolder: '请选择目标语言'
      }).then(item => item && item.description);

      if (!options.to) {
        vscode.window.showWarningMessage('请选择目标语言');
        return;
      }

      vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "自动翻译中",
        cancellable: true
      }, handleProcessTask);

      async function handleProcessTask (
        progress: vscode.Progress<{ increment?: number, message?: string}>,
        token: vscode.CancellationToken
      ) {
        const increment = 100 / texts.length;
        let cancelFlag = false;

        token.onCancellationRequested(() => {
          cancelFlag = true;
        });

        return new Promise(resolve => {
          translation(1);

          async function translation(index: number) {
            if (cancelFlag) {
              return resolve();
            }

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

              progress.report({ increment, message: `${index}/${total} ${origin} -> ${current.local}` });
            } else {
              writeFile(uri, texts);
              return resolve();
            }

            if (!(index % options.number)) {
              writeFile(uri, texts);
            };
          }
        });
      };
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.translate';
}

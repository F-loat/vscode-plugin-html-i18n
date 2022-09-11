import * as fs from 'fs';
import * as vscode from 'vscode';
import json2xls from 'json2xls';
import xls2json from 'convert-excel-to-json';
import file2texts from './utils/file2texts';

export class HTMLI18nConvertJson {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HTMLI18nConvertJson.viewType, async (uri: vscode.Uri) => {
      const json = await file2texts(uri);
      const xlsx = json2xls(json);

      fs.writeFileSync(uri.fsPath.replace(/\.json?$/, '.xlsx'), xlsx, 'binary');

      vscode.window.showInformationMessage('转换 Excel 文件成功，翻译后可右键进行还原');
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.convert2excel';
}

export class HTMLI18nConvertExcel {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HTMLI18nConvertExcel.viewType, async (uri: vscode.Uri) => {
      const json = xls2json({
        sourceFile: uri.path,
        columnToKey: {
          A: 'origin',
          B: 'local'
        }
      })['Sheet 1'];

      json.splice(0, 1);

      const texts = json.reduce((result: Record<string, string>, { local, origin }: { local: string; origin: string }) => {
        return { ...result, [origin]: local };
      }, {});

      const outputUri = vscode.Uri.parse(uri.path.replace(/\.xlsx?$/, '.json'));
      await vscode.workspace.fs.writeFile(
        outputUri,
        Buffer.from(JSON.stringify(texts, null, 2))
      );

      vscode.window.showTextDocument(outputUri);
      vscode.window.showInformationMessage('还原 JSON 文件成功');
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.convert2json';
}

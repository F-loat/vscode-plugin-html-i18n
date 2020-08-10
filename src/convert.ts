import * as fs from 'fs';
import * as vscode from 'vscode';
import json2xls from 'json2xls';
import xls2json from 'convert-excel-to-json';

export class HtmlI18nConvertJson {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HtmlI18nConvertJson.viewType, async (uri: vscode.Uri) => {
      const json = JSON.parse(String(await vscode.workspace.fs.readFile(uri)));
      const xlsx = json2xls(json);

      fs.writeFileSync(uri.fsPath.replace(/\.json?$/, '.xlsx'), xlsx, 'binary');

      vscode.window.showInformationMessage('转换 JSON 文件成功');
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.convert2excel';
}

export class HtmlI18nConvertExcel {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HtmlI18nConvertExcel.viewType, async (uri: vscode.Uri) => {
      const json = xls2json({
        sourceFile: uri.path,
        columnToKey: {
          A: 'origin',
          B: 'local'
        }
      })['Sheet 1'];

      json.splice(0, 1);

      await vscode.workspace.fs.writeFile(
        vscode.Uri.parse(uri.path.replace(/\.xlsx?$/, '.json')),
        Buffer.from(JSON.stringify(json, null, 2))
      );

      vscode.window.showInformationMessage('还原 Excel 文件成功');
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.convert2json';
}

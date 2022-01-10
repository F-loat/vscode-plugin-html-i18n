import * as vscode from 'vscode';
import parser from 'posthtml-parser';
import axios from 'axios';

export class HTMLI18nExport {
  public static register(): vscode.Disposable {
    return vscode.commands.registerCommand(HTMLI18nExport.viewType, async (uri: vscode.Uri) => {
      const html = await vscode.workspace.fs.readFile(uri);
      const tree = parser(String(html));
      const images: any[] = [];

      const parse = (item: any, index: number) => {
        if (item.tag === 'img') {
          images.push(item);
        }

        const hasContent = !!item.content;

        if (hasContent) {
          item.content.forEach(parse);
        }
      };

      tree.forEach(parse);

      images.forEach((image) => {
        const { src } = image.attrs;

        if (src) {
          const outputUri = vscode.Uri.parse(uri.path.replace(/\.html?$/, `/${src.replace(/https:?\/\/.*?\//, '')}`));
          axios({
            url: src,
            responseType: 'arraybuffer'
          }).then((res: any) => {
            vscode.workspace.fs.writeFile(
              outputUri,
              res.data,
            );
          });
        }
      });

      vscode.window.showInformationMessage('图片导出成功');
    });
  }

  private static readonly viewType = 'vscode-plugin-html-i18n.export';
}

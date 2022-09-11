import * as vscode from 'vscode';

const file2texts = async (uri: vscode.Uri) => {
  const textsObj = JSON.parse(String(await vscode.workspace.fs.readFile(uri)));
  return Object.entries(textsObj).map(([origin, local]) => ({ origin, local }))
}

export default file2texts;

import * as vscode from 'vscode';
import { HTMLI18nParse } from './parse';
import { HTMLI18nRender } from './render';
import { HTMLI18nTranslate } from './translate';
import { HTMLI18nConvertJson, HTMLI18nConvertExcel } from './convert';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(HTMLI18nParse.register());
  context.subscriptions.push(HTMLI18nRender.register());
  context.subscriptions.push(HTMLI18nTranslate.register());
  context.subscriptions.push(HTMLI18nConvertJson.register());
  context.subscriptions.push(HTMLI18nConvertExcel.register());
}

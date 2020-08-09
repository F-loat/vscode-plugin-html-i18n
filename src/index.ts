import * as vscode from 'vscode';
import { HtmlI18nParse } from './parse';
import { HtmlI18nRender } from './render';
import { HtmlI18nTranslate } from './translate';
import { HtmlI18nConvertJson, HtmlI18nConvertExcel } from './convert';

export function activate(context: vscode.ExtensionContext) {
  // Register our custom editor providers
  context.subscriptions.push(HtmlI18nParse.register());
  context.subscriptions.push(HtmlI18nRender.register());
  context.subscriptions.push(HtmlI18nTranslate.register());
  context.subscriptions.push(HtmlI18nConvertJson.register());
  context.subscriptions.push(HtmlI18nConvertExcel.register());
}

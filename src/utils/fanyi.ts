import axios from 'axios';
import SparkMD5 from 'spark-md5';
import * as vscode from 'vscode';

const appid = vscode.workspace.getConfiguration().get('vscode-plugin-html-i18n.baidu-appid');
const secret = vscode.workspace.getConfiguration().get('vscode-plugin-html-i18n.baidu-secret');

const fanyi = (word: string, to = 'zh') => {
  const encodeWord = encodeURIComponent(word);
  const salt = Date.now();
  const sign = SparkMD5.hash(`${appid}${word}${salt}${secret}`);
  const url = `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${encodeWord}&from=auto&to=${to}&appid=${appid}&salt=${salt}&sign=${sign}`;

  return axios(url, { timeout: 8000 })
    .then((res: any) => {
      const { trans_result = [] } = res.data;
      const firstResult = trans_result[0];
      return firstResult ? firstResult.dst : '';
    })
    .catch(() => {
      Promise.resolve('');
    });
};

export default fanyi;

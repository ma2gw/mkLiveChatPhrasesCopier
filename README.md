# mkLiveChatPhrasesCopier

## 概要
開いた配信のチャット欄の下に、  
チャンネルごとに設定した定型文をクリップボードにコピーするボタンを提供する
Tampermonkey スクリプトです。

弾幕やメンバーシップスタンプの組み合わせで使うことを想定。

<p align="center">
  <img src="images/overview.png" width="700">
</p>

## 使い方
Tampermonkey に適用後、**スクリプト内の配列を直接編集**して定型文を定義します。

---

### PHRASES_COMMON
全チャンネル共通で表示する定型文を定義します。

- `string`  
  → そのままコピーされるテキスト
- `[label, text]`  
  → ボタン表示名と、実際にコピーされるテキスト

---

### PHRASES_BY_CHANNEL
チャンネルごとの定型文を定義します。

- キー：チャンネルの **ハンドル名（@xxxx）**
- 値：`string` または `[label, text]` の配列  
- 配列の場合  
  - `[0]`：ボタン表示用テキスト  
  - `[1]`：クリップボードにコピーされるテキスト

```javascript
// 共通
const PHRASES_COMMON = [
    '👏👏👏👏👏👏',
    ['拍手', '👏👏👏👏👏👏'],
    ['👏', '👏👏👏👏👏👏'],
];

// チャンネル別
const PHRASES_BY_CHANNEL = {
    '@ExampleHogeFugaCh': [
        'こんHoge',
        'おつFuga',
        ['挨拶', 'こんHoge'],
    ],
};
```

## インストール方法
1. Tampermonkey をブラウザに導入します
2. `MkLiveChatPhrasesCopier.user.js` を開き、**Raw** ボタンをクリックします
3. Tampermonkey のインストール確認画面が表示されるので、インストールします

または、こちらから
[Install Script](https://raw.githubusercontent.com/ma2gw/mkLiveChatPhrasesCopier/main/mkLiveChatPhrasesCopier.user.js)


## 動作環境
2025/12/28 時点の YouTube の仕様で動作確認済み。  
仕様変更により動作しなくなる可能性があります。


## 改変・再配布について
本スクリプトは、改変・改良・再配布していただいて構いません。
（改変したら普通に使いたいので教えてくれたら喜びます…）
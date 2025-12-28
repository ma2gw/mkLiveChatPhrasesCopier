// ==UserScript==
// @name         MkLiveChatPhrasesCopier
// @namespace    https://github.com/ma2gw
// @description  One-click copy of phrases for each YouTube channel handle in live chat.
// @version      0.3
// @match        https://www.youtube.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Phraseにはstringかarrayを指定することができる
     * @typedef {string | [string, string]} Phrase
     *
     *  - string: ボタンに表示される & クリップボードにコピーされる
     *
     *  - [displayText, copyText]: 配列
     *      displayText → ボタンに表示される
     *      copyText    → クリップボードにコピーされる
     */

    /***************************************************/
    /* ここはハードコーディングで書き換え **************/
    /***************************************************/

    // 共通
    const PHRASES_COMMON = [
        '👏👏👏👏👏👏',
        ['拍手', '👏👏👏👏👏👏'],
        ['👏', '👏👏👏👏👏👏'],
    ];

    // チャンネル別
    const PHRASES_BY_CHANNEL = {
        '@usadapekora': [
            'こんぺこ',
        ],

        '@ExampleHogeFugaCh': [
            'こんHoge',
            'おつFuga',
            ['挨拶', 'こんHoge'],
        ],
    };

    /***************************************************/

    function getChannelHandle() {
        const ytdVideoOwnerRenderer = document.querySelector('ytd-video-owner-renderer');
        const a = ytdVideoOwnerRenderer?.querySelector('a.yt-simple-endpoint[href^="/@"]');
        return a ? a.getAttribute('href').slice(1) : null;
    }

    function createPanel() {
        if (document.getElementById('tm-phrase-panel')) return;

        const chatContainer = document.querySelector('div#chat-container');
        if (!chatContainer) return;

        const panel = document.createElement('div');
        panel.id = 'tm-phrase-panel';

        Object.assign(panel.style, {
            padding: '8px',
            background: '#111',
            color: '#fff',
            fontSize: '12px',
            borderTop: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
        });

        chatContainer.parentNode.insertBefore(panel, chatContainer.nextSibling);
    }

    function updatePanel() {
        const panel = document.getElementById('tm-phrase-panel');
        if (!panel) return;

        panel.innerHTML = '';

        const channelHandleRaw = getChannelHandle() ?? '(unknown)';
        const channelHandle = decodeURIComponent(channelHandleRaw);
        const channelPhrases = PHRASES_BY_CHANNEL[channelHandle] ?? [];

        console.log('[TM] channelHandle:', channelHandle);

        const phrases = [
            ...PHRASES_COMMON,
            ...channelPhrases
        ];

        const idLine = document.createElement('div');
        idLine.textContent = `Channel: ${channelHandle}`;
        idLine.style.fontFamily = 'monospace';
        panel.appendChild(idLine);

        if (phrases.length > 0) {
            const buttonRow = document.createElement('div');

            Object.assign(buttonRow.style, {
                display: 'inline-flex',
                flexWrap: 'wrap',
                gap: '6px'
            });

            phrases.forEach(text => {
                const displayText = Array.isArray(text) ? text[0] : text;
                const copyText = Array.isArray(text) ? text[1] : text;

                const btn = document.createElement('button');
                btn.textContent = displayText; // フルテキスト表示

                Object.assign(btn.style, {
                    padding: '4px 8px',
                    background: '#222',
                    color: '#fff',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                });

                btn.addEventListener('click', async () => {
                    await navigator.clipboard.writeText(copyText); // フルテキストコピー
                    flashCopied(btn);
                });

                buttonRow.appendChild(btn);
            });



            panel.appendChild(buttonRow);
        }
    }

    function flashCopied(btn) {
        const original = {
            background: btn.style.background,
            border: btn.style.border,
            color: btn.style.color
        };

        btn.style.background = '#2a7';
        btn.style.border = '1px solid #3d9';
        btn.style.color = '#fff';

        setTimeout(() => {
            Object.assign(btn.style, original);
        }, 600);
    }

    function onChannelChanged() {
        console.log('[TM] channel changed');
        createPanel();
        updatePanel();
    }

    let updateTimeout = null;
    function watchVideoOwnerRenderer() {
        const target = document.querySelector('ytd-video-owner-renderer');
        if (!target) return;

        const rendererObserver = new MutationObserver((mutations) => {
            for (const m of mutations) {
                if (m.type === 'attributes' || m.type === 'childList') {
                    if (updateTimeout) clearTimeout(updateTimeout);
                    updateTimeout = setTimeout(() => {
                        console.log('[TM] ytd-video-owner-renderer changed (debounced)');
                        onChannelChanged();
                    }, 150); // 150ms以内の連続変化はまとめる
                }
            }
        });

        rendererObserver.observe(target, {
            attributes: true,
            childList: true,
            subtree: true
        });
    }

    watchVideoOwnerRenderer();
    document.addEventListener('yt-page-data-updated', watchVideoOwnerRenderer);
    window.addEventListener('yt-navigate-finish', watchVideoOwnerRenderer);

})();

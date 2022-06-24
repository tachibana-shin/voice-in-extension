function onload() {
  const DEBUG = false;

  /* global chrome, console */
/* eslint-disable no-var, no-console, vars-on-top, no-param-reassign, no-shadow, block-scoped-var */
/* eslint-disable no-lonely-if */
  function consoleLog(...args) {
    if (DEBUG) console.log(...args);
  }
  // var extensionId = chrome.runtime.id;

  var target;

  var followedByCapitalLetter = ['.', '?', '!', '\n'];

  var pasteMode = false;

  /* eslint-disable */
  var plusEnabled = false;
  /* eslint-enable */

  var recognizing = false;

  var capsOn = false;

  var capsNext = false;

  var pageURL = '';

  var settingsLoaded = false;

  var changeCase = false;

  // const PASTEMODE_DOMAINS = ['www.facebook.com', 'm.facebook.com', 'discord.com',
  //   'www.reddit.com', 'web.whatsapp.com', 'www.messenger.com', 'meet.google.com',
  //   'www.linkedin.com', 'twitter.com', 'web.skype.com', 'outlook.live.com', 'mail.yahoo.com',
  //   'keep.google.com', 'quizlet.com', 'www.instagram.com', 'www.teamwork.com',
  //   'classroom.google.com', 'www.carousell.com.hk', 'hangouts.google.com', 'www.youtube.com',
  //   'www.ebility.com', 'www.notion.so', 'docs.google.com',
  //   'voice.google.com', 'twitch.tv', 'app.hubspot.com', 'provider.teladoc.com',
  //   'messages.google.com'];

  // Whitelist of sites where we let people use advancedMode for free.
  const whitelist = ['classroom.google.com', 'twitter.com', 'www.google.com', 'outlook.live.com',
    'docs.google.com', 'meet.google.com', 'translate.google.com', 'www.facebook.com', 'discord.com',
    'm.facebook.com', 'www.reddit.com', 'www.messenger.com', 'www.linkedin.com', 'quizlet.com',
    'www.teamwork.com', 'www.instagram.com', 'www.carousell.com.hk',
    'outlook.office.com', 'outlook.office365.com', 'web.whatsapp.com', 'dictanote.co', 'localhost:8000', 'mail.yahoo.com',
    'www.bing.com', 'twitch.tv', 'www.youtube.com'];

  // Global - captures current language.
  var lang = '';

  function gaLog(category, action, label, interaction = true) {
    consoleLog('VIGA', category, action, label);
    chrome.runtime.sendMessage({
      message_id: 'track',
      category,
      action,
      label,
      interaction,
    });
  }

  function getHost() {
    try {
      var url = new URL(pageURL);
      return url.host;
    } catch (error) {
      return 'unknown.com';
    }
  }

  function getPath() {
    try {
      var url = new URL(pageURL);
      return url.pathname;
    } catch (error) {
      return 'unknown.com';
    }
  }

  // If iframe - document.activeElement.contentWindow.document.activeElement
  function getActiveElement() {
    var elem = document.activeElement;

    if (!elem || elem.tagName === 'IFRAME') {
      return null;
    }

    return elem;
  }

  function getActiveDocument() {
    var elem = document.activeElement;
    if (!elem || elem.tagName === 'IFRAME') {
      return null;
    }

    return document;
  }

  function getActiveWindow() {
    var elem = document.activeElement;
    if (!elem || elem.tagName === 'IFRAME') {
      return null;
    }

    return window;
  }

  function checkTargetable() {
    var tgt = getActiveElement();
    var targetable = false;
    if (tgt) {
      // hasFocus is important here.
      // When we have multiple frames, one of the iframes might have a contenteditable X
      // that is active. However when we click out of the iframe, it still returns X
      // as active. This can lead to double typing.
      if ((tgt.nodeName === 'INPUT' || tgt.nodeName === 'TEXTAREA' || tgt.isContentEditable) && document.hasFocus()) {
        targetable = true;
      }
    }
    return { targetable, target: tgt };
  }

  let prevText = '';
  function insertText(textToInsert) {
    function capitalize(text) {
      return text.replace(/\S/, x => x.toUpperCase());
    }

    function needsCapitalization(prevText, followedByCapitalLetter) {
      for (var i = 0; i < followedByCapitalLetter.length; i += 1) {
        var c = followedByCapitalLetter[i];
        if (prevText.slice(prevText.length - c.length) === c) {
          return true;
        }
      }
      return false;
    }

    function getPrevText(target, lookback) {
      var res = '';
      switch (target.tagName) {
        case 'INPUT':
        case 'TEXTAREA':
          var val = target.value;
          var selEnd = target.selectionStart;
          var selStart = Math.max(0, selEnd - lookback);
          res = val.substring(selStart, selEnd);
          if (res.indexOf('\n') !== -1) {
            res = res.slice(res.lastIndexOf('\n') + 1);
          }
          break;
        case 'DIV':
        case 'P':
        default:
          var wndw = getActiveWindow();

          if (wndw && wndw.getSelection) {
            var range = wndw.getSelection().getRangeAt(0);
            if (!range.collapsed) {
              range.deleteContents();
            }

            // range.collapse
            // true collapses to start of range / false to end
            range.collapse(false);

            if (range.collapsed) {
              // We generate preview only for text node
              const inlineable = ['SPAN', 'FONT', 'B', 'I', 'U'];
              let leftSibling;
              let selStart;
              let selEnd;

              var container = range.startContainer;
              if (container.nodeType === 3) {
                selEnd = range.startOffset;
                if (selEnd - lookback > 0) {
                  selStart = selEnd - lookback;
                  res = container.textContent.substring(selStart, selEnd);
                } else {
                  // If font styling has been used or grammer help setup,
                  // then it is likely we may not get enough prev text
                  // Hope to previous sibling to get complete lookback
                  selStart = 0;
                  res = container.textContent.substring(selStart, selEnd);

                  if (container.previousSibling) {
                    leftSibling = container.previousSibling;
                    while (leftSibling.nodeType !== 3) {
                      if (leftSibling.nodeType === 1 &&
                        (inlineable.indexOf(leftSibling.nodeName) !== -1)) {
                        leftSibling = leftSibling.childNodes[leftSibling.childNodes.length - 1];
                      } else {
                        break;
                      }
                    }
                  }

                  if (leftSibling && leftSibling.nodeType === 3) {
                    var lookbackNeeded = lookback - selEnd;
                    selEnd = leftSibling.textContent.length;
                    selStart = Math.max(0, selEnd - lookbackNeeded);
                    res = leftSibling.textContent.substring(selStart, selEnd) + res;
                  }
                }
              } else if (/* container.nodeType != 3 && */ range.startOffset > 0) {
                leftSibling = container.childNodes[range.startOffset - 1];

                while (leftSibling.nodeType !== 3) {
                  if (leftSibling.nodeType === 1 &&
                    (inlineable.indexOf(leftSibling.nodeName) !== -1)) {
                    leftSibling = leftSibling.childNodes[leftSibling.childNodes.length - 1];
                  } else {
                    break;
                  }
                }

                if (leftSibling.nodeType === 3) {
                  selEnd = leftSibling.textContent.length;
                  selStart = Math.max(0, selEnd - lookback);
                  res = leftSibling.textContent.substring(selStart, selEnd);
                }
              }
            }
          }
      }

      return res;
    }

    function deletePreviousWord() {
      const inlineable = ['SPAN', 'FONT', 'B', 'I', 'U'];

      // Traverses the tree to get previous text node.
      function getPreviousTextNode(curNode) {
        let leftSibling = curNode.previousSibling;
        if (!leftSibling) {
          const parentNode = curNode.parentNode;
          if (inlineable.indexOf(parentNode.nodeName) !== -1) {
            return getPreviousTextNode(parentNode);
          }
          return null;
        }

        while (leftSibling.nodeType !== 3) {
          if (leftSibling.nodeType === 1 &&
            (inlineable.indexOf(leftSibling.nodeName) !== -1)) {
            leftSibling = leftSibling.childNodes[leftSibling.childNodes.length - 1];
          } else {
            break;
          }
        }

        if (leftSibling.nodeType === 3) {
          return leftSibling;
        }

        return null;
      }

      var wndw = getActiveWindow();

      if (wndw && wndw.getSelection) {
        var range = wndw.getSelection().getRangeAt(0);
        if (!range.collapsed) {
          range.deleteContents();
        }

        // range.collapse
        // true collapses to start of range / false to end
        range.collapse(false);

        if (range.collapsed) {
          var endContainer = range.startContainer;
          var endOffset = range.startOffset;

          var startContainer = endContainer;
          var startOffset = endOffset;
          var foundStart = false;

          if (startContainer.nodeType !== 3) {
            // Lets find a textNode to begin with.
            var firstTextNode;
            if (startOffset !== startContainer.childNodes.length) {
              firstTextNode = getPreviousTextNode(startContainer.childNodes[startOffset]);
            } else {
              // TODO: Is this correct ?
              firstTextNode = getPreviousTextNode(startContainer);
            }

            if (firstTextNode) {
              startContainer = firstTextNode;
              startOffset = firstTextNode.textContent.length;
            } else {
              foundStart = true;
            }
          }

          // The invariant in the below loop is that startContainer is always a textNode.
          while (!foundStart) {
            const val = startContainer.textContent;
            var selStart = val.lastIndexOf(' ', startOffset);

            if (selStart !== -1) {
              foundStart = true;
              startOffset = selStart;
              break;
            } else {
              var newContainer = getPreviousTextNode(startContainer);
              if (newContainer) {
                startContainer = newContainer;
                startOffset = newContainer.textContent.length;
              } else {
                startOffset = 0;
                foundStart = true;
                break;
              }
            }
          }

          const textRange = document.createRange();
          textRange.setStart(startContainer, startOffset);
          textRange.setEnd(endContainer, endOffset);
          textRange.deleteContents();

          // document.getSelection().removeAllRanges();
          // document.getSelection().addRange(textRange);
        }
      }
    }

    function adjustText(textToInsert, prevText) {
      var skipEdits = ['yue-Hant-HK', 'ja-JP', 'cmn-Hans-HK', 'cmn-Hans-CN'];
      if (skipEdits.indexOf(lang) === -1) {
        consoleLog(`prev text:"${prevText}"`);

        var endsWithSpace = prevText.length > 0 &&
          ['\n', ' ', String.fromCharCode(160)].indexOf(prevText[prevText.length - 1]) !== -1;
        prevText = prevText.trim();

        if (changeCase === 'ce') {
          // ce => capitalize all words
          // capitalize first charecter of each word
          textToInsert = textToInsert.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
        } else {
          // Check if we want to capitalize
          // Lowercase doesn't have to be capitalized
          // Uppercase is already capitalized
          var disableCapitalization = (changeCase === 'lc') || (changeCase === 'uc');
          if (!disableCapitalization && (needsCapitalization(prevText, followedByCapitalLetter) ||
              prevText.length === 0 ||
              prevText === '' ||
              prevText === undefined ||
              prevText === 'null')) {
            textToInsert = capitalize(textToInsert);
          }
  
          // I is capitalized only in English
          if (!disableCapitalization && lang.startsWith('en-')) {
            textToInsert = textToInsert.replace(/\bi\b/g, () => 'I');
          }
        }

        // Check if we want to add space
        if (prevText.length > 0 && !endsWithSpace &&
            ['(', '/', '‘', '“', '-', '–'].indexOf(prevText[prevText.length - 1]) === -1 &&
            ['.', ',', ';', ':', '?', '!', ')', '’', '”', ' ', String.fromCharCode(160), '-', '–'].indexOf(textToInsert[0]) === -1) {
          textToInsert = ` ${textToInsert}`;
        }
      }

      consoleLog(`finalText "${textToInsert}"`);
      return textToInsert;
    }

    /**
      Make sure target is usable.
      **/
    function prepTarget() {
      const domain = getHost();
      const doc = getActiveDocument();
      const wndw = getActiveWindow();

      if (!doc.body.classList.contains('voicein_ready')) {
        // On all domains where we want to trap the paste.
        // Use this if site does space suppression.
        const enablePasteHandler = ['notion.so', 'www.youtube.com', 'classroom.google.com'];
        const skipPasteHandler = ['writer.zoho.com'];

        // if (enablePasteHandler.indexOf(domain) !== -1 || pageURL.indexOf('wp-admin') !== -1) {
        // The default is to add the paste trap.
        if ((whitelist.indexOf(domain) !== -1 && enablePasteHandler.indexOf(domain) === -1) ||
          skipPasteHandler.indexOf(domain) !== -1) {
          consoleLog('[PrepTarget] Paste Trapper Not Enabled');
          doc.body.classList.add('voicein_ready');
        } else {
          consoleLog('[PrepTarget] Prepped Target', doc.body);

          wndw.addEventListener('paste', (e) => {
            if (recognizing && document.activeElement && document.activeElement.nodeName !== 'INPUT') {
              e.stopImmediatePropagation();
              consoleLog('Stopped Paste Propogation');
            }
          }, true);

          doc.body.classList.add('voicein_ready');
        }
      }
    }

    // Note that this function does in-place modifications.
    function trimParts(parts) {
      for (let i = 0; i < parts.length; i += 1) {
        let part = parts[i];
        if (part.length > 0 && part[0] === ' ') { part = part.slice(1); parts[i] = part; }
        if (part.length > 0 && part[part.length - 1] === ' ') { parts[i] = part.slice(0, part.length - 1); }
      }
    }

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const copyKeyCode = isMac ? 91 : 17;

    function copyPaste(text, callback) {
      // writeText is only available in https
      if (window === window.top && window.location.protocol === 'https:') {
        navigator.clipboard.writeText(text)
          .then(() => {
            callback();
            if (document.activeElement && document.activeElement.nodeName === 'INPUT') {
              document.activeElement.dispatchEvent(new KeyboardEvent('keyup', { keyCode: copyKeyCode }));
            }
          })
          .catch((err) => { console.error('Could not copy text: ', err); });
      } else {
        // TODO: Bug where the hasn't copied to clipboard yet and we call paste.
        // As a result, it leads to bad output. Fix by waiting for copy to complete before pasting.
        chrome.runtime.sendMessage({
          message_id: 'copy_text',
          value: text,
        }, (response) => {
          if (response) {
            callback();
          }
        });
      }
    }

    function pasteTextIntoTarget(target, text) {
      prepTarget(target);

      text = text.replaceAll('<newline>', '\n');
      text = text.replaceAll('<newparagraph>', '\n\n');

      const parts = text.split(/(<[a-z]+>)/g);
      var doc = getActiveDocument();
      var pasteFn = () => { doc.execCommand('paste', false); };
      if (parts.length > 1) { trimParts(parts); }
      for (let i = 0; i < parts.length; i += 1) {
        let part = parts[i];
        if (part) {
          switch (part) {
            case '<capitalize>': {
              capsNext = true;
              break;
            }
            case '<capson>':
              capsOn = true;
              break;
            case '<capsoff>':
              capsOn = false;
              break;
            case '<deleteword>': {
              deletePreviousWord();
              break;
            }
            case '<undo>':
              doc.execCommand('undo');
              break;
            case '<newparagraph>': {
              copyPaste('\n\n', pasteFn);
              prevText = '';
              break;
            }
            case '<insertspace>': {
              copyPaste(String.fromCharCode(160), pasteFn);
              prevText += String.fromCharCode(160);
              break;
            }
            case '<newline>': {
              copyPaste('\n', pasteFn);
              prevText = '';
              break;
            }
            default: {
              if (capsNext) { part = capitalize(part); capsNext = false; }
              if (capsOn) part = part.toLocaleUpperCase();
              const finalText = adjustText(part, prevText);
              copyPaste(finalText, pasteFn);
              prevText += finalText;
            }
          }
        }
      }
    }

    function pasteTextIntoTargetAlt(target, text) {
      function execInsertHTML(txt) {
        var doc = getActiveDocument();
        const html = txt.replace('\n', '<br>');
        consoleLog('insertHTML', html);
        doc.execCommand('insertHTML', false, html);
      }

      const parts = text.split(/(<[a-z]+>)/g);
      if (parts.length > 1) { trimParts(parts); }
      for (let i = 0; i < parts.length; i += 1) {
        let part = parts[i];
        if (part) {
          switch (part) {
            case '<capitalize>': {
              capsNext = true;
              break;
            }
            case '<capson>':
              capsOn = true;
              break;
            case '<capsoff>':
              capsOn = false;
              break;
            case '<deleteword>': {
              deletePreviousWord();
              break;
            }
            case '<newparagraph>': {
              execInsertHTML('\n\n');
              prevText = '';
              break;
            }
            case '<insertspace>': {
              execInsertHTML(String.fromCharCode(160));
              prevText += String.fromCharCode(160);
              break;
            }
            case '<newline>': {
              execInsertHTML('\n');
              prevText = '';
              break;
            }
            default: {
              if (capsNext) { part = capitalize(part); capsNext = false; }
              if (capsOn) part = part.toLocaleUpperCase();
              const finalText = adjustText(part, prevText);
              execInsertHTML(finalText);
              prevText += finalText;
            }
          }
        }
      }
    }

    function aa(a, b, c) {
      if (a.setSelectionRange) {
        a.focus();
        a.setSelectionRange(b, c);
      } else if (a.createTextRange) {
        var d = a.createTextRange();
        d.collapse(!0);
        d.moveEnd('character', c);
        d.moveStart('character', b);
        d.select();
      }
    }

    function _(a, b) {
      aa(a, b, b);
    }

    function putTextIntoTextArea(target, finalText) {
      var d = target.selectionStart;
      var c = target.value;
      target.value = c.substring(0, d) + finalText + c.substring(d);
      d += finalText.length;

      // TODO: Unroll this function ?
      _(target, d);
    }

    function insertTextIntoTextArea(target, text) {
      // text = text.replace(/<newparagraph>/g, '\n\n');
      // text = text.replace(/<newline>/g, '\n');
      // text = text.replace(/<insertspace>/g, String.fromCharCode(160));

      const parts = text.split(/(<[a-z]+>)/g);
      if (parts.length > 1) { trimParts(parts); }
      var doc = getActiveDocument();

      for (let i = 0; i < parts.length; i += 1) {
        let part = parts[i];
        if (part) {
          switch (part) {
            // case '<copybox>': {
            //   const copyText = document.getElementById('voicein_spacebox');
            //   navigator.clipboard.writeText(copyText.value)
            //     .then(() => { })
            //     .catch((err) => { console.error('Could not copy text: ', err); });
            //   break;
            // }
            case '<paste>':
              doc.execCommand('paste');
              break;
            case '<undo>':
              doc.execCommand('undo');
              break;
            case '<capitalize>': {
              capsNext = true;
              break;
            }
            case '<capson>':
              capsOn = true;
              break;
            case '<capsoff>':
              capsOn = false;
              break;
            case '<deleteword>': {
              var selEnd = target.selectionStart;
              var val = target.value;

              // find first ' ' or '\n'
              var selStart1 = Math.max(val.lastIndexOf(' ', selEnd), 0);
              var selStart2 = Math.max(val.lastIndexOf('\n', selEnd) + 1, 0);
              var selStart = Math.max(selStart1, selStart2);

              var finalText = val.slice(0, selStart) + val.slice(selEnd);
              target.value = finalText;
              target.setSelectionRange(selStart, selStart);
              break;
            }
            case '<newparagraph>': {
              putTextIntoTextArea(target, '\n\n');
              prevText = '';
              break;
            }
            case '<insertspace>': {
              putTextIntoTextArea(target, String.fromCharCode(160));
              prevText += String.fromCharCode(160);
              break;
            }
            case '<newline>': {
              putTextIntoTextArea(target, '\n');
              prevText = '';
              break;
            }
            default: {
              target.blur();
              target.focus();
              // TODO
              // $.event.trigger({
              //     type: "keypress"
              // });
              if (capsNext) { part = capitalize(part); capsNext = false; }
              if (capsOn) part = part.toLocaleUpperCase();
              const finalText = adjustText(part, prevText);

              putTextIntoTextArea(target, finalText);
              prevText += finalText;

              document.activeElement.dispatchEvent(new KeyboardEvent('keyup', { keyCode: copyKeyCode }));

              target.blur();
              target.focus();

              // $.event.trigger({
              //   type: "keypress"
              // });
            }
          }
        }
      }
    }

    function insertTextIntoContentEditable(target, text) {
      var e;
      var f;
      var g;
      const doc = getActiveDocument();
      const wndw = getActiveWindow();

      if (wndw && wndw.getSelection) {
        e = wndw.getSelection();
        if (e.getRangeAt && e.rangeCount) {
          f = e.getRangeAt(0);
          f.deleteContents();

          let skipRange = false;
          const parts = text.split(/(<[a-z]+>)/g);
          if (parts.length > 1) { trimParts(parts); }

          for (let i = 0; i < parts.length; i += 1) {
            let part = parts[i];
            if (part) {
              switch (part) {
                case '<newline>': {
                  g = document.createElement('span');
                  g.innerHTML = '<br>';
                  f.insertNode(g);
                  f.collapse(!0);
                  f.setStartAfter(g);
                  f.setEndAfter(g);
                  prevText = '';
                  break;
                }
                case '<newparagraph>': {
                  g = document.createElement('br');
                  f.insertNode(g);
                  f.collapse(!0);
                  f.setStartAfter(g);
                  f.setEndAfter(g);

                  g = document.createElement('br');
                  f.insertNode(g);
                  f.collapse(!0);
                  f.setStartAfter(g);
                  f.setEndAfter(g);
                  prevText = '';
                  break;
                }
                // case '<copybox>': {
                //   const copyText = document.getElementById('voicein_spacebox');
                //   navigator.clipboard.writeText(copyText.value)
                //     .then(() => { })
                //     .catch((err) => { console.error('Could not copy text: ', err); });
                //   break;
                // }
                case '<deleteword>': {
                  deletePreviousWord();
                  break;
                }
                case '<paste>': {
                  doc.execCommand('paste');
                  skipRange = true;
                  break;
                }
                case '<undo>': {
                  doc.execCommand('undo');
                  skipRange = true;
                  break;
                }
                case '<capitalize>': {
                  capsNext = true;
                  break;
                }
                case '<capson>': {
                  capsOn = true;
                  break;
                }
                case '<capsoff>': {
                  capsOn = false;
                  break;
                }
                case '<insertspace>': {
                  part = String.fromCharCode(160);
                  g = document.createTextNode(part);
                  f.insertNode(g);

                  f.collapse(!0);
                  f.setStart(g, part.length);
                  f.setEnd(g, part.length);
                  prevText += part;
                  break;
                }
                default: {
                  if (capsNext) { part = capitalize(part); capsNext = false; }
                  if (capsOn) part = part.toLocaleUpperCase();

                  const finalText = adjustText(part, prevText);
                  g = document.createTextNode(finalText);
                  f.insertNode(g);

                  f.collapse(!0);
                  // f.setStartAfter(g);
                  // f.setEndAfter(g);
                  f.setStart(g, finalText.length);
                  f.setEnd(g, finalText.length);
                  prevText += finalText;
                  break;
                }
              }
            }
          }

          // f.setStart(g, rangeEnd);
          // f.setEnd(g, rangeEnd);
          if (!skipRange) {
            e.removeAllRanges();
            e.addRange(f);
          }

          if (g && g.parentNode) {
            g.parentNode.normalize();
          }
        }
      } else {
        // Never happens
        // document.selection && document.selection.createRange
      }
    }

    if (textToInsert.length > 0) {
      textToInsert = textToInsert.trimLeft();

      const domain = getHost();
      const path = getPath();
      if ((domain === 'docs.google.com' && (path.startsWith('/document/') || path.startsWith('/presentation/'))) || domain === 'writer.zoho.com') {
        prevText = prevText.slice(-6);
      } else {
        prevText = getPrevText(target, 6);
      }

      try {
        // consoleLog(`insertCE "${textToInsert}"`);
        // insertTextIntoContentEditable(target, textToInsert);

        // consoleLog(`paste-alt "${textToInsert}"`);
        // pasteTextIntoTargetAlt(target, textToInsert);

        // consoleLog(`paste "${textToInsert}"`);
        // pasteTextIntoTarget(target, textToInsert);

        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          if (pasteMode) {
            consoleLog(`paste "${textToInsert}"`);
            pasteTextIntoTarget(target, textToInsert);
          } else {
            consoleLog(`insertTA "${textToInsert}"`);
            insertTextIntoTextArea(target, textToInsert);
          }
        } else {
          var skipPasteMode = ['outlook.live.com', 'outlook.office.com', 'outlook.office365.com', 'mail.yahoo.com'];
          const host = getHost();
          if (pasteMode && skipPasteMode.indexOf(host) === -1) {
            consoleLog(`paste "${textToInsert}"`);
            pasteTextIntoTarget(target, textToInsert);
          } else {
            consoleLog(`insertCE "${textToInsert}"`);
            insertTextIntoContentEditable(target, textToInsert);
          }
        }
      } catch (err) {
        consoleLog(err);
      }

      return textToInsert.length;
    }

    return 0;
  }

  function addFinalText(txt) {
    var res = checkTargetable();

    if (res.targetable) {
      target = res.target;

      insertText(txt);
      // $("#voicein_voicebox").fadeOut("slow");
      // document.getElementById('voicein_voicebox').style.display = 'none';
      // document.getElementById('voicein_voicebox').innerHTML = '';
      // interimText = '';

      // var errorBox = document.querySelector('#voicein_error');
      // if (errorBox.style.display === 'block') {
      //   errorBox.style.display = 'none';
      // }
    }
  }

  function loadLanguage() {
    chrome.storage.sync.get('stored_lang', (res) => {
      lang = res.stored_lang;
      if (!(typeof lang === 'string' && lang.length > 1)) {
        lang = 'en-US';
      }
    });
  }

  function loadSettings() {
    // Enable some exceptions
    const host = getHost();

  // const PASTEMODE_DOMAINS = ['www.facebook.com', 'm.facebook.com', 'discord.com',
  //   'www.reddit.com', 'web.whatsapp.com', 'www.messenger.com', 'meet.google.com',
  //   'www.linkedin.com', 'twitter.com', 'web.skype.com', 'outlook.live.com', 'mail.yahoo.com',
  //   'keep.google.com', 'quizlet.com', 'www.instagram.com', 'www.teamwork.com',
  //   'classroom.google.com', 'www.carousell.com.hk', 'hangouts.google.com', 'www.youtube.com',
  //   'www.ebility.com', 'www.notion.so', 'docs.google.com', 'forms.google.com',
  //   'voice.google.com', 'twitch.tv', 'app.hubspot.com', 'provider.teladoc.com',
  //   'messages.google.com'];

    if (whitelist.indexOf(host) !== -1) {
      pasteMode = true;
    }

    loadLanguage();

    chrome.storage.sync.get('pro', (ret) => {
      if (!ret.pro) {
        return;
      }

      // User is pro
      plusEnabled = true;

      pasteMode = true;

      var pasteModeExceptions = ['mail.google.com', 'www.evernote.com'];
      if (pasteModeExceptions.indexOf(host) !== -1) {
        consoleLog('paste mode disabled - exception');
        pasteMode = false;
      } else {
        chrome.storage.sync.get('no_pastemode_domains', (ret) => {
          if (ret.no_pastemode_domains) {
            var domain = getHost();
            var pastemodeDomains = ret.no_pastemode_domains;
            var matched = false;
            for (var i = 0; i < pastemodeDomains.length; i += 1) {
              if (domain.endsWith(pastemodeDomains[i])) {
                matched = true;
                break;
              }
            }

            if (matched) {
              // global variable
              pasteMode = false;
            }
          }
        });
      }

      chrome.storage.sync.get('changeCase', (ret) => {
        if (ret.changeCase) {
          changeCase = ret.changeCase;
        }
      });
    });
  }

  function handleMessages(msg) {
    switch (msg.action) {
      case 'tab_url_change':
        pageURL = msg.url;
        if (!settingsLoaded) {
          settingsLoaded = true;
          loadSettings();
        }
        if (msg.recognizing) {
          recognizing = true;
        }
        break;
      case 'on_results':
        // consoleLog('Runtime', msg, recognizing);
        addFinalText(msg.txtToAdd);
        break;
      // case 'on_interim_results':
      //   addInterimText(msg.txtToAdd);
      //   break;
      case 'recognition_started_in_bg':
        pageURL = msg.url;
        if (!settingsLoaded) {
          settingsLoaded = true;
          loadSettings();
        } else {
          loadLanguage();
        }
        recognizing = true;
        break;
      case 'recognition_stopped_in_bg':
        recognizing = false;
        break;
      case 'lang_update':
        loadLanguage();
        break;
      case 'plus_activated':
        loadSettings();
        break;
      default:
    }
  }

  chrome.runtime.onMessage.addListener((msg) => {
    try {
      consoleLog(msg);
      handleMessages(msg);
    } catch (e) {
      const minifiedURL = (pageURL || window.location.href || '').slice(0, 60);
      gaLog('JSError-CSA', `${e.name}:${e.message}`, `${minifiedURL}`);
      console.error(e);
    }
  });
}

onload();

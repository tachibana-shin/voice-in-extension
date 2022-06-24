function onload() {
  const DEBUG = false;

/* global chrome, console */
/* eslint-disable no-var, no-console, vars-on-top, no-param-reassign, no-shadow */
/* eslint-disable block-scoped-var, eqeqeq, no-unused-vars, max-len */
  function consoleLog(...args) {
    if (DEBUG) console.log(...args);
  }

  // We do not support framesets in cs_top.
  if (document.getElementsByTagName('body').length === 0) {
    return;
  }

  var extensionId = chrome.runtime.id;

  var target;

  var pasteMode = false;

  var plusEnabled = false;

  var recognizing = false;

  var capsOn = false;

  var interimText = '';

  // var disableCapitalization = false;

  // const PASTEMODE_DOMAINS = ['www.facebook.com', 'm.facebook.com', 'discord.com', 'www.reddit.com',
  //   'www.linkedin.com', 'twitter.com', 'web.skype.com', 'outlook.live.com', 'mail.yahoo.com',
  //   'keep.google.com', 'quizlet.com', 'www.instagram.com', 'www.messenger.com', 'web.whatsapp.com',
  //   'classroom.google.com', 'www.carousell.com.hk', 'hangouts.google.com', 'www.youtube.com', 'www.teamwork.com',
  //   'www.ebility.com', 'www.notion.so', 'docs.google.com', 'forms.google.com', 'messages.google.com', 'meet.google.com',
  //   'voice.google.com', 'twitch.tv', 'app.hubspot.com', 'provider.teladoc.com'];

  const pasteModeWhitelist = ['classroom.google.com', 'twitter.com', 'www.google.com', 'outlook.live.com',
    'docs.google.com', 'meet.google.com', 'translate.google.com', 'www.facebook.com', 'discord.com',
    'm.facebook.com', 'www.reddit.com', 'www.messenger.com', 'www.linkedin.com', 'quizlet.com',
    'www.teamwork.com', 'www.instagram.com', 'www.carousell.com.hk',
    'outlook.office.com', 'outlook.office365.com', 'web.whatsapp.com', 'dictanote.co', 'localhost:8000', 'mail.yahoo.com',
    'www.bing.com', 'twitch.tv', 'www.youtube.com'];

  const fineList = ['www.dating.com', 'textspins.com', 'limpado.com', 'www.evernote.com', 'mail.google.com', 'mail.zoho.com', 'pjnefijmagpdjfhhkpljicbbpicelgko', 'news.ycombinator.com'];

  /* eslint-disable */
  function getLanguages() {
    const languages = [['af-ZA','Afrikaans (South Africa)'],['sq-AL','Albanian (Albania)'],['am-ET','Amharic (Ethiopia)'],['ar-DZ','Arabic (Algeria)'],['ar-BH','Arabic (Bahrain)'],['ar-EG','Arabic (Egypt)'],['ar-IQ','Arabic (Iraq)'],['ar-IL','Arabic (Israel)'],['ar-JO','Arabic (Jordan)'],['ar-KW','Arabic (Kuwait)'],['ar-LB','Arabic (Lebanon)'],['ar-MA','Arabic (Morocco)'],['ar-OM','Arabic (Oman)'],['ar-QA','Arabic (Qatar)'],['ar-SA','Arabic (Saudi Arabia)'],['ar-PS','Arabic (State of Palestine)'],['ar-TN','Arabic (Tunisia)'],['ar-AE','Arabic (United Arab Emirates)'],['ar-YE','Arabic (Yemen)'],['hy-AM','Armenian (Armenia)'],['az-AZ','Azerbaijani (Azerbaijan)'],['eu-ES','Basque (Spain)'],['bn-BD','Bengali (Bangladesh)'],['bn-IN','Bengali (India)'],['bs-BA','Bosnian (Bosnia and Herzegovina)'],['bg-BG','Bulgarian (Bulgaria)'],['my-MM','Burmese (Myanmar)'],['yue-Hant-HK','Cantonese (Hong Kong)'],['ca-ES','Catalan (Spain)'],['hr-HR','Croatian (Croatia)'],['cs-CZ','Czech (Czech Republic)'],['da-DK','Danish (Denmark)'],['nl-BE','Dutch (Belgium)'],['nl-NL','Dutch (Netherlands)'],['en-AU','English (Australia)'],['en-CA','English (Canada)'],['en-GH','English (Ghana)'],['en-HK','English (Hong Kong)'],['en-IN','English (India)'],['en-IE','English (Ireland)'],['en-KE','English (Kenya)'],['en-NZ','English (New Zealand)'],['en-NG','English (Nigeria)'],['en-PK','English (Pakistan)'],['en-PH','English (Philippines)'],['en-SG','English (Singapore)'],['en-ZA','English (South Africa)'],['en-TZ','English (Tanzania)'],['en-GB','English (United Kingdom)'],['en-US','English (United States)'],['et-EE','Estonian (Estonia)'],['fil-PH','Filipino (Philippines)'],['fi-FI','Finnish (Finland)'],['fr-BE','French (Belgium)'],['fr-CA','French (Canada)'],['fr-FR','French (France)'],['fr-CH','French (Switzerland)'],['gl-ES','Galician (Spain)'],['ka-GE','Georgian (Georgia)'],['de-AT','German (Austria)'],['de-DE','German (Germany)'],['de-CH','German (Switzerland)'],['el-GR','Greek (Greece)'],['gu-IN','Gujarati (India)'],['iw-IL','Hebrew (Israel)'],['hi-IN','Hindi (India)'],['hu-HU','Hungarian (Hungary)'],['is-IS','Icelandic (Iceland)'],['id-ID','Indonesian (Indonesia)'],['it-IT','Italian (Italy)'],['it-CH','Italian (Switzerland)'],['ja-JP','Japanese (Japan)'],['jv-ID','Javanese (Indonesia)'],['kn-IN','Kannada (India)'],['km-KH','Khmer (Cambodia)'],['ko-KR','Korean (South Korea)'],['lo-LA','Lao (Laos)'],['lv-LV','Latvian (Latvia)'],['lt-LT','Lithuanian (Lithuania)'],['mk-MK','Macedonian (North Macedonia)'],['ms-MY','Malay (Malaysia)'],['ml-IN','Malayalam (India)'],['cmn-Hans-CN','Mandarin (China)'],['cmn-Hant-TW','Mandarin (Taiwan)'],['mr-IN','Marathi (India)'],['mn-MN','Mongolian (Mongolia)'],['ne-NP','Nepali (Nepal)'],['no-NO','Norwegian Bokmål (Norway)'],['fa-IR','Persian (Iran)'],['pl-PL','Polish (Poland)'],['pt-BR','Portuguese (Brazil)'],['pt-PT','Portuguese (Portugal)'],['pa-Guru-IN','Punjabi (Gurmukhi India)'],['ro-RO','Romanian (Romania)'],['ru-RU','Russian (Russia)'],['sr-RS','Serbian (Serbia)'],['si-LK','Sinhala (Sri Lanka)'],['sk-SK','Slovak (Slovakia)'],['sl-SI','Slovenian (Slovenia)'],['es-AR','Spanish (Argentina)'],['es-BO','Spanish (Bolivia)'],['es-CL','Spanish (Chile)'],['es-CO','Spanish (Colombia)'],['es-CR','Spanish (Costa Rica)'],['es-DO','Spanish (Dominican Republic)'],['es-EC','Spanish (Ecuador)'],['es-SV','Spanish (El Salvador)'],['es-GT','Spanish (Guatemala)'],['es-HN','Spanish (Honduras)'],['es-MX','Spanish (Mexico)'],['es-NI','Spanish (Nicaragua)'],['es-PA','Spanish (Panama)'],['es-PY','Spanish (Paraguay)'],['es-PE','Spanish (Peru)'],['es-PR','Spanish (Puerto Rico)'],['es-ES','Spanish (Spain)'],['es-US','Spanish (United States)'],['es-UY','Spanish (Uruguay)'],['es-VE','Spanish (Venezuela)'],['su-ID','Sundanese (Indonesia)'],['sw-KE','Swahili (Kenya)'],['sw-TZ','Swahili (Tanzania)'],['sv-SE','Swedish (Sweden)'],['ta-IN','Tamil (India)'],['ta-MY','Tamil (Malaysia)'],['ta-SG','Tamil (Singapore)'],['ta-LK','Tamil (Sri Lanka)'],['te-IN','Telugu (India)'],['th-TH','Thai (Thailand)'],['tr-TR','Turkish (Turkey)'],['uk-UA','Ukrainian (Ukraine)'],['ur-IN','Urdu (India)'],['ur-PK','Urdu (Pakistan)'],['uz-UZ','Uzbek (Uzbekistan)'],['vi-VN','Vietnamese (Vietnam)'],['zu-ZA','Zulu (South Africa)']];
    const languagesEdge = [["ar-BH","Arabic (Bahrain)"],["ar-EG","Arabic (Egypt)"],["ar-KW","Arabic (Kuwait)"],["ar-QA","Arabic (Qatar)"],["ar-SA","Arabic (Saudi Arabia)"],["ar-SY","Arabic (Syria)"],["ar-AE","Arabic (UAE)"],["ca-ES","Catalan"],["zh-HK","Chinese (Cantonese Traditional)"],["zh-CN","Chinese (Mandarin simplified)"],["zh-TW","Chinese (Taiwanese Mandarin)"],["da-DK","Danish (Denmark)"],["nl-NL","Dutch (Netherlands)"],["en-AU","English (Australia)"],["en-CA","English (Canada)"],["en-IN","English (India)"],["en-NZ","English (New Zealand)"],["en-GB","English (United Kingdom)"],["en-US","English (United States)"],["fi-FI","Finnish (Finland)"],["fr-CA","French (Canada)"],["fr-FR","French (France)"],["de-DE","German (Germany)"],["gu-IN","Gujarati (Indian)"],["hi-IN","Hindi (India)"],["it-IT","Italian (Italy)"],["ja-JP","Japanese (Japan)"],["ko-KR","Korean (Korea)"],["mr-IN","Marathi (India)"],["nb-NO","Norwegian (Bokmål) (Norway)"],["pl-PL","Polish (Poland)"],["pt-BR","Portuguese (Brazil)"],["pt-PT","Portuguese (Portugal)"],["ru-RU","Russian (Russia)"],["es-MX","Spanish (Mexico)"],["es-ES","Spanish (Spain)"],["sv-SE","Swedish (Sweden)"],["ta-IN","Tamil (India)"],["te-IN","Telugu (India)"],["th-TH","Thai (Thailand)"],["tr-TR","Turkish (Turkey)"]];
  
    if (window.navigator.userAgent.indexOf('Edg') > -1) {
      // Browser is Edge
      return languagesEdge;
    }
  
    return languages;
  }
  /* eslint-enable */

  const languages = getLanguages();

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

  // If iframe - document.activeElement.contentWindow.document.activeElement
  function getActiveElement() {
    var elem = document.activeElement;

    if (elem.tagName === 'IFRAME') {
      return elem;
    }

    return elem;
  }

  var tracked = false;

  function displayHelpMessage() {
    if (localStorage.viDisableHelp) return;

    const domain = window.location.host;
    const path = window.location.pathname;

    let msg = '';

    // const msg1 = 'Enable <a href="https://support.dictanote.co/hc/en-us/articles/360049111712" target="_blank">Advanced Mode</a> to dictate on this site. Needs <a href="https://dictanote.co/voicein/plus/" target="_blank">Voice In Plus</a> upgrade.';
    const msg2 = 'Enable <a href="https://dictanote.co/voicein/plus/" target="_blank">Dictation Box</a> to dictate on this site. Needs <a href="https://dictanote.co/voicein/plus/" target="_blank">Voice In Plus</a> upgrade.';
    const msg3 = '<a href="https://support.dictanote.co/hc/en-us/articles/360049111712" target="_blank">Advanced Mode</a> may be needed to dictate on this site.<br><a href="https://dictanote.co/voicein/plus/" target="_blank">Upgrade to Plus</a> to unlock Advanced Mode and many more features.';

    // const pasteModeDomains = PASTEMODE_DOMAINS;
    const dictationBoxDomains = [];

    // if (domain === 'docs.google.com' && (path.startsWith('/document/') || path.startsWith('/presentation/'))) {
    //   msg = 'For best results, dictate into the Dictation Box above. Then copy paste it into your document.<br><a href="https://support.dictanote.co/hc/en-us/articles/4405287823885" target="_blank">Learn more</a>';
    // } else
    if (!plusEnabled) {
      if (pasteModeWhitelist.indexOf(domain) !== -1 || fineList.indexOf(domain) !== -1) {
        // pass
      } else if (!pasteMode) {
        msg = msg3;
      } else if (dictationBoxDomains.indexOf(domain) !== -1) {
        msg = msg2;
      } else {
        msg = msg3;
      }
    }
    // else if (domain === 'youtube.com' && !pasteMode) {
    //   msg = 'Hit space after your comment to make Youtube recognize it';
    // }

    if (msg) {
      document.querySelector('#voicein_help').style.display = 'block';
      document.querySelector('#voicein_help_message').innerHTML = msg;
    } else {
      document.querySelector('#voicein_help').style.display = 'none';
    }
  }

  function checkTargetable() {
    var tgt = getActiveElement();
    var targetable = false;
    if (tgt) {
      if (tgt.nodeName === 'IFRAME' || tgt.nodeName === 'INPUT' || tgt.nodeName === 'TEXTAREA' || tgt.isContentEditable) {
        targetable = true;
      }
    }
    // return $(getActiveElement()).is(targetable);
    return { targetable, target: tgt };
  }

  function trackPageview(status) {
    const stringStatus = String(status);
    gaLog(`P${stringStatus}`, window.location.hostname, window.location.href);
  }

  // z
  function addInterimText(txt) {
    var res = checkTargetable();
    if (!tracked) {
      if (res.targetable) {
        trackPageview(true);
        tracked = true;
      } else {
        trackPageview(false);
        tracked = true;
      }
    }

    if (res.targetable) {
      var voiceBox = document.getElementById('voicein_voicebox');
      if (voiceBox) {
        voiceBox.style.display = 'block';
        voiceBox.innerHTML = txt;
      }
      interimText = txt;
    }
  }

  function addFinalText(txt) {
    var res = checkTargetable();

    if (res.targetable) {
      target = res.target;
      var voiceBox = document.getElementById('voicein_voicebox');
      if (voiceBox) {
        voiceBox.style.display = 'none';
        voiceBox.innerHTML = '';
      }
      interimText = '';

      var errorBox = document.querySelector('#voicein_error');
      if (errorBox && errorBox.style.display === 'block') {
        errorBox.style.display = 'none';
      }
    } else if (txt.trim() && document.querySelector('#voicein_help') &&
      !(document.querySelector('#voicein_help').style.display === 'block')) {
      // If not targetable and non empty text
      // show an error message
      document.querySelector('#voicein_error').style.display = 'block';
      document.querySelector('#voicein_error_message').innerHTML = '⚠ No Active Cursor<br>Place cursor in a text field';
    }
  }

  function setShortcuts(cmds) {
    document.querySelector('#voicein_current_ks').innerText = cmds[0].shortcut;
  }

  function setLanguageSelection(target, lang) {
    document.getElementById(target).value = lang;
  }

  function getOrInsertLang(key, target, defaultLang) {
    chrome.storage.sync.get(key, (res) => {
      lang = res[key];
      if (typeof lang === 'string' && lang.length > 1) {
        setLanguageSelection(target, lang);
      } else {
        chrome.storage.sync.set({
          key: defaultLang,
        }, () => {
          setLanguageSelection(target, defaultLang);
        });
      }
    });
  }

  function restorePreviousLanguage() {
    getOrInsertLang('stored_lang', 'voicein_select_lang', 'en-US');
  }

  function setLanguageDisplay() {
    chrome.storage.sync.get('stored_lang', (res) => {
      lang = res.stored_lang;
      if (typeof lang === 'string' && lang.length > 1) {
        document.getElementById('voicein_lang').innerText = lang;
      } else {
        lang = 'en-US';
        chrome.storage.sync.set({
          stored_lang: 'en-US',
        }, () => {
          document.getElementById('voicein_lang').innerText = lang;
        });
      }
    });
  }

  function updateLanguage() {
    var selectLanguage = document.getElementById('voicein_select_lang');
    chrome.runtime.sendMessage({
      message_id: 'update_language',
      language: selectLanguage.value,
    });
  }

  function populateSelect(select) {
    for (var b = 0; b < languages.length; b += 1) {
      select.options[b] = new Option(languages[b][1], languages[b][0]);
    }
  }

  function populateLanguageSelection() {
    var selectLanguage = document.getElementById('voicein_select_lang');
    populateSelect(selectLanguage);
  }

  function removeDomain(val, domains) {
    for (var i = 0; i < domains.length; i += 1) {
      if (domains[i] === val) {
        domains.splice(i, 1);
      }
    }
  }

  function updateDictationBoxDomains() {
    const checked = document.querySelector('#voicein_db').checked;

    // We need to add or remove the domain based on whether checkbox checked.
    chrome.storage.sync.get('spacebox_domains', (ret) => {
      var domain = window.location.host;
      var dictationBoxDomains;

      if (ret.spacebox_domains) {
        dictationBoxDomains = ret.spacebox_domains;
      } else {
        dictationBoxDomains = ['docs.google.com'];
      }

      if (checked) {
        if (dictationBoxDomains.indexOf(domain) === -1) {
          dictationBoxDomains.push(domain);

          gaLog('DictationBox', 'FromPage', domain);
        }

        document.querySelector('#voicein_spacebox_container').style.display = 'block';
      } else {
        removeDomain(domain, dictationBoxDomains);
        document.querySelector('#voicein_spacebox_container').style.display = 'none';
      }

      var res = { spacebox_domains: dictationBoxDomains };
      chrome.storage.sync.set(res, () => { });
    });
  }

  function updatePasteModeDomains() {
    const checked = document.querySelector('#voicein_pm').checked;
    consoleLog('updating', checked);

    // We need to add or remove the domain based on whether checkbox checked.
    chrome.storage.sync.get('no_pastemode_domains', (ret) => {
      var domain = window.location.host;
      var pasteModeDomains;

      if (ret.no_pastemode_domains) {
        pasteModeDomains = ret.no_pastemode_domains;
      } else {
        pasteModeDomains = [];
      }

      if (checked) {
        removeDomain(domain, pasteModeDomains);

        pasteMode = true;
      } else {
        if (pasteModeDomains.indexOf(domain) === -1) {
          pasteModeDomains.push(domain);

          gaLog('NoAdvancedMode', 'FromPage', domain);
        }

        pasteMode = false;
      }

      var res = { no_pastemode_domains: pasteModeDomains };
      chrome.storage.sync.set(res, () => { });
    });

    document.querySelector('#voicein_pm_status').innerHTML = '<br><br>Refresh the page to apply changes.';
  }

  function addLSButton(nodeID, lang) {
    var langNode = document.createElement('button');
    langNode.id = nodeID;
    langNode.innerHTML = lang;

    langNode.addEventListener('click', (e) => {
      e.preventDefault();

      chrome.runtime.sendMessage({
        message_id: 'update_language',
        language: lang,
      });

      if (target) target.focus();
    });

    document.getElementById('voicein_ls').appendChild(langNode);
  }

  function loadLSButton(key, nodeID, defaultLang) {
    chrome.storage.sync.get(key, (res) => {
      lang = res[key];
      if (typeof lang === 'string' && lang.length > 1) {
        addLSButton(nodeID, lang);
      } else {
        chrome.storage.sync.set({
          key: defaultLang,
        }, () => {
          addLSButton(nodeID, defaultLang);
        });
      }
    });
  }

  function loadPlusConfigs() {
    var optionsModal = document.querySelector('#voicein_modal');
    var popupContainer = document.querySelector('#voicein_popup_container');

    // If DOM not loaded, return.
    if (!optionsModal || !popupContainer) return;

    chrome.storage.sync.get('pro', (ret) => {
      if (!ret.pro) {
        document.querySelector('#voicein_db').disabled = true;
        document.querySelector('#voicein_pm').disabled = true;
        return;
      }

      // User is pro
      plusEnabled = true;
      displayHelpMessage();

      chrome.storage.sync.get('popupLocation', (ret) => {
        if (ret.popupLocation && typeof ret.popupLocation === 'number') {
          var locs = ['tr', 'br', 'bl', 'tl'];
          popupContainer.classList.remove('voicein_tr');
          popupContainer.classList.add(`voicein_${locs[ret.popupLocation]}`);
        }
      });

      document.querySelector('#voicein_upgrade').style.display = 'none';
      document.querySelectorAll('.plus-only').forEach((x) => { x.style.display = 'none'; });

      chrome.storage.sync.get('spacebox_domains', (ret) => {
        if (ret.spacebox_domains) {
          var domain = window.location.host;
          var spaceboxDomains = ret.spacebox_domains;
          var matched = false;
          for (var i = 0; i < spaceboxDomains.length; i += 1) {
            if (domain.endsWith(spaceboxDomains[i])) {
              matched = true;
              break;
            }
          }

          if (matched) {
            document.querySelector('#voicein_spacebox_container').style.display = 'block';
            document.querySelector('#voicein_db').checked = true;
          }
        }
      });

      document.querySelector('#voicein_db').addEventListener('change', updateDictationBoxDomains);

      document.querySelector('#voicein_pm').checked = true;
      pasteMode = true;

      chrome.storage.sync.get('no_pastemode_domains', (ret) => {
        if (ret.no_pastemode_domains) {
          var domain = window.location.host;
          var pastemodeDomains = ret.no_pastemode_domains;
          var matched = false;
          for (var i = 0; i < pastemodeDomains.length; i += 1) {
            if (domain.endsWith(pastemodeDomains[i])) {
              matched = true;
              break;
            }
          }

          if (matched) {
            document.querySelector('#voicein_pm').checked = false;

            // global variable
            pasteMode = false;
          }
        }
      });

      document.querySelector('#voicein_pm').addEventListener('change', updatePasteModeDomains);

      chrome.storage.sync.get('showLS', (ret) => {
        if (ret.showLS) {
          loadLSButton('stored_lang1_ks', 'select_lang1_ks', 'en-US');
          loadLSButton('stored_lang2_ks', 'select_lang2_ks', 'pt-BR');
          loadLSButton('stored_lang3_ks', 'select_lang3_ks', 'es-ES');
        }
      });

      // chrome.storage.sync.get('disableCapitalization', (ret) => {
      //   if (ret.disableCapitalization) {
      //     disableCapitalization = true;
      //   }
      // });
    });
  }

  function loadDOM() {
    var popupHTML = `
    <div id="voicein_settings">
      <img src="chrome-extension://${extensionId}/images/icon144_settings.png" style="width: 28px;">
      <span id='voicein_lang'>Settings</span>
    </div>
    <div id="voicein_upgrade" class="voicein_menu_option">
      <a href="https://dictanote.co/voicein/plus/" target="_blank" title="Voice In Options">
        <svg style='height: 13px;' aria-hidden="true" focusable="false" data-prefix="fas" data-icon="bolt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-bolt fa-w-10 fa-2x"><path fill="currentColor" d="M296 160H180.6l42.6-129.8C227.2 15 215.7 0 200 0H56C44 0 33.8 8.9 32.2 20.8l-32 240C-1.7 275.2 9.5 288 24 288h118.7L96.6 482.5c-3.6 15.2 8 29.5 23.3 29.5 8.4 0 16.4-4.4 20.8-12l176-304c9.3-15.9-2.2-36-20.7-36z" class=""></path></svg>
        <span>&nbsp; Upgrade</span>
      </a>
    </div>
    <div id='voicein_spacebox_container'>
      <div><textarea id='voicein_spacebox'></textarea></div>
      <p style='background: black; margin:0; padding: 0; line-height: 20px; font-size: 12px;'>
        <a href='#' style='color: white; padding-left: 5px; text-decoration: none;' id='voicein_copy_spacebox'>Copy</a>
        <a href='#' style='color: white; padding-left: 10px; text-decoration: none;' id='voicein_cut_spacebox'>Cut</a>
        <span style='float:right; color: gray'><i>Dictation Box&nbsp;</i></span>
      </p>
    </div>
    <div id="voicein_help">
      <span class='voicein_close'>x</span>
      <div id="voicein_help_message"></div>
    </div>
    <div id="voicein_error">
      <span class='voicein_close'>x</span>
      <div id="voicein_error_message"></div>
    </div>
    <div id="voicein_ls">
    </div>
    `;

    var modalHTML = `
    <div class="voicein_modal">
      <div class="voicein_modal_content">
        <span class="voicein_modal_close">&times;</span>
        <h1>Voice In Page Settings</h1>
        <small><a href='chrome-extension://${extensionId}/settings.html' target='_blank'>Go to Voice In Options →</a></small>
        <div class='voicein_modal_section'>
          <h4>Select your dictation language</h4>
          <select class='form-control' id="voicein_select_lang"></select>
        </div>
        <div class="voicein_modal_section">
          <h4>Enable Advanced Mode <span class='plus-only'>🔒 (only for <a target='_blank' href='https://dictanote.co/voicein/plus/'>plus users</a>)</span></h4>
          <div><input type='checkbox' id='voicein_pm'><label for='#voicein_pm'>Enable advanced mode on ${window.location.host}</label>
          <small id='voicein_pm_status'></small></div>
        </div>
        <div class="voicein_modal_section">
          <h4>Enable Dictation Box <span class='plus-only'>🔒 (only for <a target='_blank' href='https://dictanote.co/voicein/plus/'>plus users</a>)</span></h4>
          <div><input type='checkbox' id='voicein_db'><label for='#voicein_db'>Enable dictation box on ${window.location.host}</label></div>
        </div>
        <div class="voicein_modal_section">
          <h4>Keyboard Shortcut</h4>
          <div class='voicein_ks' id='voicein_current_ks'></div>
        </div>
        <div class="voicein_modal_section">
          <h4>Voice Commands</h4>
          <p>Find all available voice commands for your language <a href='https://dictanote.co/voicein/voicecommands/' target='_blank'>here</a></p>
        </div>
        <div class="voicein_modal_section">
          <p><a href='https://support.dictanote.co/hc/en-us/requests/new' target='_blank'>Report Bugs</a> --
             <a href='https://support.dictanote.co/hc/en-us/sections/360006696291-Voice-In' target='_blank'>Help Center</a></p>
        </div>
        <div class="voicein_modal_section" style="color:#4285F4; font-size:13px;">
        ❤️ Voice In?</b> Please rate us at <a href='' target='_blank' style='text-decoration: underline; color:#4285F4;'>Chrome Web Store</a>
        </div>
      </div>
    </div>`;

    var voiceboxContainer = document.createElement('div');
    voiceboxContainer.setAttribute('id', 'voicein_voicebox_container');

    var voicebox = document.createElement('div');
    voicebox.setAttribute('id', 'voicein_voicebox');
    voiceboxContainer.appendChild(voicebox);

    var popupContainer = document.createElement('div');
    popupContainer.setAttribute('id', 'voicein_popup_container');
    popupContainer.classList.add('voicein_tr');

    var popup = document.createElement('div');
    popup.setAttribute('id', 'voicein_popup');
    popup.innerHTML = popupHTML;
    popupContainer.appendChild(popup);

    var optionsModal = document.createElement('div');
    optionsModal.setAttribute('id', 'voicein_modal');
    optionsModal.innerHTML = modalHTML;

    var voiceinContainer = document.createElement('div');
    voiceinContainer.setAttribute('id', 'voicein_container');

    voiceinContainer.appendChild(voiceboxContainer);
    voiceinContainer.appendChild(popupContainer);
    voiceinContainer.appendChild(optionsModal);

    voiceinContainer.style.display = 'none';
    document.getElementsByTagName('body')[0].appendChild(voiceinContainer);

    var dictationBox = voiceinContainer.querySelector('#voicein_spacebox');

    dictationBox.addEventListener('copy', (e) => {
      e.stopPropagation();
    });

    var voiceinHelp = popupContainer.querySelector('#voicein_help');
    var voiceinError = popupContainer.querySelector('#voicein_error');

    voiceinHelp.querySelector('.voicein_close').addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.viDisableHelp = true;
      voiceinHelp.style.display = 'none';
    });

    voiceinError.querySelector('.voicein_close').addEventListener('click', (e) => {
      e.preventDefault();
      voiceinError.style.display = 'none';
    });

    document.querySelector('#voicein_settings').onclick = () => {
      document.querySelector('#voicein_modal .voicein_modal').style.display = 'block';
      restorePreviousLanguage();
    };

    populateLanguageSelection();
    document.querySelector('.voicein_modal #voicein_select_lang').addEventListener('change', updateLanguage);

    document.querySelector('.voicein_modal .voicein_modal_close').addEventListener('click', () => {
      document.querySelector('#voicein_modal .voicein_modal').style.display = 'none';
    });

    document.querySelector('#voicein_copy_spacebox').addEventListener('click', (e) => {
      e.preventDefault();
      const copyText = document.getElementById('voicein_spacebox');

      if (window == window.top && window.location.protocol === 'https:') {
        navigator.clipboard.writeText(copyText.value)
          .then(() => {})
          .catch((err) => { console.error('Could not copy text: ', err); });
      } else {
        chrome.runtime.sendMessage({
          message_id: 'copy_text',
          value: copyText.value,
        }, (/* response */) => {});
      }
    });

    document.querySelector('#voicein_cut_spacebox').addEventListener('click', (e) => {
      e.preventDefault();
      const copyText = document.getElementById('voicein_spacebox');

      if (window == window.top && window.location.protocol === 'https:') {
        navigator.clipboard.writeText(copyText.value)
          .then(() => {})
          .catch((err) => { console.error('Could not copy text: ', err); });
      } else {
        chrome.runtime.sendMessage({
          message_id: 'copy_text',
          value: copyText.value,
        }, (/* response */) => {});
      }
      copyText.value = '';
    });

    setLanguageDisplay();

    chrome.runtime.sendMessage({
      message_id: 'get_shortcut',
    });

    // Enable some exceptions
    const domain = window.location.host;
    const path = window.location.pathname;

    if (pasteModeWhitelist.indexOf(domain) !== -1) {
      pasteMode = true;
      document.querySelector('#voicein_pm').checked = true;
    }

    // Enable some exceptions
    // if (domain === 'docs.google.com' && (path.startsWith('/document/') || path.startsWith('/presentation/'))) {
    //   document.querySelector('#voicein_spacebox_container').style.display = 'block';
    //   document.querySelector('#voicein_db').checked = true;
    // }

    chrome.storage.sync.get('disablePopup', (ret) => {
      if (ret.disablePopup) {
        document.querySelector('#voicein_settings').style.display = 'none';
        document.querySelector('#voicein_upgrade').style.display = 'none';
        optionsModal.style.display = 'none';
      }
    });

    loadPlusConfigs();

    // Trap enter when there is interimText. If there is then empty interim text.
    document.body.addEventListener('keydown', (e) => {
      if (e.keyCode === 13 && recognizing && interimText) {
        e.stopImmediatePropagation();
        e.preventDefault();

        chrome.runtime.sendMessage({
          message_id: 'stop_recognition',
        });
      }
    }, true);
  }

  chrome.runtime.onMessage.addListener((msg/* , sender, sendResponse */) => {
    consoleLog(msg);
    try {
      switch (msg.action) {
        case 'tab_activated': {
          var container = document.querySelector('#voicein_container');
          if (msg.recognizing) {
            recognizing = true;
            if (!container) {
              loadDOM();
              container = document.querySelector('#voicein_container');
            }
            container.style.display = 'block';
          } else if (container && container.style.display == 'block') container.style.display = 'none';
          break;
        }
        case 'tab_url_change':
          if (!document.querySelector('#voicein_container')) {
            if (msg.recognizing) {
              loadDOM();
              recognizing = true;
              document.querySelector('#voicein_container').style.display = 'block';
            }
          }
          break;
        case 'on_results':
          addFinalText(msg.txtToAdd);
          break;
        case 'on_interim_results':
          addInterimText(msg.txtToAdd);
          break;
        case 'recognition_started_in_bg':
          if (!document.querySelector('#voicein_container')) {
            loadDOM();
          }
          recognizing = true;
          setLanguageDisplay();
          displayHelpMessage();
          document.querySelector('#voicein_container').style.display = 'block';
          if (document.querySelector('#voicein_spacebox_container').style.display === 'block') {
            document.querySelector('#voicein_spacebox').focus();
          }
          break;
        case 'recognition_stopped_in_bg':
          recognizing = false;
          document.querySelector('#voicein_container').style.display = 'none';
          break;
        case 'lang_update':
          setLanguageDisplay();
          break;
        case 'set_shortcut':
          setShortcuts(msg.shortcut);
          break;
        case 'plus_activated':
          loadPlusConfigs();
          break;
        default:
          break;
      }
    } catch (e) {
      gaLog('JSError-CST', `${e.name}:${e.message}`, `${window.location.href}`);
      console.error(e);
    }
  });
}

onload();

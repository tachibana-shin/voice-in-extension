function loadShortcuts(){const e=getLanguages();function t(e,t){document.getElementById(e).value=t}function n(e,n,c){chrome.storage.sync.get(e,(s=>{const o=s[e];"string"==typeof o&&o.length>1?t(n,o):chrome.storage.sync.set({key:c},(()=>{t(n,c)}))}))}function c(t){for(let n=0;n<e.length;n+=1)t.options[n]=new Option(e[n][1],e[n][0])}function s(){chrome.runtime.sendMessage({message_id:"update_ls"})}function o(){var e=document.getElementById("select_lang1_ks").value;chrome.storage.sync.set({stored_lang1_ks:e},(()=>{})),s()}function r(){var e=document.getElementById("select_lang2_ks").value;chrome.storage.sync.set({stored_lang2_ks:e},(()=>{})),s()}function l(){var e=document.getElementById("select_lang3_ks").value;chrome.storage.sync.set({stored_lang3_ks:e},(()=>{})),s()}var a,d,g;chrome.runtime.onMessage.addListener((e=>{switch(e.action){case"set_shortcut":t=e.shortcut,document.querySelector("#voicein_current_ks").innerText=t[0].shortcut,document.querySelector("#voicein_lang1_ks").innerText=t[1].shortcut,document.querySelector("#voicein_lang2_ks").innerText=t[2].shortcut,document.querySelector("#voicein_lang3_ks").innerText=t[3].shortcut}var t})),a=document.getElementById("select_lang1_ks"),d=document.getElementById("select_lang2_ks"),g=document.getElementById("select_lang3_ks"),c(a),c(d),c(g),n("stored_lang1_ks","select_lang1_ks","en-US"),n("stored_lang2_ks","select_lang2_ks","pt-BR"),n("stored_lang3_ks","select_lang3_ks","es-ES"),chrome.runtime.sendMessage({message_id:"get_shortcut"}),chrome.storage.sync.get("pro",(e=>{e.pro&&(document.querySelector("#select_lang1_ks").disabled=!1,document.querySelector("#select_lang2_ks").disabled=!1,document.querySelector("#select_lang3_ks").disabled=!1,document.querySelector("#select_lang1_ks").addEventListener("change",o),document.querySelector("#select_lang2_ks").addEventListener("change",r),document.querySelector("#select_lang3_ks").addEventListener("change",l),document.querySelector("#voicein-ls-checkbox").disabled=!1,chrome.storage.sync.get("showLS",(e=>{e.showLS&&(document.querySelector("#voicein-ls-checkbox").checked=!0)})),document.querySelector("#voicein-ls-checkbox").addEventListener("click",(()=>{document.querySelector("#voicein-ls-checkbox").checked?(chrome.storage.sync.set({showLS:!0},(()=>{})),ga_log("LS","show")):(chrome.storage.sync.set({showLS:!1},(()=>{})),ga_log("LS","hide"))})))}))}loadShortcuts();
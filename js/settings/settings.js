function onload(){var e,o;e="PageView",chrome.runtime.sendMessage({message_id:"mp_track",category:e,info:o});const n=getLanguages();function t(e){const o=document.querySelector("#microphone-error");if("info_no_microphone"===e)o.innerHTML="<b>Error</b>: Unable to find microphone. Please make sure microphone is connected and try again.",o.style.display="block";else if("info_blocked"===e)o.innerHTML='<b>Error</b>: Microphone access is blocked. <a href="https://dictanotehelp.zendesk.com/hc/en-us/articles/360037356431">Click here</a> for instructions to enable access.',o.style.display="block";else if("working"===e){const e=document.getElementById("invoke_permission");e.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" style="fill: #fff"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>&nbsp; Permission Granted',e.disabled=!0,o.style.display="none"}}function c(){var e=new webkitSpeechRecognition;e.continuous=!0,e.interimResults=!0,e.onstart=()=>{t("working"),e.stop()},e.onerror=e=>{"no-speech"===e.error&&t("info_no_speech"),"audio-capture"===e.error&&t("info_no_microphone"),"not-allowed"===e.error&&t("info_blocked")},e.onend=()=>{},e.onresult=()=>{},e.lang="en-US",e.start()}function a(e){document.getElementById("select_language").value=e}var r;document.getElementById("invoke_permission").addEventListener("click",c),document.getElementById("select_language").addEventListener("change",(function(){var e=document.getElementById("select_language");chrome.runtime.sendMessage({message_id:"update_language",language:e.value})})),function(){var e=document.getElementById("select_language");for(let o=0;o<n.length;o+=1)e.options[o]=new Option(n[o][1],n[o][0])}(),r="",chrome.storage.sync.get("stored_lang",(e=>{"string"==typeof(r=e.stored_lang)&&r.length>1?a(r):chrome.storage.sync.set({stored_lang:"en-US"},(()=>{a("en-US")}))})),document.querySelector("#voicein-popup-checkbox").disabled=!1,chrome.storage.sync.get("disablePopup",(e=>{e.disablePopup&&(document.querySelector("#voicein-popup-checkbox").checked=!0)})),document.querySelector("#voicein-popup-checkbox").addEventListener("click",(()=>{document.querySelector("#voicein-popup-checkbox").checked?(chrome.storage.sync.set({disablePopup:!0},(()=>{})),ga_log("DisablePopup")):(chrome.storage.sync.set({disablePopup:!1},(()=>{})),ga_log("EnablePopup"))})),chrome.storage.sync.get("pro",(e=>{e.pro&&(document.querySelector("#tab-change-ok").disabled=!1,chrome.storage.sync.get("tabChangeOk",(e=>{e.tabChangeOk&&(document.querySelector("#tab-change-ok").checked=!0)})),document.querySelector("#tab-change-ok").addEventListener("click",(()=>{chrome.runtime.sendMessage({message_id:"update_tab_change_ok",tabChangeOk:document.querySelector("#tab-change-ok").checked})})),document.querySelector("#voicein-popup-location").disabled=!1,chrome.storage.sync.get("popupLocation",(e=>{e.popupLocation&&(document.querySelector("#voicein-popup-location").value=e.popupLocation)})),document.querySelector("#voicein-popup-location").addEventListener("change",(()=>{var e=parseInt(document.querySelector("#voicein-popup-location").value,10);chrome.storage.sync.set({popupLocation:e},(()=>{})),ga_log("PopupLocation",e)})))})),c()}onload();
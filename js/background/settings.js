class Settings{constructor(){this.isPro=!1,this.currentLang="en-US",this.voiceCommands=[],this.disableDiacritics=!1,this.changeCase="df",this.currentTabId=-1,this.tabChangeOk=!1,this.lang1="en-US",this.lang2="pt-BR",this.lang3="es-ES",this.recognizer=null}loadStoredLang(){chrome.storage.sync.get("stored_lang",(e=>{"string"==typeof e.stored_lang&&e.stored_lang.length>1&&(this.currentLang=e.stored_lang)}))}loadVC(){chrome.storage.local.get("vc",(e=>{e.vc&&(this.voiceCommands=function(e){const s=[];return Object.keys(e).forEach((t=>{s.push([e[t],t])})),s}(e.vc))}))}loadChangeCase(){chrome.storage.sync.get("changeCase",(e=>{e.changeCase?this.changeCase=e.changeCase:this.changeCase="df"}))}loadDiacritics(){chrome.storage.sync.get("disableDiacritics",(e=>{e.disableDiacritics?this.disableDiacritics=!0:this.disableDiacritics=!1}))}loadLS(){chrome.storage.sync.get(["stored_lang1_ks","stored_lang2_ks","stored_lang3_ks"],(e=>{const s=e.stored_lang1_ks;"string"==typeof s&&s.length>1&&(this.lang1=s);const t=e.stored_lang2_ks;"string"==typeof t&&t.length>1&&(this.lang2=t);const a=e.stored_lang3_ks;"string"==typeof a&&a.length>1&&(this.lang3=a)}))}loadTabChangeOk(){chrome.storage.sync.get("tabChangeOk",(e=>{e.tabChangeOk?this.tabChangeOk=!0:this.tabChangeOk=!1}))}loadAll(){this.loadStoredLang(),chrome.storage.sync.get(["pro","expiry","code"],(e=>{e.pro&&(this.isPro=!0,this.recognizer.idleTimeout=3e5,this.loadVC(),this.loadChangeCase(),this.loadDiacritics(),this.loadLS(),this.loadTabChangeOk())}))}updateLanguage(e){this.currentLang=e,chrome.storage.sync.set({stored_lang:e},(()=>{}))}updateTabChangeOk(e){this.tabChangeOk=e,chrome.storage.sync.set({tabChangeOk:e},(()=>{}))}updateChangeCase(e){this.changeCase=e,chrome.storage.sync.set({changeCase:e},(()=>{}))}}
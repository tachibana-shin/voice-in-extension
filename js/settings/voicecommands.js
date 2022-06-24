function loadVC(){var e={},t="",c="<span title='partial match enabled'><i class='fa fa-arrows-h'></i></span>";async function r(e,c,r="POST"){const a="https://dictanote.co/voicein/"+e,o=new FormData;Object.keys(c).forEach((e=>{o.append(e,c[e])})),o.append("code",t);const n=await fetch(a,{method:r,body:o});return await n.json(),n}function a(){const t=document.querySelector("#custom-vc");t.innerHTML="",Object.keys(e).forEach((a=>{const o=document.createElement("tr");var n=e[a],d="";"string"!=typeof n&&(d=c,n=n[0]),n=n.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>"),o.innerHTML=`<td>${a}</td><td>${n}</td><td>${d}</td>`;const l=document.createElement("td"),s=document.createElement("a");s.innerHTML='<i class="fa fa-trash"></i></a>',s.addEventListener("click",(()=>{const c=o.firstElementChild.innerText;delete e[c],chrome.storage.local.set({vc:e},(()=>{})),t.removeChild(o),r("vc/del/",{cmd:c})})),l.appendChild(s),o.appendChild(l),t.appendChild(o)}))}function o(t,r,a){const o=document.querySelector("#custom-vc");r=r.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\n/g,"<br>"),console.log(t,r);const n=document.createElement("tr");n.innerHTML=a?`<td>${t}</td><td>${r}</td><td>${c}</td>`:`<td>${t}</td><td>${r}</td><td></td>`;const d=document.createElement("td"),l=document.createElement("a");l.innerHTML='<i class="fa fa-trash"></i></a>',l.addEventListener("click",(()=>{delete e[t],chrome.storage.local.set({vc:e},(()=>{})),o.removeChild(n)})),d.appendChild(l),n.appendChild(d),o.appendChild(n)}chrome.storage.sync.get("pro",(c=>{c.pro&&(chrome.storage.sync.get("code",(e=>{t=e.code})),chrome.storage.local.get("vc",(t=>{t.vc&&(e=t.vc,a())})),document.querySelector("#addNewVCBtn").classList.remove("disabled"),document.querySelector("#addBulkVCBtn").classList.remove("disabled"),document.querySelector("#exportVCBtn").classList.remove("disabled"),document.querySelector("#custom-cmds").classList.remove("disabled"),document.querySelector("#add-new-vc").addEventListener("click",(()=>{var t=document.querySelector("#toInsertThis").value,c=document.querySelector("#sayThis").value,o=document.querySelector("#partial-match").checked;c.length>0?(console.log(c,t),c=c.toLocaleLowerCase(),e[c]=o?[t,!0]:t,a(),chrome.storage.local.set({vc:e},(()=>{})),r("vc/add/",{cmd:c,txt:t,partialMatch:o}),document.querySelector("#toInsertThis").value="",document.querySelector("#sayThis").value="",document.querySelector("#partial-match").value=!1,chrome.runtime.sendMessage({message_id:"update_vc"}),$("#addNewVC").modal("hide"),ga_log("VC","Add",`${c}:${t}`)):(document.querySelector("#vc-error").innerHTML="Both field need to be non-empty",document.querySelector("#vc-error-box").style.display="block",setTimeout((()=>{document.querySelector("#vc-error-box").style.display="none"}),2e3))})),document.querySelector("#bulk-add-vc").addEventListener("click",(()=>{var t=document.querySelector("#vcTextArea").value;if(t.trim().length>0){(e=>{const t=new RegExp('(\\,|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^\\,\\r\\n]*))',"gi");let c=null,r=[[]];for(;c=t.exec(e);)c[1].length&&","!==c[1]&&r.push([]),r[r.length-1].push(c[2]?c[2].replace(new RegExp('""',"g"),'"'):c[3]);return r})(t).forEach((t=>{if(2===t.length&&t[0].trim().length>0){let c=t[0];const a=t[1];c=c.toLocaleLowerCase(),e[c]=a,o(c,a),r("vc/add/",{cmd:c,txt:a,partialMatch:!1})}else if(3===t.length&&t[0].trim().length>0){let c=t[0];const a=t[1];c=c.toLocaleLowerCase(),e[c]=[a,!0],o(c,a,!0),r("vc/add/",{cmd:c,txt:a,partialMatch:!0})}})),a(),chrome.storage.local.set({vc:e},(()=>{})),chrome.runtime.sendMessage({message_id:"update_vc"}),document.querySelector("#vcTextArea").value="",$("#addBulkVC").modal("hide")}})),document.querySelector("#exportVCBtn").addEventListener("click",(()=>{var t=function(e){function t(e){var t="";for(let c=0;c<e.length;c+=1){let r=null===e[c]?"":e[c].toString();e[c]instanceof Date&&(r=e[c].toLocaleString());let a=r.replace(/"/g,'""');a.search(/("|,|\n)/g)>=0&&(a='"'+a+'"'),c>0&&(t+=","),t+=a}return t}for(var c="",r=0;r<e.length;r++)c+=t(e[r]),r!==e.length-1&&(c+="\n");return c}(function(e){const t=[];return Object.keys(e).forEach((c=>{const r=e[c];"string"==typeof r?t.push([c,r]):t.push([c].concat(r))})),t}(e));document.querySelector("#vcExportArea").value=t})),document.querySelector("#change-case").disabled=!1,chrome.storage.sync.get("changeCase",(e=>{e.changeCase&&(document.querySelector("#change-case").value=e.changeCase)})),document.querySelector("#change-case").addEventListener("change",(()=>{chrome.runtime.sendMessage({message_id:"update_change_case",changeCase:document.querySelector("#change-case").value})})),document.querySelector("#voicein-diacritics-checkbox").disabled=!1,chrome.storage.sync.get("disableDiacritics",(e=>{e.disableDiacritics&&(document.querySelector("#voicein-diacritics-checkbox").checked=!0)})),document.querySelector("#voicein-diacritics-checkbox").addEventListener("click",(()=>{document.querySelector("#voicein-diacritics-checkbox").checked?chrome.storage.sync.set({disableDiacritics:!0},(()=>{})):chrome.storage.sync.set({disableDiacritics:!1},(()=>{})),chrome.runtime.sendMessage({message_id:"update_diacritics"})})))}))}loadVC();
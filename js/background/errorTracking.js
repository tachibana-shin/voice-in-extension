!function(e,t,n,a,r,o,i){e.GoogleAnalyticsObject=r,e.ga=e.ga||function(){(e.ga.q=e.ga.q||[]).push(arguments)},e.ga.l=1*new Date,o=t.createElement(n),i=t.getElementsByTagName(n)[0],o.async=1,o.src="https://www.google-analytics.com/analytics.js",i.parentNode.insertBefore(o,i)}(window,document,"script",0,"ga"),function(e,t){var n,a,r,o;t.__SV||(window.mixpanel=t,t._i=[],t.init=function(e,n,a){function i(e,t){var n=t.split(".");2==n.length&&(e=e[n[0]],t=n[1]),e[t]=function(){e.push([t].concat(Array.prototype.slice.call(arguments,0)))}}var c=t;for(void 0!==a?c=t[a]=[]:a="mixpanel",c.people=c.people||[],c.toString=function(e){var t="mixpanel";return"mixpanel"!==a&&(t+="."+a),e||(t+=" (stub)"),t},c.people.toString=function(){return c.toString(1)+".people (stub)"},r="disable time_event track track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" "),o=0;o<r.length;o++)i(c,r[o]);var l="set set_once union unset remove delete".split(" ");c.get_group=function(){function e(e){t[e]=function(){call2_args=arguments,call2=[e].concat(Array.prototype.slice.call(call2_args,0)),c.push([n,call2])}}for(var t={},n=["get_group"].concat(Array.prototype.slice.call(arguments,0)),a=0;a<l.length;a++)e(l[a]);return t},t._i.push([e,n,a])},t.__SV=1.2,(n=e.createElement("script")).type="text/javascript",n.async=!0,n.src="undefined"!=typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:("file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//),"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"),(a=e.getElementsByTagName("script")[0]).parentNode.insertBefore(n,a))}(document,window.mixpanel||[]),mixpanel.init("51ff84f2622a307d15d2d0a8daa41c78",{api_host:"https://api.mixpanel.com"}),ga("create","UA-42775496-5","auto"),ga("set","checkProtocolTask",null),ga("send","pageview","/background");var version=chrome.app.getDetails().version;function mpTrack(e,t){(t=t||{}).version=version,mixpanel.track(e,t)}function gaLog(e,t,n,a=!0){console.log("ga",e,t,n,a),a?ga("send","event",e,t,n):ga("send","event",e,t,n,{nonInteraction:1}),mpTrack(e,{action:t,label:n})}function trackJavaScriptError(e){gaLog("JSError",e.message,`xyz:${e.filename}:${e.lineno}:${e.colno}`,!1)}function trackPromiseError(e){let t="",n="xyz:";e.reason&&(t=e.reason.message,n+=e.reason.stack),gaLog("PromiseError",t,n,!1)}function enableErrorTracking(){window.addEventListener("error",trackJavaScriptError,!1),window.addEventListener("unhandledrejection",trackPromiseError,!1)}enableErrorTracking();
function ga_log(e,a,n,t=!0){console.log("ga",e,a,n,t),t?ga("send","event",e,a,n):ga("send","event",e,a,n,{nonInteraction:1})}!function(e,a,n,t,g,o,c){e.GoogleAnalyticsObject=g,e.ga=e.ga||function(){(e.ga.q=e.ga.q||[]).push(arguments)},e.ga.l=1*new Date,o=a.createElement(n),c=a.getElementsByTagName(n)[0],o.async=1,o.src="https://www.google-analytics.com/analytics.js",c.parentNode.insertBefore(o,c)}(window,document,"script",0,"ga"),ga("create","UA-42775496-5","auto"),ga("set","checkProtocolTask",null),ga("send","pageview","/settings");
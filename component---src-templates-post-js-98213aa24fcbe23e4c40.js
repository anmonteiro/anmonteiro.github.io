(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{149:function(e,t,a){"use strict";a.r(t),a.d(t,"query",function(){return u});a(77);var n=a(0),r=a.n(n),i=a(7),l=a.n(i),c=a(156),s=a(157),o=a(154);function m(e){var t=e.tags;return Object(o.b)("!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');"),Object(o.b)("!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');"),r.a.createElement("div",{style:{marginTop:"2rem",marginBottom:"1rem"}},r.a.createElement("a",{href:"https://twitter.com/share?hashtags="+t.join(","),className:"twitter-share-button","data-via":"_anmonteiro"},"Tweet"),r.a.createElement("a",{href:"https://twitter.com/_anmonteiro",className:"twitter-follow-button","data-show-count":"false"},"Follow @_anmonteiro"))}function d(e){var t=e.url,a=e.slug.split("/").filter(function(e){return""!==e}),n=a[a.length-1].split(".")[0];return Object(o.b)("\n  var disqus_config = function () {\n      this.page.url = '"+t+"';\n      this.page.identifier = '"+n+"';\n  };\n  (function() {  // REQUIRED CONFIGURATION VARIABLE: EDIT THE SHORTNAME BELOW\n      var d = document, s = d.createElement('script');\n\n      s.src = '//anmonteiro.disqus.com/embed.js';  // IMPORTANT: Replace EXAMPLE with your forum shortname!\n\n      s.setAttribute('data-timestamp', +new Date());\n      (d.head || d.body).appendChild(s);\n  })();\n"),r.a.createElement("div",{id:"disqus_thread"},r.a.createElement("noscript",null,"Please enable JavaScript to view the"," ",r.a.createElement("a",{href:"https://disqus.com/?ref_noscript",rel:"nofollow"},"comments powered by Disqus.")))}var u="71358222";function p(e){for(var t=e.allPosts,a=e.currentPost,n=[],i=t.length,c=0;c<i&&3!==n.length;c++){var s=t[c].node;s.fields.tags.some(function(e){return-1!==a.fields.tags.indexOf(e)})&&n.push(s)}if(n.length<3)for(var o=function(e){if(3===n.length)return"break";var a=t[e].node,r=a.fields.slug;n.some(function(e){return e.fields.slug===r})||n.push(a)},m=0;m<i;m++){if("break"===o(m))break}return r.a.createElement("div",{className:"related"},r.a.createElement("h2",null,"Related Posts"),r.a.createElement("ul",{className:"related-posts"},n.map(function(e,t){var a=e.fields,n=a.title,i=a.slug,c=a.date;return r.a.createElement("li",{key:t},r.a.createElement("h3",null,r.a.createElement(l.a,{to:i},n," ",r.a.createElement("small",null,c))))})))}t.default=function(e){var t=e.data,a=t.markdownRemark,n=t.allPosts;return r.a.createElement(c.a,null,r.a.createElement(s.a,{pageData:a}),r.a.createElement("div",{className:"post"},r.a.createElement("h1",{className:"post-title"},a.fields.title),r.a.createElement("span",{className:"post-date"},a.fields.date),r.a.createElement("div",{dangerouslySetInnerHTML:{__html:a.html}}),r.a.createElement(m,{tags:a.fields.tags}),r.a.createElement(d,a.fields),r.a.createElement(p,{allPosts:n.edges,currentPost:a})))}},154:function(e,t,a){"use strict";a.d(t,"b",function(){return i}),a.d(t,"a",function(){return l});var n=a(0),r=a.n(n);function i(e){var t=r.a.useRef(null);r.a.useEffect(function(){var a=document.body;if(null==t.current){var n=document.createElement("script");n.innerHTML=e,t.current=n,a.appendChild(n)}return function(){var e=t.current;if(null!=e)try{a.removeChild(e)}catch(n){}}})}function l(){i("\n  if (window.location.hostname !== 'localhost') {\n    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');\n\n    ga('create', 'UA-20102574-2', 'auto');\n    ga('send', 'pageview');\n  }\n      ")}},155:function(e){e.exports={data:{site:{siteMetadata:{title:"anmonteiro",description:"\n    I'm a Software Engineer with a passion for entrepreneurship and open-source\n    software. This is where I write about software engineering, programming and\n    lifestyle.",tagline:"Code ramblings"}},allMarkdownRemark:{edges:[{node:{fields:{title:"About",slug:"/about/"}}}]}}}},156:function(e,t,a){"use strict";var n=a(76),r=a.n(n),i=a(155),l=a(0),c=a.n(l),s=a(55),o=a(7),m=a.n(o),d=a(159),u=a.n(d),p=a(160),f=a.n(p),E=function(e){var t=e.siteMetadata,a=e.pagesInfo,n=t.title,r=t.description;return c.a.createElement(c.a.Fragment,null,c.a.createElement("input",{type:"checkbox",className:"sidebar-checkbox",id:"sidebar-checkbox"}),c.a.createElement("div",{className:"sidebar",id:"sidebar"},c.a.createElement("div",{className:"sidebar-item description"},c.a.createElement("p",null,r)),c.a.createElement("nav",{className:"sidebar-nav"},c.a.createElement(m.a,{key:"00",className:u()("sidebar-nav-item","Home"===n?"active":null),to:"/"},"Home"),c.a.createElement(m.a,{key:"01",className:u()("sidebar-nav-item","Archive"===n?"active":null),to:"/archive"},"Archive"),a.map(function(e,t){var a=e.node,r=a.fields.title;return c.a.createElement(m.a,{key:t,className:u()("sidebar-nav-item",r===n?"active":null),to:a.fields.slug},r)}),c.a.createElement("a",{className:"sidebar-nav-item",href:"http://github.com/anmonteiro"},"GitHub (anmonteiro)")),c.a.createElement("div",{className:"sidebar-item"},c.a.createElement("p",null,"© ",f()().year(),". All rights reserved."))))},g=a(154);a(162),a(163),a(161),a(164),a(165);t.a=function(e){var t=e.children;return c.a.useEffect(function(){var e=document.querySelector(".sidebar-toggle"),t=document.querySelector("#sidebar"),a=document.querySelector("#sidebar-checkbox"),n=function(n){var r=n.target;a.checked&&!t.contains(r)&&r!==a&&r!==e&&(a.checked=!1)};return document.addEventListener("click",n,!1),function(){document.removeEventListener("click",n)}},[]),Object(g.a)(),c.a.createElement(s.StaticQuery,{query:"1594900446",render:function(e){var a=e.site,n=e.allMarkdownRemark,i=a.siteMetadata,l=i.tagline,s=r()(i,["tagline"]);return c.a.createElement("div",{className:"theme-base-0f"},c.a.createElement(E,{siteMetadata:s,pagesInfo:n.edges}),c.a.createElement("div",{className:"wrap"},c.a.createElement("div",{className:"masthead"},c.a.createElement("div",{className:"container"},c.a.createElement("h3",{className:"masthead-title"},c.a.createElement(m.a,{to:"",title:"Home"},s.title),c.a.createElement("small",null," ",l)),c.a.createElement("div",{className:"masthead-feed"},c.a.createElement(m.a,{to:"/atom.xml"},c.a.createElement("span",{className:"icon-rss"})," ")),c.a.createElement("div",{className:"clearfix"}))),c.a.createElement("div",{className:"content container"},t)),c.a.createElement("label",{htmlFor:"sidebar-checkbox",className:"sidebar-toggle"}))},data:i})}},157:function(e,t,a){"use strict";var n=a(158),r=a(0),i=a.n(r),l=a(55),c=a(166),s=a.n(c);t.a=function(e){var t=e.pageData;return i.a.createElement(l.StaticQuery,{query:"294076752",render:function(e){var a=e.site.siteMetadata,n=a.url,r=t.fields||{},l=r.tags||[],c=null!=r.title?r.title+" · "+a.title:a.title+" · "+a.tagline,o=t.excerpt?t.excerpt:a.description,m=null!=r.url?r.url:null!=t.url?t.url:"";return i.a.createElement(s.a,null,i.a.createElement("meta",{charset:"utf-8"}),i.a.createElement("meta",{"http-equiv":"X-UA-Compatible",content:"IE=edge"}),i.a.createElement("meta",{"http-equiv":"content-type",content:"text/html; charset=utf-8"}),i.a.createElement("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0, maximum-scale=1"}),i.a.createElement("meta",{name:"keywords",content:l.join(",")}),i.a.createElement("meta",{name:"description",content:o}),i.a.createElement("meta",{name:"googlebot",content:"index,follow"}),i.a.createElement("meta",{name:"google-site-verification",content:"jNB_RpsVIbD_zo20cgitqGwzGVqV8q2otgU18nVlFTo"}),i.a.createElement("meta",{property:"og:url",content:""+n+m}),i.a.createElement("meta",{property:"og:type",content:"website"}),i.a.createElement("meta",{property:"og:title",content:c}),i.a.createElement("meta",{property:"og:image",content:n+"/img/profile_pic.png"}),i.a.createElement("meta",{property:"og:description",content:o}),i.a.createElement("meta",{property:"og:site_name",content:a.title+" · "+a.tagline}),i.a.createElement("meta",{property:"og:locale",content:"en_US"}),i.a.createElement("meta",{name:"twitter:card",content:"summary"}),i.a.createElement("meta",{name:"twitter:site",content:"@_anmonteiro"}),i.a.createElement("meta",{name:"twitter:creator",content:"@_anmonteiro"}),i.a.createElement("meta",{name:"twitter:url",content:""+n+m}),i.a.createElement("meta",{name:"twitter:title",content:c}),i.a.createElement("meta",{name:"twitter:description",content:o}),i.a.createElement("meta",{name:"twitter:image",content:n+"/img/profile_pic.png"}),i.a.createElement("link",{href:"http://gmpg.org/xfn/11",rel:"profile"}),i.a.createElement("link",{rel:"me",href:"https://twitter.com/_anmonteiro",type:"text/html"}),i.a.createElement("link",{rel:"archives",href:n+"/archive/",title:"Archive"}),i.a.createElement("link",{rel:"index",href:n,title:a.title+" · "+a.tagline}),i.a.createElement("link",{rel:"canonical",href:""+n+m}),i.a.createElement("title",null,c),i.a.createElement("link",{rel:"apple-touch-icon-precomposed",sizes:"144x144",href:"/apple-touch-icon-144-precomposed.png"}),i.a.createElement("link",{rel:"shortcut icon",href:"/favicon.ico"}),i.a.createElement("link",{rel:"alternate",type:"application/atom+xml",title:"RSS",href:"/atom.xml"}))},data:n})}},158:function(e){e.exports={data:{site:{siteMetadata:{title:"anmonteiro",description:"\n    I'm a Software Engineer with a passion for entrepreneurship and open-source\n    software. This is where I write about software engineering, programming and\n    lifestyle.",tagline:"Code ramblings",url:"https://anmonteiro.com"}}}}}}]);
//# sourceMappingURL=component---src-templates-post-js-98213aa24fcbe23e4c40.js.map
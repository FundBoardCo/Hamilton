(this.webpackJsonpdatatool=this.webpackJsonpdatatool||[]).push([[0],{127:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),c=t(28),o=t.n(c),l=(t(97),t(98),t(11)),s=t(85),i=t(19),u=t(18),m=t(32),d=t(86),p=t.n(d),h=t(90),_=t(8),E=(t(54),t(20)),b=t(63);function f(e){return!!e&&(e.response&&e.response.data?e.response.data.error?e.response.data.error:e.response.data:e.message?e.message:"object"===typeof e?JSON.stringify(e):e)}function g(e){return"string"!==typeof e?"":"".concat(e.charAt(0).toUpperCase()).concat(e.slice(1))}var v={auth_state:null,logout_state:null,newUser_state:null,search_state:null,updateUser_state:null},y=Object(_.a)(Object(_.a)({},v),{},{auth_state:null,logout_state:null,newUser_state:null,updateUser_state:null,auth_user:null,search:{results_state:null,results:[]},updateUserModal_show:!1}),k=Object(u.c)({initialState:y,airtable:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=arguments.length>1?arguments[1]:void 0;switch(console.log(a),a.type){case"AIRTABLE_GET_KEYWORDS_REQUESTED":return Object(_.a)(Object(_.a)({},e),{},{keywords:{state:"pending"}});case"AIRTABLE_GET_KEYWORDS_SUCCEEDED":return Object(_.a)(Object(_.a)({},e),{},{keywords:{state:"succeeded",data:a.data.records.map((function(e){return g(e.fields.Keyword)})).sort()}});case"AIRTABLE_GET_KEYWORDS_FAILED":return Object(_.a)(Object(_.a)({},e),{},{keywords:{state:f(a.error)}});default:return e}},people:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=arguments.length>1?arguments[1]:void 0,t={},n={investments:[{id:"foo1",name:"Nuve",startup_permalink:"nuve",logo_url:"https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1397188930/e7218786673eb38ad8de0a87dee6f34c.jpg",founders:[{name:"Elom Tsogbe",permalink:"elom-tsogbe",image_url:"https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/nh2fbkwucvqf8kmuir2u"}]},{id:"foo2",name:"Fetch Package",startup_permalink:"fetch-package",logo_url:"https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/jsfia9zgl83floeiazck",founders:[{name:"Boone Putney",permalink:"boone-putney",image_url:"https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1437093545/ibiepnrnymghaiu8nm2x.jpg"}]},{id:"foo3",name:"SpyCloud, Inc.",startup_permalink:"spycloud-inc",logo_url:"https://res-5.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1496321283/mjf4w9kc2c3dvahf5qmt.png",founders:[{name:"Jennifer Parker-Snider",permalink:"jennifer-parker-snider",image_url:"https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/vncusmb4owdry1pyfc7q"}]},{id:"foo4",name:"Outbound Engine",startup_permalink:"outboundengine",logo_url:"https://res-4.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1490121099/gutbkjabw5gwyay7hc6u.png",founders:[{name:"Sharon Slonaker, SPHR, SHRM-SCP",permalink:"sharon-slonaker-sphr-shrm-scp",image_url:"https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/i26pvn1tgt2qm5bcsvkl"}]},{id:"foo5",name:"NarrativeDx",startup_permalink:"narrativedx",logo_url:"https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/xdc5t6gzrk2dd3qvmcuv",founders:[{name:"David Sassen",permalink:"david-sassen",image_url:"https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/jz0vv1uwojk0mprby49g"}]},{id:"foo6",name:"StackEngine",startup_permalink:"stackengine",logo_url:"https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1401710880/pbuw8i0trst6atnkxbie.jpg",founders:[{name:"Jonathan Reeve",permalink:"jonathan-reeve",image_url:"https://res-4.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1450219352/dqi4ndwk2k1tm7drmlmk.jpg"}]},{id:"foo7",name:"Favor",startup_permalink:"favor",logo_url:"https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1504818744/hudc0ohrdxaeke6u60zn.png",founders:[{name:"Jag Bath",permalink:"jag-bath",image_url:"https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/uq3hxcigkd8ggs3myx0y"}]},{id:"foo1b",name:"Nuve",startup_permalink:"nuve",logo_url:"https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1397188930/e7218786673eb38ad8de0a87dee6f34c.jpg",founders:[{name:"Elom Tsogbe",permalink:"elom-tsogbe",image_url:"https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/nh2fbkwucvqf8kmuir2u"}]},{id:"foo2b",name:"Fetch Package",startup_permalink:"fetch-package",logo_url:"https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/jsfia9zgl83floeiazck",founders:[{name:"Boone Putney",permalink:"boone-putney",image_url:"https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1437093545/ibiepnrnymghaiu8nm2x.jpg"}]},{id:"foo3b",name:"SpyCloud, Inc.",startup_permalink:"spycloud-inc",logo_url:"https://res-5.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1496321283/mjf4w9kc2c3dvahf5qmt.png",founders:[{name:"Jennifer Parker-Snider",permalink:"jennifer-parker-snider",image_url:"https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/vncusmb4owdry1pyfc7q"}]},{id:"foo4b",name:"Outbound Engine",startup_permalink:"outboundengine",logo_url:"https://res-4.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1490121099/gutbkjabw5gwyay7hc6u.png",founders:[{name:"Sharon Slonaker, SPHR, SHRM-SCP",permalink:"sharon-slonaker-sphr-shrm-scp",image_url:"https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/i26pvn1tgt2qm5bcsvkl"}]},{id:"foo5b",name:"NarrativeDx",startup_permalink:"narrativedx",logo_url:"https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/xdc5t6gzrk2dd3qvmcuv",founders:[{name:"David Sassen",permalink:"david-sassen",image_url:"https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/jz0vv1uwojk0mprby49g"}]},{id:"foo6b",name:"StackEngine",startup_permalink:"stackengine",logo_url:"https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1401710880/pbuw8i0trst6atnkxbie.jpg",founders:[{name:"Jonathan Reeve",permalink:"jonathan-reeve",image_url:"https://res-4.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1450219352/dqi4ndwk2k1tm7drmlmk.jpg"}]},{id:"foo7b",name:"Favor",startup_permalink:"favor",logo_url:"https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1504818744/hudc0ohrdxaeke6u60zn.png",founders:[{name:"Jag Bath",permalink:"jag-bath",image_url:"https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/uq3hxcigkd8ggs3myx0y"}]}]};switch(a.type){case m.a:return Object(_.a)(Object(_.a)({},e),a.payload.people);case"PEOPLE_UPDATE":return a.data.records&&a.data.records.forEach((function(e){t[e.id]=Object(_.a)(Object(_.a)({},n),e.fields)})),Object(_.a)(Object(_.a)({},e),t);default:return e}},search:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=arguments.length>1?arguments[1]:void 0,t={},n={isLead:!0,isOpen:!0,isImpact:!0,matches:{keywords:["B2B","AI","Automation","AR"],raise:!0,location:!0,name:!0,org:!0}};switch(a.type){case m.a:return Object(_.a)(Object(_.a)({},e),a.payload.search);case"SEARCH_SET_KEYWORDS":return Object(_.a)(Object(_.a)({},e),{},{keywords:Array.isArray(a.keywords)?a.keywords:[]});case"SEARCH_SET_RAISE":return Object(_.a)(Object(_.a)({},e),{},{raise:"number"===typeof a.raise?a.raise:0});case"SEARCH_SET_LOCATION":return Object(_.a)(Object(_.a)({},e),{},{location:a.location});case"SEARCH_SET_REMOTE":return Object(_.a)(Object(_.a)({},e),{},{remote:a.remote});case"SEARCH_GET_RESULTS_REQUESTED":return Object(_.a)(Object(_.a)({},e),{},{results_state:"pending"});case"SEARCH_GET_RESULTS_SUCCEEDED":return a.data.records&&a.data.records.forEach((function(e){t[e.id]=Object(_.a)(Object(_.a)({},n),e.fields)})),Object(_.a)(Object(_.a)({},e),{},{results:t,results_state:"succeeded"});case"SEARCH_GET_RESULTS_FAILED":return Object(_.a)(Object(_.a)({},e),{},{results_state:f(a.error)});default:return e}}}),w=t(27),j=t.n(w),O=t(25),S=t(68),N=t.n(S),x=["keywords","raise","location"],T=j.a.mark(D),I=j.a.mark(q),R=j.a.mark(z),C=j.a.mark(F),A=j.a.mark(U);function L(){return N.a.get("https://api.airtable.com/v0/app5hJojHQxyJ7ElS/Keywords",{headers:{Authorization:"Bearer ".concat("keym1B881Ly2v7cNw")}})}function D(){var e;return j.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,Object(O.a)(L);case 3:return e=a.sent,a.next=6,Object(O.c)({type:"AIRTABLE_GET_KEYWORDS_SUCCEEDED",data:e.data});case 6:a.next=12;break;case 8:return a.prev=8,a.t0=a.catch(0),a.next=12,Object(O.c)({type:"AIRTABLE_GET_KEYWORDS_FAILED",error:a.t0});case 12:case"end":return a.stop()}}),T,null,[[0,8]])}function q(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(O.d)("AIRTABLE_GET_KEYWORDS_REQUESTED",D);case 2:case"end":return e.stop()}}),I)}function B(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},a=e.keywords,t=e.raise,n=e.location,r=[];return(a=a.reduce((function(e,a){var t=a.toLowerCase(),n=g(a),r="".concat(e).concat(e?", ":"",'FIND("').concat(t,'", {description})>0'),c="".concat(e).concat(e?", ":"",'FIND("').concat(n,'", {description})>0');return"".concat(r,", ").concat(c)}),""))&&a.length&&r.push(a),t&&r.push("AND({raise_min}<=".concat(t,",{raise_max}>=").concat(t,")")),n&&r.push('FIND("'.concat(n,'", {location_zipcode})>0')),N.a.get("https://api.airtable.com/v0/appDqWxN1pcWrdjsn/Investors",{params:{maxRecords:100,view:"Grid view",filterByFormula:"OR(".concat(r.join(","),")")},headers:{Authorization:"Bearer ".concat("keym1B881Ly2v7cNw")}})}function z(e){var a;return j.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,Object(O.a)(B,e.params);case 3:return a=t.sent,t.next=6,Object(O.c)({type:"SEARCH_GET_RESULTS_SUCCEEDED",data:a.data});case 6:return t.next=8,Object(O.c)({type:"PEOPLE_UPDATE",data:a.data});case 8:t.next=14;break;case 10:return t.prev=10,t.t0=t.catch(0),t.next=14,Object(O.c)({type:"SEARCH_GET_RESULTS_FAILED",error:t.t0});case 14:case"end":return t.stop()}}),R,null,[[0,10]])}function F(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(O.d)("SEARCH_GET_RESULTS_REQUESTED",z);case 2:case"end":return e.stop()}}),C)}function U(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(O.b)(q);case 2:return e.next=4,Object(O.b)(F);case 4:case"end":return e.stop()}}),A)}var P={key:"root",storage:p.a,blacklist:Object.keys(v)},H=Object(m.b)(P,k),M=Object(h.a)(),W=Object(u.e)(H,Object(u.a)(M)),G=Object(m.c)(W);M.run(U);var K=t(41),J=t(10),Y=t(61),Q=t(38),V=t(49),Z=t(89),$=t(15),X=t(16),ee=t(56),ae=t.n(ee),te=Object(J.h)((function(e){var a=e.children,t=e.location.pathname;return Object(n.useEffect)((function(){window.scrollTo(0,0)}),[t]),a||null})),ne=t(12);function re(){return r.a.createElement(ne.a,{id:"PageIntro",className:"pageContainer"},r.a.createElement("div",{className:"introTop"},r.a.createElement("img",{id:"Logo",className:"responsiveImg",src:ae.a,alt:"FundBoard Logo"}),r.a.createElement("h1",{className:"mb-lg-2 h3 h-lg-1"},"FundBoard"),r.a.createElement("p",{className:"text-center h5 h-sm-4"},"It should be easier to find investors that want to fund your startup."),r.a.createElement("p",{className:"text-center h5 h-sm-4"},"Now it is.")),r.a.createElement("div",{className:"introBottom"},r.a.createElement("a",{href:"/introSearch",className:"btn btn-secondary btnNoMax mb-3 mb-lg-4"},"Build your FundBoard"),r.a.createElement("p",{className:"txSm tx-lg-tx text-center"},"Are you ready to raise a round? Click the button above to get started."),r.a.createElement("p",{className:"txSm tx-lg-tx text-center"},"If not, you can ",r.a.createElement("a",null,"learn more about building and funding your startup here."))))}var ce=t(14);function oe(){var e=Object(l.c)((function(e){return e.search.keywords}))||[],a=Object(l.c)((function(e){return e.airtable.keywords}))||{},t=Array.isArray(a.data)?a.data:[],c=Object(l.b)();Object(n.useEffect)((function(){Array.isArray(a.data)||a.state||c({type:"AIRTABLE_GET_KEYWORDS_REQUESTED"})}));var o=function(e){return c({type:"SEARCH_SET_KEYWORDS",keywords:e})};return r.a.createElement(ne.a,{id:"Keywords"},r.a.createElement(ce.a,{className:"keywordsInner"},r.a.createElement("h1",{className:"text-center"},"We Are"),r.a.createElement("p",{className:"text-center"},"Choose up to 5 keywords that describe your startup."),r.a.createElement("div",{className:"tiles"},t.map((function(a){var t=e.includes(a);return(r.a.createElement("button",{className:"tile ".concat(t?"active":""),onClick:function(){return function(a,t){t?o(e.filter((function(e){return e!==a}))):e.length<5&&o([].concat(Object(b.a)(e),[a]))}(a,t)},key:a,tabIndex:0,type:"button"},a))})))))}var le=t(88),se=t.n(le);function ie(){var e=Object(l.c)((function(e){return e.search.raise}))||1e5,a=Object(n.useState)(e),t=Object(E.a)(a,2),c=t[0],o=t[1],s=Object(l.b)(),i=function(e){o(e),s({type:"SEARCH_SET_RAISE",raise:e})},u=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});return r.a.createElement(ne.a,{id:"Raise"},r.a.createElement(ce.a,{className:"raiseInner"},r.a.createElement("h1",{className:"text-center"},"Raising"),r.a.createElement("p",{className:"text-center"},"Select the amount you are raising."),r.a.createElement("h2",{className:"text-center"},u.format(c)),r.a.createElement("div",{className:"sliderWrapper"},r.a.createElement(se.a,{value:c,min:1e5,max:1e7,step:1e5,size:"lg",variant:"primary",tooltip:"on",onChange:function(e){return i(Number(e.target.value))}}))))}var ue=t(39),me=t(40);function de(){var e=Object(l.c)((function(e){return e.search.keywords}))||[],a=Object(l.c)((function(e){return e.search.raise}))||1e5,t=Object(l.c)((function(e){return e.search.location}))||"",c=Object(n.useState)(t),o=Object(E.a)(c,2),s=o[0],i=o[1],u=Object(l.c)((function(e){return e.search.remote}))||"",m=Object(n.useState)(u),d=Object(E.a)(m,2),p=d[0],h=d[1],_=Object(n.useState)(!1),b=Object(E.a)(_,2),f=b[0],g=b[1],v=Object(n.useState)(!1),y=Object(E.a)(v,2),k=y[0],w=y[1],j=Object(l.b)(),O=Object(J.g)(),S=function(e){var a=e.currentTarget,t=e.target.value;g(!0),a.checkValidity()?(w(!0),i(t),j({type:"SEARCH_SET_LOCATION",location:t})):(i(t),w(!1))},N=function(e){h(e),j({type:"SEARCH_SET_REMOTE",remote:e})};return r.a.createElement(ne.a,{id:"Location"},r.a.createElement(ce.a,{className:"locationInner"},r.a.createElement("h1",{className:"text-center"},"Near"),r.a.createElement("p",{className:"text-center"},"The location of your office, or home if you're remote."),r.a.createElement("div",{className:"formWrapper"},r.a.createElement(ue.a,{noValidate:!0,validated:f},r.a.createElement(ue.a.Group,{controlId:"LocationInput"},r.a.createElement(ue.a.Label,null,"My Zip Code (5 digit)"),r.a.createElement(ue.a.Control,{required:!0,maxLength:5,pattern:"[0-9]{5}",type:"text",placeholder:"zip code",value:s,onChange:function(e){return S(e)},isInvalid:f&&!k}),r.a.createElement(ue.a.Control.Feedback,{type:"invalid"},"Please enter a valid zip code.")),r.a.createElement(ue.a.Group,{controlId:"RemoteCheckbox",className:"mb-4"},r.a.createElement(ue.a.Check,{type:"checkbox",label:"We're fully remote, but I still entered my zip code.",checked:p,onChange:function(e){return N(e.target.checked)}})),r.a.createElement(me.a,{variant:"secondary",className:"btnNoMax",disabled:!t,onClick:function(){!function(){var n={};n.location=t,n.raise=a,n.keywords=e,j({type:"SEARCH_GET_RESULTS_REQUESTED",params:n})}(),O.push("/search")}},"See My Matches")))))}function pe(){var e=Object(n.useState)(0),a=Object(E.a)(e,2),t=a[0],c=a[1];Object(l.c)((function(e){return e.search.keywords})),Object(l.c)((function(e){return e.search.raise})),Object(l.c)((function(e){return e.search.location}));console.log(t),console.log(x.length);return r.a.createElement("div",{id:"PageIntroSearch",className:"pageContainer"},"keywords"===x[t]&&r.a.createElement(oe,null),"raise"===x[t]&&r.a.createElement(ie,null),"location"===x[t]&&r.a.createElement(de,null),r.a.createElement(Y.a,{className:"nav"},r.a.createElement(Q.a,null,r.a.createElement("a",{className:"nav-link",onClick:function(){t>0&&c(t-1)},"aria-disabled":0===t},r.a.createElement(X.a,{icon:"caret-left"}),0!==t&&r.a.createElement("span",null,"Back to ",x[t-1])),r.a.createElement("div",null,"Step ".concat(t+1," of ").concat(x.length)),r.a.createElement("a",{className:"nav-link",onClick:function(){t<x.length-1&&c(t+1)},"aria-disabled":t>=x.length-1},t<x.length-1&&r.a.createElement("span",null,"Forward to ",x[t+1]),r.a.createElement(X.a,{icon:"caret-right"})))))}var he=t(36);function _e(){return r.a.createElement(ne.a,{className:"pageContainer"},r.a.createElement(he.a,{fluid:!0},r.a.createElement(ne.a,null,r.a.createElement(ce.a,null,r.a.createElement("h1",null,"My FundBoard"))),r.a.createElement(ne.a,null,r.a.createElement(ce.a,{xs:12},"Placeholder for board"))))}var Ee=t(42),be=t(43),fe=t.n(be);function ge(e){var a=e.imgSrc,t=void 0===a?"":a,n=e.alt,c=void 0===n?"":n,o=Object(Ee.useImage)({srcList:t||fe.a}).src;return r.a.createElement("img",{src:o,alt:c||"",className:"responsiveImg"})}function ve(e){var a="".concat(e["first name"]," ").concat(e["last name"]),t=e.uuid,c=e.image_id,o=e.primary_job_title,l=e.primary_organization,s=e.matches,u=(e.isLead,e.isOpen,e.isImpact,Object(_.a)({},s)),m=u.keywords&&u.keywords.length||0;u.raise&&(m+=1),u.location&&(m+=1),m=Math.floor(m/7*100);var d=Object(J.g)(),p=function(){d.push("/search/".concat(t))};return r.a.createElement("div",{className:"person"},r.a.createElement("button",{className:"thumb",onClick:p,type:"button"},r.a.createElement(n.Suspense,{fallback:r.a.createElement(i.a,{animation:"border",role:"status",size:"sm"})},r.a.createElement(ge,{imgSrc:c,alt:a}))),r.a.createElement("div",{className:"content"},r.a.createElement("div",null,r.a.createElement("h1",null,r.a.createElement("button",{onClick:p,type:"button"},a))),r.a.createElement("div",{className:"d-flex details"},r.a.createElement("div",{className:"orgLogoWrapper"},r.a.createElement(n.Suspense,{fallback:r.a.createElement(i.a,{animation:"border",role:"status",size:"sm"})},r.a.createElement(ge,{imgSrc:"",alt:a}))),r.a.createElement("div",{className:"orgText"},r.a.createElement("div",null,"".concat(o).concat(o&&","),"".concat(o?"\xa0":""),l)))),r.a.createElement("div",{className:"controls"},r.a.createElement(me.a,{variant:"icon-info",className:"iconBtn addBtn"},r.a.createElement(X.a,{icon:"plus-circle"})),r.a.createElement("div",{className:"percentageMatch"},"".concat(m,"%"))))}function ye(){var e=Object(l.c)((function(e){return e.search.keywords}))||[],a=Object(l.c)((function(e){return e.search.raise}))||1e5,t=Object(l.c)((function(e){return e.search.location}))||"",c=Object(l.c)((function(e){return e.search.results}))||[],o=Object(l.c)((function(e){return e.search.results_state}))||"";console.log(c);var s=Object(n.useState)(!1),u=Object(E.a)(s,2),m=u[0],d=u[1],p=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});return r.a.createElement(ne.a,{id:"PageSearch",className:"pageContainer"},"pending"===o&&r.a.createElement(i.a,null),r.a.createElement("div",{className:"searchDetailsBar"},r.a.createElement("div",{className:"primaryDetails"},r.a.createElement(me.a,{className:"primaryDetailsLink",variant:"text-light",onClick:function(){d(!m)}},"".concat(Object.keys(c).length," investors match")),r.a.createElement(me.a,{variant:"primary-light",className:"btnTn inlineBtn"},r.a.createElement(X.a,{icon:"edit"}),"edit")),m&&r.a.createElement("div",{className:"secondaryDetails"},r.a.createElement("p",null,"You searched for: ".concat(e.join())),r.a.createElement("p",null,"Raise: ".concat(p.format(a))),r.a.createElement("p",null,"Location: ".concat(t)))),r.a.createElement("div",{className:"results"},Object.keys(c).map((function(e){var a=Object(_.a)({},c[e]);a.uuid=e;var t=a.permalink||a.image_id;return(r.a.createElement(ve,Object.assign({key:t},a)))}))))}function ke(){return r.a.createElement(ne.a,{className:"pageContainer"},r.a.createElement(he.a,{fluid:!0},r.a.createElement(ne.a,null,r.a.createElement(ce.a,null,r.a.createElement("h1",null,"My FundBoard"))),r.a.createElement(ne.a,null,r.a.createElement(ce.a,{xs:12},"Placeholder for profile"))))}function we(){return r.a.createElement(ne.a,{className:"pageContainer"},r.a.createElement(he.a,{fluid:!0},r.a.createElement(ne.a,null,r.a.createElement(ce.a,null,r.a.createElement("h1",null,"My FundBoard"))),r.a.createElement(ne.a,null,r.a.createElement(ce.a,{xs:12},"Placeholder for login"))))}function je(){return r.a.createElement(ne.a,{className:"pageContainer"},r.a.createElement(he.a,{fluid:!0},r.a.createElement(ne.a,null,r.a.createElement(ce.a,null,r.a.createElement("h1",null,"My FundBoard"))),r.a.createElement(ne.a,null,r.a.createElement(ce.a,{xs:12},"Placeholder for not found"))))}ve.defaultProps={uuid:"not found",image_id:"",primary_job_title:"",primary_organization:"",matches:{keywords:["one","two"],raise:!0,location:!1,name:!1,org:!1},isLead:!1,isOpen:!1,isImpact:!1};var Oe=t(45),Se=t(91);function Ne(e){var a=e.imgSrc,t=void 0===a?"":a,n=e.alt,c=void 0===n?"":n,o=Object(Ee.useImage)({srcList:t||fe.a}).src;return r.a.createElement("img",{src:o,alt:c||"",className:"responsiveImg"})}function xe(e){var a=e.name,t=e.permalink,c=e.image_url,o=e.org_name,l=e.logo_url;return(r.a.createElement("div",{className:"personStamp"},r.a.createElement("a",{href:"https://www.crunchbase.com/person/".concat(t),target:"_blank",rel:"noreferrer"},r.a.createElement("div",{className:"imageWrapper"},r.a.createElement(n.Suspense,{fallback:r.a.createElement(i.a,{animation:"border",role:"status",size:"sm"})},r.a.createElement(Ne,{imgSrc:c,alt:a})),r.a.createElement("div",{className:"orgLogoWrapper"},r.a.createElement(n.Suspense,{fallback:r.a.createElement(i.a,{animation:"border",role:"status",size:"sm"})},r.a.createElement(Ne,{imgSrc:l,alt:o})))),r.a.createElement("div",{className:"content"},r.a.createElement("h1",{className:"clamp2"},a),r.a.createElement("span",{className:"clamp2"},o)))))}function Te(e){var a=e.imgSrc,t=void 0===a?"":a,n=e.alt,c=void 0===n?"":n,o=Object(Ee.useImage)({srcList:t||fe.a}).src;return r.a.createElement("img",{src:o,alt:c||"",className:"responsiveImg"})}xe.defaultProps={name:"",permalink:"",image_url:"",org_name:"",logo_url:""};var Ie=[{key:"isLead",faIcon:"flag",text:"They lead funding rounds."},{key:"isOpen",faIcon:"door-open",text:"They are open to direct outreach."},{key:"isImpact",faIcon:"balance-scale",text:"Their organization is an impact fund."}];function Re(e){var a=e.faIcon,t=e.text;return(r.a.createElement("li",null,r.a.createElement("div",{className:"iconDisc bg-primary"},r.a.createElement(X.a,{icon:a})),r.a.createElement("span",null,t)))}var Ce=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});function Ae(e){var a=e.match.params.investor,t=Object(l.c)((function(e){return e.people}))[a]||{};console.log(t);var c=t.twitter.substr(t.twitter.lastIndexOf("/")+1),o=Object(l.c)((function(e){return e.search.results[a]}));console.log(o);var s=o.matches,u=s.keywords&&s.keywords.length||0;s.raise&&(u+=1),s.location&&(u+=1),u=Math.floor(u/7*100);var m="".concat(t["first name"]," ").concat(t["last name"]),d=Object(J.g)();return r.a.createElement(Oe.a,{size:"lg","aria-labelledby":"Modal-Title",centered:!0,show:!0,scrollable:!0,onHide:function(){d.goBack()},className:"modal-investor"},r.a.createElement(Oe.a.Header,{closeButton:!0},r.a.createElement(Oe.a.Title,{className:"sr-only"},m)),r.a.createElement(Oe.a.Body,null,r.a.createElement("div",{className:"investorHeader mb-2"},r.a.createElement("div",{className:"thumbCol"},r.a.createElement("div",{className:"thumb"},r.a.createElement(n.Suspense,{fallback:r.a.createElement(i.a,{animation:"border",role:"status",size:"sm"})},r.a.createElement(Te,{imgSrc:t.image_id,alt:m})))),r.a.createElement("div",{className:"d-flex flex-column"},r.a.createElement("h1",null,m),r.a.createElement("div",{className:"orgDetails"},r.a.createElement("div",{className:"orgLogoWrapper"},r.a.createElement(n.Suspense,{fallback:r.a.createElement(i.a,{animation:"border",role:"status",size:"sm"})},r.a.createElement(Te,{imgSrc:t.logo,alt:t.primary_organization}))),r.a.createElement("div",null,"".concat(t.primary_job_title).concat(t.primary_job_title&&","),"".concat(t.primary_job_title?"\xa0":""),t.primary_organization)))),r.a.createElement("div",{className:"crunchBaseAttribution mb-2"},"Sourced from CrunchBase.\xa0",r.a.createElement("a",{href:t.crunchbase,target:"_blank",rel:"noreferrer"},"Click to view profile.")),t.description&&r.a.createElement("div",{className:"description mb-3"},t.description),r.a.createElement("div",{className:"matches"},r.a.createElement("h2",null,"".concat(u,"% Match")),r.a.createElement("ul",null,Ie.map((function(e){return o[e.key]?r.a.createElement(Re,e):null})),Array.isArray(s.keywords)&&s.keywords.length&&r.a.createElement(Re,{faIcon:"key",text:"Their matching interests: ".concat(s.keywords.join(", "),".")}),s.raise&&r.a.createElement(Re,{faIcon:"rocket",text:"They invest between ".concat(Ce.format(t.raiseMin)," and ").concat(Ce.format(t.raiseMax),".")}),s.location&&r.a.createElement(Re,{faIcon:"map-marker-alt",text:"They are located in ".concat(t.location_city,", ").concat(t.location_state)}))),r.a.createElement("div",{className:"funded"},r.a.createElement("h2",null,"Founders they've funded"),r.a.createElement("div",{className:"founders"},t.investments.map((function(e){var a=Object(_.a)({org_name:e.name,logo_url:e.logo_url},e.founders[0]);return(r.a.createElement(xe,Object.assign({key:e.id},a)))})))),r.a.createElement("div",{className:"twitterFeed"},c&&r.a.createElement(Se.a,{dataSource:{sourceType:"profile",screenName:c},options:{height:"400",tweetLimit:"3"}})),t.linkedin&&r.a.createElement("div",{className:"mb-4 h3 text-linkedin d-flex"},r.a.createElement(X.a,{icon:["fab","linkedin"]}),"\xa0",r.a.createElement("a",{href:t.linkedin,className:"text-linkedin"},"LinkedIn Profile")),r.a.createElement("div",{className:"mb-4 h3 text-danger d-flex"},r.a.createElement(X.a,{icon:"exclamation-triangle"}),"\xa0",r.a.createElement("a",{href:t.linkedin,className:"text-danger"},"I think this profile is out of date."))),r.a.createElement(Oe.a.Footer,null,r.a.createElement("button",{className:"addBtn",type:"button",onClick:function(){console.log("ping")}},"Add to my FundBoard")))}function Le(){return r.a.createElement(J.d,null,r.a.createElement(J.b,{path:"/search/:investor",component:Ae}),r.a.createElement(J.b,{path:"/board/:investor",component:Ae}))}Ae.defaultProps={match:{}},V.b.add(Z.a,$.a,$.b,$.c,$.d,$.e,$.f,$.g,$.h,$.i,$.j,$.k,$.l,$.m,$.n,$.o,$.p,$.q,$.r,$.s);var De=function(){return r.a.createElement(K.a,null,r.a.createElement(te,null,r.a.createElement(Y.a,{className:"nav"},r.a.createElement("a",{href:"/",className:"navBrand"},r.a.createElement("img",{className:"navLogo",src:ae.a,alt:"FundBoard Logo"}),r.a.createElement("span",{className:"navName"},"FundBoard"),r.a.createElement("span",{className:"navVersion"},"0.1")),r.a.createElement(Q.a,{className:"ml-auto",defaultActiveKey:window.location.pathname},!1,!1,!1,r.a.createElement(Q.a.Link,{as:K.b,href:"/login",to:"/login",className:"login",activeClassName:"login"},r.a.createElement(X.a,{icon:"sign-in-alt"}),r.a.createElement("span",null,"Log In")))),r.a.createElement("main",{id:"Main"},r.a.createElement("div",{className:"container-xl"},r.a.createElement(J.d,null,r.a.createElement(J.b,{path:"/",exact:!0},r.a.createElement(J.a,{to:"/intro"})),r.a.createElement(J.b,{path:"/intro",component:re}),r.a.createElement(J.b,{path:"/introsearch",component:pe}),r.a.createElement(J.b,{path:"/board",component:_e}),r.a.createElement(J.b,{path:"/search",component:ye}),r.a.createElement(J.b,{path:"/profile",component:ke}),r.a.createElement(J.b,{path:"/login",component:we}),r.a.createElement(J.b,{component:je})))),r.a.createElement(Le,null)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(l.a,{store:W},r.a.createElement(s.a,{loading:r.a.createElement(i.a,null),persistor:G},r.a.createElement(De,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},43:function(e,a,t){e.exports=t.p+"static/media/greySquare.af186e0f.jpg"},56:function(e,a,t){e.exports=t.p+"static/media/FundBoard_Logo.4f77b573.svg"},92:function(e,a,t){e.exports=t(127)},97:function(e,a,t){},98:function(e,a,t){}},[[92,1,2]]]);
//# sourceMappingURL=main.9afc13c7.chunk.js.map
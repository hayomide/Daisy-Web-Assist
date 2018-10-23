    var host = location.host, www = host === 'www.ejasounds.com' ? true : false, smart = host === 'smart.ejasounds.com' ? true : false, mobile = host === 'mobile.ejasounds.com' ? true : false, blov = document.getElementById('blov'), blovShow = document.getElementById('blovShow');

    function rAf(check) {
        return window.requestAnimationFrame(check) || window.webkitRequestAnimationFrame(check) || window.mozRequestAnimationFrame(check) || window.oRequestAnimationFrame(check) || window.msRequestAnimationFrame(check) || function(check) {
            window.setTimeout(check, 1000 / 60);
        };
    }
    function clearRaf(check) {
        return window.cancelAnimationFrame(check) || window.webkitCancelAnimationFrame(check) || window.mozCancelAnimationFrame(check) || window.oCancelAnimationFrame(check) || window.msCancelAnimationFrame(check) || function(check) {
            window.clearTimeout(check);
        };
    }

    function stripTags(str) {
        str = str.replace(/<br>/gi, "\n");
        str = str.replace(/<p.*>/gi, "\n");
        str = str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
        str = str.replace(/<(?:.|\s)*?>/g, "");
        return str;
    }

    function invite(lc) {
        rAf(function() {
            lc.classList.remove('faded', 'flown-up', 'flown-right', 'flown-dwn', 'flown-lft', 'scaled-up', 'scaled-dwn', 'nodsp');
            lc.classList.add('invited');
        });
    }

    function sendAway(lc) {
        var lCn = lc.className,flyMat=lCn.match(/\btransit-fly-(up|right|dwn|lft)\b/),sclMat=lCn.match(/\btransit-scale-(up|dwn)\b/);
        if (/\btransit-fade-out\b/.test(lCn))
            rAf(function() {
                lc.classList.add('faded');

            });
        if (/\btransit-nodsp\b/.test(lCn))
            rAf(function() {
                lc.classList.add('nodsp');
            });
        if (flyMat && flyMat[1])
            rAf(function() {
                lc.classList.add('flown-' + flyMat[1]);
            });
        if (sclMat && sclMat[1])
            rAf(function() {
                lc.classList.add('scaled-' + sclMat[1]);
            });
        lc.classList.remove('invited');
    }

    function slaj(txt) {
        var ajnot = document.getElementById('ajnot');
        sendAway(ajnot);
        ajnot.classList.remove('err', 'suc');
        if (!ajnot.classList.contains('imp')) ajnot.classList.add('imp');
        var lc = document.getElementById('loadcont');
        invite(lc);
    }

    function dlaj() {
        var ajnot = document.getElementById('ajnot');
        ajnot.classList.remove('err', 'suc', 'imp');
        var lc = document.getElementById('loadcont');
        sendAway(lc);
    }

    function elaj(txt) {
        var ajnot = document.getElementById('ajnot');
        if (!txt) txt = 'Error!';
        ajnot.innerHTML = '<a class="cl" href="#">&times;</a>' + txt;
        var lc = document.getElementById('loadcont');
        invite(lc);
        ajnot.classList.remove('imp', 'suc');
        if (!ajnot.classList.contains('err')) ajnot.classList.add('err');
        dlaj();
    }



    function suclaj(txt) {
        var ajnot = document.getElementById('ajnot');
        if (!txt) txt = 'Success!';
        ajnot.innerHTML = '<a class="cl" href="#">&times;</a>' + txt;
        var lc = document.getElementById('loadcont');
        invite(lc);
        ajnot.classList.remove('err', 'imp');
        if (!ajnot.classList.contains('suc')) ajnot.classList.add('suc');
        dlaj();
    }

    function navhan(stats, resp, rs) {
        if(rs===4) {
            if(stats===200||stats===304) {
                var nc=resp,
                    ocel=document.getElementById('oc'),
                    ti=new Date().getTime();
                document.title=nc.substring(7, nc.indexOf('</title>'));
                ocel.innerHTML=nc.substr(nc.indexOf('<h1>'));
                if(history.pushState)
                    history.pushState({title:document.title,at:ti},document.title,this.link);
                location.hash='oc';
                invite(ocel);
                dlaj();
            } else elaj('HTTP '+stats+' error! Please retry later');
        }
        if(rs===0) elaj('Error! Please retry later');
    }

    function fonavhan(stats, resp, rs) {
        if(rs===4) {
            if(stats===200||stats===304) {
                document.getElementById('react_oc').innerHTML=resp;
                dlaj();
            } else elaj('HTTP '+stats+' error! Please retry later');
        }
        else if(rs===0) elaj('Error! Please retry later');
    }

    function navTo(lnk,handl, fromCache, loadNot) {
        var link,url,oc='oc',str=false,ajnot=document.getElementById('ajnot');
        if (typeof lnk==='string') {
            str=true;
            link=lnk;
        } else {
            if (lnk.hasAttribute('data-href')) link=lnk.getAttribute('data-href');
            if (lnk.hasAttribute('href')) link=lnk.getAttribute('href');
        }
        url=link;
        if (!str && lnk.hasAttribute('data-oc')) oc=lnk.getAttribute('data-oc');
        if(!fromCache) {
            url+=link.indexOf('?')===-1?'?t=':'&t=';
            url+=Math.floor(Math.random()*10);
        }
        if(loadNot&&typeof loadNot==='function')
            loadNot();
        else { location.hash = 'sbmtnForm'; invite(ajnot); }
        function resPond(stats,resp,rs) {
            if (rs===4) {
                if (stats===200||stats===304) {
                    var ti=new Date().getTime();
                    document.getElementById(oc).innerHTML=resp;
                    if(lnk.hasAttribute('data-jump-to'))
                        location.hash=lnk.getAttribute('data-jump-to');
                    if(lnk.getAttribute('data-tab')!==''||lnk.getAttribute('data-tab')!==null) {
                        if(history.pushState)
                            history.pushState({at:ti},'Tab '+url+' '+ti,lnk.getAttribute('data-tab'));
                        location.hash='oc';
                    }
                    dlaj();
                } else elaj('HTTP '+stats+' error! Please retry later');
            } else if (rs===0) elaj('Error! Please retry later');
        }
        function aborted() { elaj('Connection Aborted! You may retry loading'); }
        var xHr=window.XMLHttpRequest?new window.XMLHttpRequest():new window.ActiveXObject('Microsoft.XMLHTTP');
        xHr.link=link;
        xHr.open('GET',url,true);
        xHr.setRequestHeader('X-Requested-With','XMLHttpRequest');
        xHr.onreadystatechange=function() { !str&&lnk.hasAttribute('data-tab')?resPond(this.status,this.responseText,this.readyState):handl(this.status,this.responseText,this.readyState); };
        xHr.ontimeout=function() { elaj('Loading Timeout! Please retry later'); };
        xHr.onerror=function() { elaj('Network Connection Error! Please retry loading'); };
        xHr.onabort=aborted;
        xHr.send(null);
        window.addEventListener('popstate',function() { if(xHr) xHr.abort(); });
    }


    function subForm(f, fromCache, loadNot) {
        var url=f.getAttribute('data-action'),
            foc='foc',
            meth=f.getAttribute('method').toUpperCase(),
            ctype=f.hasAttribute('enctype')?f.getAttribute('enctype'):'application/x-www-form-urlencoded',
            form=serForm(f,false),ajnot=document.getElementById('ajnot');
        if (url==='null') {
            url=f.getAttribute('action');
            foc='oc';
        } else url=f.getAttribute('data-action');
        if (meth==='GET') {
            url+=url.indexOf('?')===-1?'?':'&';
            url+='&'+serForm(f,true);
        }

        if (!fromCache) {
            url+=url.indexOf('?')===-1?'?t=':'&t=';
            url+=Math.floor(Math.random()*10);
        }

        if (f.hasAttribute('data-foc')) foc=f.getAttribute('data-foc');
        if (loadNot&&typeof loadNot==='function') loadNot();
        else { location.hash='submitingForm'; invite(ajnot); }
        function aborted() { elaj('Connection Aborted! You may retry loading'); }
        var xHr=window.XMLHttpRequest?new window.XMLHttpRequest():new window.ActiveXObject('Microsoft.XMLHTTP');
        xHr.open(meth,url,true);
        xHr.setRequestHeader('X-Requested-With','XMLHttpRequest');
        xHr.setRequestHeader('Content-Type',ctype);
        xHr.onreadystatechange=function() {
            if (this.readyState===4) {
                if (this.status===200||this.status===304) {
                    var ti=new Date().getTime();
                    if (document.getElementById(foc))
                        document.getElementById(foc).innerHTML=xHr.responseText;
                    if (meth==='GET') {
                        if (history.pushState) history.pushState({at:ti},'Tab '+url+' '+ti,url);
                        location.hash = 'oc';
                    }
                    dlaj();
                } else elaj('HTTP '+this.status+' error! Please retry later');
            }
            if (this.readyState === 0) elaj('Error! Please retry later');
        };
        xHr.ontimeout=function() { elaj('Loading Timeout! Please retry later'); };
        xHr.onerror=function() { elaj('Network Connection Error! Please retry loading'); };
        xHr.onabort=function() { elaj('Connection Aborted! You may retry loading'); };
        xHr.send(meth==='POST'?form:null);
        window.addEventListener('popstate',function() { if(xHr) xHr.abort(); });
    }

    function popUp(txt) {
        var blov=document.getElementById('blov'),blovShow=document.getElementById('blovShow');
        blovShow.innerHTML='<a href="#newPopup" class="cl">&times;</a>'+txt;
        invite(blov);
        invite(blovShow);
        document.body.classList.add('novertscrolling');
    }

    function shwPop(href) {
        var id=href.substring(1),tgt=document.getElementById(id),blov=document.getElementById('blov');
        if (/\binvited\b/i.test(tgt.className)) { hidPop(href); return; }
        location.hash=id;
        invite(blov);
        invite(tgt);
        document.body.classList.add('novertscrolling');
    }

    function hidPop(href) {
        location.hash='popped';
        var blov=document.getElementById('blov');
        sendAway(blov);
        sendAway(document.getElementById(href.substring(1)));
        document.body.classList.remove('novertscrolling');
    }

    function shwLnk(href,origin,done) {
        var frmShow,orgn=origin?origin:new URL(href).origin+'/';
        slaj();
        if(!document.getElementById('frmShow')) {
            var blov=document.getElementById('blov'); frmShow=document.createElement('iframe');
            frmShow.id='frmShow';
            frmShow.classList.add('frmShow','popup','popup-transit','transit-scale-dwn','transit-fade-out','scaled-dwn','faded');
            rAf(function() { document.body.appendChild(frmShow); });
        } else frmShow=document.getElementById('frmShow');
        if(/smart\.ejasounds\.com/i.test(orgn)) orgn='https://www.ejasounds.com/';
        if(!done) done='See your results!';
        frmShow.setAttribute('data-origin',orgn);
        frmShow.setAttribute('data-done',done);
        frmShow.src=href;
        invite(blov);
        invite(frmShow);
        dlaj();
    }

    function callOn(href) {
        var id=href.substring(1),
            tgt=document.getElementById(id);
        location.hash=id;
        if (!/\binvited\b/.test(tgt.className)) invite(tgt);
        else { location.hash='dismissed'; sendAway(tgt); }
    }

    function aH(t) {
        if(t.hasAttribute('target')) return;
        var par=t.parentElement,
            parId=par.id,
            href=t.getAttribute('href'),
            tId=t.id,
            tCn=t.className,
            blov=document.getElementById('blov'),
            blovShow=document.getElementById('blovShow');
        if (t.hasAttribute('data-formlike'))
            navTo(t, fonavhan);
        else if(/\blnch-(popup|pnl)\b/.test(tCn)) {
            if (/^#[a-zA-Z_]/.test(href)) shwPop(href);
            else shwLnk(href);
        } else if(/\binviter\b/.test(tCn))
            callOn(href);
        else if(/\bcl\b/i.test(tCn)) {
            sendAway(blov);
            document.body.classList.remove('novertscrolling');
            if(parId==='usercheck') document.cookie='greeted=yes';
            else if(parId==='mobver') document.cookie='mobpref=no';
            else if(parId==='blovShow')
                blovShow.innerHTML='<a href="#" class="cl">&times;</a>';
            sendAway(par);
            location.hash='clsd';
        }
        // else if(!/^(#|http|mailto|tel|sms)/i.test(href) && !/\.(pdf|css|js|svg|jpe?g|png|gif)$/i.test(href)) return;
        else return;
    }

    function navig(e) {
        var tgt=e.target;
        if(!tgt) return;
        var tgtNam=tgt?tgt.tagName:null,
            par=tgt.parentElement,
            parNam=par?par.tagName:null,
            tgtCn=tgt.className;
        if (tgtNam&&tgtNam==='A'&&(tgt.hasAttribute('data-formlike')||/\b(lnch-(popup|pnl)|inviter|addrepl|cl)\b/i.test(tgtCn)))
            aH(tgt);
        else if(tgtNam&&tgtNam==='INPUT'&&(tgt.getAttribute('type')==='submit'||tgt.getAttribute('type')==='image')) {
            if(parNam!=='FORM'&&par.parentElement.tagName==='FORM') { par=par.parentElement; parNam=par.tagName; }
            if(par.hasAttribute('data-action')) subForm(par);
            else return;
        } else if (tgtNam&&tgtNam==='IMG') {
            if (/\blnch-(popup|pnl)\b/.test(tgt.className)) {
                if (tgt.hasAttribute('src')) popUp('<div class="img"><img src="' + tgt.getAttribute('src') + '"' + (tgt.hasAttribute('srcset') ? ' srcset="' + tgt.getAttribute('srcset') + '"' : '') + ' alt="' + tgt.getAttribute('alt') + '" /><br /><br /><a href="' + tgt.getAttribute('src') + '">Download Image</a></div>');
                else popUp('<div>Image file still downloading<br />Try again in a few minutes time</div>');
            } else if (parNam==='A')
                aH(par);
        } else return;
        e.preventDefault();
    }

    function panAddon(e) {
        var blov=document.getElementById('blov');
        if (isClickable(e.target)) {
            sendAway(blov);
            sendAway(this);
            document.body.classList.remove('novertscrolling');
        }
    }

    function clsPp() {
        var blov=document.getElementById('blov'),
            blovShow=document.getElementById('blovShow'),
            panes=document.getElementsByClassName('pnl'),
            pops=document.getElementsByClassName('popup');
        sendAway(blov);
        sendAway(blovShow);
        document.body.classList.remove('novertscrolling');
        blovShow.innerHTML='<a href="#" class="cl">&times;</a>';
        for (i=0; i <pops.length; i++) sendAway(pops[i]);
        for (i=0; i<panes.length; i++) sendAway(panes[i]);
        if(document.getElementById('frmShow')) { var frmShow=document.getElementById('frmShow'); frmShow.parentElement.removeChild(frmShow); }
    }

    function makeClickable(el, stats) {
        function retFalse() {
            return false;
        }
        if (!stats) {
            if (el.addEventListener) el.addEventListener('click',retFalse);
            else el.attachEvent('onclick',retFalse);
            el.classList.add('unclickable');
        } else {
            if (el.removeEventListener) el.removeEventListener('click',retFalse);
            else el.detachEvent('onclick',retFalse);
            el.classList.remove('unclickable');
        }
    }

    function isClickable(el) {
        var eltgNam=el.tagName;
        return eltgNam==='A'||eltgNam==='BUTTON'||(eltgNam==='INPUT'&&/^submit|button|reset|image$/i.test(el.getAttribute('type')))?true:false;
    }

    function notify(title, options, click, error) {
        if (!options) options={};
        // if (!options.icon) options.icon='/assets/images/icon.png';
        if (!options.lang) options.lang='EN';
        if (!click || typeof click !== 'function')
            click=function() {
                console.log('clicked');
            };
        if (!error||typeof error!=='function')
            error=function() {
                console.log('error occured');
            };
        var Not=window.Notification||window.webkitNotification||window.mozNotification;
        if (!Not) return;
        function toNot() {
            var not=new Not(title,options);
            not.onclick=click;
            not.onerror=error;
        }
        if(Not.permission==='granted') toNot();
        else if(Not.permission!=='denied') {
            Not.requestPermission(function(resp) {
                if(resp==='granted') toNot();
            });
        }
    }

    (function() {
        var i,
            pops=document.getElementsByClassName('popup'),
            panes=document.getElementsByClassName('pnl');
        for (i = 0; i < panes.length; i++) {
            if(panes[i].addEventListener) panes[i].addEventListener('click',panAddon,false);
            else panes[i].attachEvent('onclick',panAddon);
        }
        for (i=0; i<pops.length; i++) {
            if (pops[i].addEventListener) pops[i].addEventListener('click',panAddon,false);
            else pops[i].attachEvent('onclick',panAddon);
        }
    }
    )();

    function keyUp(e) {
        var key=e.key||e.keyCode||e.which;
        if(key==="Escape"||key==="Esc"||key===27) clsPp();
    }

    function chkIfrm() {
        if(!document.getElementById('frmShow')) return;
        var frmShow=document.getElementById('frmShow'),frmDoc=frmShow.contentDocument||frmShow.contentWindow.document;
        if(frmDoc.readyState==='complete') {
            var frmBase;
            if(!document.getElementById('base')) {
                frmBase=document.createElement('base');
                frmBase.id='frmBase';
            } else frmBase=document.getElementById('base');
            frmBase.href=frmShow.getAttribute('data-origin');
            frmDoc.head.appendChild(frmBase);
            readOutLoud(frmShow.getAttribute('data-done'));
            dlaj();
            return;
        }
        frmDoc.onerror=function() { clPp(); elaj('Error opening URL. While this may be our fault. Still check if your network connection is active'); };
        slaj();
        window.setTimeout(checkIframeLoaded,100);
    }

    if (window.addEventListener) {
        document.addEventListener('click',navig,true);
        document.body.addEventListener('load',chkIfrm,true);
        blov.addEventListener('click',clsPp);
        window.addEventListener('keyup',keyUp,false);
        window.addEventListener('popstate',clsPp);
    } else if (window.attachEvent) {
        document.attachEvent('onclick',navig);
        document.body.attachEvent('onload',chkIfrm);
        blov.attachEvent('onclick',clsPp);
        window.attachEvent('onkeyup',keyUp);
        window.attachEvent('onpopstate',clsPp);
    } else {
        document.onclick=navig;
        document.body.onload=chkIfrm;
        blov.onclick=clsPp;
        window.onkeyup=keyUp;
        window.onpopstate=clsPp;
    }

    var JSON=JSON||{};
    JSON.stringify=JSON.stringify||function(obj) {
        var t = typeof (obj);
        if (t!=="object"||obj===null) {
            if (t === "string") obj='"'+obj +'"';
            return String(obj);
        } else {
            var n,v,json=[],arr=(obj&&obj.constructor===Array);
            for (n in obj) {
                v=obj[n];
                t=typeof (v);
                if (t==="string") v='"'+v+'"';
                else if (t==="object"&&v!==null) v=JSON.stringify(v);
                json.push((arr?"":'"'+n+'":')+String(v));
            }
            return (arr?"[":"{")+String(json)+(arr ?"]":"}");
        }
    };

    JSON.parse=JSON.parse||function(str) {
        if (str==="") str='""';
        eval("var p="+str+";");
        return p;
    };

    if ('serviceWorker'in navigator) {
        if (!navigator.serviceWorker.controller) {
            navigator.serviceWorker.register('/assets/scripts/serviceWorker.js');
            navigator.serviceWorker.addEventListener('controllerchange',function(event) {
                navigator.serviceWorker.controller.addEventListener('statechange',function() {
                    if (this.state==='activated')
                        notify('Daisy Now Ready to Work Offline', {
                            body: 'You can now use Daisy offline. Though internet connection will still be needed for some functions'
                        });
                });
            });

            navigator.serviceWorker.onmessage=function(event) {
                console.log('Message Delivered to client', event.data);
                var msg = JSON.parse(event.data),
                    isRefresh=msg.type==='refresh',
                    url=msg.url,
                    lMd=msg.lMd,
                    ref=false;
                if (!localStorage.lMd) localStorage.lMd = lMd;
                ref=!(lMd===localStorage.lMd);
                console.log('Ref', ref);
                if (isRefresh && ref) {
                    console.log('New Contents Available');
                    location.reload();
                } else console.log('Same content exits no need to refresh');
            };
        }
    }

    window.addEventListener('beforeinstallprompt', function(e) {
        e.userChoice.then(function(choiceResult) {
            console.log(choiceResult.outcome);
            if (choiceResult.outcome == 'dismissed') {
                if (!/webAppDismissed/i.test(document.cookie))
                    elaj('Please try adding our app to your homescreen the very next time that you my access Daisy fast');
                document.cookie = "webAppDismissed";
            } else suclaj('Thank you for installing our app!');
        });
    });

    function lzyLoad(par) {
        var aSyncs = par.getElementsByClassName('load-async');
        if (!aSyncs) return;
        Array.prototype.forEach.call(aSyncs, function(aSync) {
            var tgNam = aSync.tagName;
            if (!aSync.hasAttribute('data-src') && tgNam !== 'IMG' && tgNam !== 'SCRIPT') return;
            rAf(function() {
                aSync.setAttribute('src', aSync.getAttribute('data-src'));
            });
            aSync.onload = function() {
                rAf(function() { aSync.classList.remove('load-async', 'load-img-async'); });
            };
        });
    }

    (function() {
        dlaj();
        lzyLoad(document);
    })();
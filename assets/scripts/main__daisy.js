    var spkn,
        synth=window.speechSynthesis||window.webkitSpeechSynthesis||window.mozSpeechSynthesis;
        dic=[],
        mic='',
        isTalking=false,
        grammar='',
        daisy=document.getElementsByClassName('daisy')[0],
        daisy=document.getElementsByClassName('daisy__main')[0],
        daisyInpt=document.getElementsByClassName('daisy__main__inpt')[0],
        daisyNote=document.getElementsByClassName('daisy__main__note')[0],
        daisyIntroLnk=document.getElementsByClassName('daisy__main__lnk')[0],
        daisyMicLnk=document.getElementsByClassName('daisy__main__mic')[0],
        daisyCaller=document.getElementsByClassName('daisy__caller')[0];
    
    function process(event) {
        var er,err,errr,et,trns,trnsMat,q;
        function negate(i) { return valArr[i-1]!=='off'&&valArr[i+1]!=='off'?false:true; }
        function shopJumia(q,clas) {
            var sort='popularity',dir='desc';
            switch(clas) {
                case 'expensive': sort='Price%3A%20High%20to%20Low'; break;
                case 'cheap': sort='Price%3A%20Low%20to%20High'; dir='asc'; break;
                case 'new': sort='newest'; break;
                case 'old': sort='oldest'; dir='asc'; break;
            }
            shwLnk('/Fetch/jumia.php?u='+encodeURIComponent('catalog/?q='+encodeURIComponent(q)+'&sort='+encodeURIComponent(sort)+'&dir='+encodeURIComponent(dir)),'https://www.jumia.com.ng/','Now showing you '+clas+' '+q);
        }
        if((er=event.results)&&(err=er[event.resultIndex])&&(errr=err[0])&&(trns=errr.transcript)) {}
        else if((et=event.target)&&(trns=et.value)) {}
        if(!trns) return;
        daisyInpt.value='';
        q=encodeURIComponent(trns);
        daisyInpt.value=trns;
        if(trnsMat=trns.match(/(teach\s*(me)?|learn|study|read)\s*(how|about|on|that|of|at|in|this|to)(.+)/i)) shwLnk('/lookup.php?origin='+encodeURIComponent('https://m.wikihow.com')+'&req_url='+encodeURIComponent('/wikiHowTo?search=')+'&query='+encodeURIComponent(trnsMat[3]+trnsMat[4]),'https://m.wikihow.com/','Now showing you '+trnsMat[3]+trnsMat[4]);
        else if(/(teach\s*(me)?|learn|study|read)/i.test(trns)) shwLnk('/lookup.php?origin='+encodeURIComponent('https://m.wikihow.com')+'&req_url='+encodeURIComponent('/Main-Page'),'https://m.wikihow.com/','Now showing you things to learn');
        else if(trnsMat=trns.match(/(what\s*(i|')s\s*happ?ening?|(get|be)\s*(info(rmation)?|inform(ed)?|up(\s*to\s*)?date(s|d)?)|inform\s*me)/i)) shwLnk('/lookup.php?origin='+encodeURIComponent('https://punchng.com')+'&req_url='+encodeURIComponent('/'),'https://punchng.com/','Now showing you News');
        else if(trnsMat=trns.match(/(about|wh(o|ere|at)\s*('(s|re)|is|a(re|rt|m)))\s*(.+)/i)) {
            var strt=trnsMat[1],val=trnsMat[6];
            if(strt!=='about'&&/\b(my|our|I|(w|s)?he|h(er|is))\b/.test(val)) readOutLoud('I don\'t answer personal questions');
            else if(strt!=='about'&&/\b(your?)\b/.test(val)) { res=val.replace(/your?/ig,'my')+'? Ain\'t gonna tell you. Find that out by yourself. You may be needing help from Elljay or Spider or Simi or any NaijaHacks official. Good luck!'; if(/\bname\b/i.test(val)) res='My name is Daisy'; else if(/\b(sponsor|promot)er|author\b/i.test(val)) res='NaijaHacks2018'; readOutLoud(res); }
            else shwLnk('/lookup.php?origin='+encodeURIComponent('https://www.google.com')+'&req_url='+encodeURIComponent('/search?q=')+'&query='+encodeURIComponent(trnsMat[0]),'https://www.google.com/','Now showing you about -> '+val);
            strt=val='';
        }
        else if(trnsMat=trns.match(/((gi(ve)?|te(ll)?)\s*mm?e\s+(yo)?ur?)\s+(.+)/i)) readOutLoud(trnsMat[6].replace(/your?/ig,'my')+'? Ain\'t gonna tell you. Find that out by yourself. You may be needing help from Elljay or Spider or Simi or any NaijaHacks official. Good luck!');
        else if(trnsMat=trns.match(/((new|trending?)\s*)?songs?\s+of\s+(.+)/i)) { shwLnk('/lookup.php?origin='+encodeURIComponent('https://smart.ejasounds.com')+'&req_url='+encodeURIComponent('/search?q=')+'&query='+encodeURIComponent(encodeURIComponent(trnsMat[3].trim())),'https://smart.ejasounds.com/','Now showing you some '+(trnsMat[1]?trnsMat[1]+' ':'')+' songs of '+trnsMat[3]); }
        else if(trnsMat=trns.match(/((new|trending?)\s*)?(.+(?=songs?))/i)) { shwLnk('/lookup.php?origin='+encodeURIComponent('https://smart.ejasounds.com')+'&req_url='+encodeURIComponent('/search?q=')+'&query='+encodeURIComponent(encodeURIComponent(trnsMat[3].trim())),'https://smart.ejasounds.com/','Now showing you some '+(trnsMat[1]?trnsMat[1]+' ':'')+' songs of '+trnsMat[3]); }
        else if(trnsMat=trns.match(/((new|trending?)\s*)?songs?/i)) { shwLnk('/lookup.php?origin='+encodeURIComponent('https://smart.ejasounds.com')+'&req_url='+encodeURIComponent('/'),'https://smart.ejasounds.com/','Now showing you '+(trnsMat[1]?trnsMat[1]+' ':'')+' songs'); }
        else if(trnsMat=trns.match(/((shop|order|buy)\s*)?(\S+\s+(\S+\s+)?(\S+\s+)?)?(expensive|cheap|new|old|trending?|popular|hot|most\s*(bought|buy|ordere?d?|shopp?e?d?|selling|sold|sell?)|best\s*(bought|buy|ordere?d?|shopp?e?d?|selling|sold|sell?))\s+(\S+\s+(\S+\s+)?(\S+\s+)?(\S+\s+)?)\s*(on|from|at|in|of|by)\s*(All?i\s*E(x|s)?press?|Jumia)/i)) {
            var que=trnsMat[9].trim(),clas=trnsMat[6];
            if(/All?i\s*E(x|s)?press?/i.test(trnsMat[14])) {
                var sort='total_tranpro_desc';
                switch(clas) {
                    case 'expensive': sort='price_desc'; break;
                    case 'cheap': sort='price_asc'; break;
                    case 'new': sort='create_desc'; break;
                    case 'old': sort='create_asc'; break;
                }
                shwLnk('/Fetch/ali-express.php?u='+encodeURIComponent('wholesale?SearchText='+encodeURIComponent(que)+'&SortType='+encodeURIComponent(sort)),'https://www.aliexpress.com/','Now showing you '+clas+' '+que);
                sort=null;
            } else shopJumia(que,clas);
        }
        else if(trnsMat=trns.match(/((shop|order|buy)\s*)?(\S+\s+(\S+\s+)?(\S+\s+)?)?(expensive|cheap|new|old|trending?|popular|hot|most\s*(bought|buy|ordere?d?|shopp?e?d?|selling|sold|sell?)|best\s*(bought|buy|ordere?d?|shopp?e?d?|selling|sold|sell?))\s+(.+)/i)) shopJumia(trnsMat[9],trnsMat[6]);
        else if(trnsMat=trns.match(/\b(phone|diall?|call|phone\s*call|(talk|speak)\s*(to|with))\s*(\S+)\b/i)) window.open('tel:'+trnsMat[4]);
        else if(trnsMat=trns.match(/\b(te?xt|sms|msg|message)\s*(to|with)?\s*(\S+)\b/i)) window.open('sms:'+trnsMat[3]);
        else if(trnsMat=trns.match(/\b(e?mail)\s*(to|with)?\s*(\S+)\b/i)) window.open('mailto:'+trnsMat[3]);
        else if(/\b(fine|good|great?|awesome|cool|kul|chilling?|wonderful)\b/i.test(trns)) readOutLoud('It feels great to you that. Do you need any help from me?');
        else if(/\b(hey|hello|hi|what's\s+up|how\s+are\s+you)\b/i.test(trns)) readOutLoud('Hello, how are you doing today???');
        else if(/\b(fu?c?k\s*(?!(yo?|yh)?u|off|out)|(god?)?damn(\s*it)?|shit|(?<=\w)shit)\b/i.test(trns)) readOutLoud('Am sorry. I will try to serve you better next time');
        else if(trnsMat=trns.match(/\b(get\s*(off|out)|fuck\s*((yo?|yh)?u|off)|(mothe?r)?fu?c?ke?r|a(ss|rse)hole|di?c?ke?r|dumba(ss|rse))\b/i)) readOutLoud('Must you be harsh??? '+trnsMat[0]+' too!!!');
        else if(trnsMat=trns.match(/\b(?<!I|(w|s|t)?hey?)(mad(?!at)|an?\s*idiot|crazy|stupid|foolish|dumb)\b/i)) readOutLoud('Please, I don\'t like to hear that. Don\'t let me say you too are '+trnsMat[0]);
        else if(/\bshut\s(up|it)\b/.test(trns)) { if(isTalking&&synth.speaking) synth.pause(); readOutLoud('Must you be harsh???'); }
        else shwLnk('/lookup.php?origin='+encodeURIComponent('https://www.quora.com')+'&req_url='+encodeURIComponent('/search?q=')+'&query='+encodeURIComponent(q),'https://www.quora.com/');
    }
    
    function stopSpkn() {
        // recog=false;
        daisyNote.innerHTML='';
    }
    
    function useMic(c) {
    
    spkn=new (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition)();
    spkn.lang = 'en-US';
    spkn.interimResults=false;
    spkn.continuous=c;
    spkn.maxAlternatives=5;
    spkn.start();
    recog=true;
    
    if(grammar!=='') {
        var spknGramm=new (window.SpeechGrammarList || window.webkitSpeechGrammarList || window.mozSpeechGrammarList || window.msSpeechGrammarList)(); spknGramm.addFromString(grammar,1); spkn.grammars=spknGramm;
    }
    
    spkn.onresult = process;
        
    spkn.onstart = function() {
        daisyNote.innerHTML='Start Saying Something now!';
    };
        
    spkn.onspeechend = function() {
        stopSpkn();
    }
        
    spkn.onerror = function(event) {
        if(event.error == 'no-speech') console.log('I did not hear you. Say it again');
        stopSpkn();
    };
    
    spkn.onend=function() {
        stopSpkn();
        // if(!noResp) spkn.start();
        if(window.pausedByJennie===true) { playTrack(); window.pausedByJennie=false; }
    };
    
    }
    
    function shakeJ() {
        return;
        var diasyAccl=daisyCaller.classList, x=setInterval(function() { if(daisyAccl.contains('scaled-dwn')) daisyAccl.add('scaled-dwn'); else daisyAccl.remove('scaled-dwn'); },800);
        return clearInterval(x);
    }
    
    function readOutLoud(message,noResp) {
        if(synth.speaking) synth.cancel();
        var speech = new SpeechSynthesisUtterance();
        speech.lang='en-GB';
        speech.text = message;
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        speech.onend=function() { daisyNote.innerHTML=message; isTalking=false; micOn(c); };
        speech.onend=function() { daisyNote.innerHTML=''; isTalking=true; micOff(); };
        var voices=speechSynthesis.getVoices();
        for(i=0; i<voices.length; i++) {
            if(voices[i].name==='Google UK English Female') { speech.voice=voices[i]; break; }
        }
        window.speechSynthesis.speak(speech);
        shakeJ();
        window.noResp=noResp;
        // if(!noResp) spkn.start();
    }
    
    function micOn(c) { useMic(c); if(!recog) { spkn.start(); recog=true } shakeJ(); mic='on'; }
    function micOff() { if(typeof spkn==='undefined') return; spkn.stop(); stopSpkn(); daisyNote.innerHTML=''; mic='off'; }
    function intro() { readOutLoud(stripTags(document.getElementsByClassName('daisy__explnd')[0].innerHTML).trim().replace(/\n+/,'. ').replace(/\s+/,' ')); }
    
    // daisy.onmouseenter=micOn;
    // daisy.onmouseleave=micOff;
    if(window.addEventListener) {
         daisyMicLnk.addEventListener('click',micOn);
         daisyIntroLnk.addEventListener('click',intro);
    } else if(window.attachEvent) {
         daisyMicLnk.attachEvent('onclick',micOn);
         daisyIntroLnk.attachEvent('onclick',intro);
    } else {
         daisyMicLnk.onclick=micOn;
    }
    daisyInpt.onchange=process;
    // daisy.onmouseenter=function() { if(read) return; readOutLoud('What\'s up?'); read=true; };
    
    
    window.onload=function() { readOutLoud('This is a NaijaHacks2018 project. It is all about making your web activities very easy for you because from here you can actually get so many things done. And this project was laid down by the team Oreo featuring Elljay, Spider and Simi. And my own name is Daisy. Thank you! And you can press the link below to see and hear what I can do'); };
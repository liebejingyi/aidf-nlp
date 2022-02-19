const API_URL = "http://192.168.10.101:9100/";
const multi_language = ["Chinese","English","Indonesian"]
const personal_sentiment = ["","Positive","Neutral","Negative"]
var OTHER_XHR = 0;
var sentimentdiv = '<li><label for="sentiment-tendency">Choose a sentiment tendency:'+
'</label><select class="sentiment-tendency" name="sentiment-tendency" id="sentiment-tendency">'+
'<option value="">--Please your own sentiment tendency--</option>'+
'<option value=1>Negative</option>'+
'<option value=2>Slightly Negative</option>'+
'<option value=3>Neutral</option>'+
'<option value=4>Slightly Positive</option>'+
'<option value=5>Positive</option></select></li>';

$(document).ready(function(){


})


function findORG(){
    var xhr = new  XMLHttpRequest();
    var text_input = document.getElementById("text-input");
    var lang = document.getElementById("lang").selectedIndex;
    let textInput = {'textInput':text_input.value,'language':lang};
    console.log(textInput);

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var org = JSON.parse(xhr.responseText)["org"];
            var language = JSON.parse(xhr.responseText)["language"];
            if (multi_language.indexOf(language) != -1) {
                document.getElementById("langmsg2").style.display="none";
                if (language != multi_language[lang]) {
                    langmsg = "Inconsistency between the detected text language (<b>"+language+"</b>) and the selected language. Please select whether to switch";
                    document.getElementById("langdet1").innerHTML = langmsg;
                    languageIndex = multi_language.indexOf(language);
                    document.getElementById("langdet1").value = [lang,languageIndex];
                    document.getElementById("langmsg1").style.display="inline-block";
                } else {
                    document.getElementById("langmsg1").style.display="none";
                }
            } else {
                document.getElementById("langmsg1").style.display="none";
                langmsg = "The detected text language (<b>"+language+"</b>) not supported currently. Please confirm whether to <b>change the paragraph</b>";
                document.getElementById("langdet2").innerHTML = langmsg;
                document.getElementById("langmsg2").style.display="inline-block";
                document.getElementById("text-input").style.borderColor="red";
                document.getElementById("text-input").style.backgroundColor='pink';
            }
            if (org != null) {
                orgdisplay = document.getElementById("org");
                orgdisplay.value = text_input.value;
                var orgopt = '<p>Check entit(ies) you are interested in</p>'
                orgopt = orgopt + '<input type="checkbox" name="orgopt" value="0" onclick="checkAll(this)"/>All</br>';
                for (var i=0;i<org.length;i++) {
                    orgdisplay.value = orgdisplay.value.replace(org[i], '<span class="highlight"><elem type="org"><token>'+org[i]+'</token><div class="label org">ORG</div></elem></span>');
                    orgopt = orgopt + '<input type="checkbox" name="orgopt" value="' + org[i] + '" onchange="checkMR()"/>' + org[i] + '</br>';
                }
                orgdisplay.innerHTML = orgdisplay.value;
                document.getElementById("org-selected").innerHTML = orgopt;
                orgdisplay.style.height = orgdisplay.scrollHeight + 'px';
                document.getElementById("AR").style.display="inline-block";
                document.getElementById("submit").style.display="inline-block";
            } else {
                orgdisplay = document.getElementById("org");
                orgdisplay.value = text_input.value;
                var orgopt = '<p>Check entit(ies) you are interested in</p>'
                orgopt = orgopt + '<input type="checkbox" name="orgopt" value=""></br>';
                orgdisplay.innerHTML = orgdisplay.value;
                document.getElementById("org-selected").innerHTML = orgopt;
                orgdisplay.style.height = (orgdisplay.scrollHeight - 50) + 'px';
                document.getElementById("AR").style.display="inline-block";
                document.getElementById("submit").style.display="inline-block";
            }



        }
    }

    xhr.open('POST', API_URL + 'org_recommend', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(JSON.stringify(textInput));

}

function nlp(){

    var method = getCheckedValue("nlp-method");
    if (method.length>0) {
        $.getJSON('https://api.db-ip.com/v2/free/self', function(data) {

            var xhr = new  XMLHttpRequest();
            var textInput = document.getElementById("text-input").value;
            var lang = document.getElementById("lang").selectedIndex;

            var pt = getPTW();
            var ps = getPST();
            var ar = getCheckedValue("orgopt");
            var mr = document.getElementById("orginput").value;
            let nlpInput = {'textInput':textInput,'language':lang,'method':method,'ar':ar,'mr':mr,'pt':pt,'ps':ps,'ip':data,};
            console.log(nlpInput)

            xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    var topic = JSON.parse(xhr.responseText)["LDA"];
                    var sentiment = JSON.parse(xhr.responseText)["bert"];
                    var res = '<b>Topic: </b>'+topic+'</br>'+'<b>Sentiment: </b>'+sentiment+'</br>';
                    document.getElementById("res").innerHTML = res;
                    document.getElementById("res").style.display="inline-block";
                }
            }

            xhr.open('POST', API_URL + 'nlp_combined', true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(JSON.stringify(nlpInput));
    });}
}

function getCheckedValue(name){
    var boxes = document.getElementsByName(name);
    var values = new Array();
    for (i=0;i<boxes.length;i++){
        if (boxes[i].checked){
            values.push(boxes[i].value);
        }
    }

    if (values.length < 1) {
        if (name == "nlp-method") {
            window.alert('Please choose at least 1 method for analysis!');
        } else if (name == "org-selected") {
            values = '';
        }
    }
    return values
}

function getPST(){
    var st = document.getElementsByClassName("sentiment-tendency");
    var res = {};
    for (var i=0;i<st.length;i++){
        sti = st[i];
        res[sti.name] = sti.selectedIndex;
    }
    return res
}

function getPTW(){
    credit = document.getElementById("credit-weight").value;
    greeness = document.getElementById("greeness-weight").value;

    return {'credit':credit,'greeness':greeness}
}

function changePara(langdetopt2){
    document.getElementById("text-input").style.borderColor="black";
    document.getElementById("text-input").style.backgroundColor='white';
}

function switchLanguage(langdetopt1){
    var opt = langdetopt1.value;
    var lang = document.getElementById("langdet1").value[opt];
    langopt = document.getElementById("lang");
    langopt[lang].selected = true;

    var xhr = new  XMLHttpRequest();
    var text_input = document.getElementById("text-input");
    let textInput = {'textInput':text_input.value,'language':lang};

    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var org = JSON.parse(xhr.responseText)["org"];
            if (org != null) {
                orgdisplay = document.getElementById("org");
                orgdisplay.value = text_input.value;
                var orgopt = '<p>Check entit(ies) you are interested in</p>';
                orgopt = orgopt + '<input type="checkbox" name="orgopt" value="0"/>All</br>';
                for (var i=0;i<org.length;i++) {
                    orgdisplay.value = orgdisplay.value.replace(org[i], '<span class="highlight"><elem type="org"><token>'+org[i]+'</token><div class="label org">ORG</div></elem></span>');
                    orgopt = orgopt + '<input type="checkbox" name="orgopt" value="' + org[i] + '"/>' + org[i] + '</br>';
                }
                orgdisplay.innerHTML = orgdisplay.value;
                document.getElementById("org-selected").innerHTML = orgopt;
                orgdisplay.style.height = orgdisplay.scrollHeight + 'px';
                document.getElementById("AR").style.display="inline-block";
                document.getElementById("submit").style.display="inline-block";
            } else {
                orgdisplay = document.getElementById("org");
                orgdisplay.value = text_input.value;
                var orgopt = '<p>Check entit(ies) you are interested in</p>'
                orgopt = orgopt + '<input type="checkbox" name="orgopt" value=""></br>';
                orgdisplay.innerHTML = orgdisplay.value;
                document.getElementById("org-selected").innerHTML = orgopt;
                orgdisplay.style.height = (orgdisplay.scrollHeight - 50) + 'px';
                document.getElementById("AR").style.display="inline-block";
                document.getElementById("submit").style.display="inline-block";
            }
        }
    }

    xhr.open('POST', API_URL + 'org_recommend', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(JSON.stringify(textInput));
}

function checkAll(select){
    var name = select.name;

    var boxes = document.getElementsByName(name);
    if (boxes[0].checked) {
        for (i=1;i<boxes.length;i++){
            boxes[i].checked = true;
        }
    } else {
        for (i=1;i<boxes.length;i++){
            boxes[i].checked = false;
        }
    }

    var orgs = new Array();
    for (var i=1;i<boxes.length;i++){
        if (boxes[i].checked == true) {
            orgs.push(boxes[i].value);
        }
    }
    var MR = document.getElementById("orginput");
    var mr = MR.value.split(',');
    for (var i=0;i<mr.length;i++){
        if (mr[i].length >0) {
            orgs.push(mr[i]);
        }
    }
    if (orgs.length > 0){
        var sentimentopt = '';
        for (var i=0;i<orgs.length;i++){
            var tmp = sentimentdiv.replace('Choose a sentiment tendency:',orgs[i]);
            tmp = tmp.replace('name="sentiment-tendency"','name="'+orgs[i]+'"');
            tmp = tmp.replace('id="sentiment-tendency"','id="'+orgs[i]+'"');
            tmp = tmp.replace('for="sentiment-tendency"','for="'+orgs[i]+'"');
            sentimentopt = sentimentopt + tmp;
        }
        document.getElementById("sentiment-select").innerHTML = sentimentopt;
    } else {
        document.getElementById("sentiment-select").innerHTML = null;
    }

}

function checkMR(){
    var MR = document.getElementById("orginput");
    var mr = MR.value.split(',');
    var text = document.getElementById("text-input").value;
    var nottext = new Array();
    for (var i=0;i<mr.length;i++) {
        if (text.search(mr[i]) == -1){
            nottext.push(mr[i])
        }
    }
    if (nottext.length == 0) {
        document.getElementById("org-input-msg").innerHTML = null;
    } else {
        document.getElementById("org-input-msg").innerHTML = nottext.join() + ' not in text!';
    }

    var boxes = document.getElementsByName("orgopt");
    var orgs = new Array();
    for (var i=1;i<boxes.length;i++){
        if (boxes[i].checked == true) {
            orgs.push(boxes[i].value);
        }
    }

    for (var i=0;i<mr.length;i++){
        if (mr[i].length >0) {
            orgs.push(mr[i]);
        }
    }
    if (orgs.length > 0){
        var sentimentopt = '';
        for (var i=0;i<orgs.length;i++){
            var tmp = sentimentdiv.replace('Choose a sentiment tendency:',orgs[i]);
            tmp = tmp.replace('name="sentiment-tendency"','name="'+orgs[i]+'"');
            tmp = tmp.replace('id="sentiment-tendency"','id="'+orgs[i]+'"');
            tmp = tmp.replace('for="sentiment-tendency"','for="'+orgs[i]+'"');
            sentimentopt = sentimentopt + tmp;
        }
        document.getElementById("sentiment-select").innerHTML = sentimentopt;
    } else {
        document.getElementById("sentiment-select").innerHTML = null;
    }
}

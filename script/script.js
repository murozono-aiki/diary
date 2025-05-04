let diaryData = JSON.parse(localStorage.getItem("diary-data"));
const dayGroup = ["日","月","火","水","木","金","土"];
let url = "";

try {
    const storageURL = localStorage.getItem("diary-url");
    if (storageURL) url = storageURL;
} catch(error) {
    console.error(error);
}

function dateToString(date) {
    let year = date.getFullYear().toString();
    if (year.length < 4) year = '0'.repeat(4 - year.length) + year;
    let month = (date.getMonth() + 1).toString();
    if (month.length < 2) month = '0'.repeat(2 - month.length) + month;
    let date_ = date.getDate().toString();
    if (date_.length < 2) date_ = '0'.repeat(2 - date_.length) + date_;
    return year + "-" + month + "-" + date_ + "T00:00:00";
}
function datetimeToString(date) {
    let year = date.getFullYear().toString();
    if (year.length < 4) year = '0'.repeat(4 - year.length) + year;
    let month = (date.getMonth() + 1).toString();
    if (month.length < 2) month = '0'.repeat(2 - month.length) + month;
    let date_ = date.getDate().toString();
    if (date_.length < 2) date_ = '0'.repeat(2 - date_.length) + date_;
    let hours = date.getHours().toString();
    if (hours.length < 2) hours = '0'.repeat(2 - hours.length) + hours;
    let minutes = date.getMinutes().toString();
    if (minutes.length < 2) minutes = '0'.repeat(2 - minutes.length) + minutes;
    let seconds = date.getSeconds().toString();
    if (seconds.length < 2) seconds = '0'.repeat(2 - seconds.length) + seconds;
    return year + "-" + month + "-" + date_ + "T" + hours + ":" + minutes + ":" + seconds;
}
function getDateFormat(date, autoYear = true) {
    let dateText = "";
    if (autoYear && date.getFullYear() != new Date().getFullYear()) dateText += date.getFullYear() + " / ";
    dateText += (date.getMonth() + 1) + " / " + date.getDate() + " (" + dayGroup[date.getDay()] + ")";
    return dateText;
}

// 日記の表示
function createDiaryElement(oneDayData, highlightText) {
    function createHighlightElement(text) {
        const element = document.createElement('span');
        element.className = "highlight";
        const lineList = text.replaceAll("\r\n", "\n").replaceAll("\r", "\n").split("\n");
        for (let i = 0; i < lineList.length; i++) {
            const line = lineList[i];
            if (i != 0) element.appendChild(document.createElement('br'));
            element.appendChild(document.createTextNode(line));
        }
        return element;
    }

    const element = document.createElement('button');
    element.className = "oneDiary";

    const dateElement = document.createElement('div');
    element.appendChild(dateElement);
    dateElement.className = "diary_dateElement";
    const date = new Date(oneDayData.date);
    dateElement.appendChild(document.createTextNode(getDateFormat(date)));
    const dateString = dateToString(date);
    element.addEventListener('click', event => {
        setDiaryEditor(dateString)
    });

    for (let content of oneDayData.contents) {
        if (!content.text) continue;

        if (content.title != "-") {
            const titleElement = document.createElement('div');
            element.appendChild(titleElement);
            titleElement.className = "diary_titleElement";
            const title = content.title;
            const spanTitle = title.split(highlightText);
            for (let i = 0; i < spanTitle.length; i++) {
                if (i != 0) titleElement.appendChild(createHighlightElement(highlightText));
                titleElement.appendChild(document.createTextNode(spanTitle[i]));
            }
        }

        const textElement = document.createElement('div');
        element.appendChild(textElement);
        textElement.className = "diary_textElement";
        const text = content.text;
        const spanText = text.split(highlightText);
        for (let i = 0; i < spanText.length; i++) {
            if (i != 0) textElement.appendChild(createHighlightElement(highlightText));
            spanText[i] = spanText[i].replaceAll("\r\n", "\n").replaceAll("\r", "\n");
            const lineList = spanText[i].split("\n");
            for (let j = 0; j < lineList.length; j++) {
                const line = lineList[j];
                const paragraphElement = document.createElement('p');
                //if (j != 0) textElement.appendChild(document.createElement('br'));
                textElement.appendChild(paragraphElement);
                //textElement.appendChild(document.createTextNode(line));
                paragraphElement.appendChild(document.createTextNode(line));
            }
        }
    }
    return element;
}

function resetDiary(data = diaryData) {
    const pastElement = document.getElementById("main");
    const element = document.createElement('div');
    pastElement.id = "main_past";
    element.id = "main";

    const date = new Date();
    date.setHours(0, 0, 0, 0);
    let dateString = dateToString(date);

    let index = data.length - 1;
    for (let i = index; i >= 0; i--) {
        if (data[i].date == dateString) {
            element.appendChild(createDiaryElement(data[i]));
            index = i;
            break;
        }
    }
    date.setDate(date.getDate() - 1);
    dateString = dateToString(date);
    for (let i = index; i >= 0; i--) {
        if (data[i].date == dateString) {
            const heading = document.createElement('div');
            heading.className = "heading";
            heading.appendChild(document.createTextNode("昨日"));
            element.appendChild(heading);
            element.appendChild(createDiaryElement(data[i]));
            index = i;
            break;
        }
    }
    date.setDate(date.getDate() - 1);
    dateString = dateToString(date);
    for (let i = index; i >= 0; i--) {
        if (data[i].date == dateString) {
            const heading = document.createElement('div');
            heading.className = "heading";
            heading.appendChild(document.createTextNode("一昨日"));
            element.appendChild(heading);
            element.appendChild(createDiaryElement(data[i]));
            index = i;
            break;
        }
    }
    date.setDate(date.getDate() + 2);
    date.setDate(date.getDate() - 31);
    dateString = dateToString(date);
    for (let i = index; i >= 0; i--) {
        if (data[i].date == dateString) {
            const heading = document.createElement('div');
            heading.className = "heading";
            heading.appendChild(document.createTextNode("１ヵ月前"));
            element.appendChild(heading);
            element.appendChild(createDiaryElement(data[i]));
            index = i;
            break;
        }
    }
    date.setDate(date.getDate() + 31);
    date.setFullYear(date.getFullYear() - 1);
    dateString = dateToString(date);
    for (let i = index; i >= 0; i--) {
        if (data[i].date == dateString) {
            const heading = document.createElement('div');
            heading.className = "heading";
            heading.appendChild(document.createTextNode("１年前"));
            element.appendChild(heading);
            element.appendChild(createDiaryElement(data[i]));
            index = i;
            break;
        }
    }
    date.setFullYear(date.getFullYear() - 4);
    dateString = dateToString(date);
    for (let i = index; i >= 0; i--) {
        if (data[i].date == dateString) {
            const heading = document.createElement('div');
            heading.className = "heading";
            heading.appendChild(document.createTextNode("５年前"));
            element.appendChild(heading);
            element.appendChild(createDiaryElement(data[i]));
            index = i;
            break;
        }
    }
    date.setFullYear(date.getFullYear() - 5);
    dateString = dateToString(date);
    for (let i = index; i >= 0; i--) {
        if (data[i].date == dateString) {
            const heading = document.createElement('div');
            heading.className = "heading";
            heading.appendChild(document.createTextNode("１０年前"));
            element.appendChild(heading);
            element.appendChild(createDiaryElement(data[i]));
            index = i;
            break;
        }
    }
    document.getElementById("main-area").appendChild(element);
        
    index = data.length - 1;
    const heading = document.createElement('div');
    heading.className = "heading";
    heading.appendChild(document.createTextNode("全ての日記"));
    element.appendChild(heading);
    const appendDiary = () => {
        if (element) {
            element.appendChild(createDiaryElement(data[index]));
            index--;
            if (index >= 0) requestAnimationFrame(appendDiary);
            else requestAnimationFrame(() => {pastElement.remove();});
        } else {
            pastElement.remove();
        }
    }
    if (index >= 0) requestAnimationFrame(appendDiary);
}
let initFunction;
if (diaryData) {
    resetDiary();
    /*initFunction = (async () => {
        const postURL = new URL(url);
        postURL.searchParams.set("method", "POST");
        const responce = await fetch(postURL, {method: "POST", body: JSON.stringify(diaryData)});
        const data = await responce.json();
        diaryData = data;
        localStorage.setItem("diary-data", JSON.stringify(diaryData.slice(-400)));
        if (diaryData) requestAnimationFrame(() => {resetDiary();});
    });*/
}/* else {*/
    initFunction = (async () => {
        const getURL = new URL(url);
        getURL.searchParams.set("method", "GET");
        const responce = await fetch(getURL, {method: "GET"});
        const data = await responce.json();
        diaryData = data;
        localStorage.setItem("diary-data", JSON.stringify(diaryData.slice(-400)));
        if (diaryData) requestAnimationFrame(() => {resetDiary();});
    });
/*}*/
function requestURL() {
    document.getElementById("firstForm").addEventListener("submit", event => {
        url = document.getElementById("URL-input").value;
        if (url && URL.canParse(url)) {
            localStorage.setItem("diary-url", url);
            initFunction();
        } else {
            requestURL();
        }
    }, {once: true});
    document.getElementById("firstDialog").showModal();
}
document.getElementById("firstDialog").addEventListener("close", event => {
    if (!url || !URL.canParse(url)) requestURL();
});
if (url && URL.canParse(url)) {
    initFunction();
} else {
    requestURL();
}

// ----------
// 日記の検索
document.getElementById("filterForm").addEventListener('submit', event => {
    event.preventDefault();

    const searchText_input = document.getElementById("search").value;

    if (!searchText_input) {
        resetDiary();
    } else {
        const searchTexts = searchText_input.split(/[ 　]/);
        const searchedData = diaryData.filter(data => {
            for (let content of data.contents) {
                for (let searchText of searchTexts) {
                    if (content.title.indexOf(searchText) >= 0) return true;
                    if (content.text.indexOf(searchText) >= 0) return true;
                }
            }
            return false;
        });


        document.getElementById("main").remove();
        const element = document.createElement('div');
        element.id = "main";
        document.getElementById("main-area").appendChild(element);
        
        index = searchedData.length - 1;
        const heading = document.createElement('div');
        heading.className = "heading";
        heading.appendChild(document.createTextNode("検索結果"));
        element.appendChild(heading);
        const appendDiary = () => {
            if (element) {
                element.appendChild(createDiaryElement(searchedData[index], searchTexts[0]));
                index--;
                if (index >= 0) requestAnimationFrame(appendDiary);
            }
        }
        if (index >= 0) requestAnimationFrame(appendDiary);
    }
});

// ----------
// 日記の編集
let editDate = "";
const saveButton = document.getElementById("set_contents");
let is_saving = 0;
let saveTimeoutId;
const savingElement = document.getElementById("saving");
savingElement.style.display = "none";

document.getElementById("edit-area").style.display = "none";

function addContent(titleText, contentText) {
    let element = document.createElement('p');
    element.setAttribute('class',"one_content_area");

    let title = document.createElement('input');
    title.setAttribute('type','text');
    title.setAttribute('class',"title");
    title.setAttribute('placeholder',"見出し");
    title.setAttribute('spellcheck',"true");
    title.addEventListener('input', event => {
        saveButton.disabled = false;
    });
    if (titleText) {
        title.value = titleText;
        title.readOnly = true;
        if (titleText == "-") {
            title.style.display = "none";
        }
    }

    let content = document.createElement('textarea');
    content.setAttribute('class',"content");
    content.setAttribute('placeholder',"内容");
    content.setAttribute('spellcheck',"true");
    content.addEventListener('input',event=>{
        saveButton.disabled = false;
        content.style.height = "auto";
        content.style.height = content.scrollHeight + "px";
        if (saveTimeoutId) clearTimeout(saveTimeoutId);
        saveTimeoutId = setTimeout(() => {
            saveTimeoutId = undefined;
            save();
        }, 5000);
    });
    content.addEventListener('change',event=>{
        if (saveTimeoutId) clearTimeout(saveTimeoutId);
        save();
    });
    if (contentText) {
        content.value = contentText;
    }

    element.appendChild(title);
    if (titleText != "-") element.appendChild(document.createElement('br'));
    element.appendChild(content);

    document.getElementById("contents_area").appendChild(element);
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            content.style.height = "auto";
            content.style.height = content.scrollHeight + "px";
        });
    });
}

function setDiaryEditor(dateString) {
    editDate = dateString;
    while(document.getElementsByClassName('one_content_area')[0]){
        document.getElementsByClassName('one_content_area')[0].remove();
    }
    let editData;
    for (let i = diaryData.length - 1; i >= 0; i--) {
        if (diaryData[i].date == dateString) {
            editData = diaryData[i];
            break;
        }
    }
    const date = new Date(dateString);
    const todayDate = new Date();
    let text;
    if (dateString == dateToString(todayDate)) text = "今日　" + getDateFormat(date, false);
    todayDate.setDate(todayDate.getDate() - 1);
    if (dateString == dateToString(todayDate)) text = "昨日　" + getDateFormat(date, false);
    document.getElementById("editDate").textContent = text || getDateFormat(date);
    let addedContents = 0;
    if (editData) {
        for (let content of editData.contents) {
            if (content.text) {
                addContent(content.title, content.text);
                addedContents++;
            }
        }
    }
    if (addedContents == 0) {
        addContent("-", "");
    }
    saveButton.disabled = true;
    requestAnimationFrame(() => {
        document.getElementById("main-area").style.display = "none";
        document.getElementById("edit-area").style.display = "";
        scrollTo(0, 0);
    });
}

document.getElementById("closeEditor").addEventListener('click', event => {
    save();
    requestAnimationFrame(() => {
        document.getElementById("edit-area").style.display = "none";
        document.getElementById("main-area").style.display = "";
        scrollTo(0, 0);
    });
});

document.getElementById("editButton").addEventListener('click', event => {
    setDiaryEditor(dateToString(new Date()));
});

document.getElementById("editLastDay").addEventListener('click', event => {
    save();
    const date = new Date(editDate);
    date.setDate(date.getDate() - 1);
    setDiaryEditor(dateToString(date));
});
document.getElementById("editNextDay").addEventListener('click', event => {
    save();
    const date = new Date(editDate);
    date.setDate(date.getDate() + 1);
    setDiaryEditor(dateToString(date));
});

//ボタンが押されたら内容入力欄を追加する
document.getElementById('add_content').addEventListener('click',event => {
    addContent();
});

// 編集内容を保存
function save() {
    saveButton.disabled = true;
    const updateDate = datetimeToString(new Date());
    let editData;
    for (let i = diaryData.length - 1; i >= 0; i--) {
        if (diaryData[i].date == editDate) {
            editData = diaryData[i];
            break;
        }
    }
    let object = {};
    object.date = editDate;
    object.contents = [];
    let contents = document.getElementsByClassName('one_content_area');
    for(let i = 0 ; i < contents.length ; i++){
        let contentObject = {};
        let element = contents[i];
        contentObject.title = element.firstElementChild.value;
        if (i == 0 && !contentObject.title) contentObject.title = "-";
        element.firstElementChild.readOnly = true;
        contentObject.text = element.lastElementChild.value;
        contentObject.update = updateDate;
        if(contentObject.title){
            let is_edited = true;
            if (editData) {
                let existSameTitle = false;
                for (let content of editData.contents) {
                    if (content.title == contentObject.title) {
                        existSameTitle = true;
                        if (content.text == contentObject.text || (!content.text && !contentObject.text)) {
                            is_edited = false;
                        } else {
                            content.text = contentObject.text;
                        }
                    }
                }
                if (!existSameTitle) editData.contents.push(contentObject);
            } else {
                if (!contentObject.text) {
                    is_edited = false;
                }
            }
            if (is_edited) object.contents.push(contentObject);
        }
    }
    if (!editData) {
        const diaryDate = new Date(editDate);
        let added = false;
        for (let i = diaryData.length - 1; i >= 0; i--) {
            if (new Date(diaryData[i].date).getTime() < diaryDate.getTime()) {
                diaryData.splice(i + 1, 0, object);
                added = true;
                break;
            }
        }
        if (!added) diaryData.unshift(object);
    }
    if (object.contents.length >= 1) {
        is_saving++;
        savingElement.style.display = "";
        (async () => {
            const postURL = new URL(url);
            postURL.searchParams.set("method", "POST");
            const responce = await fetch(postURL, {method: "POST", body: JSON.stringify([object])});
            is_saving--;
            if (!is_saving) savingElement.style.display = "none";
            const data = await responce.json();
            diaryData = data;
            localStorage.setItem("diary-data", JSON.stringify(diaryData.slice(-400)));
            requestAnimationFrame(() => {resetDiary();});
        })();
        localStorage.setItem("diary-data", JSON.stringify(diaryData.slice(-400)));
        requestAnimationFrame(() => {resetDiary();});
    }
}

//ボタンが押されたら保存する
document.getElementById('set_contents').addEventListener('click', event => {
    save();
});
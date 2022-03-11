let myFileName = new Array();
let myFile = new Array();
let root_path;
let walk_path = '';
let myOrigin = window.origin;
// let server="http://localhost:8000";
let server;


function getFileName(path) {
    let pos1 = path.lastIndexOf('\\');
    let pos2 = path.lastIndexOf('/');
    let pos = Math.max(pos1, pos2);
    if (pos < 0)
        return path;
    else
        return path.substring(pos + 1);
}



function btnOpen(avg) {
    if (avg !== "") {
        let my_file;
        for (let i = 0; i < myFile.length; i++) {
            if (myFile[i]["name"] === avg) {
                my_file = myFile[i];
                break
            }
        }
        let myUrl = encodeURIComponent(server+"/in_file");
        window.open("./doc.html?url="+myUrl+"&ab="+encodeURIComponent(my_file["ab"]), "new2", "height=1000,wight=500,top=50");
    } else {
        window.alert("error");
    }
}

function btnDir(avg) {
    if (avg !== "") {
        let my_file;
        for (let i = 0; i < myFile.length; i++) {
            if (myFile[i]["name"] === avg) {
                my_file = myFile[i];
                break
            }
        }
        walk_path = my_file["root"];
        goDir(walk_path);

    } else {
        window.alert("error");
    }
}


function addFiles(file) {
    $("#fileData").append('<div class="row dataRow" onclick=btnOpen("' + file["name"] + '")>\n' +
        '        <div class="fileNameDiv col-md-6 col-sm-6 col-xs-8">\n' +
        '            <img class="fileIcon img-rounded" alt="文件" src="index/img/fileIcon.ico"/>\n' +
        '            <span class="fileName" title="' + file["name"] + '">' + file["name"] + '</span>\n' +
        '        </div>\n' +
        "\t\t\t\t<div class=\"col-md-2 col-sm-3 col-xs-4\">" + file["root"] + "</div>\n" +
        '    </div>')
}

function addDirs(file) {
    $("#fileData").append("<div class=\"row dataRow\" onclick=btnDir(\"" + file["name"] + "\")>\n" +
        "\t\t\t\t<div class=\"fileNameDiv col-md-6 col-sm-6 col-xs-8\">\n" +
        "\t\t\t\t\t<img class=\"filesIcon img-rounded\" alt=\"文件夹\" src=\"index/img/Folder.png\"/>\t\n" +
        "\t\t\t\t\t<span class=\"fileName\" title=\"" + file["name"] + "\">" + file["name"] + "</span>\t\n" +
        "\t\t\t\t</div>\n" +
        "\t\t\t\t<div class=\"col-md-2 col-sm-3 col-xs-4\">" + file["root"] + "</div>\n" +
        "\t\t\t</div>")
}


function adds() {
    $("#fileData").empty();
    $("#now_path").empty();
    $("#now_path").append(root_path);
    for (let a = 0; a < myFile.length; a++) {
        myFileName[a] = myFile[a]["name"];
        if (myFile[a]["isdir"] !== "True")
            addFiles(myFile[a]);
        else
            addDirs(myFile[a]);
    }

}

function getStart() {

    $.ajax({
        url: server+"/here",
        async: false,
        success: function (result) {
            root_path = result;
            walk_path = root_path;
        },
        error: function (result) {
            alert('请求数据出错！！');
        },
    })
    // while (myOrigin === "null") myOrigin = window.origin;
    $.post({
        url: server+"/getFile",
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({
            "path": root_path,
            "myOrigin": myOrigin
        }),
        async: false,
        success: function (result) {
            myFile = JSON.parse(result);
            adds();
        },
        error: function (result) {
            alert('请求数据出错！！');
        },
    });
    console.log(myFile)
}

function goDir(avg) {
    if (avg === '') return;

    // while (myOrigin === "null") myOrigin = window.origin;
    $.post({
        url: server+"/getFile",
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({
            "path": avg,
            "myOrigin": myOrigin
        }),
        async: false,
        success: function (result) {
            myFile = JSON.parse(result);
            adds();
            $("#now_path").empty();
            $("#now_path").append(walk_path);
        },
        error: function (result) {
            alert('请求数据出错！！');
        },
    });
}


$(document).ready(function () {
    myOrigin = window.origin;
    $("#btnget").click(function () {
        let Url = document.getElementById("myUrl");
        if(isNaN(Url.value)){
            server = $("#myUrl").val().replace(/\s*/g,"");
            getStart();
        }else{
            alert("请输入服务器url");
            Url.focus();
            return;
        }
        
    });


    // getStart();
    $("#now_path").empty();
    $("#now_path").append(root_path);


    window.setInterval(function () {
        goDir(walk_path);
    }, 30000);
});
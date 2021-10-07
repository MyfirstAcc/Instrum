'use strict' //strong mode 
let maxv;

let stackAbnormal = [];//allocation memory for array for abnormal values 


$(document).ready(function () {

    if (localStorage["ChisloYchastkov"] > 0)
        ChisloYchastkov.value = localStorage["ChisloYchastkov"]


    if (parametr.length > 1) {
        ChisloYchastkov.value = parametr.length;
        TableYchastki();
    }


    $("#Button1").click(TableYchastki);
    $(document).on('click', "#Button2", abnormalHide);

    //this method generates fields for the values of damaged areas
    function TableYchastki() {

        let elem = document.getElementById('mytextarea')
        let a = elem.value.split(/$\s*/m);
        let n = $("#ChisloYchastkov").val();
        if (a.length == 0) {
            n = $("#ChisloYchastkov").val();
        } else {
            n = a.length;
            $('#mytextarea').attr('rows', n)
            $("#ChisloYchastkov").val(n)
        }

        let div = $("#div1");
        div.css("display", "block");
        div.html("");
        for (let i = 1; i <= n; i++) {
            if (i <= n) {
                let element1 = "ploshad" + i;
                let element2 = "koord" + i;
                if (localStorage[element1] == undefined) { localStorage[element1] = "" }
                if (localStorage[element2] == undefined) { localStorage[element2] = "" }
                if (parametr.length > 1) { localStorage[element1] = parametr[i - 1] }
                div.append(
                    ` <div class="m-2 form-group row">
                        <label class="col-5 col-form-label">Площадь повреждённой территории на ${i} участке:</label>
                        <label class="col-5 col-form-label">Координаты контура ${i}-го участка:</label>                                                 
                        <div class="col-3">
                            <input class='tab form-control' type=text id='ploshad${i}' value="${localStorage[element1]}">                          
                        </div>
                        <div class="col-2">
                        </div>                                  
                        <div class="col-3">
                            <input class='form-control' type=text id='koord${i}'value="${localStorage[element2]}">                          
                        </div>
                    </div>`);
            }
        }

        div.append(`
        <div>
            <hr>
            <input type=button class=" btn btn-primary" value='Поиск аномальных значений' id='Button2'>
            <div class="container">
                <div class="row g-2">
                    <div class="col-3">
                        <input type=button class="m-2 btn btn-primary Abnormal" value='Исключить аномальные значения'
                            id='Button3'>
                        <input type=button class="m-2 btn btn-primary Abnormal"
                            value='Понизить аномальные значения до максимально возможного' id='Button6'>
                    </div>
                    <div class="col-3">
                        <input type=button class="m-2 btn btn-primary Abnormal" value='Усреднить аномальные значения'
                            id='Button4'></input>
                        <input type=button class="m-2 btn btn-primary Abnormal"
                            value='Понизить аномальные значения до максимального имеющегося' id='Button5'>

                    </div>
                </div>
            </div>
            <hr>
        </div>`);


        div.append(
            ` <div class="form-group row">
                <label class="col-5 col-form-label">Общая площадь повреждённой территории:</label> 
                <div class="col-6">
                    <input class='tab'  type=text readonly class="form-control-plaintext" id='SumPloshad' >
                </div>
            </div>`);


        div.append(
            ` <div class="form-group row">
                <label class="col-5 col-form-label">Средняя площадь повреждённой территории:</label> 
                <div class="col-6">
                    <input class='tab' type=text  readonly class="form-control-plaintext" id='SredPloshad' >
                </div>
            </div>`);


        div.append(
            ` <div class="form-group row">
                <label class="col-5 col-form-label">Среднеквадратическое отклонение:</label> 
                <div class="col-6">
                    <input class='tab'  type="text" readonly class="form-control-plaintext" id='Otklonenie'>
                </div>
            </div>`);

        if (a.length > 0) {
            for (let i = 1; i <= n; i++) {
                let element1 = "ploshad" + i;
                $(`#${element1}`).val(a[i - 1]);
            }
        }
        localStorage["ChisloYchastkov"] = n;
        abnormalHide();

    }

    //this method counting values in field of damaged areas 
    function abnormalHide() {
        stackAbnormal = [];
        maxv = 0;

        let n = $("#ChisloYchastkov").val();
        $("#SumPloshad").val("0");
        $("#SredPloshad").val("0");
        $("#Otklonenie").val("0");


        for (let i = 1; i <= n; i++) {
            if (i <= n) {
                let element1 = "ploshad" + i;
                let element2 = "koord" + i;
                localStorage[element1] = document.getElementById(element1).value;
                localStorage[element2] = document.getElementById(element2).value;
                $("#SumPloshad").val($("#SumPloshad").val() * 1 + $(`#${element1}`).val() * 1);
                if (parseFloat(document.getElementById(element1).value) > maxv) { maxv = parseFloat(document.getElementById(element1).value) }
            }
        }

        $("#SredPloshad").val($("#SumPloshad").val() / n);

        for (let i = 1; i <= n; i++) {
            if (i <= n) {
                let element1 = "ploshad" + i;
                $("#Otklonenie").val($("#Otklonenie").val() * 1 + Math.pow($(`#${element1}`).val() - $("#SredPloshad").val(), 2));
            }
        }

        $("#Otklonenie").val(Math.sqrt($("#Otklonenie").val() * 1 / n));

        let number = getRatio(n);
        $(`.Abnormal`).css("display", "none");
        for (let i = 1; i <= n; i++) {
            let element1 = "ploshad" + i;
            $(`#${element1}`).attr("class", "tab form-control");

            if ((($(`#${element1}`).val() * 1) - ($("#SredPloshad").val() * 1)) / ($("#Otklonenie").val() * 1) >= number) {
                $(`#${element1}`).attr("class", "tab form-control is-invalid");
                $(`.Abnormal`).css("display", "block");
                $(`#${element1}`).focus();
                stackAbnormal.push($(`#${element1}`));// LIFO ///can also use FIFO                                                      
            }
        }
        CanvDraw();
        map();
    }

    //handler for remove abnormal values 
    $(document).on('click', "#Button3", () => {
        let myarray = [];
        let j = 0;
        let n = $("#ChisloYchastkov").val();
        let number = getRatio(n);

        for (let i = 1; i <= n; i++) {
            let element1 = "ploshad" + i;
            if (($(`#${element1}`).val() - $("#SredPloshad").val()) / $("#Otklonenie").val() < number) {
                myarray[j] = $(`#${element1}`).val();
                j++;
            }
        }

        $("#ChisloYchastkov").val(j);
        TableYchastki();
        for (let i = 1; i <= j; i++) {
            let element1 = "ploshad" + i;
            $(`#${element1}`).val(myarray[i - 1]);
        }
        abnormalHide()
    });
    //handler avg values
    $(document).on('click', "#Button4", () => {
        let n = $("#ChisloYchastkov").val();
        let number = getRatio(n);

        for (let i = 1; i <= n; i++) {
            let element1 = "ploshad" + i;
            if (($(`#${element1}`).val() - $("#SredPloshad").val()) / $("#Otklonenie").val() >= number) {
                $(`#${element1}`).val($("#SredPloshad").val());
                $(`#${element1}`).css("background", "white");
            }

        }
        abnormalHide();

    });

    $(document).on('click', "#Button5", () => {
        let mymax = 0;
        let n = $("#ChisloYchastkov").val();
        let number = getRatio(n);

        for (let i = 1; i <= n; i++) {
            let element1 = "ploshad" + i;
            if ($(`#${element1}`).val() > Number(mymax) && (($(`#${element1}`).val() - $("#SredPloshad").val()) / $("#Otklonenie").val() < number)) {
                mymax = $(`#${element1}`).val();
            }

        }
        for (let i = 1; i <= n; i++) {
            let element1 = "ploshad" + i;
            if (($(`#${element1}`).val() - $("#SredPloshad").val()) / $("#Otklonenie").val() >= number) {
                $(`#${element1}`).val(mymax);
                $(`#${element1}`).css("background", "white");
            }
        }
        abnormalHide()

    });

    $(document).on('click', "#Button6", () => {

        let n = $("#ChisloYchastkov").val() * 1;
        let number = getRatio(n);

        for (let i = 1; i <= n; i++) {
            let element1 = "ploshad" + i;
            if (($(`#${element1}`).val() - $("#SredPloshad").val()) / $("#Otklonenie").val() >= number) {
                $(`#${element1}`).val(0.99 * (number * ($("#Otklonenie").val() * 1) + ($("#SredPloshad").val() * 1)));
                $(`#${element1}`).css("background", "white");
            }
        }

        abnormalHide()
    });

    $("#ButtonSave").click(checkFiled);


    function checkFiled() {
        if (stackAbnormal.length != 0) {
            while (stackAbnormal.length != 0) {
                $(stackAbnormal.pop()).focus(); //while stack is not empty, marking field                                
            }                                   // repeat call this method will not show notifier 
            noty.show(); //show "Toast" notification
        }
        else {
            saveFiledInTxt();
            stackAbnormal = [];
            noty.close();
        }
    }


    $("#ButtonClear").click(() => {
        let n = ChisloYchastkov.value;
        for (let i = 1; i <= n; i++) {
            let element1 = "ploshad" + i;
            $(`#${element1}`).val("");
            localStorage[element1] = "";
        }
        abnormalHide();
    });
});


function saveFiledInTxt() {
    let n = ChisloYchastkov.value;
    let mysavedtext = "";
    for (let i = 1; i <= n; i++) {
        let element1 = "ploshad" + i;
        mysavedtext = mysavedtext + $(`#${element1}`).val() + ';';
    }
    // for autodownload in browser 
    let link = document.createElement("a"); //create element "<a>...</a><" in DOM 
    link.download = "download.txt";
    link.href = `data:text/plain;charset=utf-8,%EF%BB%BF${encodeURIComponent(mysavedtext)}`;
    link.click(); //soft click
    link.remove();// remove "<a>" element from DOM 

}


//function determining the coefficient
function getRatio(n) {
    if (n <= 5) {
        return 1.791;
    } else if (n > 5 || n <= 10) {
        return 2.146;
    } else if (n > 10 || n <= 15) {
        return 2.326;
    } else if (n > 15 || n <= 20) {
        return 2.447;
    } else if (n > 20 || n <= 25) {
        return 2.447;
    } else {
        return 2.633;
    }
}


function CanvDraw() {
    let k = getRatio($("#ChisloYchastkov").val());
    var max = k * Otklonenie.value + +SredPloshad.value;
    var mid = parseFloat(SredPloshad.value);
    var disp = mid + parseFloat(Otklonenie.value);
    let dispmin = mid - parseFloat(Otklonenie.value);
    var canv = document.getElementById("canv");
    var ctx = canv.getContext('2d');
    var koord;


    ctx.font = `20px ${$('.container').css("font-family")}`;
    canv.width = 600;
    canv.height = 300;
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.moveTo(5.5, 5.5);
    ctx.lineTo(3.5, 15.5);
    ctx.moveTo(5.5, 5.5);
    ctx.lineTo(7.5, 15.5);
    ctx.moveTo(5.5, 5.5);

    ctx.fillText("0", 1, 295.5);

    ctx.lineTo(5.5, 280.5);
    ctx.lineTo(590.5, 280.5);
    ctx.lineTo(580.5, 278.5);
    ctx.moveTo(590.5, 280.5);
    ctx.lineTo(580.5, 282.5);
    ctx.stroke();
    var n = ChisloYchastkov.value;
    for (var i = 1, g = 15.5; i <= n; i++, g += 10) {
        let element1 = "ploshad" + i;
        koord = document.getElementById(element1).value;
        ctx.moveTo(5.5 + 570.5 * koord / maxv - 3, 76.25 + g);
        ctx.lineTo(5.5 + 570.5 * koord / maxv + 3, 70.25 + g);
        ctx.stroke();
        ctx.moveTo(5.5 + 570.5 * koord / maxv + 3, 76.25 + g);
        ctx.lineTo(5.5 + 570.5 * koord / maxv - 3, 70.25 + g);
        ctx.fillText(Math.round(koord), 5.5 + 570.5 * koord / maxv - 5, 295.5);
        ctx.stroke();
    }
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.moveTo(5.5 + 570.5 * max / maxv, 5.5);
    ctx.lineTo(5.5 + 570.5 * max / maxv, 280.5);
    ctx.font = `12px cursive`;
    ctx.fillText('Аномаль.', 570.5 * max / maxv, 10.5);
    ctx.fillText(max.toFixed(2), 570.5 * max / maxv, 22.5);
    ctx.font = `20px ${$('.container').css("font-family")}`;

    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle = "green";
    ctx.moveTo(5.5 + 570.5 * mid / maxv, 5.5);
    ctx.lineTo(5.5 + 570.5 * mid / maxv, 280.5);
    ctx.font = `12px cursive`;
    ctx.fillText('Сред.', 570.5 * mid / maxv, 10.5);
    ctx.fillText(mid.toFixed(2), 570.5 * mid / maxv, 22.5);
    ctx.font = `20px ${$('.container').css("font-family")}`;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.strokeStyle = "yellow";
    ctx.moveTo(5.5 + 570.5 * disp / maxv, 5.5);
    ctx.lineTo(5.5 + 570.5 * disp / maxv, 280.5);
    ctx.font = `12px cursive`;
    ctx.fillText('Откл.', 570.5 * disp / maxv, 10.5);
    ctx.fillText(disp.toFixed(2), 570.5 * disp / maxv, 22.5);
    ctx.font = `20px ${$('.container').css("font-family")}`;
    ctx.stroke();
    ctx.closePath();

    ctx.strokeStyle = "yellow";
    ctx.moveTo(5.5 + 570.5 * dispmin / maxv, 5.5);
    ctx.lineTo(5.5 + 570.5 * dispmin / maxv, 280.5);
    ctx.font = `12px cursive`;
    ctx.fillText('Откл', 570.5 * dispmin / maxv, 10.5);
    ctx.fillText(dispmin.toFixed(2), 570.5 * dispmin / maxv, 22.5);
    ctx.font = `20px ${$('.container').css("font-family")}`;
    ctx.stroke();
    ctx.closePath();
}


function map() {
    let k = getRatio($("#ChisloYchastkov").val());
    var canv = document.getElementById("canv2");
    var mid = parseFloat(SredPloshad.value);
    var disp = mid + parseFloat(Otklonenie.value);
    let dispmin = mid - parseFloat(Otklonenie.value);

    var ctx = canv.getContext('2d');
    canv.width = 600;
    canv.height = 300;
    var pic = new Image();
    ctx = canv.getContext('2d');
    pic.src = 'map.jpg';
    canv.width = 600;
    canv.height = 300;
    pic.onload = function () {
        ctx.drawImage(pic, 0, 0, canv.width, canv.height);
        var n = parseFloat(ChisloYchastkov.value);
        for (var i = 1; i <= n; i++) {
            let sredX = 0;
            let sredY = 0;
            let element1 = "ploshad" + i;
            let element2 = "koord" + i;
            let koord = document.getElementById(element2).value;
            let koordmass = koord.split(";");
            ctx.beginPath();
            ctx.fillStyle = `rgba(${20 * i}, 255, 0, 0.7)`;
            if (document.getElementById(element1).value >= disp || document.getElementById(element1).value <= dispmin) {
                ctx.fillStyle = "rgba(255, 255, 0, 0.7)"
            }

            if ((document.getElementById(element1).value - SredPloshad.value) / Otklonenie.value >= k) {
                ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
            }

            for (var j = 1; j < koordmass.length; j += 2) {

               
                if (j > 1) {
                    ctx.lineTo(koordmass[j - 1], koordmass[j]);
                }
                else {
                    ctx.moveTo(koordmass[j - 1], koordmass[j]);
                }
                sredX = (sredX * ((koordmass.length - 1) / 2) + parseFloat(koordmass[j - 1])) / ((koordmass.length - 1) / 2);
                sredY = (sredY * ((koordmass.length - 1) / 2) + parseFloat(koordmass[j])) / ((koordmass.length - 1) / 2);
            }
            ctx.fill();
            ctx.closePath();

            ctx.fillStyle = "black";
            ctx.font = "italic 16pt Arial";
            ctx.fillText(document.getElementById(element1).value, sredX, sredY);

            ctx.fillStyle = `rgba(${20 * i}, 255, 0, 0.7)`;
            ctx.stroke();
        }

    }
}




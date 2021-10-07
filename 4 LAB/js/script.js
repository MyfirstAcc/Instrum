'use strict' //strong mode 


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
                if (localStorage[element1] == undefined) { localStorage[element1] = "" }
                if (parametr.length > 1) { localStorage[element1] = parametr[i - 1] }
                div.append(
                    ` <div class="m-2 form-group row">
                        <label class="col-5 col-form-label">Площадь повреждённой территории на ${i} участке:</label>
                        <div class="col-3">
                            <input class='tab form-control ' type=text id='ploshad${i}' value="${localStorage[element1]}">
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
        stackAbnormal=[];
        let n = $("#ChisloYchastkov").val();
        $("#SumPloshad").val("0");
        $("#SredPloshad").val("0");
        $("#Otklonenie").val("0");


        for (let i = 1; i <= n; i++) {
            if (i <= n) {
                let element1 = "ploshad" + i;
                localStorage[element1] = document.getElementById(element1).value;
                $("#SumPloshad").val($("#SumPloshad").val() * 1 + $(`#${element1}`).val() * 1);
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
        abnormalHide()

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


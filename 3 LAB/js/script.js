'use strict'

$(document).ready(function () {

    if (localStorage["ChisloYchastkov"] > 0)
        ChisloYchastkov.value = localStorage["ChisloYchastkov"]



    $("#Button1").click(TableYchastki);
    $(document).on('click', "#Button2", abnormalHide);

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

        $("#div1").css("display", "block");
        $("#div1").html("");
        for (let i = 1; i <= n; i++) {
            if (i <= n) {
                let element1 = "ploshad" + i;
                if (localStorage[element1] == undefined) { localStorage[element1] = "" }
                $("#div1").append(
                    ` <div class="form-group row">
                        <label class="col-5 col-form-label">Площадь повреждённой территории на ${i} участке:</label>
                        <div class="col-6">
                            <input class='tab'  type=text id='ploshad${i}' value="${localStorage[element1]}">
                        </div>
                    </div>`);
            }
        }

        $("#div1").append(`
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


        $("#div1").append(
            ` <div class="form-group row">
                <label class="col-5 col-form-label">Общая площадь повреждённой территории:</label> 
                <div class="col-6">
                    <input class='tab'  type=text readonly class="form-control-plaintext" id='SumPloshad' >
                </div>
            </div>`);


        $("#div1").append(
            ` <div class="form-group row">
                <label class="col-5 col-form-label">Средняя площадь повреждённой территории:</label> 
                <div class="col-6">
                    <input class='tab' type=text  readonly class="form-control-plaintext" id='SredPloshad' >
                </div>
            </div>`);


        $("#div1").append(
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

    function abnormalHide() {

        let n = $("#ChisloYchastkov").val();
        $("#SumPloshad").val("0");
        $("#SredPloshad").val("0");
        $("#Otklonenie").val("0");
        let flagAbnormal = false;

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
            $(`#${element1}`).css("background", "");

            if ((($(`#${element1}`).val() * 1) - ($("#SredPloshad").val() * 1)) / ($("#Otklonenie").val() * 1) >= number) {
                $(`#${element1}`).css("background", "red");
                $(`.Abnormal`).css("display", "block");
                flagAbnormal = true;
            }
        }
        return flagAbnormal;
    }

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
        let flag;

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
});

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


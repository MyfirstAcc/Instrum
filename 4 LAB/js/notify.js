let noty = new Noty({
    theme:'bootstrap-v4',
    text: `<p>Не все значения имеют нормальные значения!</p>
            <b>Вы точно хотите продолжить и сохранить без исправлений?</b>`,
    buttons: [
        Noty.button('Да', ' m-2 btn btn-outline-warning', function () {
            saveFiledInTxt();
            noty.close();

        }, { id: 'button1', 'data-status': 'ok' }),

        Noty.button('Нет', 'btn btn-outline-success', function () {
            noty.close();
        })
    ]
});
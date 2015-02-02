function ChangeLanguage(language) {
    var messagesXml = [
        'js/vendor/traducao/traducao.xml'
    ];

    $(messagesXml).each(function (index, item) {
        $.ajax({
            url: item,
            success: function (xml) {
                $(xml).find('translation').each(function () {
                    var id = $(this).attr('id');
                    var text = $(this).find(language).text();
                    $("." + id).html(text);
                });
            }
        });
    });
}

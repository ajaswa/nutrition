var NT = NT || {};
NT.appKEY = "a612c3af4c291fb441f665ff21023933";
NT.appID = "fdac48c4";
NT.getURL = "https://api.nutritionix.com/v1_1/item?appId=" + NT.appId + "&appKey=" + NT.appKey + "&upc=";
NT.init = function() {

    $('#searchForm').submit(function( event ) {
        event.preventDefault();
        $.get( NT.getUri + $("#upc").val() )
            .done(function(data) {
                postResults(data);
            });
    });

    $(".dial").knob();
    $('.dial').val(0).trigger('change');
};

NT.postResults = function(response) {
    var foodItem = JSON.parse(response);
    $("#results").html(response);
    $("#calories").val(foodItem.nf_calories).trigger('change');
    $("#fat").val(foodItem.nf_total_fat).trigger('change');
    $("#sodium").val(foodItem.nf_sodium).trigger('change');
    $("#sugars").val(foodItem.nf_sugars).trigger('change');
    $("#productName").html(foodItem.item_name);

};

$(function() {
    NT.init();
});

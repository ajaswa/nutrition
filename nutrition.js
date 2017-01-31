var NT = NT || {};
NT.appKey = "a612c3af4c291fb441f665ff21023933";
NT.appId = "fdac48c4";
NT.getUri = "https://api.nutritionix.com/v1_1/item?appId=" + NT.appId + "&appKey=" + NT.appKey + "&upc=";
NT.init = function() {

    $('#searchForm').submit(function( event ) {
        event.preventDefault();
        $.get( NT.getUri + $("#upc").val() )
            .done(function(data) {
                NT.postResults(data);
            })
            .fail(function(){
                $("#productName").html("Please try another product");
            });
    });
    $("#searchForm small span").on("click", function(e){
        $("#upc").val(e.target.innerHTML);
        $("#searchForm").submit();
    });

    $(".dial").knob();
    $(".dial").val(0).trigger("change");
};

NT.postResults = function(foodItem) {
    $("#results").html(foodItem);
    $("#calories").val(foodItem.nf_calories).trigger('change');
    $("#fat").val(foodItem.nf_total_fat).trigger('change');
    $("#sodium").val(foodItem.nf_sodium).trigger('change');
    $("#sugars").val(foodItem.nf_sugars).trigger('change');
    $("#productName").html(foodItem.item_name);

};

$(function() {
    NT.init();
});

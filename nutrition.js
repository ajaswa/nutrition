$(function() {
    var NT = {
        appKey: "a612c3af4c291fb441f665ff21023933",
        appId: "fdac48c4",
        getUri: "https://api.nutritionix.com/v1_1/item",
        init: function() {
            var self = this;
            $(".dial").knob();
            $(".dial").val(0).trigger("change");

            Quagga.init(

                {
                    "inputStream":{
                        "type":"LiveStream",
                        "constraints":{
                            "width":{
                                "min":640
                            },
                            "height":{
                                "min":480
                            },
                            "aspectRatio":{
                                "min":1,
                                "max":100
                            },
                            "facingMode":"environment"
                        }
                    },
                    "locator":{
                        "patchSize":"medium",
                        "halfSample":true
                    },
                    "numOfWorkers":4,
                    "decoder":{
                        "readers":[
                            {
                                "format":"upc_reader",
                                "config":{

                                }
                            }
                        ]
                    },
                    "locate":true
                },
                function ( err ) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                    NT.attachListeners();
                    Quagga.start();
                });
        },

        attachListeners: function() {
            var self = this;

            self.initCameraSelection();
            $('#searchForm').submit(function( e ) {
                e.preventDefault();
                $.get( self.getUri + "?appId=" + self.appId + "&appKey=" + self.appKey + "&upc="+  $("#upc").val() )
                    .done(function(data) {
                        self.postResults(data);
                    })
                    .fail(function(){
                        $("#productName").html("Please try another product");
                    });
            });
            $("#searchForm small span").on("click", function(e){
                $("#upc").val(e.target.innerHTML);
                $("#searchForm").submit();
            });

        },
        postResults: function(foodItem) {
            $("#calories").val(foodItem.nf_calories).trigger('change');
            $("#fat").val(foodItem.nf_total_fat).trigger('change');
            $("#sodium").val(foodItem.nf_sodium).trigger('change');
            $("#sugars").val(foodItem.nf_sugars).trigger('change');
            $("#productName").html(foodItem.item_name);
        },
        initCameraSelection: function(){
            var streamLabel = Quagga.CameraAccess.getActiveStreamLabel();

            return Quagga.CameraAccess.enumerateVideoDevices()
            .then(function(devices) {
                function pruneText(text) {
                    return text.length > 30 ? text.substr(0, 30) : text;
                }
                var $deviceSelection = document.getElementById("deviceSelection");
                while ($deviceSelection.firstChild) {
                    $deviceSelection.removeChild($deviceSelection.firstChild);
                }
                devices.forEach(function(device) {
                    var $option = document.createElement("option");
                    $option.value = device.deviceId || device.id;
                    $option.appendChild(document.createTextNode(pruneText(device.label || device.deviceId || device.id)));
                    $option.selected = streamLabel === device.label;
                    $deviceSelection.appendChild($option);
                });
            });
        },
    };

    NT.init();

    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {color: "green", lineWidth: 2});
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, {x: 0, y: 1}, drawingCtx, {color: "#00F", lineWidth: 2});
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, {x: 'x', y: 'y'}, drawingCtx, {color: 'red', lineWidth: 3});
            }
        }
    });

    Quagga.onDetected(function(result) {
        var code = result.codeResult.code;

        if (NT.lastResult !== code) {
            NT.lastResult = code;
            var $node = null, canvas = Quagga.canvas.dom.image;

            $node = $('<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>');
            $node.find("img").attr("src", canvas.toDataURL());
            $node.find("h4.code").html(code);
            $("#result_strip ul.thumbnails").prepend($node);
            $("#upc").val(code);
        }
    });


});

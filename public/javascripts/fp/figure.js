
//$LAB.script('http://maps.googleapis.com/maps/api/js?sensor=true').wait()


$LAB
    .setOptions({BasePath:'/javascripts/'})

    // Load JQuery UI & Plug-ins

    // Load other libraries
    .script([
        'jquery/jquery-1.7.1.min.js'
    ])

        // Load FiercePlanet other plugins
   .script([
       'fp/graphics/stick-figure.js'
   ])
    .wait(function() {
        var frame = 0
            , maxFrames = 3;
        var direction = 0;
        var canvasName = '#resourceCanvas';
        var defaultY = 25;
        var running = false;
        var drawFigure = function() {
            var y = defaultY;
            var action = $('input:radio[name=action]:checked').val();
            var reverse = $('input:checkbox[name=reverse]:checked').val();
            var exaggerated = $('input:checkbox[name=exaggerated]:checked').val();
            direction = (reverse == 'on' ? 1 : 0);
            if (action == 'run') {
                switch (frame) {
                    case 0:
                        y = y - 5;
                        break;
                    case 1:
                        y = y - 10;
                        break;
                    case 2:
                        y = y - 5;
                        break;
                    case 3:
                        break;
                }
            }
            var canvas = $(canvasName)[0];
            var ctx = canvas.getContext('2d');
            var w = canvas.width;
            var h = canvas.height;
            ctx.clearRect(0, 0, w, h);


            var sf = new FiercePlanet.StickFigure(150, y, 100, 100, exaggerated);
            sf.defaultAction = eval('sf. ' + action);
            sf.defaultAction(frame, direction);
            sf.drawFigure(ctx);

            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.strokeStyle = '#000';
            ctx.stroke();

            ctx.strokeRect(150, y, 100, 100);

            $('#display').html(frame);
            frame = (frame == maxFrames ? 0 : frame + 1)
        };
        $('#step').click(drawFigure);
        $('#play').click(function() {
                if (running) {
                    clearInterval(this.agentTimerId);
                    running = false;
                }
                else {
                    this.agentTimerId = setInterval(drawFigure, 200);
                    running = true;
                }
            }
        );

    })


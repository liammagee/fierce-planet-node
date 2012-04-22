/**
 * Note: assumes paper.js is loaded
 */



function onMouseMove(event) {
    FiercePlanet.Effects.currentEffect.mouseMove(event);
}

// The onFrame function is called up to 60 times a second:
function onFrame(event) {
    if (Lifecycle.inPlay
        && (_.isUndefined(Lifecycle.currentWorld.scrollingImageVisible) || Lifecycle.currentWorld.scrollingImageVisible)
        && (_.isUndefined(Universe.settings.scrollingImageVisible) || Universe.settings.scrollingImageVisible)) {
        FiercePlanet.Effects.currentEffect.drawEffect();
    }
}

FiercePlanet.Effects = FiercePlanet.Effects || {};
FiercePlanet.Effects.setupView = function() {
    this.currentEffect = this.currentEffect || FiercePlanet.Effects.Snow;
    // Place the instances of the symbol:
    if ((_.isUndefined(Lifecycle.currentWorld.scrollingImageVisible) || Lifecycle.currentWorld.scrollingImageVisible)
        &&
        (_.isUndefined(Universe.settings.scrollingImageVisible) || Universe.settings.scrollingImageVisible)) {
        project.activeLayer.removeChildren();
        FiercePlanet.Effects.currentEffect.setupEffect();
    }
}

FiercePlanet.Effects.Snow = FiercePlanet.Effects.Snow || {};
FiercePlanet.Effects.Snow.setupEffect = function() {
// The amount of symbol we want to place;
    this.count = 150;
// Create a symbol, which we will use to place instances of later:
    this.path = new Path.Circle(new Point(0, 0), 5);
    this.path.style = {
        fillColor: 'white',
        strokeColor: 'white'
    };
    this.symbol = new Symbol(this.path);
    this.vector = new Point({
        angle: 45,
        length: 0
    });
    this.mouseVector = this.vector.clone();

    for (var i = 0; i < this.count; i++) {
        // The center position is a random point in the view:
        var center = Point.random() * view.size;
        var placed = this.symbol.place(center);
        placed.scale(i / this.count);
        placed.data = {};
        placed.data.vector = new Point({
            angle: Math.random() * 360,
            length : (i / this.count) * (Math.random()) / 5
        });
    }
};
FiercePlanet.Effects.Snow.mouseMove = function(event) {
    this.mouseVector = view.center;// - event.point;
};
FiercePlanet.Effects.Snow.drawEffect = function() {
    this.vector = this.vector + (this.mouseVector - this.vector) / 30;

    // Run through the active layer's children list and change
    // the position of the placed symbols:
    for (var i = 0; i < this.count; i++) {
        var item = project.activeLayer.children[i];
        var size = item.bounds.size;
        var length = this.vector.length / 200 * size.width / 10;
        item.position += this.vector.normalize(length) + item.data.vector;
        this.keepInView(item);
    }
};
FiercePlanet.Effects.Snow.keepInView = function(item) {
    var position = item.position;
    var itemBounds = item.bounds;
    var bounds = view.bounds;
    if (itemBounds.left > bounds.width) {
        position.x = -item.bounds.width;
    }

    if (position.x < -itemBounds.width) {
        position.x = bounds.width + itemBounds.width;
    }

    if (itemBounds.top > view.size.height) {
        position.y = -itemBounds.height;
    }

    if (position.y < -itemBounds.height) {
        position.y = bounds.height  + itemBounds.height / 2;
    }
};

FiercePlanet.Effects.Rain = FiercePlanet.Effects.Rain || {};
FiercePlanet.Effects.Rain.setupEffect = function() {
// The amount of symbol we want to place;
    this.count = 150;
// Create a symbol, which we will use to place instances of later:
    this.path = new Path.RoundRectangle(new Rectangle(new Point(0, 0), new Size(2, 10)), new Size(1, 1));
    this.path.style = {
        fillColor: 'grey',
        strokeColor: 'grey'
    };
    this.symbol = new Symbol(this.path);
    this.vector = new Point({
        angle: 15,
        length: 0
    });
    this.mouseVector = this.vector.clone();

    for (var i = 0; i < this.count; i++) {
        // The center position is a random point in the view:
        var center = Point.random() * view.size;
        var placed = this.symbol.place(center);
        placed.scale(i / this.count);
        placed.data = {};
        placed.data.vector = new Point({
            angle: Math.random() * 360,
            length : (i / this.count) * (Math.random()) / 5
        });
    }
};
FiercePlanet.Effects.Rain.mouseMove = function(event) {
    this.mouseVector = view.center;// - event.point;
};
FiercePlanet.Effects.Rain.drawEffect = function() {
    this.vector = this.vector + (this.mouseVector - this.vector) / 30;

    // Run through the active layer's children list and change
    // the position of the placed symbols:
    for (var i = 0; i < this.count; i++) {
        var item = project.activeLayer.children[i];
        var size = item.bounds.size;
        var length = this.vector.length / 200 * size.width / 10;
        item.position += this.vector.normalize(length) + item.data.vector;
        this.keepInView(item);
    }

};
FiercePlanet.Effects.Rain.keepInView = function(item) {
    var position = item.position;
    var itemBounds = item.bounds;
    var bounds = view.bounds;
    if (itemBounds.left > bounds.width) {
        position.x = -item.bounds.width;
    }

    if (position.x < -itemBounds.width) {
        position.x = bounds.width + itemBounds.width;
    }

    if (itemBounds.top > view.size.height) {
        position.y = -itemBounds.height;
    }

    if (position.y < -itemBounds.height) {
        position.y = bounds.height  + itemBounds.height / 2;
    }
};


FiercePlanet.Effects.currentEffect = FiercePlanet.Effects.Snow;

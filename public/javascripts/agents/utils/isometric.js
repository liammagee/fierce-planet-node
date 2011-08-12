/*!
 * Fierce Planet - Isometric utilities
 * Various utility methods
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains isometric utility functions
 */
FiercePlanet.Isometric = FiercePlanet.Isometric || {};
var Isometric = Isometric || {};


// Adapted from Danko Kozar, http://www.flashperfection.com/tutorials/Isometric-Transformations-15818.html

// "0.46365 (radians) - it's a “classic” 1:2 isometric angle which lays up perfectly into pixel grid of the computer screen. "
Isometric.DEFAULT_PERSPECTIVE_ANGLE = 0.46365;
//Isometric.PERSPECTIVE_ANGLE = 0.30;
Isometric.PERSPECTIVE_ANGLE = Isometric.DEFAULT_PERSPECTIVE_ANGLE;

Isometric.DEFAULT_ROTATION_ANGLE = 0;
Isometric.ROTATION_ANGLE = Isometric.DEFAULT_ROTATION_ANGLE;


/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.offsets3DPoint = function (point3d) {
    var x = point3d[0];
    var y = point3d[1];
    var z = point3d[2];

    // Cartesian coordinates
    var xCart = (x-z)*Math.cos(Isometric.PERSPECTIVE_ANGLE);
    // flash coordinates
    var xI = xCart;
    // Cartesian coordinates
    var yCart = y+(x+z)*Math.sin(Isometric.PERSPECTIVE_ANGLE);
    // flash coordinates
    var yI = -yCart;


    return {x: xI, y: yI};
};


/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.generate2DPoint = function (origin, point3d) {
    var xOrigin = origin[0];
    var yOrigin = origin[1];
    var point = Isometric.offsets3DPoint(point3d);
    var xI = point.x + xOrigin;
    var yI = point.y + yOrigin;
    return {x: xI, y: yI};
};

/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.lineTo3DPoint = function (context, origin, point3d) {
    var point = Isometric.generate2DPoint(origin, point3d);
    context.lineTo(point.x, point.y);
    return point;
};

/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.draw3DTile = function (context, origin, tileSize) {
    var x3d = [tileSize, 0, 0];
    var y3d = [0, tileSize, 0];
    var z3d = [0, 0, tileSize];
    var xOrigin = origin[0];
    var yOrigin = origin[1];
    var point = Isometric.offsets3DPoint(x3d);
    // Revise height
    var isoTileHeight = - point.y * 2;
//    var originCoordX = xOrigin + point.x;
//    var originCoordY = yOrigin + isoTileHeight;
//    var endCoordX = xOrigin - point.x;
//    var endCoordY = yOrigin;
    y3d = [0, isoTileHeight, 0];

//    context.clearRect();

    context.beginPath();
    context.moveTo(xOrigin, yOrigin);
    Isometric.lineTo3DPoint(context, origin, x3d);
    Isometric.lineTo3DPoint(context, origin, y3d);
    Isometric.lineTo3DPoint(context, origin, z3d);
    context.lineTo(xOrigin, yOrigin);
    context.closePath();
};

/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.doIsometricOffset = function (xPos, yPos) {
    var tileOffset = Isometric.offsets3DPoint([FiercePlanet.cellHeight, 0, 0]);
    var midTileX = (FiercePlanet.worldWidth - 1) / 2;
    var midTileY = (FiercePlanet.worldHeight - 1) / 2;
    var midTilePosX = midTileX * FiercePlanet.cellWidth;
    var midTilePosY = midTileY * FiercePlanet.cellHeight;

    var diffX = xPos - midTileX;
    var diffY = yPos - midTileY;
    var diffXY = diffX - diffY;
    var x = midTilePosX + (tileOffset.x * 2 * (diffX - (diffXY * 0.5)));
    var y = midTilePosY - (tileOffset.y * 2 * (diffXY * - 0.5));

    return {x: x, y: y};
};

/**
 * Normalises the isometric co-ordinate to a convention co-ordinate position
 * TODO: Needs proper mathematical reversal of all angular transformations
 */
Isometric.normaliseCoordinates = function (x, y) {
    var tileOffset = Isometric.offsets3DPoint([FiercePlanet.cellHeight, 0, 0]);
    var midTilePosX = FiercePlanet.WORLD_WIDTH / 2;
    var midTilePosY = FiercePlanet.WORLD_HEIGHT / 2;

    var isoCellRatio = FiercePlanet.cellWidth / (tileOffset.x * 2);
    var diffX = (x - midTilePosX) * isoCellRatio;
    var diffY = (y - midTilePosY);
    var newXPos = diffX - (diffY * midTilePosX / midTilePosY);
    var newYPos = (diffX * midTilePosY / midTilePosX + diffY);
    var newX = midTilePosX + ((newXPos));
    var newY = midTilePosY + ((newYPos));

    return {x: newX, y: newY};
};

/**
 * Normalises the isometric co-ordinate to a convention co-ordinate position
 */
Isometric.roundTo = function (value, number) {
    var isNeg = (value < 0);
    var baseValue = (isNeg ? Math.ceil(value) : Math.floor(value));
  var remainder = value % 1;
  if (!isNeg && remainder > number)
    value = baseValue + number;
  else if (isNeg && remainder < - number)
    value = baseValue - number;
  else
    value = baseValue;
  return value;
};


// Adapted from Danko Kozar, http://www.flashperfection.com/tutorials/Isometric-Transformations-15818.html


/**
 * Transforms x,y,z coordinates into Flash x coordinate
 *
 * @param x
 * @param y
 * @param z
 */
Isometric.xFla = function (xOrigin, x, y, z) {
    var xCart = (x-z)*Math.cos(Isometric.PERSPECTIVE_ANGLE);
    // flash coordinates
    var xI = xCart + xOrigin;
    return (xI);
};


/**
 * Transforms x,y,z coordinates into Flash y coordinate
 * @param x
 * @param y
 * @param z
 */
Isometric.yFla = function (yOrigin, x, y, z) {
    var yCart = y+(x+z)*Math.sin(Isometric.PERSPECTIVE_ANGLE);
    // flash coordinates
    var yI = -yCart + yOrigin;
    return (yI);
};

// --- drawing functions --------------------------------
/**
 *
 * @param l
 * @param r
 * @param g
 * @param b
 * @param a
 */
Isometric.style = function (l, r, g, b, a) {
    // a: line width
    // b: line color
    // c: line alpha
    ctx.lineWidth = l;
    ctx.strokeStyle = rgb(r, g, b, a);
};
/**
 *
 * @param ctx
 * @param x
 * @param y
 * @param z
 */
Isometric.plot = function (ctx, xOrigin, yOrigin, x, y, z) {
    ctx.moveTo(Isometric.xFla(xOrigin, x, y, z), Isometric.yFla(yOrigin, x, y, z));
};
/**
 *
 * @param ctx
 * @param x
 * @param y
 * @param z
 */
Isometric.draw = function (ctx, xOrigin, yOrigin, x, y, z) {
    ctx.lineTo(Isometric.xFla(xOrigin, x, y, z), Isometric.yFla(yOrigin, x, y, z));
};

/**
 *
 * @param x
 * @param y
 * @param z
 * @param a
 * @param b
 * @param c
 * @param color
 */
Isometric.box = function (ctx, xOrigin, yOrigin, x, y, z, a, b, c) {
    ctx.beginPath();
    Isometric.plot(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.plot(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.plot(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z);
    ctx.closePath();
};
/**
 *
 * @param x
 * @param y
 * @param z
 * @param a
 * @param b
 * @param c
 * @param color
 * @param fill
 */
Isometric.boxFilled = function (ctx, xOrigin, yOrigin, x, y, z, a, b, c) {
//    style(1, color, 100);
    ctx.beginPath();
    Isometric.plot(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.plot(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x+a, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.plot(ctx, xOrigin, yOrigin, x, y, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y+b, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z+c);
    Isometric.draw(ctx, xOrigin, yOrigin, x, y, z);
    ctx.closePath();
};
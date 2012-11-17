/*!
 * Fierce Planet - Notice
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


var NoticeDimensions = {};
/** @constant The default width of notices */
NoticeDimensions.WAVE_NOTICE_WIDTH = 200;
/** @constant The default height of notices */
NoticeDimensions.WAVE_NOTICE_HEIGHT = 500;
/**
 * Builds an inline notice.
 *
 * @constructor
 * @param text
 * @param x
 * @param y
 * @param width
 * @param height
 * @param start
 * @param duration
 */
function Notice(text, x, y, start, duration, width, height, backgroundColor, foregroundColor, lineWidth, font) {
    this.text = text || "";
    this.start = start || Lifecycle.universeCounter;
    this.duration = duration || 150;
    this.x = x || 0; // Math.random() * (FiercePlanet.Orientation.worldWidth - Notice.WAVE_NOTICE_WIDTH);
    this.y = y || 0; // Math.random() * (FiercePlanet.Orientation.worldHeight - Notice.WAVE_NOTICE_HEIGHT);
    this.width = width || NoticeDimensions.WAVE_NOTICE_WIDTH;
    this.height = height || NoticeDimensions.WAVE_NOTICE_HEIGHT;
    this.backgroundColor = backgroundColor || 'rgba(32, 98, 210)';
    this.foregroundColor = foregroundColor || 'rgba(255, 255, 255)';
    this.lineWidth = lineWidth || 2;
    this.font = font || '500 14px/2 Unknown Font, sans-serif';
}

if (typeof exports !== "undefined")
    exports.Notice = Notice;



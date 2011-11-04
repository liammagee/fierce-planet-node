/*!
 * Fierce Planet - Notice
 *
 * Copyright (C) 2011 Liam Magee
 * MIT Licensed
 */


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
    this.start = start || FiercePlanet.Game.gameCounter;
    this.duration = duration || 150;
    this.x = x || (Math.random() * (FiercePlanet.Orientation.worldWidth - FiercePlanet.Game.WAVE_NOTICE_WIDTH));
    this.y = y || Math.random() * (FiercePlanet.Orientation.worldHeight - FiercePlanet.Game.WAVE_NOTICE_HEIGHT);
    this.width = width || FiercePlanet.Game.WAVE_NOTICE_WIDTH;
    this.height = height || FiercePlanet.Game.WAVE_NOTICE_HEIGHT;
    this.backgroundColor = backgroundColor || 'rgba(32, 98, 210)';
    this.foregroundColor = foregroundColor || 'rgba(255, 255, 255)';
    this.lineWidth = lineWidth || 2;
    this.font = font || '500 14px/2 Unknown Font, sans-serif';
}


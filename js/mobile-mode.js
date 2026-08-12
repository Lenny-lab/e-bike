(function () {
  'use strict';

  function isPhone() {
    var phoneViewport = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    var shortSide = Math.min(window.screen.width || 9999, window.screen.height || 9999);
    return phoneViewport && shortSide <= 600;
  }

  if (isPhone()) document.documentElement.classList.add('is-phone');
}());
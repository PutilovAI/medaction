export default class MenuAim {
  constructor(opts) {
    this.options = Object.assign({
      el_menu: null,
      __row: 'li',
      __submenu: '*',
      submenuDirection: 'right',
      tolerance: 75, // bigger = more forgivey when entering submenu,
      delay: 300,
      c_active: 'state-open',
      enter: () => {},
      activate: () => {},
      deactivate: () => {},
      exitMenu: () => {},
      mouseleaveRow: () => {},
      clickRow: () => {},
    }, opts);

    this.el_menu = this.options.el_menu || null;

    if (!this.el_menu) return;

    this.activeRow = null;
    this.mouseLocs = [];
    this.lastDelayLoc = null;
    this.timeoutId = null;
    this.timerOutRaw = 0;

    this.MOUSE_LOCS_TRACKED = 3; // number of past mouse locations to track
    this.DELAY = this.options.delay; // ms delay when user appears to be entering submenu

    this.onDocumentMousemoveLeaverow = (() => {
      let {DELAY,options} = this;
      //___Для скрытия подменю при наведении между пунктами
      var targetRow = 1,
          stopTimer = 0;

      return (e)=> {
        if (!e.target) return;

        if (typeof e.target.closest === 'function') {
          targetRow = e.target.closest(options.__submenu);
        }

        targetRow = !targetRow ? 0 : 1

        if (targetRow === 0 && stopTimer === 0) {
          this.timerOutRaw = setTimeout(() => {
            this.mouseleaveMenu(e);
            document.removeEventListener('mousemove', this.onDocumentMousemoveLeaverow);
          }, DELAY);
        }
        stopTimer = 1;
      }
    })().bind(this);

    this.mousemoveDocument = this.mousemoveDocument.bind(this)
    this.mouseleaveMenu = this.mouseleaveMenu.bind(this)
    this.mouseenterRow = this.mouseenterRow.bind(this)
    this.mouseleaveRow = this.mouseleaveRow.bind(this)
    this.clickRow = this.clickRow.bind(this)

    this.initEvents()
  }

  deactivate() {
    let {activeRow, options} = this;

    if (activeRow) {
      activeRow.classList.remove(options.c_active);
      options.deactivate(activeRow);
      this.activeRow = null;
    }
  }

  activate(row) {
    let {activeRow, options} = this;

    if (row === activeRow) {
      return;
    }

    if (activeRow) {
      this.deactivate();
    }

    options.activate(row);
    this.activeRow = row;
  }

  exitMenu() {
    this.options.exitMenu()
  }

  /**
   * Keep track of the last few locations of the mouse.
   */
  mousemoveDocument(e) {
    let {mouseLocs, MOUSE_LOCS_TRACKED} = this;

    this.mouseLocs.push({ x: e.pageX, y: e.pageY });

    if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
      this.mouseLocs.shift();
    }
  }

  /**
   * Cancel possible row activations when leaving the menu entirely
   */
  mouseleaveMenu(e) {
    let {timeoutId} = this;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    this.deactivate();
  }

  /**
   * Trigger a possible row activation whenever entering a new row.
   */

  mouseenterRow(e) {
    let {timeoutId, timerOutRaw, options} = this;
    let row = e.target;

    if (timeoutId) {
      // Cancel any previous activation delays
      clearTimeout(timeoutId);
    }

    options.enter(row);
    this.possiblyActivate(row);

    clearTimeout(timerOutRaw);
    document.removeEventListener('mousemove', this.onDocumentMousemoveLeaverow);
  }

  mouseleaveRow(e) {
    let {options, activeRow} = this;

    options.mouseleaveRow(e, activeRow);
    document.addEventListener('mousemove', this.onDocumentMousemoveLeaverow);
  }

  /*
  * Immediately activate a row if the user clicks on it.
  */
  clickRow(e) {
    const row = e.target.closest(this.options.__row);
    if (row) {
      this.activate(row);
      this.options.clickRow(row);
    }
  }


  /**
   * Possibly activate a menu row. If mouse movement indicates that we
   * shouldn't activate yet because user may be trying to enter
   * a submenu's content, then delay and check again later.
   */
  possiblyActivate(row) {
    var delay = this.activationDelay();

    if (delay) {
      this.timeoutId = setTimeout(() => {
        this.possiblyActivate(row);
      }, delay);
    } else {
      this.activate(row);
    }
  }

  /**
   * Return the amount of time that should be used as a delay before the
   * currently hovered row is activated.
   *
   * Returns 0 if the activation should happen immediately. Otherwise,
   * returns the number of milliseconds that should be delayed before
   * checking again to see if the row should be activated.
   */
  activationDelay() {
    let { activeRow, options, el_menu, lastDelayLoc, DELAY, mouseLocs } = this;

    if (!activeRow || !activeRow.querySelectorAll(options.__submenu).length) {
      // If there is no other submenu row already active, then
      // go ahead and activate immediately.
      return 0;
    }

    const offset = {
      top: el_menu.offsetTop,
      left: el_menu.offsetLeft,
    };

    const upperLeft = {
      x: offset.left,
      y: offset.top - options.tolerance,
    };

    const upperRight = {
      x: offset.left + el_menu.offsetWidth,
      y: upperLeft.y,
    };

    const lowerLeft = {
      x: offset.left,
      y: offset.top + el_menu.offsetHeight + options.tolerance,
    };

    const lowerRight = {
      x: offset.left + el_menu.offsetWidth,
      y: lowerLeft.y,
    };

    let loc = mouseLocs[mouseLocs.length - 1];
    let prevLoc = mouseLocs[0];

    if (!loc) {
      return 0;
    }

    if (!prevLoc) {
      prevLoc = loc;
    }

    if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
      prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
      // If the previous mouse location was outside of the entire
      // menu's bounds, immediately activate.
      return 0;
    }

    if (lastDelayLoc &&
      loc.x === lastDelayLoc.x && loc.y === lastDelayLoc.y) {
      // If the mouse hasn't moved since the last time we checked
      // for activation status, immediately activate.
      return 0;
    }

    // Detect if the user is moving towards the currently activated
    // submenu.
    //
    // If the mouse is heading relatively clearly towards
    // the submenu's content, we should wait and give the user more
    // time before activating a new row. If the mouse is heading
    // elsewhere, we can immediately activate a new row.
    //
    // We detect this by calculating the slope formed between the
    // current mouse location and the upper/lower right points of
    // the menu. We do the same for the previous mouse location.
    // If the current mouse location's slopes are
    // increasing/decreasing appropriately compared to the
    // previous's, we know the user is moving toward the submenu.
    //
    // Note that since the y-axis increases as the cursor moves
    // down the screen, we are looking for the slope between the
    // cursor and the upper right corner to decrease over time, not
    // increase (somewhat counterintuitively).
    function slope(a, b) {
      return (b.y - a.y) / (b.x - a.x);
    };

    var decreasingCorner = upperRight,
        increasingCorner = lowerRight;

    // Our expectations for decreasing or increasing slope values
    // depends on which direction the submenu opens relative to the
    // main menu. By default, if the menu opens on the right, we
    // expect the slope between the cursor and the upper right
    // corner to decrease over time, as explained above. If the
    // submenu opens in a different direction, we change our slope
    // expectations.
    if (options.submenuDirection === "left") {
      decreasingCorner = lowerLeft;
      increasingCorner = upperLeft;
    } else if (options.submenuDirection === "below") {
      decreasingCorner = lowerRight;
      increasingCorner = lowerLeft;
    } else if (options.submenuDirection === "above") {
      decreasingCorner = upperLeft;
      increasingCorner = upperRight;
    }

    var decreasingSlope = slope(loc, decreasingCorner),
        increasingSlope = slope(loc, increasingCorner),
        prevDecreasingSlope = slope(prevLoc, decreasingCorner),
        prevIncreasingSlope = slope(prevLoc, increasingCorner);

    if (decreasingSlope < prevDecreasingSlope &&
          increasingSlope > prevIncreasingSlope) {
      // Mouse is moving from previous location towards the
      // currently activated submenu. Delay before activating a
      // new menu row, because user may be moving into submenu.
      this.lastDelayLoc = loc;
      return DELAY;
    }

    this.lastDelayLoc = null;
    return 0;
  }

  /**
   * Hook up initial menu events
   */
  initEvents() {
    let { el_menu, options } = this;

    el_menu.addEventListener('mouseleave', this.mouseleaveMenu);
    let el_rows = el_menu.querySelectorAll(options.__row);

    if (el_rows.length) {
      el_rows.forEach((item) => {
        item.addEventListener('mouseenter', this.mouseenterRow);
        item.addEventListener('mouseleave', this.mouseleaveRow);
        item.addEventListener('click', this.clickRow);
      });
    }

    document.addEventListener('mousemove', this.mousemoveDocument);
  }
}

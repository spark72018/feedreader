/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(
  (function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
      /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
      it('are defined', function() {
        expect(allFeeds).toBeDefined();
        expect(allFeeds.length).not.toBe(0);
      });

      /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
      it('all feed objects have url property and is not empty', function() {
        allFeeds.forEach(feedObj => {
          expect(feedObj.hasOwnProperty('url')).toBe(true);
          expect(feedObj.url).toBeTruthy();
        });
      });

      /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
      it('all feed objects have truthy name property value', function() {
        allFeeds.forEach(feedObj => {
          expect(feedObj.hasOwnProperty('name')).toBe(true);
          expect(feedObj.name).toBeTruthy();
        });
      });
    });

    /* TODO: Write a new test suite named "The menu" */
    describe('The menu', function() {
      /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
      it('menu hidden by default', function() {
        const bodyClassList = document.body.classList;

        expect(bodyClassList.contains('menu-hidden')).toBe(true);
      });
      /* TODO: Write a test that ensures the menu changes
          * visibility when the menu icon is clicked. This test
          * should have two expectations: does the menu display when
          * clicked and does it hide when clicked again.
          */
      it('menu click changes visibility', function(done) {
        const menuIcon = document.getElementsByClassName('menu-icon-link')[0];
        const menu = document.getElementsByClassName('slide-menu')[0];
        const xCoordsBeforeClick = getXCoord(menu);

        expect(xCoordsBeforeClick < 0).toBe(true);

        menuIcon.click();

        // animation takes .2s to complete
        // so get x coord after animation finishes
        setTimeout(() => {
          const xCoordsAfterClick = getXCoord(menu);

          expect(xCoordsAfterClick === 0).toBe(true);

          // click menu again to return to default hidden state
          menuIcon.click();
          done();
        }, 210);

        function getXCoord(element) {
          return element.getBoundingClientRect().x;
        }
      });
    });
    /* TODO: Write a new test suite named "Initial Entries" */
    describe('Initial Entries', function() {
      /* TODO: Write a test that ensures when the loadFeed
             * function is called and completes its work, there is at least
             * a single .entry element within the .feed container.
             * Remember, loadFeed() is asynchronous so this test will require
             * the use of Jasmine's beforeEach and asynchronous done() function.
             */
      beforeEach(function(done) {
        try {
          loadFeed(0, done);
        } catch (e) {
          throw new Error('beforeEach error on loadFeed call', e);
        }
      });

      it('at least one .entry element in .feed after loadFeed called', function() {
        const findClassName = className => element =>
          element.getElementsByClassName(className);
        const feedContainer = document.getElementsByClassName('feed')[0];

        expect(findClassName('entry')(feedContainer).length > 0).toBe(true);
      });
    });

    /* TODO: Write a new test suite named "New Feed Selection" */
    describe('New Feed Selection', function() {
      /* TODO: Write a test that ensures when a new feed is loaded
             * by the loadFeed function that the content actually changes.
             * Remember, loadFeed() is asynchronous.
             */

      // utility functions
      const greaterThan = n2 => n1 =>
        n1 > n2 ? n1 : { error: new Error('n1 is not greater than n2') };

      const greaterThanZero = greaterThan(0);

      const getNestedFirstElementChild = (depth, { firstElementChild }) => {
        if (greaterThanZero(depth).error) {
          const { error } = greaterThanZero(depth);

          throw error;
        }

        return depth === 1
          ? firstElementChild
          : getNestedFirstElementChild(depth - 1, firstElementChild);
      };

      let valBeforeChange;
      let valAfterChange;

      beforeEach(function(done) {
        try {
          loadFeed(0, done);
        } catch (e) {
          throw new Error('beforeEach error on loadFeed call', e);
        }
      });

      it('content changes when new feed loads', function(done) {
        const feedContainer = document.getElementsByClassName('feed')[0];
        const firstEntryHeader = getNestedFirstElementChild(3, feedContainer);

        valBeforeChange = firstEntryHeader.innerText;

        // load different feed
        const test = new Promise((resolve, reject) => {
          loadFeed(1, resolve);
        });
        test.then(val => {
          const firstEntryHeader = getNestedFirstElementChild(3, feedContainer);

          valAfterChange = firstEntryHeader.innerText;
          expect(valAfterChange).not.toBe(valBeforeChange);
          done();
        });
      });
    });
  })()
);

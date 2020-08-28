import test from 'ava';
import sinon from 'sinon';
import html from './helpers/html';
import Player from '../src/player';

test('constructor accepts only Vimeo embeds', (t) => {
    t.throws(() => {
        void new Player(html`<div data-vimeo-initialized><iframe></iframe></div>`);
    });

    t.throws(() => {
        void new Player('string');
    });

    t.throws(() => {
        void new Player(html`<iframe></iframe>`);
    });

    t.throws(() => {
        void new Player(html`<iframe src="https://www.youtube.com/embed/Uj3_KqkI9Zo"></iframe>`);
    });
});

test('contructor does not throw if jquery is not present', (t) => {
    /* eslint-env jquery */
    /* globals jQuery:true */
    const frames = jQuery('iframe')[0];
    const oldJQuery = jQuery;

    window.jQuery = jQuery = undefined;

    t.notThrows(() => {
        void new Player(frames);
    });

    jQuery = window.jQuery = oldJQuery;
});

test('constructor uses the first element from a jQuery object', (t) => {
    /* eslint-env jquery */
    const consoleWarnSpy = sinon.spy(console, 'warn');

    const iframes = jQuery('iframe');
    const player = new Player(iframes);

    t.true(consoleWarnSpy.called);
    t.true(player.element === iframes[0]);

    console.warn.restore();
});

test('constructor does not warn if only one jQuery object', (t) => {
    /* eslint-env jquery */
    const consoleWarnSpy = sinon.spy(console, 'warn');

    const div = jQuery('.one');
    const player = new Player(div);

    t.true(consoleWarnSpy.called === false);
    t.true(player.element === div[0]);

    console.warn.restore();
});

// test.skip('constructor accepts a div without attributes when there is an options object', (t) => {
//     t.notThrows(() => {
//         void new Player(html`<div id="player"></div>`, { id: 76979871 });
//     });
// });
//
// test.skip('constructor finds iframe elements within the provided element', (t) => {
//     const div = html`<div></div>`;
//     const iframe = html`<iframe src="https://player.vimeo.com/video/159195552" width="640" height="360" frameborder="0" allowfullscreen mozallowfullscreen webkitallowfullscreen></iframe>`;
//     div.appendChild(iframe);
//
//     const player = new Player(div);
//
//     t.ok(player.element === iframe);
// });

// test.skip('constructor gets an element by id if passed a string', (t) => {
//     const element = document.getElementById('test_player');
//     const player = new Player('test_player');
//
//     t.ok(player.element === element);
// });

test('constructor returns the same player object for the same element', (t) => {
    const iframe = document.querySelector('.one');
    const player1 = new Player(iframe);
    const player2 = new Player(iframe);

    t.true(player1 === player2);
});

test('constructing a player with a bad URI should fail', async (t) => {
    const player1 = new Player(
        html`<div data-vimeo-id="1"></div>`
    );
    await t.throwsAsync(() => player1.ready());
});

test('future calls to destroyed player should not not work', async (t) => {
    const player1 = new Player(
        html`<iframe id="to-destroy" src="https://player.vimeo.com/video/76979871"></iframe>`
    );

    await t.notThrows(() => player1.destroy());
    t.falsy(document.querySelector('#to-destroy'));

    await t.throwsAsync(() => player1.ready());
    await t.throwsAsync(() => player1.loadVideo(1));
});

test('player object includes all api methods', async (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    const methods = Object.getOwnPropertyNames(Player.prototype)
        .filter((method) => method !== 'constructor')

    methods.forEach((method) => {
        t.true(typeof player[method] === 'function');
    });

    const getters = methods.filter((method) => /^get[A-Z]/.test(method));
    getters.forEach((method) => {
        t.true(player[method]() instanceof Promise);
    });

    const setters = methods.filter((method) => /^set[A-Z]/.test(method));
    for (const method of setters) {
        await t.throwsAsync(() => player[method](), TypeError);
    }

    t.true(player.ready() instanceof Promise);
    t.true(player.play() instanceof Promise);
    t.true(player.pause() instanceof Promise);
    t.true(player.loadVideo() instanceof Promise);
    await t.throws(() => player.enableTextTrack(), TypeError);
    t.true(player.enableTextTrack('en') instanceof Promise);
    t.true(player.disableTextTrack() instanceof Promise);
    t.true(player.addCuePoint() instanceof Promise);
    t.true(player.removeCuePoint() instanceof Promise);
    t.true(player.requestFullscreen() instanceof Promise);
    t.true(player.exitFullscreen() instanceof Promise);
});

test('set requires a value', async (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    await t.throwsAsync(() => player.set('color'), TypeError);
});

test('on requires an event and a callback', (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    t.throws(() => player.on(), TypeError, 'You must pass an event name.');
    t.throws(() => player.on('play'), TypeError, 'You must pass a callback function.');
    t.throws(() => player.on('play', 'string'), TypeError, 'The callback must be a function.');
    t.notThrows(() => player.on('play', () => {
    }));
});

test('off requires an event name, and the optional callback must be a function', (t) => {
    const iframe = document.querySelector('.one');
    const player = new Player(iframe);

    t.throws(() => player.off(), TypeError, 'You must pass an event name.');
    t.throws(() => player.off('play', 'string'), TypeError, 'The callback must be a function.');
    t.notThrows(() => player.off('play', () => {
    }));
});

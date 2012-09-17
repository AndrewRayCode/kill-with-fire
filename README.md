Kill it with fire!
------------------
Not metaphorically speaking.

![Kaboom](https://raw.github.com/DelvarWorld/kill-with-fire/master/screenshot.jpg)

See it live: [Demo](http://andrewray.me/kill-with-fire).

Only works on elements with white backgrounds. Change images/circle_eat.png to a different color for otherwise.

Takes optional config object

    var $thing = $('.thing').killWithFire({
        callback: function() {
            console.log('done!');
        }),
        image_path: '/images_dir/' // defaults to images/ . Must have trailing slash!
    })

Originally made for [The Hippopotamatron 5000](http://andrewray.me/assets/games/hippopotamatron/index.htm).

Never license your code.

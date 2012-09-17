(function() {

var sp,
    animations = [],
    MOTION = {'Normal':1, 'Smooth':2},      // AS3 like motion types. Used for tweening
    INTERVAL = {'Tween':10, 'Animation':20};// Intervals in milliseconds for setTimeout calls. Defaults are Tween:10, Animation:1

$.fn.killWithFire = function(config) {
    config = config || {};

    sp = config.image_path || 'images/';

    var elem = this.get(0), me = this;
    this.css('overflow', 'hidden');
    var offset = {
        y: parseInt(elem.offsetTop, 10),
        x: parseInt(elem.offsetLeft, 10)
    };
    var height = parseInt(elem.clientHeight, 10);
    var steps = Math.round(parseInt(elem.clientWidth, 10) / 50);

    // Steps are how many explosion "lines" there are. Creates new line from right to left every 500 ms.
    for(var x=steps; x > 0; x--) {
        setTimeout((function(i){ return function(){
             explosion(((i*50)+offset.x)-128, offset.y+(height/2)-20, elem);
         }}(x)) , 450*(Math.abs(x-steps)));
    }

    setTimeout(function() {
        me.fadeOut().promise().then(function() {
            me.remove();
            config.callback && config.callback();
        });
    }, 450 * steps);

    return this;
};
        
// Create an explosion at point x,y. Generations are how many "tails" the explosion creates before dying out completely. Each explosion has 2 tails in 
// the next generation, so it's exponential. Default generations is 3 ... 5 lags pretty badly ... 10 almost crashed my computer, but it was nice to look at.
function explosion(x, y, parent, generations) {
    var offset = {
        x: parseInt(parent.offsetLeft, 10),
        y: parseInt(parent.offsetTop, 10)
    };
    var circle = $('<div></div>')
        .appendTo(parent)
        .css({'background':'transparent url('+sp+'circle_eat.png) top left no-repeat', 'position':'absolute',
        'top':(y - offset.y - 36)+'px', 'left':(x - offset.x - 36)+'px', 'width':'200px', 'height':'200px'});
    var ap = false;
    if(generations === undefined) {generations = 2;} // THE FASTER YOUR COMPUTER, THE HIGHER THIS CAN BE
    if(generations == 1) {
        // Make the second to last explosion the smaller one. Looks nice that way for some reason
        animations.push(new SpriteAnimation(ap ? sp+'checkers.png' : sp+'explosion_sprite_4.png', 64, 64, 256, 256, x, y, document.body));
    } else {
        animations.push(new SpriteAnimation(ap ? sp+'checkers.png' : sp+'explosion_sprite_'+randInt(1,3)+'.png', 128, 128, 512, 512, x, y, document.body));
    }
    if(animations.length == 1) { animationLoop(); }
    if(generations > 0) {
        setTimeout(function () {
            explosion(x, (y+20)-randInt(0,80), parent, generations-1); // top
        }, randInt(100, 220));
        setTimeout(function () {
            explosion((x-45)+randInt(0,90), (y+50)-randInt(0,100), parent, generations-1); // bottom right
        }, randInt(30, 90));
    }
}


// This implementation of sprite based animation uses the time tested method of a spritesheet that is cut
// into each frame in a grid image. See the containing folder for example images. This creates a div that will
// show one frame, sticks it in a parent, and launches "callback" on animation finish
function SpriteAnimation(sourceImage, width, height, sprite_width, sprite_height, x, y, parent, callback) {
    this.bg_x = 0; this.bg_y = 0;
    this.sprite_width = sprite_width;
    this.sprite_height = sprite_height;
    this.width = width;
    this.height = height;
    this.animation = $('<div></div>')
        .appendTo(parent)
        .css({'position':'absolute', 'background':'transparent url('+sourceImage+') top left no-repeat scroll',
        'height':height+'px', 'width':width+'px', 'top':y+'px', 'left':x+'px', 'z-index':'9999'})

    // Remove the animation from the stack
    this.destroy = function() {
        removeFromArray(animations, this);
        this.animation.remove();
        if(callback) {
            callback();
        }
    }
    return this;
}

// Where the animation magic happens. Basically shifts the background position of a SpriteAnimation every 20 ms
function animationLoop() {
    for(var i=0; i<animations.length; i++) {
        animations[i].bg_x++;
        if(animations[i].bg_x * animations[i].width == animations[i].sprite_width) {
            animations[i].bg_x = 0;
            animations[i].bg_y++;
        }
        if(animations[i].bg_y * animations[i].height > animations[i].sprite_height) {
            animations[i].destroy();
            break;
        } else {
            animations[i].animation.css('background-position', (-(animations[i].bg_x * animations[i].width))+'px '+(-(animations[i].bg_y * animations[i].height))+'px');
        }
    }
    if(animations.length > 0) {
        setTimeout(animationLoop,INTERVAL.Animation);
    }
}
        
// Generate a random integer with bounds
function randInt(min, max) {
    if (!arguments.length) {
        min = 0; max = 100;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
    
// Remove a specific element from an array
var removeFromArray = function(array, item) {
    for(var x=0; x<array.length; x++) {
        if(array[x] == item) {
            array.splice(x, 1);
            return item;
        }
    }
    return false;
}

}());

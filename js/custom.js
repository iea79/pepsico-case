var app = {
    pageScroll: '',
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= app.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= app.mdWidth && $(window).width() < app.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= app.smWidth && $(window).width() < app.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < app.smWidth; } // < 768
function isIOS() { return app.iOS(); } // for iPhone iPad iPod
function isTouch() { return app.touchDevice(); } // for touch device

$(document).ready(function(){

   $('.stages__for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        asNavFor: '.stages__nav-set',
        fade: true,
        adaptiveHeight: true,
    });
    $('.stages__nav-set').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.stages__for',
        dots: false,
        arrows: false,
        centerMode: true,  
    });

    $('.stages__nav').on('click', '.stages__nav-prev', function() {
        $('.stages__nav-set').slick('slickPrev');
    });

    $('.stages__nav').on('click', '.stages__nav-next', function() {
        $('.stages__nav-set').slick('slickNext');
    });

    $(".stages__nav-set .stages__nav-box").on("click", function() {
        const index = $(this).attr("data-slick-index");
        $(".stages__for").slick("slickGoTo", index);
    });

    var preview = {
        id: 452520245,
        title: false,
    };

    var player1 = new Vimeo.Player('short-video', preview);

    $('#previwe').on('show.bs.modal', function() {
        player1.play();
    });

    $('#previwe').on('hide.bs.modal', function() {
        player1.pause();
    });

    mouseMoveParallax();

    let wowOffset = $(window).height() / 4;

    let wow = new WOW({
        boxClass:     'wow',
        animateClass: 'slideUp', 
        offset:        wowOffset,
    });

    wow.init();
    
});


function mouseMoveParallax() {
    let wrapper = $('.parallaxBox');
    let item = wrapper.find('.parallaxMouse');
    let speed = 0;
    let offsetX;
    let offsetY;

    if (isXsWidth()) return false;

    wrapper.on('mousemove', function(even) {
        // console.log(even.screenX);
        // console.log(even.clientX - $(window).width() / 2);
        offsetX = -(even.clientX - $(window).width() / 2);
        offsetY = -(even.clientY - $(window).width() / 2);

        if (isXsWidth()) {
            item.removeAttr('style');
        } else {
            item.each(function(index, el) {
                speed = $(el).data('speed');
                $(el).attr('style', 'transform: translate3d('+(offsetX*speed/1000)+'em, '+(offsetY*speed/1000)+'em , 0)');
            });
        }

    });

    wrapper.on('mouseleave', function(even) {
        item.each(function(index, el) {
            speed = $(el).data('speed');
            $(el).attr('style', 'transform: translate3d(0, 0 , 0)');
        });
    });
}

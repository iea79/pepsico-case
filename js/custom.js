$(document).ready(function(){

   $('.stages__for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        asNavFor: '.stages__nav-set',
        fade: true,
        responsive: [ 
            {
                breakpoint: 768,
                settings: {
                    adaptiveHeight: true,
                }
            },
        ]
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

    $('[data-fancybox="video"]').fancybox({
        hash: false,
    });

});
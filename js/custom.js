$(document).ready(function(){

   $('.stages__for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        asNavFor: '.stages__nav',
    });
    $('.stages__nav').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.stages__for',
        dots: false,
        arrows: false,
    });

    $(".stages__nav .stages__nav-item").on("click", function() {
        const index = $(this).attr("data-slick-index");
        $(".stages__for").slick("slickGoTo", index);
    });

    $('[data-fancybox="video"]').fancybox({
        hash: false,
    });

});
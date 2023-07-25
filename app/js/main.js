$(function () {
    $('.top-slider__inner').slick({
        dots: true,
        arrows: false,
        fade: true,
        autoplay: true,
        autoplaySpeed: 3000,
    }),
        $(".star").rateYo({
            starWidth: "1px",
            readOnly: true,
        });
})
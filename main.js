jQuery(document).ready(function() {
    jQuery('img.svg').each(function() {

        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Check if the viewport is set, else we gonna set it if we can.
            if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
                $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });

    if (jQuery('#form-expression').length) {
        jQuery('#form-expression').validate({
            rules: {
                exp_name: {
                    required: true
                },
                exp_email: {
                    required: true,
                    email: true
                },
                exp_telephone: {
                    required: true,
                    number: true
                },
                exp_feedback: {
                    required: true
                }
            },
            errorPlacement: function(error, element) {
                //error.insertAfter(element);
            },
            submitHandler: function(form) {
                var action = jQuery(form).attr('action');
                jQuery.ajax({
                    type: "POST",
                    url: action,
                    data: jQuery(form).serialize(),
                    beforeSend: function(xhr) {
                        xhr.overrideMimeType("text/plain; charset=x-user-defined");
                        jQuery('.submit-wrapper .loading').fadeIn(400);
                    },
                    success: function(response) {
                        jQuery('.submit-wrapper .loading').fadeOut(300);
                        jQuery(form)[0].reset();
                        jQuery('#feedback-box .msg-success').fadeIn(300);

                        setTimeout(function() {
                            jQuery('#feedback-box .msg-success').fadeOut(300);
                        }, 10000);

                    }
                });

                return false;
            }
        });
    }


    var owl = jQuery('.owl-destination');
    var owl2 = jQuery('.owl-navigation');

    /*
     * Destination carousel
     */
    owl.owlCarousel({
        nav: false,
        dots: false,
        autoplay: true,
        items: 1,
        slideSpeed: 1000,
        loop: false,
    }).on('changed.owl.carousel', function(event) {
        owl2.trigger('to.owl.carousel', [event.item.index, 300, true]);
        // (Optional) Remove .current class from all items
        owl2.find('.current').removeClass('current');
        // (Optional) Add .current class to current active item
        owl2.find('.owl-item .item').eq(event.item.index).addClass('current');
    });

    /*
     * Navigation carousel
     */
    owl2.owlCarousel({
        nav: true,
        dots: true,
        margin: 10,
        items: 3,
        loop: false
    }).on('click', '.owl-item', function(event) {
        owl.trigger('to.owl.carousel', [jQuery(this).index(), 100, true]);
    });


    jQuery('.scroll-trigger .top-trigger').on('click', function() {
        jQuery(this).parent().next().find('.jspArrowUp').trigger('click');
    });


    /*
     * Replace all SVG images with inline SVG
     */
    jQuery('img.svg').each(function() {
        var $img = jQuery(this);
        var imgID = $img.attr('id');
        var imgClass = $img.attr('class');
        var imgURL = $img.attr('src');

        jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');

            // Add replaced image's ID to the new SVG
            if (typeof imgID !== 'undefined') {
                $svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if (typeof imgClass !== 'undefined') {
                $svg = $svg.attr('class', imgClass + ' replaced-svg');
            }

            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');

            // Replace image with new SVG
            $img.replaceWith($svg);

        }, 'xml');

    });


    //Check to see if the window is top if not then display button
    jQuery(window).scroll(function() {
        var win_width = jQuery(window).width();
        if (jQuery(this).scrollTop() > 150) {
            jQuery('.scrollToTop').fadeIn();
        } else {
            jQuery('.scrollToTop').fadeOut();
        }

        if (jQuery(this).scrollTop() > 211) {
            jQuery('.main-header').addClass('is-sticky');
        } else {
            jQuery('.main-header').removeClass('is-sticky');
        }

        if (jQuery(this).scrollTop() > 101) {
            jQuery('.header-top').slideUp();
        } else {
            jQuery('.header-top').slideDown();
        }

        /*if (jQuery(this).scrollTop() < 50) {
            var header_height = jQuery('#main_header').height();
            jQuery('.header-end').height(header_height);
        }*/

    });

    //Click event to scroll to top
    jQuery('.scrollToTop').click(function() {
        jQuery('html, body').animate({ scrollTop: 0 }, 800);
        return false;
    });

    jQuery('.search-trigger a').on('click', function(event) {
        //var header_height = jQuery('header').height();
        /*jQuery('#overlay-box').css('top',header_height);
        jQuery('#search-box').css('top',header_height + 27);*/
        jQuery('#overlay-box').css('left', 0);

        jQuery('.simple-v-scroll').mCustomScrollbar("update");
        jQuery(body).toggleClass('search-open');

        event.preventDefault();
        jQuery('#overlay-box').slideToggle();
        jQuery('#search-box').slideToggle();

        jQuery('#keyword').val('').focus();

        //api_pane.reinitialise();
    });

    jQuery('#kspg-ajax-search').submit(function(event) {
      if (currentRequest != null) {
        currentRequest.abort();
      }

      var string = jQuery('#keyword').val();
        if(string.length > 0 && string.length < 200){
            window.location.href = "https://beta.kohsantepheapdaily.com.kh/?s=" + string;
        }else{
            event.preventDefault();
        }

        //console.log(string.length);
      
    });


    var paged = 1;
    var searchTerm = '';
    var keep_load = true;

    var currentRequest = null;
    jQuery('#keyword').keyup(function(event) {

        jQuery(this).attr('autocomplete', 'off');
        searchTerm = jQuery(this).val();
        var _this = jQuery(this);

        if (currentRequest != null) {
            currentRequest.abort();
        }

        keep_load = true;

        if (searchTerm.length > 0) {
            delay(function() {
                currentRequest = jQuery.ajax({
                    url: BASE,
                    type: "POST",
                    data: {
                        'action': 'kspg_ajax_search',
                        'term': searchTerm,
                        'paged': 1
                    },
                    dataType: 'html',
                    beforeSend: function() {
                        jQuery('.search-result-wrapper').find('.search-result-overlay').fadeIn(400);
                        jQuery('.search-result-wrapper').find('.search-result-loading').fadeIn(500);

                    },
                    success: function(result) {
                        //serach_count(searchTerm);
                        //load_page_two(searchTerm);
                        //console.log(result);
                        response = jQuery.parseJSON(result);
                        jQuery('#load_more_wrapper').slideDown();

                        var content_data = '<h3>រកមិនឃើញលទ្ធផល</h3>';
                        if (response.all_post > 0) {
                            content_data = response.content
                        }

                        jQuery('.search-result-wrapper').find('.search-result-overlay').fadeOut(300);
                        jQuery('.search-result-wrapper').find('.search-result-loading').fadeOut(300);
                        jQuery('#kspg-search-result #searched-articles').html(content_data).show();
                        jQuery('#kspg-search-result #latest-articles').hide();

                        jQuery('#load_more').data('paged', 2);

                    },
                    error: function(xhr) {
                        jQuery('.search-result-wrapper').find('.search-result-loading').fadeOut(300);
                    }
                });
            }, 800);

        } else {
            jQuery('.search-result-wrapper').find('.search-result-overlay').fadeOut(300);
            jQuery('.search-result-wrapper').find('.search-result-loading').fadeOut(300);
            jQuery('#kspg-search-result #searched-articles').hide();
            jQuery('#kspg-search-result #latest-articles').show();
        }
    });


    function auto_load_more(searchTerm, paged) {
        jQuery.ajax({
            url: BASE,
            type: "POST",
            data: {
                'action': 'kspg_ajax_search',
                'term': searchTerm,
                'paged': paged
            },
            dataType: 'html',
            beforeSend: function() {},
            success: function(result) {
                //serach_count(searchTerm);
                response = jQuery.parseJSON(result);
                if (response.all_post > 0) {
                    content_data = response.content
                    keep_load = true;
                } else {
                    keep_load = false;
                }

                jQuery('#kspg-search-result #searched-articles').append(response.content);
            },
            error: function(xhr) {
                jQuery('.search-result-wrapper').find('.search-result-loading').fadeOut(300);
            }
        });
    }

    function load_page_two(searchTerm) {
        jQuery.ajax({
            url: BASE,
            type: "POST",
            data: {
                'action': 'kspg_ajax_search',
                'term': searchTerm,
                'paged': 2
            },
            dataType: 'html',
            beforeSend: function() {},
            success: function(result) {
                //serach_count(searchTerm);
                response = jQuery.parseJSON(result);
                jQuery('#kspg-search-result #searched-articles').append(response.content);
            },
            error: function(xhr) {
                jQuery('.search-result-wrapper').find('.search-result-loading').fadeOut(300);
            }
        });
    }




    var delay = (function() {
        var timer = 0;
        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    jQuery('#kspg-search-result').mCustomScrollbar({
        //axis:"x",
        //advanced:{ updateOnImageLoad: true,updateOnContentResize: true },
        scrollButtons:{ enable: true },
        //scrollInertia: 0,
        //mousewheel: {preventDefault: true},
        callbacks:{
            onTotalScroll:function(){
                
                //auto_load_more(searchTerm, paged)
                if(keep_load == true){
                    //console.log("scroll to bottom");
                    jQuery('#load_more').trigger('click');
                    //console.log('keep loading');
                }
                
            },
            onTotalScrollOffset:100
            /*alwaysTriggerOffsets:false*/
        }
    });

    jQuery('#load_more').on('click', function() {
        var paged = jQuery(this).data('paged');
        var searchTerm = jQuery("#keyword").val();

        //console.log('paged ' + paged);

        currentRequest = jQuery.ajax({
            //url: BASE + '/wp-admin/admin-ajax.php',
            url: BASE,
            type: "POST",
            data: {
                'action': 'kspg_ajax_search',
                'term': searchTerm,
                'paged': paged
            },
            dataType: 'html',
            beforeSend: function() {
                jQuery('.search-result-wrapper').find('.search-result-overlay').fadeIn(400);
                jQuery('.search-result-wrapper').find('.search-result-loading').fadeIn(500);
            },
            success: function(result) {
                response = jQuery.parseJSON(result);

                jQuery('.search-result-wrapper').find('.search-result-overlay').fadeOut(300);
                jQuery('.search-result-wrapper').find('.search-result-loading').fadeOut(300);
                jQuery('#kspg-search-result #searched-articles').append(response.content);
                jQuery('#kspg-search-result #latest-articles').hide();

                //console.log(parseInt(paged) + 1);
                jQuery('#load_more').data('paged', parseInt(paged) + 1);

                if (response.all_post < 20) {
                    keep_load = false;
                }else{
                    keep_load = true;
                }

                //search_load_more(paged + 1, response.all_post, );
                //serach_count(searchTerm, paged);

            },
            error: function(xhr) {
                jQuery('.search-result-wrapper').find('.search-result-loading').fadeOut(300);
            }
        });
    });

    function serach_count(searchTerm, paged) {
        jQuery.ajax({
            //url: BASE + '/wp-admin/admin-ajax.php',
            url: BASE,
            type: "POST",

            data: {
                'action': 'kspg_ajax_search_count',
                'term': searchTerm,
                'paged': paged
            },
            dataType: 'html',
            beforeSend: function() {},
            success: function(result) {
                response = jQuery.parseJSON(result);
                search_load_more(response.paged, response.max_page);
            }
        });
    }

    function search_load_more(paged, max_page) {

        //jQuery('#load_more').data('paged', parseInt(paged) + 1);
        if (paged < max_page) {
            jQuery('#load_more_wrapper').show();
        } else {
            jQuery('#load_more_wrapper').hide();
        }
    }

    jQuery('.close-popup').on('click', function(event) {
        event.preventDefault();
        jQuery('#search-box, #overlay-box, #feedback-box').fadeOut();
        jQuery(body).toggleClass('search-open');
    });

    jQuery('#overlay-box').on('click', function(event) {
        event.preventDefault();
        jQuery('#search-box, #overlay-box, #feedback-box').fadeOut();
        jQuery(body).toggleClass('search-open');
    });

    jQuery('.comment-link').on('click', function(event) {
        event.preventDefault();
        jQuery('#feedback-box').slideToggle();
        jQuery('#overlay-box').css('top', 0);
        jQuery('#overlay-box').css('right', 0);
        jQuery('#overlay-box').css('left', 'auto');
        jQuery('#overlay-box').slideToggle();
        jQuery(body).toggleClass('search-open');
    });

    /*jQuery('header').sticky({
        topSpacing:0,
        zIndex:98
    });*/


});

 (function() {

if(!('ontouchend' in document)) return;
var pageX, pageY, newX, newY, linked;

jQuery('.tp-revslider-slidesli').on('touchstart', function(event) {
    //console.log('touch me!');

    newX = newY = false;

    var target = jQuery(event.target),
    clas = target.attr('class');
    event = event.originalEvent;

    if(event.touches) event = event.touches[0];
    pageX = event.pageX;
    pageY = event.pageY;

    if(target.is('a') || target.closest('a').length) linked = target;

    }).on('touchmove', function(event) {

        event = event.originalEvent;
        if(event.touches) event = event.touches[0];

        newX = event.pageX;
        newY = event.pageY;
        if(Math.abs(pageX - newX) > 10) event.preventDefault();

    }).on('touchend', function(event) {

    if(newX !== false && Math.abs(pageX - newX) > 30) {

        eval('revapi' + jQuery(this).closest('.revolution-slider').attr('id').split('rev_slider_')[1].split('_')[0])[pageX > newX ? 'revnext' : 'revprev']();

    }
    else if((linked && newY === false) || (linked && Math.abs(pageY - newY) < 10)) {

        linked = linked.is('a') ? linked : linked.closest('a');
        if(linked.length) {

            if(linked.attr('target') === '_blank') {    
                window.open(linked.attr('href'));
            }
            else {
                window.location = linked.attr('href');
            }

        }

    }

    linked = newX = false;

});})();

jQuery(function($) {

    jQuery("li.have-child > label > input[type=checkbox]").on('change', function(e) {
        if (jQuery(this).is(':checked')) {
            jQuery(this).parent().next().find('input[type=checkbox]').prop("checked", "checked");
        } else {
            jQuery(this).parent().next().find('input[type=checkbox]').prop("checked", false);
        }
    });

    jQuery("ul ul li.have-child > label > input[type=checkbox]").on('change', function(e) {
        if (jQuery(this).is(':checked')) {
            jQuery(this).parent().next().fadeIn();
        } else {
            jQuery(this).parent().next().fadeOut();
        }
    });

    jQuery("li.have-child.falled-back ul label > input[type=checkbox]").on('change', function(e) {
        if (jQuery(this).is(':checked')) {
            jQuery(this).parent().parent().parent().parent().find('> label > input[type=checkbox]').attr('checked', true);
            //jQuery(this).parent().next().find('input[type=checkbox]').prop("checked","checked");
        }
    });

    jQuery("li.have-child-domain > label > input[type=checkbox]").on('change', function(e) {
        if (jQuery(this).is(':checked')) {
            jQuery('.falled-back > label > input[type=checkbox]').prop("checked", "checked");
        } else {
            jQuery('.falled-back > label > input[type=checkbox]').prop("checked", false);
        }
    });

    jQuery("li.have-child-domain-sub.falled-back ul label > input[type=checkbox]").on('change', function(e) {
        if (jQuery(this).is(':checked')) {
            jQuery(this).parent().parent().parent().parent().find('> label > input[type=checkbox]').attr('checked', true);
            //jQuery(this).parent().next().find('input[type=checkbox]').prop("checked","checked");
        }
    });

    jQuery('.control-group li .toggle-child').on('click', function(e) {
        jQuery(this).toggleClass('expand');
        jQuery(this).parent().next().slideToggle();
        e.preventDefault();
    });

    jQuery(".submenu-trigger").on('click', function() {
        jQuery(this).next().slideToggle();
    });
    var win_width = jQuery(window).width();
    if (win_width < 768) {
        jQuery(body).on('click', function(e) {
            jQuery('.body-click-close').slideUp();
            var container = jQuery(".submenu-trigger");
            var close_target = jQuery(".nav.kh-nav");

            if (!container.is(e.target) && container.has(e.target).length === 0) {
                close_target.slideUp();
            }
        });
    }
    if (win_width > 768) {
        if(jQuery('.v-scroll-wrapper').length){
            jQuery('.v-scroll-wrapper').width(jQuery('.v-scroll-wrapper').data('width'));
        }
    }
});

function scale_update() {
    var mobile_caruasel = jQuery('.mobile-carusel');
    var win_width = jQuery(window).width();
    if (win_width <= 768) {
        var slider_num = jQuery('.mobile-carusel').length;
        //console.log(slider_num);
        //jQuery('.mobile-carusel').find('article').css( "height", "auto");
        jQuery('.mobile-carusel').each(function(index, element){
            element = jQuery(this);     

            element.owlCarousel({
                nav: true,
                dots: true,
                margin: 0,
                items: 1,
                callbacks: true,
                responsive : {
                    // breakpoint from 0 up
                    0 : {
                        items: 1,
                    },
                    // breakpoint from 480 up
                    480 : {
                        items: 2,
                    }
                }
            });
            element.on('refreshed.owl.carousel', function(event){
                /*var maxHeight = 0;
                console.log('refreshed');

                var prevHeight = element.find('.owl-stage');
                var thisHeight = element.find('.owl-stage').height('auto').height();
                element.height(prevHeight);
                maxHeight = (maxHeight > thisHeight ? maxHeight : thisHeight);

                //owl_height = element.find('.owl-stage').innerHeight();
                element.find('article').height(thisHeight);*/

                /*owl_height = element.find('.owl-stage').height();
                //element.find('article').addClass('updated_height');
                var p_height = owl_height + 'px';
                console.log('updated')
                element.find('article').css( "height", p_height);*/
            });
            
            if(element.hasClass('caruasel-ads-item')){
                //element.trigger('remove.owl.carousel', 2).trigger('refresh.owl.carousel');
                element.trigger('remove.owl.carousel', 2);
                element.removeClass('caruasel-ads-item');
            }

            //console.log('init');
            element.trigger('refresh.owl.carousel');

            if(index >= (slider_num)){
                re_init_slider_height();
            }
        });
        
    } else {
        mobile_caruasel.trigger('destroy.owl.carousel');
        mobile_caruasel.removeClass('owl-carousel');
    }

    jQuery('.simple-v-scroll').mCustomScrollbar({
        axis:"x",
        advanced:{ updateOnImageLoad: true,updateOnContentResize: true },
        scrollButtons:{ enable: true },
        //scrollInertia: 0,
        mousewheel: {preventDefault: true}
    });

    

    if (win_width > 768) {
        jQuery('.v-scroll').mCustomScrollbar({
            axis:"x",
            advanced:{ updateOnImageLoad: true,updateOnContentResize: true },
            scrollButtons:{ enable: true,
                scrollAmount: 20
            },
            contentTouchScroll: true,
            documentTouchScroll: true,
            mouseWheelPixels: 500,
        });
    }

    /*if(win_width < 767){
      if(jQuery('.owl-stage').length){
        jQuery('.owl-stage').each(function(){
          var max_height = 0;
          jQuery(this).children().each(function(){
            my_height = jQuery(this).height();
            if(my_height > max_height) {
              max_height = my_height;
            }
            console.log('my height' + my_height);
          });
          console.log('max_height' + max_height);

          jQuery(this).find('article').height(max_height);
        });
      }
    }*/
}

function re_init_slider_height(){
    jQuery('.mobile-carusel').each(function(index, element){
        element = jQuery(this);
        owl_height = element.find('.owl-stage').height();
        //element.find('article').addClass('updated_height');
        var p_height = owl_height + 'px';
        //console.log('updated');
        //console.log(p_height);
        element.find('article').css( "height", p_height);
    });
}

function loaded_resize_only() {
    var win_width = jQuery('html').width();
    

    if (win_width > 768) {
        jQuery('.live-box .mCSB_buttonDown').addClass('disable');

        jQuery('.h-scroll').mCustomScrollbar({
            axis:"y",
            /*advanced:{ 
                updateOnImageLoad: true,
                updateOnContentResize: true
            },
            contentTouchScroll: true,
            documentTouchScroll: true,
            */
            mouseWheelPixels: 500,
            //scrollInertia: 1000,
            scrollButtons:{ enable: true,
            scrollAmount: 20
            },
            //theme:"light-thick",
            callbacks:{
                whileScrolling:function(){
                    //console.log(this.mcs.topPct);
                    if(this.mcs.topPct < 5){
                        jQuery('.live-box .mCSB_buttonUp').addClass('disable');
                        jQuery('.live-box .mCSB_buttonDown').removeClass('disable');
                    }else if(this.mcs.topPct > 90){
                        jQuery('.live-box .mCSB_buttonUp').removeClass('disable');
                        jQuery('.live-box .mCSB_buttonDown').addClass('disable');
                    } else{
                        jQuery('.live-box .mCSB_buttonUp').removeClass('disable');
                        jQuery('.live-box .mCSB_buttonDown').removeClass('disable');
                    }
                }
            }
        });
    }
}

jQuery(function(){
    var win_width = jQuery('html').width();
    if (jQuery('.revolution-slider').length) {

        if (win_width > 768) {
            jQuery('.revolution-slider').show().revolution({

                lazyLoad: "on",
                delay: 8000,
                startwidth: 880,
                startheight: 450,
                hideThumbs: 600,

                thumbWidth: 80,
                thumbHeight: 50,
                thumbAmount: 5,

                navigationType: "arrow",
                navigationArrows: "1",
                navigationStyle: "preview4",

                touchenabled: 'on',
                onHoverStop: "off",

                swipe_treshold: 30,

                swipe_velocity: 1,
                swipe_min_touches: 1,
                swipe_max_touches: 75,
                swipe_direction: "horizontal",
                drag_block_vertical: 'false',

                parallax: "mouse",
                parallaxBgFreeze: "on",
                parallaxLevels: [7, 4, 3, 2, 5, 4, 3, 2, 1, 0],

                keyboardNavigation: "on",

                navigationHAlign: "center",
                navigationVAlign: "bottom",
                navigationHOffset: 0,
                navigationVOffset: 20,

                soloArrowLeftHalign: "left",
                soloArrowLeftValign: "center",
                soloArrowLeftHOffset: 20,
                soloArrowLeftVOffset: 0,

                soloArrowRightHalign: "right",
                soloArrowRightValign: "center",
                soloArrowRightHOffset: 20,
                soloArrowRightVOffset: 0,

                shadow: 0,
                fullWidth: "off",
                fullScreen: "off",

                spinner: "spinner4",

                stopLoop: "off",
                stopAfterLoops: -1,
                stopAtSlide: -1,

                shuffle: "off",

                autoHeight: "off",
                forceFullWidth: "off",

                hideThumbsOnMobile: "off",
                hideNavDelayOnMobile: 1500,
                hideBulletsOnMobile: "on",
                hideArrowsOnMobile: "off",
                hideThumbsUnderResolution: 0,

                hideSliderAtLimit: 0,
                hideCaptionAtLimit: 0,
                hideAllCaptionAtLilmit: 0,
                startWithSlide: 0,
                videoJsPath: "",
                fullScreenOffsetContainer: ""
            });

        }else{
            jQuery('.revolution-slider').revkill();
        }
    }
});

function pre_load_search() {
    jQuery.ajax({
        //url: BASE + '/wp-admin/admin-ajax.php',
        url: BASE,
        type: "POST",
        data: {
            'action': 'kspg_ajax_search',
            'term': '',
            'paged': 1,
            'preload': 1
        },
        dataType: 'html',
        beforeSend: function() {
            jQuery('.search-result-wrapper').find('.search-result-overlay').fadeIn(400);
            jQuery('.search-result-wrapper').find('.search-result-loading').fadeIn(500);
        },
        success: function(result) {
            response = jQuery.parseJSON(result);

            jQuery('.search-result-wrapper').find('.search-result-overlay').fadeOut(300);
            jQuery('.search-result-wrapper').find('.search-result-loading').fadeOut(300);
            jQuery('#kspg-search-result #searched-articles').html(response.content).show();
            jQuery('#kspg-search-result #latest-articles').hide();

        },
        error: function(xhr) {
            jQuery('.search-result-wrapper').find('.search-result-loading').fadeOut(300);
        }
    });
}


jQuery(document).ready(function(){
    scale_update();
});

jQuery(window).bind("resize", function() {
    scale_update();
    loaded_resize_only();
});

jQuery(window).load(function() {
    loaded_resize_only();
    //pre_load_search();

    re_init_slider_height();
});

jQuery(function() {
    jQuery("img.lazy").lazyload({
        effect : "fadeIn",
        event : "sporty",
        failure_limit : 15,
        skip_invisible : false,
        threshold : 100,
        load : function()
        {
            scale_update();
        }
    });
});

jQuery(window).bind("load", function() {
    var timeout = setTimeout(function() {
        jQuery("img.lazy").trigger("sporty")
    }, 5000);
});


document.addEventListener('touchmove', function(event) {
    event = event.originalEvent || event;
    if (event.scale !== 1) {
       event.preventDefault();
    }
}, false);

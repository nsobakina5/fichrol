;(function($){
    "use strict";

    function PopupCenter(pageURL, title,w,h) {
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        var targetWin = window.open (pageURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
        return targetWin;
    } 

    function ajax_shares_counter(post_id, page_url){

            console.log('update share count');

            //var post_id = $('#kspg-post-container').data('postid');

            // http://donreach.com/social-share-count
            var shareUrl =page_url;
            if(page_url == ''){
                shareUrl = window.location.href;
            }
            
            // Ajax request to read share counts. Notice "&callback=?" is appended to the URL to define it as JSONP.
            $.getJSON('https://count.donreach.com/?url=' + encodeURIComponent(shareUrl) + "&callback=?", function (data) {

                $.ajax({
                    url : BASE,
                    type: "POST",
                    data: {
                        'action': 'kspg_ajax_social_counter',
                        'post_id': post_id,
                        'count': data.total
                    },
                    dataType: 'json',
                    success:function(data){
                        console.log(data);
                    }
                });

            });

    }
    
    /* ================================================== */
    $(document).ready(function () {
        
        $('.customer.share').on("click", function(event) {
            event.preventDefault();

            var popup_response = PopupCenter($(this).attr('href'), 'Social Share', 500, 400);
            var post_id = $(this).data('postid');
            var post_url = $(this).attr('href');
            var this_elem = $(this);

            //console.log('sharing');

            var timer = setInterval(function() {   
                if(popup_response.closed) { 
                clearInterval(timer);         
                //console.log('share done');                   
                    //clearInterval(timer);  
                    //ajax_shares_counter(post_id, post_url);
                    $.ajax({
                        url : BASE,
                        type: "POST",
                        data: {
                            //'action': 'kspg_ajax_social_counter_live',
                            'action': 'kspg_ajax_social_counter',
                            'post_id': post_id
                        },
                        dataType: 'json',
                        success:function(data){
                            //console.log(data);
                            var replace_count = '#share_post_' + post_id;
                            $(replace_count).find('.share_counter').html(data.share_count);
                        }
                    });
                }
                
            }, 800); 

        });

        //ajax_shares_counter();

    });


    

}(jQuery));

/*jQuery(window).load(function() {
    if(jQuery('.single-share-axjax').length){
        var post_id = jQuery('.single-share-axjax').data('postid');
        jQuery.ajax({
            url : BASE,
            type: "POST",
            data: {
                'action': 'kspg_ajax_get_shares_views_live',
                'post_id': post_id
            },
            dataType: 'json',
            success:function(data){
                //console.log(data);
                var replace_count = '#share_post_' + post_id;
                jQuery(replace_count).find('.share_counter').html(data.share_count);
            }
        });
    }
});*/
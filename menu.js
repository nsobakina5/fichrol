jQuery(document).ready(function () {
  /*$('.mobile-nav-button').on('click', function() {
    $( ".mobile-nav-button .mobile-nav-button__line:nth-of-type(1)" ).toggleClass( "mobile-nav-button__line--1");
    $( ".mobile-nav-button .mobile-nav-button__line:nth-of-type(2)" ).toggleClass( "mobile-nav-button__line--2");  
    $( ".mobile-nav-button .mobile-nav-button__line:nth-of-type(3)" ).toggleClass( "mobile-nav-button__line--3");  

    $('.mobile-nav-button').toggleClass('open');
    $('.mobile-menu').toggleClass('mobile-menu--open');
  });*/



  jQuery(".mobile-menu li").hoverIntent({
    sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)    
    interval: 10,  // number = milliseconds for onMouseOver polling interval    
    timeout: 10,   // number = milliseconds delay before onMouseOut    
    over:function(){
      var overlayChild = "." + jQuery(this).data('overlay');
      jQuery('.toggle-menu-overlay, .content-wrapper').fadeTo(100, 0);
      jQuery("#menu-overlay").find(overlayChild).fadeIn();
    },
    out:function(){
      var overlayChild = "." + jQuery(this).data('overlay');
      jQuery("#menu-overlay").find(overlayChild).hide();
    }
  });

  jQuery(".mobile-menu ul").hoverIntent({
    sensitivity: 1, // number = sensitivity threshold (must be 1 or higher)    
    interval: 10,  // number = milliseconds for onMouseOver polling interval    
    timeout: 500,   // number = milliseconds delay before onMouseOut    
    out:function(){
      jQuery('.toggle-menu-overlay, .content-wrapper').fadeTo(100, 1);
    }
  });


  jQuery(".toggle-child").on('click', function(){
    jQuery(this).next().slideToggle();
    jQuery(this).parent().toggleClass('active');

    jQuery(this).parent().nextAll().removeClass('active');
    jQuery(this).parent().prevAll().removeClass('active');

    jQuery(this).parent().nextAll().find('ul').slideUp();
    jQuery(this).parent().prevAll().find('ul').slideUp();
  });

});

var showRightPush = document.getElementById( 'showRightPush' ),
    menuRight = document.getElementById( 'cbp-spmenu-s2' ),
    body = document.body,
    header = document.getElementById('main_header');

showRightPush.onclick = function() {
  classie.toggle( this, 'active' );
  classie.toggle( body, 'cbp-spmenu-push-toleft' );
  classie.toggle( header, 'cbp-spmenu-push-toleft' );
  classie.toggle( menuRight, 'cbp-spmenu-open' );
  disableOther( 'showRightPush' );
  jQuery('.menu-overlay').toggle();

  jQuery( ".mobile-nav-button .mobile-nav-button__line:nth-of-type(1)" ).toggleClass( "mobile-nav-button__line--1");
  jQuery( ".mobile-nav-button .mobile-nav-button__line:nth-of-type(2)" ).toggleClass( "mobile-nav-button__line--2");  
  jQuery( ".mobile-nav-button .mobile-nav-button__line:nth-of-type(3)" ).toggleClass( "mobile-nav-button__line--3");  

  jQuery('.mobile-nav-button').toggleClass('open');
  jQuery('.mobile-menu').toggleClass('mobile-menu--open');
};

jQuery('.menu-overlay').on('click', function(){
  showRightPush.onclick();
})

function disableOther( button ) {
  if( button !== 'showRightPush' ) {
    classie.toggle( showRightPush, 'disabled' );
  }
};
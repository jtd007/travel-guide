$(function(){
    
    $('#main-nav ul.sf-menu').superfish({
        delay:       700,                            // one second delay on mouseout
        animation:   {opacity:'show',height:'show'},  // fade-in and slide-down animation
        speed:       'fast',                          // faster animation speed
        cssArrows:  false                            // disable generation of arrow mark-up
    });
    
    
    transformicons.add('.tcon');
    
    $("#mobile-nav ul").flexNav({
        'animationSpeed':     250,            // default for drop down animation speed
        'transitionOpacity':  true,           // default for opacity animation
      //  'buttonSelector':     '.menu-button', // default menu button class name
      //  'hoverIntent':        false,          // Change to true for use with hoverIntent plugin
        'hoverIntentTimeout': 150,            // hoverIntent default timeout
        'calcItemWidths':     false,          // dynamically calcs top level nav item widths
        'hover':              true            // would you like hover support?      
    });
   
   $(".navbar-toggler").on({
        'click':function(event){
            
            if(!$(this).hasClass("active")) {
                $(this).addClass("active");
            } else {
                $(this).removeClass("active");
            }
            
            event.preventDefault();
        }
   });
   
   
   $('#home-slider').slick({
	infinite: true,
        speed: 300,
        autoplay: true,
        autoplaySpeed: 6000,
        slidesToShow: 1,
        //appendArrows: $("#home-slider-wrap .site-container"),
        prevArrow: '<a href="#" class="slick-prev"></a>',
        nextArrow: '<a href="#" class="slick-next"></a>',
        adaptiveHeight: true
       
    });
    
    
    $('#cms_content table').not("#news-table").wrap('<div class="table-responsive"></div>');
    
    
    var news_dt = $('#news-table').DataTable({
        //scrollX:true
        lengthChange:true
        ,paging:true
        ,searching: true
        ,responsive:true
        ,info:true
       // ,ordering: false
        ,order: [[1, "desc"]]
        ,dom: 'l<"#dt-sort-order-wrap">ftip'
        ,language: {
            paginate: {
              previous: "Prev"
            }
          }
          /*
         ,fnDrawCallback:function(){
                 $('.dataTables_filter input[type=search]').prop("placeholder", "Search");
            }
        */
    });
    
    $('#news-table').DataTable().columns([0]).visible(false).draw();
    
    $("#dt-sort-order-wrap").html('&nbsp;<select data-placeholder="Sort Date" id="dt-sort-order"><option value="desc" selected="">Newest First</option><option value="asc">Oldest First</option></select>&nbsp;<select id="filter-category"><option value="">Category...</option><option value="1">News</option><option value="2">Events</option></select>');
   
    /*
    $('#cms_content').on('change', "#dt-sort-order",function(event){
            //console.log('change detected');
            //var ndt = $('#news-table').DataTable();
            //console.log(news_dt);
            news_dt.order([0,$(this).val()]).draw();
    });
    */
   
   
   
    $('#dt-sort-order').on({
                'change':function(event){
                //   alert($(this).val());
                          //var ndt = $('#news-table').DataTable();
                          news_dt.order([1,$(this).val()]).draw();
                }
        });
    
    
    $('#filter-category').on({
                'change':function(event){
                    //alert($(this).val());
                          //var ndt = $('#news-table').DataTable();
                          news_dt.column(0).search($(this).val()).draw();
                         // ndt.order([0,$(this).val()]).draw();
                }
        });
    
   
    //MENUS of LIST OF PAGES FROM SITE TO PICK FROM 
    $('.select-menus').each(function(){
        var o =$(this);
        var menu_type = o.data('menu-type');
        var menu_id = o.data('menu-id');
        var posted = {ybr_token:sessiontoken,item_id:menu_id};
        if(menu_type !== "id"){
            posted ={ybr_token:sessiontoken,item_name:menu_id};
        } 
        
        //var menu_name = o.data('menu-name');
        $.ajax({
                type:"post",
                url:XHR_PUBLIC_PATH + 'menus',
                data:posted,
                //data:{ybr_token: sessiontoken,item_name:menu_name},
                dataType:"json",
                success:function(data){
                      //console.log(data);
                     var html = "";
                    if(data != null){
                         $.each(data, function (index, v) {
                             //  console.log(v);

                             html += "<option value='"+v.menu.link+"'>"+v.menu.label+"</option>";
                             if (typeof v.menu.children !== undefined) {
                                 var res =  listPagesDD(v.menu.menu_id,v.menu.children,1,null,null);
                              //console.log(res);
                                 if(res !== null){
                                     html += res.phtml;
                                 }
                             }
                         });
                     }
                    o.html(html);
                    }
            });
    });
                     
    
       //LOGIN FUNCTIONALITY
    if ($('#login').length > 0) {
        $('#reset_password').on({
           'click':function(event){
               var email = $('#email').val();
                console.log(email);
                var o = $(this);
                var id = o.data('target-id');
                //alert(id);
                $('#'+id).toggle();
                $('#resetEmail').val(email);
                event.preventDefault();
            }

       });
        $("#resetPasswordSubmit").on({
            click: function (event) {
                var email = $("#resetEmail").val();
                if (email === "") {
                    alert("Please enter your e-mail address to continue");
                } else {
                    // $(this).fadeOut('fast'); // hide submit button		
                    $.ajax({
                        type: "post",
                        url: XHR_PUBLIC_PATH + 'resetPassword',
                        data: {ybr_token: sessiontoken, email: email},
                        dataType: "json",
                        success: function (data) {
                            if (data) {
                                $("#reset-msg").html("<p class='alert alert-success'>Your password has been reset and e-mailed to <strong>" + email + "</strong>.</p>");
                                $('#resetPasswordForm').hide();
                            } else {
                                //alert("ahshshs");
                                $("#reset-msg").html("<p class='alert alert-warning'>There was a probelm and we were not able to send a reset link to <strong>" + email + "</strong>.</p>");
                            }
                        }
                    });



                }


                event.preventDefault();
            }
        });
    }
    
});



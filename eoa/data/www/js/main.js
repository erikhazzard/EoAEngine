/*===========================================================================

  End of Ages main JS file

TODO: Break this file up.

=============================================================================*/
/*Some global variables*/

//player object
var player = new Player({});

//our only zone object so far
var zone_1 = {};

/*===========================================================================

  On DOMReady Events

=============================================================================*/
window.addEvent('domready', function(){
    /*================================
     *
     * Initial Character info request
     *
     * ===============================*/
    //get game state from server
    
    /*================================
     *
     * Initial zone setup
     *
     * ===============================*/
    //Set up the zone
    zone_1 = new Zone({});

    /*================================
     *
     * Heartbeat requests
     *
     * ===============================*/
    var heartbeat;
    var chat_heartbeat;

    heartbeat = new Request({
        url: url_root + url_game_heartbeat,
        initialDelay: 1000,
        delay:200,
        limit:300,
        onSuccess: function(res){
            //Evaluate the response to generate JS objects
            eval(res);

            //We expect back an array of character objects, so let's update them
            for(var i = 0; i < char_array.length; i++){
                if($(char_array[i][0])){
                    $(char_array[i][0]).setStyle('left', char_array[i][1]);
                    $(char_array[i][0]).setStyle('top', char_array[i][2]);
                }
                else{
                    var char_el = new Element('div', {'id':char_array[i][0]});
                    $('camera_container').adopt(char_el);
                    $(char_array[i][0]).setStyle('background', '#' + char_array[i][3]);
                    $(char_array[i][0]).setStyle('position', 'relative');
                    $(char_array[i][0]).setStyle('border', '1px solid #efefef');
                    $(char_array[i][0]).setStyle('width', '20px');
                    $(char_array[i][0]).setStyle('height', '20px');
                }
            }
        }
    });

    $('start_heartbeat').addEvent('click', function(){
        heartbeat.startTimer();
    });
    $('stop_heartbeat').addEvent('click', function(){
        heartbeat.stopTimer();
    });


    /*================================
     * 
     * Chat 
     *
     * ===============================*/
    /*------------
     * Heartbeat
     * -----------*/
    chat_heartbeat = new Request({
        url: url_root + url_chat_heartbeat,
        initialDelay: 1000,
        delay:500,
        limit:700,
        onSuccess: function(res){
            //Evaluate the response to generate JS objects
            eval(res);

            if(chat_messages){
                //We expect back an array of character objects, so let's update them
                for(var i = 0; i < chat_messages.length; i++){
                    //Update chat text
                    var new_chat_line = new Element('div', {
                        'class':'chat_line',
                        'html':"<span class='chat_author' style='color:#" + 
                                chat_messages[i][2] + "'>" +
                                chat_messages[i][0] +
                                "</span>: " + 
                                chat_messages[i][1]
                    });
                    $('chat_incoming').adopt(new_chat_line);
                    $('chat_incoming').scrollTo(0, parseInt($('chat_incoming').getStyle('height'), 10));
                }
            }
        }
    });

    $('start_chat_heartbeat').addEvent('click', function(){
        chat_heartbeat.startTimer();
    });
    $('stop_chat_heartbeat').addEvent('click', function(){
        chat_heartbeat.stopTimer();
    });

    /*------------
     * Chat window
     * -----------*/
    $('chat_submit').addEvent('click', function(){
        var chat_message = $('chat_text').value;
        var send_chat_req = new Request({
            url: url_root + url_chat_send,
            method: 'post',
            data: 'sent_message=' + chat_message + '&update_now=true',
            onSuccess: function(res){
                $('chat_text').value = '';
            }
        }).send();
    });
});

/*===========================================================================
 *
 * Handle Input
 *
=============================================================================*/
window.addEvent('keydown', function(event){ 
    //amount is also the cell size
    var amount = zone_1.options.cell_size;

    //Make sure we move only after the current move is finished
        //If we don't check this, a request will be made every time
        //an event is fired (which is lot if they are holding the
        //move key)

    /*Handle movement keys*/
    if(event.key == 'up'){
        if(pc_character.options.dir_moving['up'] === false){
            pc_character.move('up', amount, zone_1.options.grid);
        }
    }
    else if(event.key == 'right'){
        if(pc_character.options.dir_moving['right'] === false){
            pc_character.move('right', amount, zone_1.options.grid);
        }
    }
    else if(event.key == 'down'){
        if(pc_character.options.dir_moving['down'] === false){
            pc_character.move('down', amount, zone_1.options.grid);
        }
    }
    else if(event.key == 'left'){
        if(pc_character.options.dir_moving['left'] === false){
            pc_character.move('left', amount, zone_1.options.grid);
        }
    }
    
    /*Handle command keys*/
    if(event.key == "i"){
        //sample command key event
        //alert("Inventory");
    }        
});

/*===========================================================================

  Function calls

=============================================================================*/

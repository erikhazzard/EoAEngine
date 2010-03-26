/*===========================================================================

  End of Ages main JS file

TODO: Break this file up.

=============================================================================*/
/*Some global variables*/

//pc character object
var player = new Player({});
//our only zone object so far
var zone_1 = {};

var creep_list = [];
var c1, c2;
/*===========================================================================

  On DOMReady Events

=============================================================================*/
window.addEvent('domready', function(){
    /*================================
     *
     *  Hide all hidden elements 
     *
     * ===============================*/
    $$('.hidden_element').setStyle('opacity',0);
      /*================================
     *
     * Initial zone setup
     *
     * ===============================*/
    //Set up the zone
    zone_1 = new Zone({});
    
    /*--------------------------------
     * Game Functions
     * ------------------------------*/
    //Set towers to automatically attack
    var tower_attack = function(){
        for(var i=0; i<player.options.towers_owned.length;i++){
            //Loop through each tower and see if it has any creeps 
            //  in its radius.  If so, call attack on the first creep
            //  in its aggro list
            if(player.options.towers_owned[i].options.creep_aggro_array.length !==
                0){
                    player.options.towers_owned[i].attack(
                        player.options.towers_owned[i].options.creep_aggro_array[0]);     
                }
        }
    };
    //Run this function every X ms
    tower_attack_periodical_func = tower_attack.periodical(100);


    //Send wave
    $('send_wave').addEvent('click', function(evt){
            creep_list.push(new Creep({health: 5 + creep_list.length}));
            creep_list[creep_list.length - 1].send_to_end();
    });

    //dummy game loop
    var dummy_req = new Request({
        url:url_root + url_game_heartbeat,
        initalDelay:2,
        delay:10,
        limit:20,
        onSuccesss: function(res){
            console.log('2');
        }
    })
    //}).startTimer();

    /*================================
     *
     * Heartbeat requests
     *
     * ===============================*/
    var heartbeat;
    var chat_heartbeat;

    heartbeat = new Request({
        url: url_root + url_game_heartbeat,
        initialDelay: 400,
        delay:400,
        limit:1200,
        onSuccess: function(res){
            //Evaluate the response to generate JS objects
            /*eval(res);

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
            */
        }
    });

    //$('start_heartbeat').addEvent('click', function(){
    //    heartbeat.startTimer();
    //});
    //$('stop_heartbeat').addEvent('click', function(){
    //    heartbeat.stopTimer();
    //});


    /*================================
     * 
     * Tower Elements 
     *
     * ===============================*/
    $('toggle_grid').addEvent('click', function(){
        zone_1.toggle_grid();
        player.options.mode = 'selection';
    });

    $('tower_purchase_button').addEvent('click', function(){
        if(!zone_1.options.grid_is_displayed){
            zone_1.toggle_grid();
        }
        player.options.mode = 'build';
    });

    /*================================
     * Tower upgrade buttons (Base upgrades)
     * ===============================*/
    $('tower_button_upgrade_damage').addEvent('click', function(){
        if(player.options.selected_tower !== null){
            player.options.selected_tower.upgrade('damage');
        }
    });
    $('tower_button_upgrade_delay').addEvent('click', function(){
        if(player.options.selected_tower !== null){
            player.options.selected_tower.upgrade('delay');
        }
    });
    $('tower_button_upgrade_range').addEvent('click', function(){
        if(player.options.selected_tower !== null){
            player.options.selected_tower.upgrade('range');
        }
    });
     /*================================
     * Tower upgrade buttons (Elementals upgrades)
     * ===============================*/
    $('tower_button_upgrade_elemental_dark').addEvent('click', function(){
        if(player.options.selected_tower !== null){
            player.options.selected_tower.upgrade('elemental_dark');
        }
    });
    $('tower_button_upgrade_elemental_earth').addEvent('click', function(){
        if(player.options.selected_tower !== null){
            player.options.selected_tower.upgrade('elemental_earth');
        }
    });
    $('tower_button_upgrade_elemental_fire').addEvent('click', function(){
        if(player.options.selected_tower !== null){
            player.options.selected_tower.upgrade('elemental_fire');
        }
    });
    $('tower_button_upgrade_elemental_light').addEvent('click', function(){
        if(player.options.selected_tower !== null){
            player.options.selected_tower.upgrade('elemental_light');
        }
    });
    $('tower_button_upgrade_elemental_water').addEvent('click', function(){
        if(player.options.selected_tower !== null){
            player.options.selected_tower.upgrade('elemental_water');
        }
    });
    $('tower_button_upgrade_elemental_wind').addEvent('click', function(){
        if(player.options.selected_tower !== null){
            player.options.selected_tower.upgrade('elemental_wind');
        }
    });

  
    /*================================
     *
     * HTML Elements
     *
     * ===============================*/
    $(player.options.html_gold).set('html', player.options.gold);
    $(player.options.html_health).set('html', player.options.health);
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

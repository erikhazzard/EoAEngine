/*===========================================================================
 *
 * Game Class
 *
=============================================================================*/
/*Create a game class.  The game object controls various gameplay settings*/
var Game = new Class({
    Implements: [Options],
    
    //Set the attributes / options
    options: {
        /*:::::::::::::::::::::::::
            Tower Related
        /*:::::::::::::::::::::::::*/
        //Base tower cost
        tower_base_cost: 10,
        //Resell value of towers (percentage)
        tower_resell_value: .75,

        /*:::::::::::::::::::::::::
            Creep Related
        /*:::::::::::::::::::::::::*/
        creep_base_value: 5,
        creep_value_modifier: .5,

        //Health
        creep_base_health: 3,
        creep_health_modifier: 1.7,

        //Save the level the game is at (waves)
        level: 0,

        //how long to wait between waves (in MS)
        wave_delay: 18000,

        //Stores the time left until the next wave
        next_wave_timer: 18000,

        //Amount of creeps to send for each wave
        creeps_per_wave: 5,
        //Time between sending individual creeps
        creep_send_delay: 500,

        /*:::::::::::::::::::::::::
            HTML Elements
        /*:::::::::::::::::::::::::*/
        html_level_display: 'game_level_display'

    },

    /*--------------------------------
     * Constructor
     * -------------------------------*/
    initialize: function(options){
        //set the object's attributes / options
        this.setOptions(options);
    },

    //Get crepe value
    get_creep_value: function(level){
        //Returns a gold cost for the creep based on the
        //  level passed in
        var creep_value = this.options.creep_base_value + Math.round(
                            this.options.creep_value_modifier * 
                            this.options.level);
        return creep_value;
    },

    get_creep_health: function(){
        //Calcuate the creeps' health
        var creep_health = this.options.creep_base_health + Math.round(
                            this.options.creep_health_modifier * 
                            this.options.level)
        return creep_health;
    },

    //Send wave of creeps
    send_wave: function(){
        //Send an amount of creeps based on the creeps_per_wave and set value
        var that = this;

        //Track how many creeps have been sent
        var creeps_sent = 0;

        //Send a creep ever creep_send_delay seconds, if the right number
        //  of creeps have been sent then stop sending them
        var send_creep_func = (function(){
            if(creeps_sent >= that.options.creeps_per_wave){
                $clear(send_creep_func);
            }
            else{
                creep_list.push(new Creep({
                    health: that.get_creep_health(),
                    value: that.get_creep_value()
                }));
                creep_list[creep_list.length - 1].send_to_end();
            }
            creeps_sent += 1;
        }).periodical(this.options.creep_send_delay);

        //Reset the countdown
        this.options.next_wave_timer = this.options.wave_delay;

        //Increare the level
        this.options.level += 1;
        //Update the level display text
        $(this.options.html_level_display).set('html', this.options.level);

    }
})


/*===========================================================================
 *
 * Player Class
 *
=============================================================================*/
/* Create a Player Class.  Stores information about the Player_Object
 */
Player = new Class({
    Implements: [Options],
    //Set the attributes / options
    options: {
        //Some Player_Object properties
        health: 20,
        gold: 100,

        //Keep track of total amount of gold
        accumlated_gold: 100,
        elemental_points: 0,

        //Store the mode the Player_Object is in
        //  will be either selection or build
        mode: 'selection',
        selected_tower: null,
        selected_creep: null,

        //Store the names HTML page elements
        html_health: 'player_health_amount',
        html_gold: 'inventory_gold_amount',
        html_elemental_points: 'inventory_element_points_amount',

        html_tower_selected_wrapper: 'tower_selected_wrapper',
        html_creep_selected_wrapper: 'creep_selected_wrapper',

        //Stores a list of towers the Player_Object owns
        towers_owned: [],

        //Stores how many creeps were killed (towers also track this)
        creeps_killed: 0
    },

    initialize: function(options, Player_Object){
        this.setOptions(options); 
    },

    /*---------------------
     * Update Functions
     * --------------------*/
    update_gold: function(amount){
        //Amount will usually be negative
        this.options.gold += amount;

        //If the amount is positive, add it to the total gold count
        if(amount > 0){
            this.options.accumlated_gold += amount;
        }

        //Update the gold text
        $(this.options.html_gold).set('html', this.options.gold);

        //Highlight the gold
        //  Yellow if positive, red if negative
        (amount > 0) ? 
            $(this.options.html_gold).highlight('#dddd22') :
            $(this.options.html_gold).highlight('#22dddd');
        
    },

    update_selection: function(){
        if(this.options.selected_tower !== null){
            this.options.selected_tower.select_tower();
            return;
        }
        if(this.options.selected_creep !== null){
            this.options.selected_creep.select_creep();
            return;
        }
    }
});

/*===========================================================================
 *
 * Tower Class
 *
=============================================================================*/
/*Create a Tower Class.
 *  This will store all the information about towers.  Towers are saved with
 *  both grid coordinates and css coordinates.  A cell may contain a tower. */

var Tower = new Class({
    Implements: [Options],
    //Set the attributes / options
    options: {
        //Store the character element (empty now, filled in on initialize)
        element: {},
        element_id: null,

        //Keep track of number of towers that have been created
        tower_id: 0,
        //Store the ID of the tower in the player's towers_owned array
        player_owned_id: 0,

        add_to_map: true,

        //HTML Element Names
        html_name: 'tower_selected_name',
        html_damage: 'tower_obj_damage',
        html_damage_upgrade: 'tower_button_upgrade_damage',
        html_delay: 'tower_obj_delay',
        html_delay_upgrade: 'tower_button_upgrade_delay',
        html_range: 'tower_obj_range',
        html_range_upgrade: 'tower_button_upgrade_range',
            //Elemental Values
            html_elemental_dark: 'tower_obj_elemental_dark',
            html_elemental_dark_upgrade: 'tower_button_upgrade_elemental_dark',
            html_elemental_earth: 'tower_obj_elemental_earth',
            html_elemental_earth_upgrade: 'tower_button_upgrade_elemental_earth',
            html_elemental_fire: 'tower_obj_elemental_fire',
            html_elemental_fire_upgrade: 'tower_button_upgrade_elemental_fire',
            html_elemental_light: 'tower_obj_elemental_light',
            html_elemental_light_upgrade: 'tower_button_upgrade_elemental_light',
            html_elemental_water: 'tower_obj_elemental_water',
            html_elemental_water_upgrade: 'tower_button_upgrade_elemental_water',
            html_elemental_wind: 'tower_obj_elemental_wind',
            html_elemental_wind_upgrade: 'tower_button_upgrade_elemental_wind',
        html_sell_button: 'tower_button_sell',

        //Position
        pos_x: 0,
        pos_y: 0,

        //How many cells needed for both x and y 
        //  e.g. 2 would mean it really takes up 4 cells (2x + 2y = 4)
        cells_size_xy: 1,

        //Base attributes
        level_damage: 0,
        base_damage: 1,
        damage: 1,

        //delay is in MS
        level_delay: 0,
        base_delay: 1000,
        delay: 1000,

        //How far out the towers can shoot (in cells)
        level_range: 0,
        base_range: 3,
        range: 3,
        
        //Spped the bullet moves
        bullet_speed: 500,

        //number of creatures killed
        creeps_killed: 0,
        
        //elemental attributes
        elementals: {'dark':0,
                    'earth':0,
                    'fire':0,
                    'light':0,
                    'water':0,
                    'wind':0,
                },

        //Store any elemental effects that this tower has
        elementals_effects: {'dark': {'tick_delay':1000,
                                    'tick_damage':0,
                                    'tick_number':0
                                    },
                            'earth': {'slow_amount':0,
                                        'slow_duration':0
                                    },
                            'wind': {'stun_chance':0, 
                                    'stun_duration':0}},

        //Value (Money Player_Object has spent on this tower)
        value: 0,

        //css color
        color: '#000000',
        
        //Keep track of the attack timer.  Every time a creep attacks,
        //  the timer is reset to this.options.delay
        attack_timer: 0,

        //Reference to Player_Object this tower belongs to
        Player_Object_reference: {},

        //Reference to the cell the tower belongs in
        cell_reference: {},

        //contains references to the cells in the tower's radius / range
        cells_in_range: [],

        //Determine if radius is visible
        radius_visible: false,

        //The creep aggro list, which is a priority list of creeps the tower 
        //  wants to attack.  When a creep enters the tower radius, it is
        //  pushed to this list. When it leaves, it is removed
        creep_aggro_array: [],

        //Active effects on the tower (e.g. buffs or debuffs)
        active_effects: []
    },
     /*--------------------------------
     * Constructor
     * -------------------------------*/
    //initialize is a MooTools constructor
    //each tower expects a Player_Object object to be passed into it so it knows
    //  who it belongs to.  By default, it's just the Player_Object playing so
    //  this won't change for now, but we might want to allow multiple users
    //  to play and place towers in the same grid
    initialize: function(options, map_reference, Player_Object_reference){
        this.setOptions(options); 

        //Set that for reference
        var that = this;

        //set the map and Player_Object references if not set
        if(Player_Object_reference === undefined){
            Player_Object_reference = Player_Object;
        }
        if(map_reference === undefined){
            map_reference = Map_Object;
        }

        //Set the cell reference
        //  set i and j to the passed in y and x coordinates
        var i = this.options.pos_y;
        var j = this.options.pos_x;

        //Store which Player_Object the tower belongs to
        Player_Object.options.towers_owned.push(this);

        //Set the value of the array index
        this.options.player_owned_tower_index =
            Player_Object_reference.options.towers_owned.length - 1;
            
        //set the cell reference
        this.options.cell_reference = Map_Object.options.cell_objects_grid[i][j];

        //call the target cell object's adopt method to add this tower object
        //  to the cell object's contained_creeps list
        Map_Object.options.cell_objects_grid[i][j].adopt_tower(this);

        //Set the Player_Object reference
        this.options.Player_Object_reference = Player_Object_reference;

        //set the html element id
        this.options.element_id = 'Tower ' 
            + Player_Object.options.towers_owned.length;
       
        //Set element options
        this.options.element =  new Element('div', {
            'id': this.options.element_id,
            'class': 'tower_base tool_tip',
            'title': this.options.element_id,
            'styles': {
                'background-color':this.options.color,
                'height': Map_Object.options.cell_size - 2 + 'px', 
                'left':this.options.pos_x * Map_Object.options.cell_size,
                'top':this.options.pos_y * Map_Object.options.cell_size,
                'width': Map_Object.options.cell_size - 2 + 'px',
                'z-index': '1337'
            },
            'events': {
                'click': function(evt){
                    //stop propagation
                    evt.stop();
                    that.select_tower();
                }
            }
        });

        //Update the rel of the element for the Tool Tips
        this.update_element_rel();
        
        //Update the cells in the tower's range
        this.update_cells_in_range();
      
        //Add the element to the map if set to true
        if(this.options.add_to_map === true){
            $('map_container').adopt(this.options.element);
        }

    },
    /*----------------------------------------------------------------------
     * Methods
     * ---------------------------------------------------------------------*/
    update_element_rel: function(){
        Tool_Tips.detach(this.options.element);
        
        this.options.element.set('rel','');
                                
        //Attach the tool tips to this element
        Tool_Tips.attach(this.options.element);
    },
    
    select_tower: function(){
        //Determine if creep is selected
        var creep_selected = Player_Object.options.html_creep_selected_wrapper;
        if($(creep_selected).getStyle('opacity')>0){
            Tool_Tips.hide();
            $(creep_selected).setStyle('opacity', 0);
        }
        //Show the radius
        this.toggle_radius_display(); 

        //Update the Player_Object's selection
        Player_Object.options.selected_creep = null;
        Player_Object.options.selected_tower = this;

        //Update the HTML elements
        $(this.options.html_name).set('html', this.options.element_id);
        $(this.options.html_damage).set('html', this.options.damage);
        $(this.options.html_delay).set('html', this.options.delay);
        $(this.options.html_range).set('html', this.options.range);
        //Elemental Text
        $(this.options.html_elemental_dark).set('html', 
                                this.options.elementals['dark']);
        $(this.options.html_elemental_earth).set('html', 
                                this.options.elementals['earth']);
        $(this.options.html_elemental_fire).set('html', 
                                this.options.elementals['fire']);
        $(this.options.html_elemental_light).set('html', 
                                this.options.elementals['light']);
        $(this.options.html_elemental_water).set('html', 
                                this.options.elementals['water']);
        $(this.options.html_elemental_wind).set('html', 
                                this.options.elementals['wind']);

        if(Player_Object.options.selected_tower === this){
            $(Player_Object.options.html_tower_selected_wrapper).setStyle('opacity',1);
        }
        else{
            $(Player_Object.options.html_tower_selected_wrapper).setStyle('opacity',0);
        }   
    }, 

    /*----------------
     * Radius display
     * ---------------*/
    toggle_radius_display: function(){
        var that = this;
       
        //Get the length of the cells contained in the tower's radius
        var cells_in_range_len = this.options.cells_in_range.length;

        //Toggle the radius
        if(this.options.radius_visible === false){
            var that = this;
    
            //Turn off the visibility of the radius for other towers the Player_Object
            //owns
            var num_towers = Player_Object.options.towers_owned.length;

            //Go through all the towers the Player_Object owns and turn off the radius
            //visibility
            for(var count=0; count<num_towers; count++){
                Player_Object.options.towers_owned[count].hide_radius_display();
            }
            //Set the current tower's radius' visibilty to true (it is set to 
            //  false in the above loop)

            //Show the radius
            this.options.radius_visible = true;

            //add a class to the cells that are contained in the tower's radius
            $each(that.options.cells_in_range, function(i){ 
                    i.options.element.addClass('grid_cell_show_radius')});

        }
        else{
            //Turn off the radius display
            this.hide_radius_display();
        }
    },
    

    hide_radius_display: function(){
        //Turn the radius off
        this.options.radius_visible= false;

        var that = this;
        var cells_in_range_len = this.options.cells_in_range.length;

        for(var count=0; count<cells_in_range_len; count++){
            that.options.cells_in_range[count].options.element.removeClass('grid_cell_show_radius');
        }
    },
    

    /*----------------
     * Upgrade tower
     * ---------------*/
    upgrade: function(type){
        if(type === 'damage'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, this.options.level_damage);
            var next_level_cost = this.calc_upgrade_cost(type, 
                                    this.options.level_damage+1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;
                
                //Increase tower damage
                this.options.damage += 1;
                this.options.level_damage += 1;

                //Update the damage text
                $(this.options.html_damage).highlight('#2222dd');
                $(this.options.html_damage).set('html', this.options.level_damage);

                $(this.options.html_damage_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'delay'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, this.options.level_delay);
            var next_level_cost = this.calc_upgrade_cost(type,
                                    this.options.level_delay+1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.delay -= 15;
                this.options.level_delay += 1;

                //Update the delay text
                $(this.options.html_delay).highlight('#2222dd');
                $(this.options.html_delay).set('html', this.options.delay);

                $(this.options.html_delay_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'range'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, this.options.level_range);
            var next_level_cost = this.calc_upgrade_cost(type,
                                    this.options.level_range+1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.range += 1;
                this.options.level_range += 1;

                //Update the cells in the range
                this.update_cells_in_range();

                //Update the radius
                this.toggle_radius_display();
                this.toggle_radius_display();

                //Update the range text
                $(this.options.html_range).highlight('#2222dd');
                $(this.options.html_range).set('html', this.options.level_range);
                    
                $(this.options.html_range_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        /*--------------------
         * ELEMENTAL UPGRADES
         * -------------------*/
        else if(type === 'elemental_dark'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['dark']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['dark'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['dark'] += 1;

                //Update the text
                $(this.options.html_elemental_dark).highlight('#2222dd');
                $(this.options.html_elemental_dark).set('html',
                                            this.options.elementals['dark']);
                    
                $(this.options.html_elemental_dark_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'elemental_earth'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['earth']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['earth'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['earth'] += 1;

                //Update the text
                $(this.options.html_elemental_earth).highlight('#2222dd');
                $(this.options.html_elemental_earth).set('html',
                                            this.options.elementals['earth']);
                    
                $(this.options.html_elemental_earth_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'elemental_fire'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['fire']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['fire'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['fire'] += 1;

                //Update the text
                $(this.options.html_elemental_fire).highlight('#2222dd');
                $(this.options.html_elemental_fire).set('html',
                                            this.options.elementals['fire']);
                    
                $(this.options.html_elemental_fire_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'elemental_light'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['light']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['light'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['light'] += 1;

                //Update the text
                $(this.options.html_elemental_light).highlight('#2222dd');
                $(this.options.html_elemental_light).set('html',
                                            this.options.elementals['light']);
                    
                $(this.options.html_elemental_light_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'elemental_wind'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['wind']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['wind'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['wind'] += 1;

                //Update the text
                $(this.options.html_elemental_wind).highlight('#2222dd');
                $(this.options.html_elemental_wind).set('html',
                                            this.options.elementals['wind']);
                    
                $(this.options.html_elemental_wind_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        else if(type === 'elemental_water'){
            //Find the cost
            var cost = this.calc_upgrade_cost(type, 
                            this.options.elementals['water']);
            var next_level_cost = this.calc_upgrade_cost(type,
                            this.options.elementals['water'] + 1);

            if(cost <= Player_Object.options.gold){
                //Does the Player_Object have enough money?
                //  (Use -cost because we will be decreasing the gold
                //  by cost
                Player_Object.update_gold(-cost);
                this.options.value += cost;

                this.options.elementals['water'] += 1;

                //Update the text
                $(this.options.html_elemental_water).highlight('#2222dd');
                $(this.options.html_elemental_water).set('html',
                                            this.options.elementals['water']);
                    
                $(this.options.html_elemental_water_upgrade).set('value', 'Upgrade: ' +
                                                    next_level_cost + ' gold');
            }
        }
        
        //Update the rel of the element for the Tool Tips
        this.update_element_rel();
    },

    

    //TODO: Refactor this stuff
    //Calculate the upgrade cost from the current to the next level
    calc_upgrade_cost: function(type, level){
        //Return the cost to upgrade based on the type passed in
        if(type === 'damage'){
            return Game_Object.options.tower_base_cost
                    + Math.round(Math.pow(1.3, level));
        }
        if(type === 'delay'){
            return Game_Object.options.tower_base_cost
                + Math.round(Math.pow(1.3, level));
        }
        if(type === 'range'){
            return Game_Object.options.tower_base_cost
                + Math.round(Math.pow(2.3, level));
        }
        else{
            return Game_Object.options.tower_base_cost
                + Math.round(Math.pow(1.5, level));
        }
    },
    

  
    /*----------------
     * Update tower
     * ---------------*/
    update_cells_in_range: function(){
        //clear the cells in range
        this.options.cells_in_range.length = 0;
       
        //Set loop length (saves a little bit of time)
        var loop_length = this.options.range + 1;
        var range_value = -this.options.range;

        //Set the i,j to access the grid
        var i = this.options.pos_y;
        var j = this.options.pos_x;

        //Set that to this
        var that = this;

        //Set the tower's radius (will need to be updated when range is upgraded)
        for(var count_i=range_value; count_i<loop_length; count_i++){
            for(var count_j=range_value; count_j<loop_length; count_j++){
                //Make sure i+count_i and j+count_j are defined.  If not,
                //  don't add a cell.  This will happen if we try to create
                //  a tower near the edge of the map
                if(i+count_i > -1 && 
                    j+count_j > -1 &&
                        Map_Object.options.cell_objects_grid[i+count_i][j+count_j] !== undefined){
                    //Add a reference to the cell the radius contains
                    this.options.cells_in_range.push(
                            Map_Object.options.cell_objects_grid[i+count_i][j+count_j]);

                    //Add a reference to this tower for each cell that this
                    //  radius contains
                    Map_Object.options.cell_objects_grid[i+count_i][j+count_j].adopt_tower_in_range(
                        that);
                }
            }   
        }
    },
    

    /*----------------
     * Attack
     * ---------------*/
    attack: function(target){
        //When called, attack target.  Pass in an object that has an i and j for now
        var that = this;
        
        //See if the tower can attack
        if(this.options.attack_timer === 0){
            //See if there is a target
            if(target.options.health <= 0){
                this.options.creep_aggro_array.erase(target);
                return;
            }
            //Attack!

            //Set the target cell
            var creep_i = target.options.pos_y;
            var creep_j = target.options.pos_x;
            
            //Store the target cell for splash damage / chaining
            var cell_target = Map_Object.options.cell_objects_grid[
                creep_i][creep_j];
          
            //Create a new element for the 'bullet', tween the bullet
            //  to the target then destroy the bullet element
            var bullet_element = new Element('div', {
                'class':'tower_bullet_base',
                'styles': {'left': that.options.element.getStyle('left'),
                            'top': that.options.element.getStyle('top')
                        }
            });
            //add the bullet element to the grid container
            $(Map_Object.options.grid_container_element).adopt(bullet_element);
            
            //Reset the attack timer
            this.reset_attack_timer();

            //Create a bullet tween Fx object
            var bullet_tween = new Fx.Morph(bullet_element, {
                duration: that.options.bullet_speed,
                transition: Fx.Transitions.Linear
            });

            //Set a left and top amount to move the bullet to
            //  This amount is added to the left and top of the bullet
            //  tween so the bullet ends closer to the creep
            var cell_size = Map_Object.options.cell_size;

            var bullet_amount_left = cell_size;
            var bullet_amount_top = cell_size;

            //The values will be negative if the directions are 
            //  left or up (left += X for CSS, top += Y for CSS)
            if(target.options.dir_facing === 'left'){
                bullet_amount_left *= -1;
            }
            if(target.options.dir_facing === 'up'){
                bullet_amount_top *= -1;
            }
           
            /*----------------
             * Build Target List
             * ---------------*/
            //If the tower can do splash damage or chains creeps, we need
            //  to add the effected creeps to the tower's effected target list
            //This will have AT LEAST the tower's inital target
            var targets_effected = [{creep:target, 
                                    damage:that.options.damage}];
         
            /*===============================================================
             *
             *              ELEMENTAL DAMAGE
             *
             * TODO: Should elementals stack? E.G. Should wind stun creeps in
             * an AOE radius if the tower also has fire?  Or stun and chain
             * with light?
             * TODO: All these calculations should be done during upgrades
             * not during each attack 
             * ==============================================================*/
            /*============ ELEMENTAL: FIRE - SPLASH DAMAGE ==================*/
            //For splash damage, set the radius
            //FIRE ELEMENTAL = SPLASH
            //  Splash damage affects all creeps in surrounding cells.  As the
            //  fire elemental skill increases, the radius and damage also 
            //  increases.
            var elemental_value_fire = this.options.elementals['fire'];
            if(elemental_value_fire > 0){
                /*-------- Set up Radius ------------------*/
                var radius = Math.ceil(elemental_value_fire / 40) + 1;
                var radius_pos = radius + 1;
                var radius_neg = -radius;

                //use x and y of target cell
                var i = cell_target.options.pos_y;
                var j = cell_target.options.pos_x;

                var cells_effected = [];

                for(var count_i=radius_neg; count_i<radius_pos; count_i++){
                    for(var count_j=radius_neg; count_j<radius_pos; count_j++){
                        //Make sure i+count_i and j+count_j are defined.  If not,
                        //  don't add a cell.  This will happen if we try to create
                        //  a tower near the edge of the map
                        if(Map_Object.options.cell_objects_grid[i+count_i] !== undefined &&
                            Map_Object.options.cell_objects_grid[j+count_j] !== undefined){

                            //Add a reference to the cell the radius contains
                            cells_effected.push(
                                    Map_Object.options.cell_objects_grid[i+count_i][j+count_j]);
                        }
                    }   
                }
                
                //If the tower has a certain elemental, it may need to have
                //  more creeps in its target list
                //Loop through others and push if need be
                //
                //Clear the effected targets list because we'll be rebuilding here
                //  (We don't want duplicate targets)
                targets_effected = [];

                //The first creep will recieve the majority of the damage, 
                //  creeps around it will recieve less.  splash_dmg is overwritten
                //  in the loop for every creep except the primary target creep
                var splash_dmg = Math.ceil(that.options.damage / 1.5);

                for(i=0; i<cells_effected.length; i++){
                    for(var j=0; j<cells_effected[i].options.contained_creeps.length; j++){
                        //Calculate damage
                        if(j > 0){
                            splash_dmg = (Math.ceil(that.options.damage / 5)
                                        ) + (Math.ceil(elemental_value_fire / 5));
                        }
                        targets_effected.push({creep: cells_effected[i].options.contained_creeps[j],
                                                damage: splash_dmg})
                    }
                }
                
            }
            /*================== END FIRE ==================================*/

            /*============ ELEMENTAL: LIGHT - CHAINING =====================*/
            //For splash damage, set the radius
            //LIGHT ELEMENTAL = SPLASH
            //  Chains affect multiple creeps that are close together.  As the
            //  light elemental skill increases, more creeps are affected,
            //  the distance between the creeps increases and the damage 
            //  increases.
            var elemental_value_light = this.options.elementals['light'];
            if(elemental_value_light > 0){
                /*-------- Number of creeps to chain ------*/
                var num_creeps_to_chain = elemental_value_light;

                /*-------- Set up Radius ------------------*/
                var radius = Math.ceil(elemental_value_fire / 40) + 2;
                var radius_pos = radius + 1;
                var radius_neg = -radius;

                //use x and y of target cell
                var i = cell_target.options.pos_y;
                var j = cell_target.options.pos_x;

                var cells_effected = [];

                for(var count_i=radius_neg; count_i<radius_pos; count_i++){
                    for(var count_j=radius_neg; count_j<radius_pos; count_j++){
                        //Make sure i+count_i and j+count_j are defined.  If not,
                        //  don't add a cell.  This will happen if we try to create
                        //  a tower near the edge of the map
                        if(Map_Object.options.cell_objects_grid[i+count_i] !== undefined &&
                            Map_Object.options.cell_objects_grid[j+count_j] !== undefined){

                            //Add a reference to the cell the radius contains
                            cells_effected.push(
                                    Map_Object.options.cell_objects_grid[i+count_i][j+count_j]);
                        }
                    }   
                }
                
                //Clear the effected targets list because we'll be rebuilding here
                //  (We don't want duplicate targets)
                targets_effected = [];

                //Store the amount of creeps that have been effected
                num_creeps_damaged = 0;
                
                //The first creep will recieve the majority of the damage, 
                // and creeps further down the chain will receive less 
                for(i=0; i<cells_effected.length; i++){
                    for(var j=0; j<cells_effected[i].options.contained_creeps.length; j++){
                        //If the number of creeps have already been reached, end the loop
                        if(num_creeps_damaged >= num_creeps_to_chain){
                            break;
                        }
                        else{
                            //Calculate damage
                            chain_dmg = Math.ceil(that.options.damage / (
                                        num_creeps_damaged + 1)) + (
                                        elemental_value_light / 5);
                            targets_effected.push({creep: cells_effected[i].options.contained_creeps[j],
                                                    damage: chain_dmg})
                            num_creeps_damaged += 1;
                        }
                    }
                }
            }
            /*================== END LIGHT =================================*/

            /*============ ELEMENTAL: WIND - STUN  =========================*/
            //WIND ELEMENTAL = STUN
            //  Has a chance to stun.  The chance and duration of stun will
            //  increase as the elemental skill increase
            var elemental_value_wind = this.options.elementals['wind'];
            if(elemental_value_wind > 0){
                //Determine chance and duration
                //TODO: Come up with better values
                var elemental_wind_stun_chance = 15 + (Math.ceil(
                                    elemental_value_wind / 3));
                var elemental_wind_stun_duration = .2 + (Math.ceil(
                                    elemental_value_wind / 50)) *
                                    1000;
                that.options.elementals_effects['wind']['stun_chance'] = 
                    elemental_wind_stun_chance;
                that.options.elementals_effects['wind']['stun_duration'] = 
                    elemental_wind_stun_duration;
            }
            /*================== END WIND ==================================*/

            /*============ ELEMENTAL: DARK - Damage Over Time ==============*/
            //DARK ELEMENTAL = Damage Over Time 
            //  Adds a damage over time effect to the creep. Damage dealt,
            //  amount of ticks, and time between ticks changes with upgrades
            var elemental_value_dark = this.options.elementals['dark'];
            if(elemental_value_dark > 0){
                //Determine chance and duration
                //TODO: Come up with better values
                //Total number of ticks
                var elemental_dark_tick_number = 2 + Math.ceil(
                                    elemental_value_dark / 10);
                //Damage per tick
                var elemental_dark_tick_damage = Math.ceil(
                                    elemental_value_dark * .2) + 
                                    this.options.damage * .2;
                //Time between ticks
                var elemental_dark_tick_delay =  5 - Math.log(
                                    1 + (elemental_value_dark * .2));

                that.options.elementals_effects['dark']['tick_number'] = 
                    elemental_dark_tick_number;
                that.options.elementals_effects['dark']['tick_damage'] = 
                    elemental_dark_tick_damage;
                that.options.elementals_effects['dark']['tick_delay'] = 
                    elemental_dark_tick_delay;
            }
            /*================== END DARK ==================================*/

            /*============ ELEMENTAL: EARTH - SLOW  ========================*/
            //EARTH ELEMENTAL - SLOW
            //  Slows the creep.  Movement speed and duration are effected by
            //  upgrades
            var elemental_value_earth = this.options.elementals['earth'];
            if(elemental_value_earth > 0){
                //Determine the speed (how much slower the creep moves) and
                //  the duration (how long the effect lasts)
                this.options.elementals_effects['earth']['slow_amount'] = 
                    elemental_value_earth * 10;
                this.options.elementals_effects['earth']['slow_duration'] =
                    elemental_value_earth * 100;

            }
            /*================== END EARTH =================================*/

            /*----------------
             * Move the bullet and damage the creep once the bullet hits
             * ----------------*/
            //move the bullet from the tower to the target
            bullet_tween.start({
                'left': parseInt(target.options.element.getStyle('left')) +
                        bullet_amount_left,
                'top': parseInt(target.options.element.getStyle('top')) +
                        bullet_amount_top
            }).chain(function(){
                /*:::::::::::::::::::::::::
                 * Elemental Damage
                 *:::::::::::::::::::::::::*/
                /*----------------
                 *Wind
                 *----------------*/
                //If there is a wind elemental, attempt to stun the first
                //  creep in the list if the hit is successful
                if(that.options.elementals['wind'] > 0){
                    //calculate chance
                    var stun_chance = Math.floor(Math.random() * 101);
                    
                    //Random will return a value between 0 and the
                    //stun chance, so each value has a 1 in 
                    //stun_chance probability
                    if(stun_chance <= that.options.elementals_effects['wind']['stun_chance']){
                        creep_active_effects = targets_effected[0].creep.options.active_effects;
                        //See if the tower can add a slow effect
                        var stun_allowed = true;
                        //Loop through target creep's effects and if a slow effect
                        //  is on, then set slow_allowed to false
                        for(i=0; i<creep_active_effects.length; i++){
                            if(creep_active_effects[i]['source'] === that){
                                if(creep_active_effects[i]['elemental'] === 'wind'){
                                    slow_allowed = false;
                                    break;
                                }
                            }
                        }
                        //If the tower can add a DoT effect, do so
                        var this_effect_index = creep_active_effects.length;

                        //Add the DoT effect to the creeps' active effect list
                        if(stun_allowed === true){                      
                            var stun_effect = {
                                //We haven't pushed this to the array yet
                                //  so the array length will be the index
                                //  of this new item
                                'index':this_effect_index,
                                'level': that.options.elementals['wind'],
                                'elemental':'wind',
                                'source':that,
                                'html_element': new Element('div', {
                                    'id': 'active_effect_wind' 
                                        + that.options.elementals['wind'] 
                                        + '_t' + this.options.tower_id
                                        + '_i' + this_effect_index,
                                    'class': 'effect_icon effect_icon_wind'    
                                }),
                                'html_tip_title': 'Wind - Stun',
                                'html_tip_text': '',
                                'effect_function': (function(index,creep){
                                        return function(){
                                            creep.options.creep_tween.resume();
                                            creep.update_html_active_effects();
                                            //See if there are any ticks left
                                            if(creep_active_effects[index] !== undefined){
                                                //Remove tool tip when effect fades
                                                var tool_tip_id = Tool_Tips.options.current_element_id;
                                                if(tool_tip_id !== null){
                                                    if(tool_tip_id.search(creep_active_effects[index].html_element.get('id'))
                                                        !== -1){
                                                        Tool_Tips.hide();
                                                    }
                                                }
                                                //End the periodical
                                                $clear(creep_active_effects[index].effect_function);
                                                //Destroy this function
                                                creep_active_effects.splice(index,1);
                                                creep.update_html_active_effects();
                                            }
                                    }})(this_effect_index, targets_effected[0].creep).periodical(
                                        that.options.elementals_effects['wind'].stun_duration)
                            };
                            //Make sure the target index is defined (it will likely
                            //  be undefined if the tower tries to attack a creep that 
                            //  is already dead)
                            //Pause the creep's movement
                            targets_effected[0].creep.options.creep_tween.pause();
                            
                            //Set the effect's tip text (different for each effect)
                            stun_effect.html_tip_text = 'Level: ' 
                                                + stun_effect.level 
                                                + '<br /><br />'
                                                + 'Source: '
                                                + stun_effect.source.options.element_id;


                            creep_active_effects.push(stun_effect);
                        }
                    }
                }
                
                
                /*----------------
                 *Dark
                 *----------------*/
                //If there is a dark element and the target creep does not
                //  have a DoT effect from this tower already, add one
                if(that.options.elementals['dark'] > 0){
                    creep_active_effects = targets_effected[0].creep.options.active_effects;
                    //See if the tower can add a Damage over Time effect
                    var dot_allowed = true;
                    //Loop through target creep's effects and if a DoT is up
                    //  then set dot_allowed to false
                    for(i=0; i<creep_active_effects.length; i++){
                        if(creep_active_effects[i]['source'] === that){
                            if(creep_active_effects[i]['elemental'] === 'dark'){
                                dot_allowed = false;
                                break;
                            }
                        }
                    }
                    //If the tower can add a DoT effect, do so
                    var this_effect_index = creep_active_effects.length;

                    //Add the DoT effect to the creeps' active effect list
                    if(dot_allowed === true){
                        var dot_effect = {
                            //We haven't pushed this to the array yet
                            //  so the array length will be the index
                            //  of this new item
                            'index':this_effect_index,
                            'level': that.options.elementals['dark'],
                            'elemental':'dark',
                            'ticks_left':that.options.elementals_effects['dark']['tick_number'],
                            'source':that,
                            'html_element': new Element('div', {
                                'id': 'active_effect_dark' 
                                        + that.options.elementals['dark'] 
                                        + '_t' + this.options.tower_id
                                        + '_i' + this_effect_index,
                                'class': 'effect_icon effect_icon_dark tool_tip',
                            }),
                            'html_tip_title': 'Dark: Damage Over Time',
                            'html_tip_text': '',
                            'effect_function': (function(index,creep){
                                    return function(){
                                        //See if there are any ticks left
                                        creep.update_html_active_effects();
                                        if(creep_active_effects[index] !== undefined){
                                            //Remove tool tip when effect fades
                                            var tool_tip_id = Tool_Tips.options.current_element_id;
                                            if(tool_tip_id !== null){
                                                if(tool_tip_id.search(creep_active_effects[index].html_element.get('id'))
                                                    !== -1){
                                                    Tool_Tips.hide();
                                                }
                                            }
                                            if(creep_active_effects[index].ticks_left > 0){
                                                creep.take_damage(
                                                    that.options.elementals_effects['dark'].tick_damage,
                                                    that);
                                                creep_active_effects[index].ticks_left -= 1;
                                            }
                                            else{
                                                //End the periodical
                                                $clear(creep_active_effects[index].effect_function);
                                                //Destroy this function
                                                creep_active_effects.splice(index,1);
                                                creep.update_html_active_effects();
                                            }
                                        }
                                    }})(this_effect_index, targets_effected[0].creep).periodical(
                                        that.options.elementals_effects['dark'].tick_delay * 
                                        1000)
                        };
                        //Set the effect's tip text (different for each effect)
                        dot_effect.html_tip_text = 'Level: ' 
                                                + dot_effect.level 
                                                + '<br />'
                                                + 'Source: '
                                                + dot_effect.source.options.element_id;

                        creep_active_effects.push(dot_effect);
                    }
                }
                /*----------------
                 *Earth
                 *----------------*/
                if(that.options.elementals['earth'] > 0){
                    creep_active_effects = targets_effected[0].creep.options.active_effects;
                    //See if the tower can add a slow effect
                    var slow_allowed = true;
                    //Loop through target creep's effects and if a slow effect
                    //  is on, then set slow_allowed to false
                    for(i=0; i<creep_active_effects.length; i++){
                        if(creep_active_effects[i]['source'] === that){
                            if(creep_active_effects[i]['elemental'] === 'earth'){
                                slow_allowed = false;
                                break;
                            }
                        }
                    }
                    //If the tower can add a DoT effect, do so
                    var this_effect_index = creep_active_effects.length;

                    //Add the DoT effect to the creeps' active effect list
                    if(slow_allowed === true){
                        var slow_effect = {
                            //We haven't pushed this to the array yet
                            //  so the array length will be the index
                            //  of this new item
                            'index':this_effect_index,
                            'level': that.options.elementals['earth'],
                            'elemental':'earth',
                            'source':that,
                            'html_element': new Element('div', {
                                'id': 'active_effect_earth' 
                                        + that.options.elementals['earth'] 
                                        + '_t' + this.options.tower_id
                                        + '_i' + this_effect_index,
                                'class': 'effect_icon effect_icon_earth' 
                            }),
                            'html_tip_title': 'Earth - Slow',
                            'html_tip_text': '',
                            'effect_function': (function(index,creep){
                                    return function(){
                                        creep.options.move_speed = 
                                            creep.options.move_speed_base;
                                        creep.update_html_active_effects();
                                        //See if there are any ticks left
                                        if(creep_active_effects[index] !== undefined){
                                            //Remove tool tip when effect fades
                                            var tool_tip_id = Tool_Tips.options.current_element_id;
                                            if(tool_tip_id !== null){
                                                if(tool_tip_id.search(creep_active_effects[index].html_element.get('id'))
                                                    !== -1){
                                                    Tool_Tips.hide();
                                                }
                                            }
                                            //Return speed to normal
                                            creep.options.move_speed = 
                                                creep.options.move_speed_base;
                                            //End the periodical
                                            $clear(creep_active_effects[index].effect_function);
                                            //Destroy this function
                                            creep_active_effects.splice(index,1);
                                            creep.update_html_active_effects();
                                        }
                                }})(this_effect_index, targets_effected[0].creep).periodical(
                                    that.options.elementals_effects['earth'].slow_duration)
                        };
                        //Make sure the target index is defined (it will likely
                        //  be undefined if the tower tries to attack a creep that 
                        //  is already dead)
                        targets_effected[0].creep.options.move_speed += 
                            that.options.elementals_effects['earth'].slow_amount;
                         
                        //Set the effect's tip text (different for each effect)
                        slow_effect.html_tip_text = 'Level: ' 
                                                + slow_effect.level 
                                                + '<br /><br />'
                                                + 'Source: '
                                                + slow_effect.source.options.element_id;

                        creep_active_effects.push(slow_effect);
                    }

                }
               
                //Update the active creep effect
                targets_effected[0].creep.update_html_active_effects();
                
                /*----------------
                 *Deal Damage
                 *----------------*/
                for(i=0; i<targets_effected.length; i++){
                    //Deal damage to the creep
                    that.deal_damage(targets_effected[i].creep, 
                                    targets_effected[i].damage);
                }
                //Destroy the bullet element
                bullet_element.destroy();
            });
        }
    },

    reset_attack_timer: function(){
        //Create a function with a delay of this tower's delay
        //  When the delay is up, the timer value will equal 0 
        //  which means the tower can attack.  This function is called
        //  whenever the tower attacks
        
        //Set the attack timer delay 
        this.options.attack_timer = this.options.delay;

        var that = this;

        //Create the function to set the timer to 0
        var attack_timer_function = function(){ 
            that.options.attack_timer = 0;
        };
        
        attack_timer_function.delay(this.options.delay);
    },

    /*----------------
     *
     * (Attack) Deal Damage
     *
     * ---------------*/
    deal_damage: function(target, damage){
        //Will deal damage to the target passed in.
        target.take_damage(damage, this);
    },

    /*----------------
     *
     * Sell Tower
     *
     * ---------------*/
    sell_tower: function(){
        //Calcuate the value of the tower, give the Player_Object money, and destroy
        //  Get the current value
        var tower_value = this.options.value;
        tower_value = tower_value * Game_Object.options.tower_resell_value;
        
        //Give the player gold
        Player_Object.options.gold += tower_value;
        console.log(Player_Object.options.gold, tower_value);

        //Remove the tower
        this.destroy_tower();
    },

    /*----------------
     *
     * Destroy Tower
     *
     * ---------------*/
    destroy_tower: function(){
        //Removes tower from the game
        //Remove HTML element
        $(this.options.element).dispose();

        //Remove tower from player's tower owned list
        Player_Object.options.towers_owned.splice(
            this.options.player_owned_id, 1);

        //Remove radius display
        this.hide_radius_display();

        //Unselect tower if it is selected
        if(Player_Object.options.selected_tower === this){
            if(Player_Object.options.selected_tower === this){
                $(Player_Object.options.html_tower_selected_wrapper
                        ).setStyle('opacity',0);
                Player_Object.options.selected_tower = null;
            }
        }

        //Remove cell from grid
        this.options.cell_reference.remove_tower();
        
        //Hide tooltips if they exist
        Tool_Tips.hide();
    }
});

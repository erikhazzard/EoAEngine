/*===========================================================================
 *
 * Creep Class
 *
=============================================================================*/
/*Create a creep class.
 * This is our base creep class.*/
var Creep= new Class({
    Implements: [Options],
    //Set the attributes / options
    options: {
        //Properties
        name: 'Null',
        health: 5,
        power: 0,

        //Some extra attributes
        armor_class: 0,

        //elemental attributes
        elementals: {'dark':0,
                    'earth':0,
                    'fire':0,
                    'light':0,
                    'water':0,
                    'wind':0,
                },

        //Grid position
        pos_x: 1,
        pos_y: 0,
        //position in the zone's path array
        pos_path: 0,

        //Active buffs
        //  Contains a list of functions that act as effects on the creep 
        //  For instance, any slow effects or damage over time
        //  Structure is:
        //      {'index':index, 'element': element, 'function':function, 
        //          'source':tower_that_owns_this_effect}
        active_effects: [],

        //Speed (tween duration) in MS per move.  Need to save on server also
        move_speed: 375,
        //base_move_speed is the base move speed, used to return the creep's
        //  normal speed if a speed or slow effect wears off
        move_speed_base: 375,
        //Create a new chain for the movement(object created in initialize)
        move_chain: null,
        move_functions: [],
        //Store if the creep is moving to the end
        moving_to_end: false,

        //Creep's tween object
        creep_tween: {},

        //css color
        color: '#000000',
        
        //Store the character element (empty now, filled in on initialize)
        element: {},
        element_id: null,
        add_to_map: true,

        //Store the ID of the creep (increases on every wave)
        creep_id: 0,

        //Value of creep (how much gold the player gets when killing it)
        //  This is set in when a wave of creeps is called
        value: 0,
        
        //The direction the character is facing
        dir_facing: 'down',
        //Stores the direction the character is moving at any given instant
        dir_moving: {'up':false, 'right':false, 'down':false, 'left':false},

        //HTML Elements
        html_name: 'creep_selected_name',
        html_health: 'creep_selected_health',
        html_power: 'creep_selected_power',
        html_armor_class: 'creep_selected_armor_class',
        html_move_speed: 'creep_selected_move_speed',
        html_active_effects: 'creep_selected_active_effects'
    },

       
     /*--------------------------------
     * Constructor;

        //We don't yet allow for diagonal movement
        var move_direction = '';
        var move_length = 0;
        
        //Stores an array of movement functions
        that.options.move_functions = [];

     * -------------------------------*/
    //initialize is a MooTools constructor
    initialize: function(options){
        //set the object's attributes / options
        this.setOptions(options);

        var that=this;

        //Set the element ID
        if(this.options.element_id === null){
            this.options.element_id = "creep_" + this.options.name + '_'
                                    + creep_list.length;
        }

        this.options.creep_id = creep_list.length;

        //Set element options
        this.options.element =  new Element('div', {
            'id': this.options.element_id,
            'class': 'creep_base',
            'styles': {
                'height':Zone_Object.options.cell_size - 2 + 'px',
                'left':this.options.pos_x * Zone_Object.options.cell_size,
                'top':this.options.pos_y * Zone_Object.options.cell_size,
                'width':Zone_Object.options.cell_size - 2 + 'px'
            },
            'events': {
                'click': function(evt){
                    evt.stop();
                    that.select_creep();
                }
            }
        });

        //Add to the map it it should be added
        if(this.options.add_to_map === true){
            $('zone_container').adopt(this.options.element);
        }

        this.options.move_chain = new Chain();
    
        /*:::::::::::::::::::::::::
        //Create the move chain
        /*:::::::::::::::::::::::::*/
        //Set the path so we don't have to retype it everytime
        var path = Zone_Object.options.path;
        
        //Set the path length equal to the actual path length minus 1 because
        //  we will be looking at i + 1 in the loop, and when the loop is at
        //  the last iteration we need to be able to access the last element,
        //  not an element outside the length of the array
        var path_length = Zone_Object.options.path.length - 1;

        //We don't yet allow for diagonal movement
        var move_direction = '';
        var move_length = 0;
        
        //Stores an array of movement functions
        that.options.move_functions = [];

        for(var i=0; i<path_length; i++){
            //Determine direction needed to move
            //Check for y
            if(path[i][0] === path[i+1][0]){
                //x is the same, change y direction
                move_direction = ( path[i][1] < path[i+1][1] ) ? 'down':'up';
                move_length = Math.abs(path[i][1] - path[i+1][1]);
            }
            //Check for x
            if(path[i][1] === path[i+1][1]){
                //y is the same, change x direction
                move_direction = ( path[i][0] < path[i+1][0] ) ? 'right':'left';
                move_length = Math.abs(path[i][0] - path[i+1][0]);
            }
           
            //Tells the creep to go from start to finish based on zone's path
            that.options.move_functions.push(
                    //We need to use a closure here otherwise the variables
                    //  will be set to value of the last iteration
                    function(dir, len, obj){
                        return function(){
                            //call the creep's move function
                            obj.move(dir, len);
                        }}(move_direction, move_length, that));
        }   
        //Add the move functions to the object's move chain
        that.options.move_chain.chain(that.options.move_functions);

    },

    /*----------------------------------------------------------------------
     * Methods
     * ---------------------------------------------------------------------*/
    update_html_active_effects: function(){
        if(Player_Object.options.selected_creep === this){
            var that = this;
            //Copy the active effects
            var active_effects = this.options.active_effects;
          
            //Update the HTML elements
            $(this.options.html_name).set('html', this.options.element_id);
            $(this.options.html_health).set('html', this.options.health);
            $(this.options.html_power).set('html', this.options.power);
            $(this.options.html_armor_class).set('html', this.options.armor_class);
            $(this.options.html_move_speed).set('html', this.options.move_speed);

            $(this.options.html_active_effects).empty();
            
            //Add the element for each effect
            for(var i=0; i<active_effects.length; i++){
                $(this.options.html_active_effects).adopt(
                        active_effects[i].html_element);
                active_effects[i].html_element.set('title', 
                        active_effects[i].html_tip_title);
                active_effects[i].html_element.set('rel', 
                        active_effects[i].html_tip_text);
            }

            //Add the tool tip
            Tool_Tips.attach('.tool_tip');
        }
    },
    /*----------------
     * Select Creep
     * ---------------*/
    select_creep: function(){
        //Determine if tower is selected
        var tower_selected = Player_Object.options.html_tower_selected_wrapper;
        if($(tower_selected).getStyle('opacity')>0){
            Tool_Tips.hide();
            $(tower_selected).setStyle('opacity', 0);
        }
        //Show the selection wrapper
        $(Player_Object.options.html_creep_selected_wrapper).setStyle('opacity', 1);
        
        //Update the Player_Object's selection
        Player_Object.options.selected_tower = null;
        Player_Object.options.selected_creep = this;

        
        //Get the active effects
        this.update_html_active_effects();
    },
    
    /*----------------
     * Move Creep
     * ---------------*/
    /*Move and Tween creep*/
    move: function(direction, amount, cell_size){
        //Direciton is either up, right, down, or left.  It's used to
        //  determine what direction the creep is facing
        //Amount is the amount of cells to move the creep
        //Grid is a passed in grid, but if not passed in will use
        //  Zone_Object's grid
        
        //store this as that so we can refrence it inside other classes
        var that = this;
            
        /*:::::::::::::::::::::::::
         * Move (on the grid) and tween (css) the creep 
         *:::::::::::::::::::::::::*/

        //We're moving the creep in a direction
        that.options.dir_moving[direction] = true;
        //Set the direction the creep is facing
        that.options.dir_facing = direction;

        //set the direction used by CSS (either left or top)
        //  if the directino is up or down, the css_directino is top
        //      otherwise it is left
        css_direction = (direction === 'up' || direction === 'down') ?
                        'top':'left';
    
        //If the direction is up or left, the amount needs to be multipled
        //  by a negative 1
        //amount_modifier the amount to move either up or down or left or 
        //  right.  Since it is just 1 or -1, it is also the value to move
        //  the character on the grid by.
        amount_modifier = (direction === 'up' || direction === 'left') ?
                        -1:1;

        //Change the amount based on modifier
        //Amount is how much to move the character's CSS position
        amount *= amount_modifier;

        /*:::::::::::::::::::::::::
         *See if movement is possible
         *:::::::::::::::::::::::::*/
        //Store the coordinates of the desired move
        //If the css direction is top (direction is up or down), change the
        //  desired_pos_y to be the amount the creep is to move, else the
        //  css_direction is not top so we change the x coordinate
        //
        var desired_pos_x = (css_direction === 'left') ? 
                            that.options.pos_x + amount:
                            that.options.pos_x;

        var desired_pos_y = (css_direction === 'top') ? 
                            that.options.pos_y + amount:
                            that.options.pos_y;

        /***Grid Movement***/
        //Save current position
        var previous_pos_x = that.options.pos_x;
        var previous_pos_y = that.options.pos_y;

        //Move the x or y of the character by 1
        that.options.pos_x = desired_pos_x;
        that.options.pos_y = desired_pos_y;

        /***CSS Movement****/
        //Create the tween object to move the character
        that.options.creep_tween = new Fx.Tween(that.options.element, {
            duration: that.options.move_speed,
            transition: Fx.Transitions.Quad.easeIn
        });

        //Get the current character position, relative to CSS.
        //  This position is not the actual x,y of a character, but the
        //  css property
        var creep_css_position = parseInt(
                that.options.element.getStyle(css_direction), 10);
      
        //Set the amount of CSS pixels to move to the amount * the cell size
        if(cell_size === undefined){
            var cell_size = Zone_Object.options.cell_size;
        }
        var css_amount_to_move = amount * cell_size

        /*:::::::::::::::::::::::::
        //Tween the character and callChain
        *:::::::::::::::::::::::::*/
        that.options.creep_tween.start(css_direction, creep_css_position + 
            css_amount_to_move).chain(function(){
            //The character is done moving in this direction
            that.options.dir_moving[direction] = false;

            //Update the creep's position on the path
            that.options.pos_path += 1;

            //Remove the creep from the cell it previously occupied
            that.remove_from_cell(previous_pos_y, previous_pos_x);

            //Add the creep to the cell the creep occupies
            //  add to cell as i,j 
            that.add_to_cell(that.options.pos_y,that.options.pos_x);
           
            //We're done moving the creep, the chain for creep move is done
            that.options.move_chain.callChain();
        });
        
        /*:::::::::::::::::::::::::
         *Send request to server
         *:::::::::::::::::::::::::*/
        /*Make the request to the server if the character is the PC*/
        if(that.options.is_pc === true){
            var req = new Request({
                url: url_root + url_character_move,
                data: 'dir=' + direction,
                method: 'post',
                onSuccess: function(res){
                    //If request is successful, no need to do anything
                },
                onFailure: function(res){
                    //If the request failed, move the character back the
                    //  specified amount
                    that.options.element.setStyle(css_direction,
                                        character_position - amount + 'px');
                }
            }).send();   
        }

        //We're done
        //return this;
    },

    //Add a creep to a cell
    add_to_cell: function(i,j){
        //Store a reference to the cell we want
        var cell_object = Zone_Object.options.cell_objects_grid[i][j].options;
        //Add creep to the current cell object's references
        cell_object.contained_creeps.push(
            this);

        var towers_in_range = cell_object.towers_in_range;

        //Check if any towers have a radius that occupies the cell
        //  If the cell falls within a tower's radius, check to see if this 
        //  creep is in that tower's aggro list
        //      If it isn't, push this creep to the aggro list
        if(towers_in_range.length !== 0){
            //Loop through towers in the list
            for(var i=0; i<towers_in_range.length; i++){
                if(towers_in_range[i].options.creep_aggro_array.indexOf(
                            this) === -1){
                    //Add this creep to the tower's aggro list
                    towers_in_range[i].options.creep_aggro_array.push(this);    
                }
            }
        }
       
        //Check if creep has reached the goal
        //TODO: THIS SHOULD BE AN EVENT
        if(i === 0 && j === 24){
            //i,j are the end goal in this case
            this.reached_goal();
        }



    },
    remove_from_cell: function(i,j){
        //Remove the creep from the cell object
        creep_array = Zone_Object.options.cell_objects_grid[i][j].
            options.contained_creeps;
        creep_array.splice(creep_array.indexOf(this), 1);

        //Remove the creep from any towers that no longer are in 
        //  range of the creep
        var cell_object = Zone_Object.options.cell_objects_grid[i][j].options;
        var towers_in_range = cell_object.towers_in_range;

        if(towers_in_range.length !== 0){
            //Loop through towers in the list
            for(var i=0; i<towers_in_range.length; i++){
                if(towers_in_range[i].options.creep_aggro_array.indexOf(
                            this) !== -1){
                    //Remove this creep from the tower's aggro list
                    towers_in_range[i].options.creep_aggro_array.erase(this);    
                }
            }
        }

},

    /*----------------
     * Begin Wave 
     * ---------------*/
    send_to_end: function(){
        //Only call the move chain if the creeps aren't moving to the end
        if(this.options.moving_to_end === false){
            this.options.moving_to_end === true;
            this.options.move_chain.callChain();
        }
        
    }, 
    /*---------------------------------
     * Damage Functions
     * --------------------------------
    /*----------------
     * Take Damage
     * ---------------*/
    take_damage: function(amt, referrer){
        //Pass in an amount to deal damage to creep and
        //  an elemental type
        //TODO: some AC calculations 
        //Only take damage if the health is above 0
        if(Player_Object.options.selected_creep === this){
            this.select_creep();
            this.update_html_active_effects();
        }
        if(this.options.health > 0){
            //Flash the creep
            this.options.element.highlight('#dd2222');

            this.options.health -= amt;
            
            //Check to see if the creep is dead
            if(this.options.health <= 0){
                this.destroy();
                referrer.options.creeps_killed += 1;
                Player_Object.options.creeps_killed += 1;
                return 0;
            }
        }
        return this.options.health;
    },

    /*----------------
     * Destroy Creep 
     * ---------------*/
    destroy: function(){
        //Destroy the creep
        this.options.move_chain.clearChain();
        this.options.element.highlight('#22dddd');
        this.options.element.fade(0);

        //Remove the monster from the list
        var i = this.options.pos_y;
        var j = this.options.pos_x;

        //Remove the creep from the cell objects grid:
        Zone_Object.options.cell_objects_grid[i][j].options.contained_creeps.erase(this);

        //Give the Player_Object some money
        Player_Object.update_gold(this.options.value);

        $(Player_Object.options.html_gold).highlight('#dddd22');
        $(Player_Object.options.html_gold).set('html', 
                Player_Object.options.gold);

        //Remove creep from selection and update selection box
        if(Player_Object.options.selected_creep === this){
            Player_Object.options.selected_creep = null;
            //Hide the tooltip if it is up
            Tool_Tips.hide();
            $(Player_Object.options.html_creep_selected_wrapper).setStyle(
                'opacity',0);
        }
    },

    reached_goal: function(){
        //Destroy the creep
        this.options.move_chain.clearChain();
        this.options.element.highlight('#22dddd');
        this.options.element.fade(0);

        //Remove the monster from the list
        var i = this.options.pos_y;
        var j = this.options.pos_x;

        //Remove the creep from the cell objects grid:
        Zone_Object.options.cell_objects_grid[i][j].options.contained_creeps.erase(this);

        //health
        Player_Object.options.health -= 1;
        $(Player_Object.options.html_health).highlight('#dd2222');
        //Clear the effected targets list because we'll be rebuilding here
        //        (We don't want duplicate targets)
        $(Player_Object.options.html_health).set('html', Player_Object.options.health);

        //Remove creep from selection and update selection box
        if(Player_Object.options.selected_creep === this){
            Player_Object.options.selected_creep = null;
            //Hide the tooltip if it is up
            Tool_Tips.hide();
            $(Player_Object.options.html_creep_selected_wrapper).setStyle(
                'opacity',0);
        }


    }
});

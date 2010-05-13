/*===========================================================================
 *
 * Cell Class
 *
=============================================================================*/
/*Create a cell class.
 * Each cell is an object with an element and various properties, such as 
 * if a tower is on it, if it is able to have a tower on it, etc. */

var Cell = new Class({
    Implements: [Options],

    //Set the attributes / options
    options: {
        //The pos_x and pos_y are the position on the grid
        pos_x: 0,
        pos_y: 0,

        //the html element
        element: {},

        //the value (passed in from the grid)
        cell_value: 0,

        //The cell objects are associated with a map object
        //  Do not set the map_object here though or MooTools
        //  will clone it; we want a reference
        map_object: {},

        //Holds a reference to the creep(s) a cell contains 
        contained_creeps: [],
        //Holds a reference to the tower a cell contains
        contained_tower: null,
        //Holds a reference to tower(s) that have a radius that
        //  extend to this cell
        towers_in_range: []
    },

    /*--------------------------------
     * Constructor
     * -------------------------------*/
    initialize: function(options, map_object){
        //set the object's attributes / options
        this.setOptions(options);

        //Set the map object reference here.  Otherwise, it would be set
        //  as a copy
        this.options.map_object = map_object;

        //that equals the current cell object
        var that = this;
        
        //Create the cell element (a div)
        this.options.element = new Element('div', {
            'id': 'grid_cell_' + that.options.pos_x + '_' + that.options.pos_y,
            'class': 'grid_cell grid_cell_hidden',
            'styles': {
                'height': that.options.map_object.options.cell_size - 1,
                //y and x are reversed here because of the way we store it
                //  y is the 'outter' loop which really is like the x value,
                //  but if used x here instead of y, we would have to set the
                //  pos_y to x instead of y.  When we access the array, the 
                //  array is stored to look like a cartesian x,y coordinate
                //  system but we access the array as [y][x]
                'left': that.options.pos_x * that.options.map_object.options.cell_size,
                'top': that.options.pos_y * that.options.map_object.options.cell_size,
                'width': that.options.map_object.options.cell_size - 1,
            },
            'events' : {
                //Highlight cell
                'mouseenter': function(el){
                    if(that.options.map_object.options.grid_is_displayed === true){
                        //See if the grid has a 0 in the current location
                        //  as it's value
                        //Get the grid's value (y,x)
                        if(that.options.cell_value === 0){
                            that.options.element.addClass('grid_cell_hover_value_0');
                        }
                        else{
                            //It's not a 0
                            that.options.element.addClass('grid_cell_hover_value_1');
                        }
                    }
                },

                //Return cell to normal color
                'mouseleave': function(el){
                    if(that.options.map_object.options.grid_is_displayed === true){
                        that.options.element.removeClass('grid_cell_hover_value_0');
                        that.options.element.removeClass('grid_cell_hover_value_1');
                    }
                },            

                /*--------------------------------
                 * Click event on cell
                 * -------------------------------*/
                'click': function(el){
                    if(Player_Object.options.mode === 'selection'){
                        that.click_selection_mode();
                    }
                    else if(Player_Object.options.mode === 'build'){
                        that.click_build_mode();
                    }
                }
            }
        });
    },

    /*--------------------------------
     * Methods
     * -------------------------------*/
    /*The following methods work when the grid is active.
     * click_selection_mode and click_build_mode will get information about
     * the object that tied to a current cell. */
    click_selection_mode: function(){
        //get information (if any) about the object occupying the current cell
        //a similar function is also called when the html element for a tower
        //  is clicked on
        console.log(this.options.contained_creeps,this.options.pos_x,
                    this.options.pos_y);
    },

    click_build_mode: function(el){
        //check to see if we can place a building in the cell
        if(this.options.cell_value !== 0){
            /*We can place a tower on the cell, so try to*/

            //see if the Player_Object has enough money
            if(Player_Object.options.gold >= Game_Object.options.tower_base_cost){
                //TODO: make request to server to see if the Player_Object gold matches on server

                //create a tower object
                var tower = new Tower({'pos_x': this.options.pos_x, 
                        'pos_y': this.options.pos_y});

                //decrease the Player_Object's gold by the base tower cost amount
                Player_Object.update_gold(
                        Game_Object.options.tower_base_cost);

                //update the HTML element that shows gold amount
                $(Player_Object.options.html_gold).set('html', 
                        Player_Object.options.gold);
            }

        //get out of build mode
        Player_Object.options.mode = 'selection';
        this.options.element.removeClass('grid_cell_hover_value_0');
        this.options.element.removeClass('grid_cell_hover_value_1');

        //hide the grid
        Map_Object.toggle_grid();
        }
    },

    adopt_tower: function(tower_reference){
        //adopt_tower: takes in an object and adds it to this object's 
        //  contained_creeps
        this.options.contained_tower = tower_reference;
        
        //set the cell value to 0 (we can't build on a cell already used)
        this.options.cell_value = 0;
    },

    remove_tower: function(){
        //remove_tower: remove an object reference
        this.options.contained_tower = null;

        //reset the cell value to 1 (we can build on it)
        this.options.cell_value = 1;
    },

    //Add reference to tower that has a range that contains this cell
    adopt_tower_in_range: function(tower_reference){
        //Add a passed in tower to the towers in range array
        this.options.towers_in_range.push(tower_reference);        
    },
    remove_tower_in_range: function(tower_reference){
        //Remove the passed in tower from the array of towers in range
        this.options.towers_in_range.erase(tower_reference);
    }

});

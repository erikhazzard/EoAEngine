/*===========================================================================
 *
 * Zone Class
 *
=============================================================================*/
/*Create a zone class.  Each zone contains a grid.  Ideally, the grid will be just one grid of many zones in the 'world' class*/

var Zone = new Class({
    Implements: [Options],
    
    //Set the attributes / options
    options: {
        //Zone name
        name: 'Zone_01',
        
        //Element (the HTML element)
        element: {},

        //The zone grid (ideally, this will be recieved from the server
        //Is created on init
        grid: null,
    },
    initialize: function(options){
        //set the object's attributes / options
        this.setOptions(options)

        if(this.options.grid === null){
            //Build a simple grid matrix
            this.options.grid = [
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            ]
        }
    }

});

/*===========================================================================
 *
 * Character Class
 *
=============================================================================*/
/*Create a character class.
 * Attributes: name, color, pos_x, pos_y
 * Methods
 *  set_position(x,y): takes in a grid (e.g. Zone grid), x,y coordinate and 
 *  checks if the grid[x,y] is passable.  If so, the character's pos is 
 *  updated and the function returns True
 */

var Character = new Class({
    Implements: [Options],
    //Set the attributes / options
    options: {
        name: 'Null',
        color: '#000000',
        pos_x: 0,
        pos_y: 0,
        tween_duration: 75,
        
        //Store the character element (empty now, filled in on initialize)
        element: {},
        element_id: null,
        add_to_map: true,
        
        //The direction the character is facing
        dir_facing: 'right',
        //Stores the direction the character is moving at any given instant
        dir_moving: {'up':false, 'right':false, 'down':false, 'left':false},

        //Store if this is the Player character.  If so, we want to send 
        //  request to server when it moves.  If someone changes this value,
        //  it's not a problem because the server ensures checks anyway.
        is_pc: false
    },

     /*--------------------------------
     * Constructor
     * -------------------------------*/
    //initialize is a MooTools constructor
    initialize: function(options){
        //set the object's attributes / options
        this.setOptions(options);

        //Set the element ID
        if(this.options.element_id === null){
            this.options.element_id = "character_" + this.options.name;
        }

        //Set element options
        this.options.element =  new Element('div', {
            'id': this.options.element_id,
            'class': 'character_base',
            'styles': {
                'background':this.options.color,
                'left':this.options.pos_x,
                'top':this.options.pos_y
            }
        });

        //Add to the map it it should be added
        if(this.options.add_to_map === true){
            $('zone_container').adopt(this.options.element);
        }

    },

    /*--------------------------------
     * Methods
     * -------------------------------*/
    //can_move method, checks for collisions
    can_move: function(grid, x, y){
        //Make sure we get coordinates
        if(x !== undefined && y !== undefined){
            //See if the grid coordinates are valid
            if(grid[x] !== undefined && grid[y] !== undefined){
                //See if the position can be set
                if(grid[x][y] !== 0){
                    return true;
                }
                else{
                    return false;
                }
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    },

    /*Move and Tween character*/
    move: function(direction, amount, grid){
        //store this as that so we can refrence it inside other classes
        that = this;
            
        /*:::::::::::::::::::::::::
         * Move (on the grid) and tween (css) the character
         *:::::::::::::::::::::::::*/

        //We're moving the character in a direction
        that.options.dir_moving[direction] = true;

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
        //  pos_y to be either plus or plus a negative (minus) 1, else the
        //  css_direction is not top so we change the x coordinate
        //
        var desired_pos_x = (css_direction === 'left') ? 
                            that.options.pos_x + amount_modifier:
                            that.options.pos_x;

        var desired_pos_y = (css_direction === 'top') ? 
                            that.options.pos_y + amount_modifier:
                            that.options.pos_y;

        //If no grid is passed in, use a dummy one
        if(grid === undefined){
            grid = [[1,1,1],[1,1,1],[1,1,1],[1,1,1]];
        }

        if(that.can_move(grid, desired_pos_x, desired_pos_y) === true){ 
            /***Grid Movement***/
            //Move the x or y of the character by 1
            that.options.pos_x = desired_pos_x;
            that.options.pos_y = desired_pos_y;

            /***CSS Movement****/
            //Create the tween object to move the character
            var character_tween = new Fx.Tween(that.options.element, {
                duration: that.options.tween_duration,
                transition: Fx.Transitions.Quad.easeIn
            });

            //Get the current character position, relative to CSS.
            //  This position is not the actual x,y of a character, but the
            //  css property
            var character_position = parseInt(
                    that.options.element.getStyle(css_direction), 10);
            
            //Tween the character
            character_tween.start(css_direction, character_position + amount).chain(function(){
                //The character is done moving in this direction
                that.options.dir_moving[direction] = false;
            });

            /*:::::::::::::::::::::::::
             *Send request to server
             *:::::::::::::::::::::::::*/
            /*Make the request to the server if the character is the PC*/
            if(that.options.is_pc == true){
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
        }
        //Cannot move on the grid, so set the dir_moving[direction] to false,
        //  otherwise it won't be reset
        else{
            that.options.dir_moving[direction] = false;
        }
    }
})

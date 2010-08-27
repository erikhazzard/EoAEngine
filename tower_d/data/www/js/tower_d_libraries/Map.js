/*===========================================================================
 *
 * Map Class
 *
=============================================================================*/
/*Create a map class.  Each map contains a grid.  Ideally, the grid will be
 * just one grid of many maps in the 'world' class*/

var Map = new Class({
    Implements: [Options],
    
    //Set the attributes / options
    options: {
        //Map name
        name: 'Map_01',
        
        //Element (the HTML element)
        element: {},

        //The map grid (ideally, this will be recieved from the server
        //Is created on init
        grid: null,
        grid_container_element: 'grid_container',
        grid_display_element: 'grid_display_container',
        grid_is_displayed: false,

        //Cell size of the grid
        cell_size: 32,

        //Store a grid of all the cell objects. Should match up exactly
        //  to this.options.grid
        cell_objects_grid: [[]],

        //store a path
        path: [ //Top Left > Down
                [0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],
                [0,10], [0,11],[0,12],[0,13],
                //Bottom Left > Right
                [1,13],[2,13],[3,13],[4,13],[5,13],[6,13],
                //Middle Left > Up
                [6,12],[6,11],[6,10],[6,9],[6,8],
                [6,7],[6,6],[6,5],[6,4],[6,3],[6,2],[6,1],[6,0],
                //Top Middle > Right
                [7,0],[8,0],[9,0],[10,0],[11,0],[12,0],
                //Right Middle > Down
                [12,1],[12,2],[12,3],[12,4],[12,5],[12,6],[12,7],[12,8],
                [12,9],[12,10],[12,11],[12,12],[12,13],
                //Right Bottom > Right
                [13,13],[14,13],[15,13],[16,13],[17,13],[18,13],
                //Right Bottom > Top Right (To Goal)
                [18,12],[18,11],[18,10],
                [18,9],[18,8],[18,7],[18,6],[18,5],[18,4],[18,3],[18,2],
                [18,1],[18,0]
            ] 
    },

    /*--------------------------------
     * Constructor
     * -------------------------------*/
    initialize: function(options){
        //set the object's attributes / options
        this.setOptions(options);

        if(this.options.grid === null){
            //Build a simple grid matrix
            this.options.grid = [
                [0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0],
                [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
            ]
        }

        //Call method to create the grid elements
        this.create_cells();
    },

    /*--------------------------------
     * Methods
     * -------------------------------*/
    create_cells: function(opacity){
        /*Will populate the grid_container HTML element
         * with a bunch of cells based on the cell size and create a 
         * border around the bottom and right edges*/
                      
        //Set the grid container's inital opacity to 0
        $(this.options.grid_container_element).setStyle('opacity', .9);

        //Store the map object as that
        var that = this;

        //Loop through the grid (rows, then columns)
        for(var i=0; i < this.options.grid.length; i++){
            for(var j=0; j < this.options.grid[i].length; j++){
                //j is really the X coordinate, i is the Y coordinate
                var cell_object = new Cell({
                    'pos_x': j, 'pos_y': i,
                    'cell_value': this.options.grid[i][j]
                }, this);
                
                //Add cell object to map cell list
                this.options.cell_objects_grid[i].include(cell_object);
                
                //Add it to the grid container
                $(this.options.grid_container_element).adopt(cell_object.options.element);    
            }
            //Add an empty array to the cell_object_grid
            //  Don't add an empty list to the end
            if(i !== this.options.grid.length - 1){
                this.options.cell_objects_grid.include([]);
            }
        }
    },

    toggle_grid: function(opacity){
        
        //Fade the grid container to the opacity passed in (if any)
        if(opacity === undefined){
            opacity = .5;
        }
        
        if(this.options.grid_is_displayed === true){
            //Hide the grid
            this.options.grid_is_displayed = false;
           
            var that = this;
            $(this.options.grid_display_element).setStyle('opacity',0);
            //$each($$('.grid_cell'), function(i){ i.addClass('grid_cell_hidden'); })
        }
        else{
            //Show the grid
            this.options.grid_is_displayed = true;

            var that = this;
            $(this.options.grid_display_element).setStyle('opacity',.3);
            //$each($$('.grid_cell'), function(i){ i.removeClass('grid_cell_hidden'); })
        }
    }
});

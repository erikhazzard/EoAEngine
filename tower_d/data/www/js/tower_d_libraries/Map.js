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
        cell_size: 24,

        //Store a grid of all the cell objects. Should match up exactly
        //  to this.options.grid
        cell_objects_grid: [[]],

        //store a path
        path: [ //Top Left > Down
                [1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9],
                [1,10], [1,11],[1,12],[1,13],[1,14],[1,15],[1,16],[1,17],
                //Bottom Left > Right
                [2,17],[3,17],[4,17],[5,17],[6,17],[7,17],[8,17],
                //Middle Left > Up
                [8,16],[8,15],[8,14],[8,13],[8,12],[8,11],[8,10],[8,9],[8,8],
                [8,7],[8,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],
                //Top Middle > Right
                [9,0],[10,0],[11,0],[12,0],[13,0],[14,0],[15,0],[16,0],
                //Right Middle > Down
                [16,1],[16,2],[16,3],[16,4],[16,5],[16,6],[16,7],[16,8],
                [16,9],[16,10],[16,11],[16,12],[16,13],[16,14],[16,15],
                [16,16],[16,17],
                //Right Bottom > Right
                [17,17],[18,17],[18,17],[19,17],[20,17],[21,17],[22,17],
                [23,17],[24,17],
                //Right Bottom > Top Right (To Goal)
                [24,16],[24,15],[24,14],[24,13],[24,12],[24,11],[24,10],
                [24,9],[24,8],[24,7],[24,6],[24,5],[24,4],[24,3],[24,2],
                [24,1],[24,0]
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
                [0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
                [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],
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

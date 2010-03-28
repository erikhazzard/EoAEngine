/*===========================================================================

  End of Ages Game Main JS file

  This file is used sitewide

=============================================================================*/
/*================================
 *  Add tips 
 * ===============================*/
var Tool_Tips = {}; 

/*===========================================================================

  On DOMReady Events

=============================================================================*/
window.addEvent('domready', function(){
    /*================================
     *  Hide all hidden elements 
     * ===============================*/
    $$('.hidden_element').setStyle('opacity',0);
    
    //Add Tool Tips
    Tool_Tips = new Tips($$('.tool_tip'),{
            className: 'tool_tip_custom',
            fixed: true
    });
})

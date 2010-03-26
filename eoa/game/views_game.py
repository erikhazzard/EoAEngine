"""==========================================================================
                                                                                                       
views_game.py

contains all our functions relating to the game

TODO (Soon)
    -Make this extensible, turn some of this stuff into apps - e.g. Character
============================================================================="""
from views_utils import *

'''========================================================================

Functions

==========================================================================='''
"""-----------------
Information related
--------------------"""

def get_character_info(request):
    """Returns some character information for the logged in character"""
    
    #Set the character's color
    character = Character.objects.filter(is_logged_in=True,
                account=request.user.get_profile())[0]
    character_color = character.color
    character_pos_x = character.pos_x
    character_pos_y = character.pos_y

    #Build a javascript string with some info
    res = "var character_color = '#" + character_color + "';"
    res += "var character_pos_x = '" + str(character_pos_x) + "px' ;"
    res += "var character_pos_y = '" + str(character_pos_y) + "px' ;"

    return HttpResponse(res)

def heartbeat(request):
    """Returns a list of logged in users"""

    characters = Character.objects.all()

    #Set the current time
    now = datetime.datetime.now()

    #Subtract the delay of the request made to this function
    time_test = now - datetime.timedelta(minutes=2)
    
    messages = ServerLog.objects.filter(message_time__gte=time_test)

    #Create a list of active characters
    active_characters = []

    #Get only active characters - do this better...
    for i in characters:
        if i.last_update > time_test:
            active_characters.append(i)

    res = "var char_array = [];\n"

    for i in active_characters:
        if i.name != request.user.username:
            #Don't count characters attached to the logged in user
            res += "char_array.push(['" + i.name + "', '" + str(i.pos_x) +\
                            "', '" + str(i.pos_y) + "','" + i.color +\
                            "']);\n"

            
        
    return HttpResponse(res)   

"""-----------------
Character functions
--------------------"""
def move(request):
    #Get the direction
    dir = cgi.escape(request.POST['dir'])
    #Get the character associated with the user
    char = Character.objects.get(account=request.user)
 
    #move_amount is how much to move the character
    #   this should be calculated based off db (run speed of character)
    move_amount = 5

    #Update the stored position
    #Because our coordinate system starts at 0,0 in the top left, when the 
    #   character presses up they are decreasing their position in the y dir
    if dir == 'up':
        char.pos_y -= move_amount
    elif dir == 'down':
        char.pos_y += move_amount
    elif dir == 'right':
        char.pos_x += move_amount
    elif dir == 'left':
        char.pos_x -= move_amount

    char.connected = True

    #Save the character position
    char.save()
   
    #Return the x or y position based on direction passed in
    #   Used mainly for debugging
    if dir == 'up' or dir == 'down':
        res = "x:%s" % (char.pos_y)

    if dir == 'left' or dir == 'right':
        res = "x:%s" % (char.pos_x)

    return HttpResponse(res)

"""-----------------
Chat related
--------------------"""
def chat_heartbeat(request):
    """Grabs the last message from the server"""

    #Set the current time
    now = datetime.datetime.now()

    #Subtract the delay of the request made to this function
    time_test = now - datetime.timedelta(seconds=.5)
    
    #Get all the messages that haven't been sent
    messages = ServerLog.objects.filter(message_time__gte=time_test)

    #Build response string
    res = "var chat_messages = ''"

    if len(messages) > 0:
        res = "var chat_messages = new Array();\n"

        for i in messages:
            cur_character = Character.objects.filter(is_logged_in=True,
                account=i.author)[0]
            cur_character_color = cur_character.color
            #Loop through all returned messages
            res += "chat_messages.push(['" + i.author.username + "', '" + \
                                        i.message + "', '" + \
                                        cur_character_color + "']);\n"

    res += "//%s" % (time_test)

    return HttpResponse(res)

def chat_send_message(request):
    """Updates the ServerLog"""
    
    #Get the message sent
    sent_message = cgi.escape(request.POST['sent_message'])

    #Create a new ServerLog object
    new_message = ServerLog(author=request.user, message=sent_message)
    new_message.save()

    #setup a respone
    res = 'Success'

    return HttpResponse(res)

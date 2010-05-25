import unittest
                                                 
from custom_exceptions import *
import Tower, Map, Cell, Player, Creep

TYPES = ('damage', 'delay', 'range',
        'elemental_dark', 'elemental_earth',
        'elemental_fire', 'elemental_light',
        'elemental_water', 'elemental_wind')

test_player = Player.Player()
'''--------------------------------------
Tower Tests
-----------------------------------------'''
class testTower(unittest.TestCase):
    '''Test for tower'''
    def setUp(self):
        self.tower = Tower.Tower()

    def test_calc_upgrade_cost(self):
        #Try to calc the cost of damage
        self.tower.calc_upgrade_cost('damage')

        #Make sure values are right
        damage_level = self.tower.attributes['damage']['level']
        assert damage_level is not None

        damage_mod = self.tower.attributes['damage']['modifier']
        assert damage_mod is not None

        base_cost = self.tower.tower_base_cost
        assert base_cost >= 0

        cost = int(base_cost + round(damage_mod ** damage_level))

        self.assertEqual(cost, self.tower.calc_upgrade_cost('damage'))

    def test_calculate_cells_in_range(self):
        '''Tests the function that grabs all the cells in a radius around
        the tower'''
        #Cannot pass in an empty cell grid object
        self.assertRaises(EmptyCellGrid, self.tower.update_cells_in_range)
        
        #Create a dummy cell objects grid to pass in
        map_object = Map.Map()
        cell_objects_grid = map_object.cell_objects
        #This is testing the map object, so technically it shouldnt really
        #   be here
        assert cell_objects_grid is not None

        #With default position of 0,0
        new_cells_in_range = self.tower.update_cells_in_range(
                cell_grid=cell_objects_grid)
        assert new_cells_in_range is not None

        #With position of 4,4
        self.tower.pos_i = 4
        self.tower.pos_j = 4
        new_cells_in_range = self.tower.update_cells_in_range(
                cell_grid=cell_objects_grid)
        assert new_cells_in_range is not None

        #With large radius
        self.tower_radius = 10
        new_cells_in_range = self.tower.update_cells_in_range(
                cell_grid=cell_objects_grid)
        assert new_cells_in_range is not None

        #With really big radius
        self.tower_radius = 100
        new_cells_in_range = self.tower.update_cells_in_range(
                cell_grid=cell_objects_grid)
        assert new_cells_in_range is not None


    def test_upgrade(self):
        #Try to upgrade with some dummy value
        self.tower.upgrade('damage',20)

    def test_attack(self):
        #Test the attack method of a tower
        self.tower.attack((0,0))

    def tearDown(self):
        self.tower = None

'''--------------------------------------
Map Tests
-----------------------------------------'''
class testMap(unittest.TestCase):
    def setUp(self):
        self.map = Map.Map()

    def test_createCellObjects(self):
        self.map.create_cells()

    def test_verifyCellObjects(self):
        #Get cell value of grid
        assert self.map.grid is not None
        
        cell_value = self.map.grid[1][1]
        assert cell_value is not None
        #Make sure cell values match
        self.assertEqual(self.map.cell_objects[1][1].cell_value, 
                cell_value)

        #Do this again, but do the opposite check
        cell_value = self.map.grid[1][2]
        assert cell_value is not None
        #Make sure the cell_value does not match 
        self.assertNotEqual(self.map.cell_objects[1][2].cell_value, 
                cell_value + 1)

    def tearDown(self):
        self.map = None

'''--------------------------------------
Cell Tests
-----------------------------------------'''
class testCell(unittest.TestCase):
    def setUp(self):
        self.cell = Cell.Cell()

    def test_adoptTower(self):
        #Try to adopt a tower
        self.cell.adopt_tower()

    def test_adoptTowerInvalidPlacement(self):
        self.cell.cell_value = 1
        self.assertRaises(CellOccupiedError,
                self.cell.adopt_tower)

    def tearDown(self):
        self.cell = None

'''--------------------------------------
Player Tests
-----------------------------------------'''
class testPlayer(unittest.TestCase):
    def setUp(self):
        self.player = Player.Player()

    def test_updateGold(self):
        assert self.player.gold is not None
        old_gold_amount = self.player.gold
        self.assertEqual(self.player.update_gold(40),
                old_gold_amount + 40)

    def test_updateHealth(self):
        assert self.player.health is not None
        #Get player health
        health = self.player.health

        self.assertEqual(self.player.update_health(-5), health - 5)

        self.player.health = 10
        self.assertEqual(self.player.update_health(9), 19)
    
    def test_destroy(self):
        self.assertRaises(PlayerDefeated,
                self.player.destroy)

    def tearDown(self):
        self.Player = None

'''--------------------------------------
Creep Tests
-----------------------------------------'''
class testCreep(unittest.TestCase):
    def setUp(self):
        self.creep = Creep.Creep() 

    def test_moveTest(self):
        #Create a dummy path
        path = ((0,1),(0,2),(0,3),(0,4),(0,5))

        self.creep.move(path)
        self.creep.move(path)
        self.creep.move(path)
        self.creep.move(path)
        self.creep.move(path)
        self.creep.move(path)
        self.creep.move(path)

    def test_reachedGoal(self):
        self.creep.reached_goal()

    def test_removeCreep(self):
        self.creep.destroy()

    def test_updateHealth(self):
        assert self.creep.health is not None
        self.creep.health = 20
        self.assertEqual(self.creep.update_health(-4),
            16)
        
        #Health = 0
        self.creep.health = 4
        #Should return none
        self.assertEqual(self.creep.update_health(-4),
            None)

        #Health = Below 0
        self.creep.health = 1
        #Should return none
        self.assertEqual(self.creep.update_health(-4),
            None)

    def tearDown(self):
        self.creep = None

if __name__ == '__main__':
    unittest.main()

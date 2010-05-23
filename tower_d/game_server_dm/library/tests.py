import unittest
from custom_exceptions import *
import Tower, Map, Cell

TYPES = ('damage', 'delay', 'range',
        'elemental_dark', 'elemental_earth',
        'elemental_fire', 'elemental_light',
        'elemental_water', 'elemental_wind')

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

    def test_upgrade(self):
        #Try to upgrade with some dummy value
        self.tower.upgrade('damage',20)

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


if __name__ == '__main__':
    unittest.main()

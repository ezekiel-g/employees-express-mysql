const employeeRouter = require('express').Router()
const employeeController = require('../controllers/employeeController')

employeeRouter.get('/', employeeController.getEmployees)
employeeRouter.get('/:id', employeeController.getEmployee)
employeeRouter.post('/', employeeController.addEmployee)
employeeRouter.put('/:id', employeeController.editEmployee)
employeeRouter.delete('/:id', employeeController.deleteEmployee)

module.exports = employeeRouter

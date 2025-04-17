const departmentRouter = require('express').Router()
const departmentController = require('../controllers/departmentController')

departmentRouter.get('/', departmentController.getDepartments)
departmentRouter.get('/:id', departmentController.getDepartment)
departmentRouter.post('/', departmentController.addDepartment)
departmentRouter.put('/:id', departmentController.editDepartment)
departmentRouter.delete('/:id', departmentController.deleteDepartment)

module.exports =  departmentRouter

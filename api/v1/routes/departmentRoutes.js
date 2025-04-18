import express from 'express'
import departmentController from '../controllers/departmentController.js'

const departmentRouter = express.Router()

departmentRouter.get('/', departmentController.getDepartments)
departmentRouter.get('/:id', departmentController.getDepartment)
departmentRouter.post('/', departmentController.addDepartment)
departmentRouter.put('/:id', departmentController.editDepartment)
departmentRouter.delete('/:id', departmentController.deleteDepartment)

export default departmentRouter

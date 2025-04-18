import dbConnection from '../database/database.js'

const queries = {
    getDepartments: `SELECT id, name, code, location, is_active 
                     FROM departments`,                     
    getDepartment: `SELECT id, name, code, location, is_active 
                    FROM departments 
                    WHERE id = ?`,                   
    addDepartment: `INSERT INTO departments (name, code, location, is_active) 
                    VALUES (?, ?, ?, ?)`,               
    editDepartment: `UPDATE departments 
                    SET name = ?, code = ?, location = ?, is_active = ? 
                    WHERE id = ?`,         
    deleteDepartment: `DELETE FROM departments 
                      WHERE id = ?`
}

const handleError = (response, error) => {
    let statusCode = 500
    let message = 'Unexpected error'

    if (error.code === 'ER_DUP_ENTRY') {
        statusCode = 400
        message = 'Duplicate entry'
    } else if (error.code === 'ER_BAD_NULL_ERROR') {
        statusCode = 400
        message = 'Missing required field'
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400
        message = 'Invalid reference to another table'
    } else if (error.code === 'ER_ROW_IS_REFERENCED_2') {
        statusCode = 409
        message = 'Cannot delete department with related records'
    }

    console.error('Error: ', error.message)
    return response.status(statusCode).json({ message })
}

const getDepartments = async (request, response) => {
    try {
        const rows = await dbConnection.execute(queries.getDepartments)
        response.status(200).json(rows[0])
    } catch (error) {
        return handleError(response, error)
    }
}

const getDepartment = async (request, response) => {
    const { id } = request.params

    try {
        const rows = await dbConnection.execute(queries.getDepartment, [id])
        if (rows[0].length === 0) {
            return response.status(404).json({ message: 'Department not found' })
        }

        return response.status(200).json(rows[0][0])
    } catch (error) {
        return handleError(response, error)
    }
}

const addDepartment = async (request, response) => {
    const { name, code, location, is_active } = request.body

    try {
        const result = await dbConnection.execute(
            queries.addDepartment, [name, code, location, is_active]
        )

        return response.status(201).json({
            message: 'Department added successfully',
            department: {
                id: result[0].insertId,
                name,
                code,
                location,
                is_active
            }
        })
    } catch (error) {
        return handleError(response, error)
    }
}

const editDepartment = async (request, response) => {
    const { id } = request.params
    const { name, code, location, is_active } = request.body

    try {
        const result = await dbConnection.execute(
            queries.editDepartment, [name, code, location, is_active, id]
        )

        if (result[0].affectedRows === 0) {
            return response.status(404).json({ message: 'Department not found' })
        }

        return response.status(200).json({
            message: 'Department updated successfully',
            department: {
                id,
                name,
                code,
                location,
                is_active
            }
        })
    } catch (error) {
        return handleError(response, error)
    }
}

const deleteDepartment = async (request, response) => {
    const { id } = request.params

    try {
        const result = await dbConnection.execute(queries.deleteDepartment, [id])

        if (result[0].affectedRows === 0) {
            return response.status(404).json({ message: 'Department not found' })
        }

        return response.status(200).json({ message: 'Department deleted successfully' })
    } catch (error) {
        return handleError(response, error)
    }
}

export default {
    getDepartments,
    getDepartment,
    addDepartment,
    editDepartment,
    deleteDepartment
}

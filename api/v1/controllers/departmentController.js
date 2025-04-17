const dbConnection = require('../database/database')

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

const validateLocation = input => {
    const validLocations = new Set(['New York', 'San Francisco', 'London'])
    return validLocations.has(input)
}

const getDepartments = async (request, response) => {
    try {
        const rows = await dbConnection.execute(queries.getDepartments)
        response.status(200).json(rows[0])
    } catch (error) {
        console.error('Error querying database: ', error.message)
        response.status(500).json({ message: 'Error querying database' })
    }
}

const getDepartment = async (request, response) => {
    const { id } = request.params
    if (!id) { return response.status(400).json({ message: 'ID required' }) }

    try {
        const rows = await dbConnection.execute(queries.getDepartment, [id])
        if (rows[0].length === 0) {
            return response.status(404).json({ message: 'Not found' })
        }

        return response.status(200).json(rows[0][0])
    } catch (error) {
        console.error('Error querying database: ', error.message)
        return response.status(500).json({ message: 'Error querying database' })
    }
}

const addDepartment = async (request, response) => {
    const { name, code, location, is_active } = request.body

    if (!name || !code || !location) {
        return response.status(400).json({ message: 'All fields required' })
    }

    if (!validateLocation(location)) {
        return response.status(400).json({ message: 'Invalid location' })
    }

    const isActiveValue = is_active === undefined ? true : is_active

    try {
        const result = await dbConnection.execute(
            queries.addDepartment, [name, code, location, isActiveValue]
        )

        return response.status(201).json({
            message: 'Department added successfully',
            department: {
                id: result[0].insertId,
                name,
                code,
                location,
                is_active: isActiveValue
            }
        })
    } catch (error) {
        console.error('Error querying database: ', error.message)
        return response.status(500).json({ message: 'Error querying database' })
    }
}

const editDepartment = async (request, response) => {
    const { id } = request.params
    const { name, code, location, is_active } = request.body

    if (!name || !code || !location) {
        return response.status(400).json({ message: 'All fields required' })
    }

    if (!validateLocation(location)) {
        return response.status(400).json({ message: 'Invalid location' })
    }

    const isActiveValue = is_active === undefined ? true : is_active

    try {
        const result = await dbConnection.execute(
            queries.editDepartment, [name, code, location, isActiveValue, id]
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
                is_active: isActiveValue
            }
        })
    } catch (error) {
        console.error('Error querying database: ', error.message)
        return response.status(500).json({ message: 'Error querying database' })
    }
}

const deleteDepartment = async (request, response) => {
    const { id } = request.params
    if (!id) { return response.status(400).json({ message: 'ID required' }) }

    try {
        const result = await dbConnection.execute(queries.deleteDepartment, [id])

        if (result[0].affectedRows === 0) {
            return response.status(404).json({ message: 'Department not found' })
        }

        return response.status(200).json({ message: 'Department deleted successfully' })
    } catch (error) {
        console.error('Error querying database: ', error.message)
        return response.status(500).json({ message: 'Error querying database' })
    }
}

module.exports = {
    getDepartments,
    getDepartment,
    addDepartment,
    editDepartment,
    deleteDepartment
}

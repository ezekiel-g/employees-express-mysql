import dbConnection from '../database/database.js'

const queries = {
    getEmployees: `SELECT id, first_name, last_name, email, hire_date, 
                   department_id, country_code, phone_number, is_active 
                   FROM employees`,
    getEmployee: `SELECT id, first_name, last_name, email, hire_date, 
                  department_id, country_code, phone_number, is_active 
                  FROM employees 
                  WHERE id = ?`,
    addEmployee: `INSERT INTO employees (first_name, last_name, email, 
                  hire_date, department_id, country_code, phone_number, 
                  is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    editEmployee: `UPDATE employees 
                   SET first_name = ?, last_name = ?, email = ?, hire_date = ?, 
                   department_id = ?, country_code = ?, phone_number = ?, 
                   is_active = ? WHERE id = ?`,
    deleteEmployee: `DELETE FROM employees 
                     WHERE id = ?`
}

const handleError = (response, error) => {
    let statusCode = 500
    let message = 'Unexpected error occurred'

    if (error.code === 'ER_DUP_ENTRY') {
        statusCode = 400
        message = 'Duplicate entry: ' + error.message
    } else if (error.code === 'ER_BAD_NULL_ERROR') {
        statusCode = 400
        message = 'Missing required field'
    } else if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400
        message = 'Invalid department ID'
    }

    console.error('Error: ', error.message)
    return response.status(statusCode).json({ message })
}

const getEmployees = async (request, response) => {
    try {
        const rows = await dbConnection.execute(queries.getEmployees)
        response.status(200).json(rows[0])
    } catch (error) {
        return handleError(response, error)
    }
}

const getEmployee = async (request, response) => {
    const { id } = request.params

    try {
        const rows = await dbConnection.execute(queries.getEmployee, [id])
        if (rows[0].length === 0) {
            return response.status(404).json({ message: 'Employee not found' })
        }
        return response.status(200).json(rows[0][0])
    } catch (error) {
        return handleError(response, error)
    }
}

const addEmployee = async (request, response) => {
    const {
        first_name,
        last_name,
        email,
        hire_date,
        department_id,
        country_code,
        phone_number,
        is_active
    } = request.body

    try {
        const result = await dbConnection.execute(
            queries.addEmployee, [
                first_name,
                last_name,
                email,
                hire_date,
                department_id,
                country_code,
                phone_number,
                is_active
            ]
        )

        return response.status(201).json({
            message: 'Employee added successfully',
            employee: {
                id: result[0].insertId,
                first_name,
                last_name,
                email,
                hire_date,
                department_id,
                country_code,
                phone_number,
                is_active
            }
        })
    } catch (error) {
        return handleError(response, error)
    }
}

const editEmployee = async (request, response) => {
    const { id } = request.params
    const {
        first_name,
        last_name,
        email,
        hire_date,
        department_id,
        country_code,
        phone_number,
        is_active
    } = request.body

    try {
        const result = await dbConnection.execute(
            queries.editEmployee, [
                first_name,
                last_name,
                email,
                hire_date,
                department_id,
                country_code,
                phone_number,
                is_active,
                id
            ]
        )

        if (result[0].affectedRows === 0) {
            return response.status(404).json({ message: 'Employee not found' })
        }

        return response.status(200).json({
            message: 'Employee updated successfully',
            employee: {
                id,
                first_name,
                last_name,
                email,
                hire_date,
                department_id,
                country_code,
                phone_number,
                is_active
            }
        })
    } catch (error) {
        return handleError(response, error)
    }
}

const deleteEmployee = async (request, response) => {
    const { id } = request.params

    try {
        const result = await dbConnection.execute(queries.deleteEmployee, [id])

        if (result[0].affectedRows === 0) {
            return response.status(404).json({ message: 'Employee not found' })
        }

        return response.status(200).json({ message: 'Employee deleted successfully' })
    } catch (error) {
        return handleError(response, error)
    }
}

export default {
    getEmployees,
    getEmployee,
    addEmployee,
    editEmployee,
    deleteEmployee
}

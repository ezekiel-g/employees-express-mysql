const dbConnection = require('../database/database')

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

const validateEmail = input => {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    return regex.test(input)
}

const validatePhoneNumber = input => {
    const regex = /^[0-9]{7,15}$/
    return regex.test(input)
}

const validateCountryCode = input => {
    const regex = /^[0-9]{1,4}$/
    return regex.test(input)
}

const getEmployees = async (request, response) => {
    try {
        const rows = await dbConnection.execute(queries.getEmployees)
        response.status(200).json(rows[0])
    } catch (error) {
        console.error('Error querying database: ', error)
        response.status(500).json({ message: 'Error querying database' })
    }
}

const getEmployee = async (request, response) => {
    const { id } = request.params
    if (!id) {
        return response.status(400).json({ message: 'ID required' })
    }

    try {
        const rows = await dbConnection.execute(queries.getEmployee, [id])
        if (rows[0].length === 0) {
            return response.status(404).json({ message: 'Not found' })
        }
        return response.status(200).json(rows[0][0])
    } catch (error) {
        console.error('Error querying database: ', error)
        return response.status(500).json({ message: 'Error querying database' })
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

    if (
        !first_name ||
        !last_name ||
        !email ||
        !hire_date ||
        !country_code ||
        !phone_number
    ) {
        return response.status(400).json({ message: 'All fields required' })
    }

    if (!validateEmail(email)) {
        return response.status(400).json({ message: 'Invalid email format' })
    }
    if (!validatePhoneNumber(phone_number)) {
        return response.status(400).json({ message: 'Invalid phone number format' })
    }
    if (!validateCountryCode(country_code)) {
        return response.status(400).json({ message: 'Invalid country code format' })
    }

    const isActiveValue = is_active === undefined ? true : is_active

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
                isActiveValue
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
                is_active: isActiveValue
            }
        })
    } catch (error) {
        console.error('Error querying database: ', error)
        return response.status(500).json({ message: 'Error querying database' })
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

    if (
        !first_name ||
        !last_name ||
        !email ||
        !hire_date ||
        !country_code ||
        !phone_number
    ) {
        return response.status(400).json({ message: 'All fields required' })
    }

    if (!validateEmail(email)) {
        return response.status(400).json({ message: 'Invalid email format' })
    }
    if (!validatePhoneNumber(phone_number)) {
        return response.status(400).json({ message: 'Invalid phone number format' })
    }
    if (!validateCountryCode(country_code)) {
        return response.status(400).json({ message: 'Invalid country code format' })
    }

    const isActiveValue = is_active === undefined ? true : is_active

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
                isActiveValue,
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
                is_active: isActiveValue
            }
        })
    } catch (error) {
        console.error('Error querying database: ', error)
        return response.status(500).json({ message: 'Error querying database' })
    }
}

const deleteEmployee = async (request, response) => {
    const { id } = request.params
    if (!id) {
        return response.status(400).json({ message: 'ID required' })
    }

    try {
        const result = await dbConnection.execute(queries.deleteEmployee, [id])

        if (result[0].affectedRows === 0) {
            return response.status(404).json({ message: 'Employee not found' })
        }

        return response.status(200).json({ message: 'Employee deleted successfully' })
    } catch (error) {
        console.error('Error querying database: ', error)
        return response.status(500).json({ message: 'Error querying database' })
    }
}

module.exports = {
    getEmployees,
    getEmployee,
    addEmployee,
    editEmployee,
    deleteEmployee
}

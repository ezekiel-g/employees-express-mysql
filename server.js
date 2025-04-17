require('dotenv').config()
const express = require('express')
const departmentRoutes = require('./api/v1/routes/departmentRoutes')
const employeeRoutes = require('./api/v1/routes/employeeRoutes')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/v1/departments', departmentRoutes)
app.use('/api/v1/employees', employeeRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

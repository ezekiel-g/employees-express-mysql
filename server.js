import dotenv from 'dotenv'
import express from 'express'
import departmentRoutes from './api/v1/routes/departmentRoutes.js'
import employeeRoutes from './api/v1/routes/employeeRoutes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use('/api/v1/departments', departmentRoutes)
app.use('/api/v1/employees', employeeRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

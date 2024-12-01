import express from 'express'
import cors from 'cors'
import fileRoutes from './router/fileRoutes.js'
import authRotes from './router/authRoutes.js'
import cookieParser from "cookie-parser";


const app = express()
const PORT = 3000

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))

app.use('/api', fileRoutes)
app.use('/api', authRotes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

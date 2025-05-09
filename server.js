/*********************************************************************************
 * WEB700 – Assignment 05
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
 * of this assignment has been copied manually or electronically from any other source
 * (including 3rd party web sites) or distributed to other students.
 *
 * Name: Dinh Khoa Chau Student ID: 174120238 Date: 2025-03-20
 * Online (Vercel) Link: https://web700-a5.vercel.app/
 ********************************************************************************/

const express = require('express')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const collegeData = require('./modules/collegeData')

const app = express()
const HTTP_PORT = process.env.PORT || 8080
// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }))

// Set up static folder
app.use(express.static(path.join(__dirname, 'public')))

// Set up EJS with layouts
app.use(expressLayouts)
app.set('layout', 'layouts/main')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(function (req, res, next) {
  let route = req.path.substring(1)
  app.locals.activeRoute =
    '/' +
    (isNaN(route.split('/')[1])
      ? route.replace(/\/(?!.*)/, '')
      : route.replace(/\/(.*)/, ''))

  res.locals.equal = function (lvalue, rvalue, options) {
    if (arguments.length < 3)
      throw new Error('EJS Helper equal needs 2 parameters')
    if (lvalue != rvalue) {
      return options.inverse(this)
    } else {
      return options.fn(this)
    }
  }

  next()
})

// Routes
app.get('/', (req, res) => {
  res.render('home')
})

app.get('/about', (req, res) => {
  res.render('about')
})

app.get('/htmlDemo', (req, res) => {
  res.render('htmlDemo')
})

app.get('/students', (req, res) => {
  collegeData
    .getAllStudents()
    .then((data) => {
      res.render('students', { students: data })
    })
    .catch((err) => {
      res.render('students', { message: 'no results' })
    })
})

app.get('/courses', (req, res) => {
  collegeData
    .getCourses()
    .then((data) => {
      if (data.length > 0) {
        res.render('courses', { courses: data })
      } else {
        // Pass an empty array rather than no courses variable
        res.render('courses', { courses: [], message: 'no results' })
      }
    })
    .catch((err) => {
      res.render('courses', { courses: [], message: 'no results' })
    })
})

app.get('/course/:id', (req, res) => {
  collegeData
    .getCourseById(req.params.id)
    .then((course) => res.render('course', { course: course }))
    .catch(() => res.render('course', { message: 'no results' }))
})

app.get('/course/delete/:id', (req, res) => {
  collegeData
    .deleteCourseById(req.params.id)
    .then(() => {
      res.redirect('/courses')
    })
    .catch((err) => {
      res.status(500).send('Unable to Remove Course / Course not found')
    })
})

app.get('/student/:num', (req, res) => {
  collegeData
    .getStudentByNum(req.params.num)
    .then((student) => res.render('student', { student: student }))
    .catch(() => res.json({ message: 'no results' }))
})

app.get('/students/add', (req, res) => {
  collegeData
    .getCourses()
    .then((data) => {
      res.render('addStudent', { courses: data })
    })
    .catch(() => {
      res.render('addStudent', { courses: [] })
    })
})

app.post('/students/add', (req, res) => {
  collegeData
    .addStudent(req.body)
    .then(() => {
      res.redirect('/students')
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send('Error adding student')
    })
})

app.get('/student/delete/:studentNum', (req, res) => {
  collegeData
    .deleteStudentByNum(req.params.studentNum)
    .then(() => {
      res.redirect('/students')
    })
    .catch((err) => {
      res.status(500).send('Unable to Remove Student / Student not found')
    })
})

app.post('/student/update', (req, res) => {
  collegeData
    .updateStudent(req.body)
    .then(() => {
      res.redirect('/students')
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send('Error updating student')
    })
})

app.get('/courses/add', (req, res) => {
  res.render('addCourse')
})

app.post('/courses/add', (req, res) => {
  collegeData
    .addCourse(req.body)
    .then(() => {
      res.redirect('/courses')
    })
    .catch((err) => {
      res.status(500).send('Unable to Add Course')
    })
})

// 404 route - must be last!
app.use((req, res) => {
  res.status(404).send('Page Not Found')
})

// Initialize the data before starting the server
collegeData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log('Server listening on port: ' + HTTP_PORT)
    })
  })
  .catch((err) => {
    console.error(`Failed to initialize data: ${err}`)
  })

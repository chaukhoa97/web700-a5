const fs = require('fs')
const path = require('path')

class Data {
  constructor(students, courses) {
    this.students = students
    this.courses = courses
  }
}

let dataCollection = null

function initialize() {
  return new Promise((resolve, reject) => {
    const studentsPath = path.join(__dirname, '..', 'data', 'students.json')
    const coursesPath = path.join(__dirname, '..', 'data', 'courses.json')

    fs.readFile(studentsPath, 'utf8', (err, studentData) => {
      if (err) {
        reject('unable to read students.json')
        return
      }

      fs.readFile(coursesPath, 'utf8', (err, courseData) => {
        if (err) {
          reject('unable to read courses.json')
          return
        }

        const students = JSON.parse(studentData)
        const courses = JSON.parse(courseData)
        dataCollection = new Data(students, courses)
        resolve()
      })
    })
  })
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (dataCollection?.students?.length) {
      resolve(dataCollection.students)
    } else {
      reject('no results returned')
    }
  })
}

function getTAs() {
  return new Promise((resolve, reject) => {
    if (dataCollection?.students) {
      const tas = dataCollection.students.filter((s) => s.TA)
      tas.length > 0 ? resolve(tas) : reject('no results returned')
    } else {
      reject('no results returned')
    }
  })
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (dataCollection?.courses?.length) {
      resolve(dataCollection.courses)
    } else {
      reject('no results returned')
    }
  })
}

function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    if (dataCollection?.students) {
      const studentsByCourse = dataCollection.students.filter(
        (student) => student.course == course
      )
      studentsByCourse.length > 0
        ? resolve(studentsByCourse)
        : reject('no results returned')
    } else {
      reject('no results returned')
    }
  })
}

function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    if (dataCollection?.students) {
      const student = dataCollection.students.find((s) => s.studentNum == num)
      student ? resolve(student) : reject('no results returned')
    } else {
      reject('no results returned')
    }
  })
}

function getCourseById(id) {
  return new Promise((resolve, reject) => {
    if (dataCollection?.courses) {
      const course = dataCollection.courses.find((c) => c.courseId == id)
      course ? resolve(course) : reject('no results returned')
    } else {
      reject('no results returned')
    }
  })
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    if (studentData) {
      // Set TA status
      studentData.TA = studentData.TA ? true : false

      // Set student number
      studentData.studentNum = dataCollection.students.length + 1

      // Add the student to the array
      dataCollection.students.push(studentData)
      resolve()
    } else {
      reject('error: invalid student data')
    }
  })
}

function updateStudent(studentData) {
  return new Promise((resolve, reject) => {
    if (studentData) {
      // Handle the TA checkbox - if it's undefined, set it to false
      studentData.TA = studentData.TA ? true : false

      // Find the student by studentNum
      const index = dataCollection.students.findIndex(
        (student) => student.studentNum == studentData.studentNum
      )

      if (index !== -1) {
        // Update the student
        dataCollection.students[index] = studentData
        resolve()
      } else {
        reject('student not found')
      }
    } else {
      reject('error: invalid student data')
    }
  })
}

module.exports = {
  initialize,
  getAllStudents,
  getTAs,
  getCourses,
  getStudentsByCourse,
  getStudentByNum,
  getCourseById,
  addStudent,
  updateStudent,
}

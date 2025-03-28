const Sequelize = require('sequelize')
var sequelize = new Sequelize('neondb', 'neondb_owner', 'npg_Y3j5spdQUFCa', {
  host: 'ep-red-cake-a4yf9wqv-pooler.us-east-1.aws.neon.tech',
  dialect: 'postgres',
  port: 5432,
  dialectModule: require('pg'),
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
  query: { raw: true },
})

const Student = sequelize.define('Student', {
  studentNum: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressProvince: Sequelize.STRING,
  TA: Sequelize.BOOLEAN,
  status: Sequelize.STRING,
})

const Course = sequelize.define('Course', {
  courseId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: Sequelize.STRING,
  courseDescription: Sequelize.STRING,
})

Course.hasMany(Student, { foreignKey: 'course' })

function initialize() {
  return new Promise(function (resolve, reject) {
    sequelize
      .sync()
      .then(() => {
        resolve()
      })
      .catch((err) => {
        reject('unable to sync the database')
      })
  })
}

function getAllStudents() {
  return new Promise(function (resolve, reject) {
    Student.findAll()
      .then((data) => {
        if (data.length > 0) {
          resolve(data)
        } else {
          reject('no results returned')
        }
      })
      .catch(() => {
        reject('no results returned')
      })
  })
}

function getTAs() {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      where: {
        TA: true,
      },
    })
      .then((data) => {
        if (data.length > 0) {
          resolve(data)
        } else {
          reject('no results returned')
        }
      })
      .catch(() => {
        reject('no results returned')
      })
  })
}

function getCourses() {
  return new Promise(function (resolve, reject) {
    Course.findAll()
      .then((data) => {
        if (data.length > 0) {
          resolve(data)
        } else {
          reject('no results returned')
        }
      })
      .catch(() => {
        reject('no results returned')
      })
  })
}

function getStudentsByCourse(course) {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      where: {
        course: course,
      },
    })
      .then((data) => {
        if (data.length > 0) {
          resolve(data)
        } else {
          reject('no results returned')
        }
      })
      .catch(() => {
        reject('no results returned')
      })
  })
}

function getStudentByNum(num) {
  return new Promise(function (resolve, reject) {
    Student.findAll({
      where: {
        studentNum: num,
      },
    })
      .then((data) => {
        if (data.length > 0) {
          resolve(data[0])
        } else {
          reject('no results returned')
        }
      })
      .catch(() => {
        reject('no results returned')
      })
  })
}

function getCourseById(id) {
  return new Promise(function (resolve, reject) {
    Course.findAll({
      where: {
        courseId: id,
      },
    })
      .then((data) => {
        if (data.length > 0) {
          resolve(data[0])
        } else {
          reject('no results returned')
        }
      })
      .catch(() => {
        reject('no results returned')
      })
  })
}

function addStudent(studentData) {
  return new Promise(function (resolve, reject) {
    studentData.TA = studentData.TA ? true : false
    for (let prop in studentData) {
      if (studentData[prop] === '') {
        studentData[prop] = null
      }
    }
    Student.create(studentData)
      .then(() => {
        resolve()
      })
      .catch(() => {
        reject('unable to create student')
      })
  })
}

function updateStudent(studentData) {
  return new Promise(function (resolve, reject) {
    studentData.TA = studentData.TA ? true : false
    for (let prop in studentData) {
      if (studentData[prop] === '') {
        studentData[prop] = null
      }
    }
    Student.update(studentData, {
      where: { studentNum: studentData.studentNum },
    })
      .then(() => {
        resolve()
      })
      .catch(() => {
        reject('unable to update student')
      })
  })
}

function addCourse(courseData) {
  return new Promise(function (resolve, reject) {
    for (let prop in courseData) {
      if (courseData[prop] === '') {
        courseData[prop] = null
      }
    }
    Course.create(courseData)
      .then(() => {
        resolve()
      })
      .catch(() => {
        reject('unable to create course')
      })
  })
}

function updateCourse(courseData) {
  return new Promise(function (resolve, reject) {
    for (let prop in courseData) {
      if (courseData[prop] === '') {
        courseData[prop] = null
      }
    }
    Course.update(courseData, {
      where: { courseId: courseData.courseId },
    })
      .then(() => {
        resolve()
      })
      .catch(() => {
        reject('unable to update course')
      })
  })
}

function deleteCourseById(id) {
  return new Promise(function (resolve, reject) {
    Course.destroy({
      where: { courseId: id },
    })
      .then(() => {
        resolve()
      })
      .catch(() => {
        reject('unable to delete course')
      })
  })
}

function deleteStudentByNum(studentNum) {
  return new Promise(function (resolve, reject) {
    Student.destroy({
      where: { studentNum: studentNum },
    })
      .then(() => {
        resolve()
      })
      .catch(() => {
        reject('unable to delete student')
      })
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
  addCourse,
  updateCourse,
  deleteCourseById,
  deleteStudentByNum,
}

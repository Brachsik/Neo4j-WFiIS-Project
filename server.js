import express from "express";
import { db, StudentClass, TeacherClass, ActivityClass } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '/public')))



const dataB = new db();
const Student = new StudentClass();
const Teacher = new TeacherClass();
const Activity = new ActivityClass();

Student.createStudent("Don", "bobo");

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/users", async (req, res) => {
  const students = await Student.listStudents();
  res.render("users.ejs", { data: students });
});

app.get("/createUser", async (req, res) => {

  res.render("createUser.ejs", { data: "/createUser", method: "POST" });
});

app.post("/createUser", async (req, res) => {
    await Student.createStudent(req.body.name, req.body.faculty)
      const students = await Student.listStudents();
      res.render("users.ejs", { data: students });
})

app.get("/createTeacher", async (req, res) => {
  res.render("createUser.ejs", { data: "/createTeacher", method: "POST" });
});

app.post("/createTeacher", async (req, res) => {
  await Teacher.createTeacher(req.body.name, req.body.faculty);
  const students = await Teacher.listTeachers();
  res.render("teachers.ejs", { data: students });
});

app.get("/createClass", async (req, res) => {
  res.render("createClass.ejs", { data: "/createClass", method: "POST" });
});

app.post("/createClass", async (req, res) => {
  await Activity.createClass(req.body.name);
  const students = await Activity.listActivities();
  res.render("classes.ejs", { data: students });
});

////

app.get("/deleteUser", async (req, res) => {
  res.render("createUser.ejs", { data: "/deleteUser", method: "POST" });
});

app.post("/deleteUser", async (req, res) => {
  console.log("deleting");
  await Student.deleteStudent(req.body.name, req.body.faculty);
  const students = await Student.listStudents();
  res.render("users.ejs", { data: students });
});

app.get("/deleteTeacher", async (req, res) => {
  res.render("createTeacher.ejs", { data: "/createTeacher", method: "POST" });
});

app.post("/deleteTeacher", async (req, res) => {
  await Teacher.deleteTeacher(req.body.name, req.body.faculty);
  const students = await Teacher.listTeachers();
  res.render("teachers.ejs", { data: students });
});

app.get("/deleteClass", async (req, res) => {
  res.render("createClass.ejs", { data: "/createClass", method: "POST" });
});

app.post("/deleteClass", async (req, res) => {
  await Activity.deleteClass(req.body.name);
  const students = await Activity.listActivities();
  res.render("classes.ejs", { data: students });
});

////

app.get("/teachers",async (req, res) => {
      const students = await Teacher.listTeachers();
  res.render("teachers.ejs", {data : students});
});

app.get("/classes", async (req, res) => {
  const students = await Activity.listActivities();
  res.render("classes.ejs", { data: students });
});

app.listen(3000);

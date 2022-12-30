import express from "express";
import { db, StudentClass, TeacherClass, ActivityClass } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "/public")));

const dataB = new db();
const Student = new StudentClass();
const Teacher = new TeacherClass();
const Activity = new ActivityClass();

Student.createStudent("Don", "bobo");

app.get("/", async (req, res) => {
  const list = await Student.listParticipation();
  console.log(list);
  res.render("index.ejs", { data: list });
});

app.get("/supervisors", async (req, res) => {
  const list = await Teacher.listParticipation();
  console.log(list);
  res.render("supervisors.ejs", { data: list });
});

app.get("/users", async (req, res) => {
  const students = await Student.listStudents();
  res.render("users.ejs", { data: students });
});

app.get("/createUser", async (req, res) => {
  res.render("createUser.ejs", { data: "/createUser", method: "POST" , whatTo: "Zarejestruj Studenta", what: "Zarejestruj"});
});

app.post("/createUser", async (req, res) => {
  await Student.createStudent(req.body.name, req.body.faculty);
  const students = await Student.listStudents();
  res.render("users.ejs", { data: students });
});

app.get("/createTeacher", async (req, res) => {
  res.render("createUser.ejs", {
    data: "/createTeacher",
    method: "POST",
    whatTo: "Zarejestruj Nauczyciela",
    what: "Zarejestruj",
  });
});

app.post("/createTeacher", async (req, res) => {
  await Teacher.createTeacher(req.body.name, req.body.faculty);
  const students = await Teacher.listTeachers();
  res.render("teachers.ejs", { data: students });
});

app.get("/createClass", async (req, res) => {
  res.render("createClass.ejs", {
    data: "/createClass",
    method: "POST",
    whatTo: "Zarejestruj Przedmiot",
    what: "Zarejestruj",
  });
});

app.post("/createClass", async (req, res) => {
  await Activity.createClass(req.body.name);
  const students = await Activity.listActivities();
  res.render("classes.ejs", { data: students });
});

////

app.get("/deleteUser", async (req, res) => {
  res.render("createUser.ejs", {
    data: "/deleteUser",
    method: "POST",
    whatTo: "Usuń Studenta",
    what: "Usuń",
  });
});

app.post("/deleteUser", async (req, res) => {
  console.log("deleting");
  await Student.deleteStudent(req.body.name, req.body.faculty);
  const students = await Student.listStudents();
  res.render("users.ejs", { data: students });
});

app.get("/deleteTeacher", async (req, res) => {
  res.render("createUser.ejs", {
    data: "/deleteTeacher",
    method: "POST",
    whatTo: "Usuń Nauczyciela",
    what: "Usuń",
  });
});

app.post("/deleteTeacher", async (req, res) => {
  await Teacher.deleteTeacher(req.body.name, req.body.faculty);
  const students = await Teacher.listTeachers();
  res.render("teachers.ejs", { data: students });
});

app.get("/deleteClass", async (req, res) => {
  res.render("createClass.ejs", {
    data: "/deleteClass",
    method: "POST",
    whatTo: "Usuń Przedmiot",
    what: "Usuń",
  });
});

app.post("/deleteClass", async (req, res) => {
  await Activity.deleteClass(req.body.name);
  const students = await Activity.listActivities();
  res.render("classes.ejs", { data: students });
});

////

app.get("/createGoesTo", async (req, res) => {
  res.render("goesToCreator.ejs", {
    data: "/createGoesTo",
    method: "POST",
    whatTo: "Utwórz rejestrację",
    what: "Utwórz",
  });
});

app.post("/createGoesTo", async (req, res) => {
  await Student.createParticipation(
    req.body.name,
    req.body.faculty,
    req.body.class
  );
  const list = await Student.listParticipation();
  res.render("index.ejs", { data: list });
});

app.get("/deleteGoesTo", async (req, res) => {
  res.render("goesToCreator.ejs", {
    data: "/deleteGoesTo",
    method: "POST",
    whatTo: "Usuń rejestrację",
    what: "Usuń",
  });
});

app.post("/deleteGoesTo", async (req, res) => {
  await Student.deleteParticipation(
    req.body.name,
    req.body.faculty,
    req.body.class
  );
  const list = await Student.listParticipation();
  res.render("index.ejs", { data: list });
});

app.get("/createTeaches", async (req, res) => {
  res.render("goesToCreator.ejs", {
    data: "/createTeaches",
    method: "POST",
    whatTo: "Utwórz rejestrację",
    what: "Utwórz",
  });
});

app.post("/createTeaches", async (req, res) => {
  await Teacher.createParticipation(
    req.body.name,
    req.body.faculty,
    req.body.class
  );
  const students = await Teacher.listParticipation();
  res.render("supervisors.ejs", { data: students });
});

app.get("/deleteTeaches", async (req, res) => {
  res.render("goesToCreator.ejs", { data: "/deleteTeaches", method: "POST", whatTo: "Usuń rejestrację", what: "Usuń" });
});

app.post("/deleteTeaches", async (req, res) => {
    console.log("meeee")
  await Teacher.deleteParticipation(
    req.body.name,
    req.body.faculty,
    req.body.class
  );
  const students = await Teacher.listParticipation();
  res.render("supervisors.ejs", { data: students });
});

app.get("/teachers", async (req, res) => {
  const students = await Teacher.listTeachers();
  res.render("teachers.ejs", { data: students });
});

app.get("/classes", async (req, res) => {
  const students = await Activity.listActivities();
  res.render("classes.ejs", { data: students });
});

app.listen(3000);

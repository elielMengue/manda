import request from "supertest";
import { app } from "./app";
import { prisma } from "./db/prisma";

async function main() {
  const unique = Date.now();
  const mentorEmail = `mentor_${unique}@test.local`;
  const apprenantEmail = `apprenant_${unique}@test.local`;
  const partnerEmail = `partner_${unique}@test.local`;
  const pwd = "Test1234!";

  // Register mentor user
  let res = await request(app).post("/api/v1/auth/register").send({
    firstName: "Mentor",
    lastName: "Test",
    email: mentorEmail,
    password: pwd,
    address: "-",
    phone: "000",
    photoUrl: "-",
  });
  console.log("register mentor:", res.status);
  let mentorToken = res.body.accessToken as string;
  const mentorUserId = res.body.user.id as number;

  // Create mentor profile
  res = await request(app)
    .post("/api/v1/profiles/mentor")
    .set("Authorization", `Bearer ${mentorToken}`)
    .send({ specialite: "Web", experience: "5 ans", bio: "Mentor" });
  console.log("create mentor profile:", res.status);

  // Re-login to get updated role (Mentor)
  res = await request(app).post("/api/v1/auth/login").send({ email: mentorEmail, password: pwd });
  mentorToken = res.body.accessToken as string;

  // Create cours as mentor
  res = await request(app)
    .post("/api/v1/cours")
    .set("Authorization", `Bearer ${mentorToken}`)
    .send({ titre: "Intro JS", description: "Basics", duree: 60, status: "draft", imageUrl: "-" });
  console.log("create cours:", res.status);
  const coursId = res.body.id as number;

  // Create module
  res = await request(app)
    .post(`/api/v1/cours/${coursId}/modules`)
    .set("Authorization", `Bearer ${mentorToken}`)
    .send({ titre: "Module 1", description: "M1", ordre: 0, duree: 60 });
  console.log("create module:", res.status);
  const moduleId = res.body.id as number;

  // Create lesson
  res = await request(app)
    .post(`/api/v1/modules/${moduleId}/lessons`)
    .set("Authorization", `Bearer ${mentorToken}`)
    .send({ titre: "L1", textContenu: "Texte", duree: 10, type: "txt", ordre: 0, videoUrl: "-" });
  console.log("create lesson:", res.status);
  const lessonId = res.body.id as number;

  // Create quiz + question + option
  res = await request(app)
    .post(`/api/v1/modules/${moduleId}/quizzes`)
    .set("Authorization", `Bearer ${mentorToken}`)
    .send({ titre: "Q1", description: "Quiz", dureeMax: 10, nombreTentatives: 3, scoreMinReussite: 1, type: "qcm" });
  console.log("create quiz:", res.status);
  const quizId = res.body.id as number;

  res = await request(app)
    .post(`/api/v1/quizzes/${quizId}/questions`)
    .set("Authorization", `Bearer ${mentorToken}`)
    .send({ questionText: "2+2?", ordre: 0, points: 1, typeQuestion: "qcm" });
  console.log("create question:", res.status);
  const questionId = res.body.id as number;

  res = await request(app)
    .post(`/api/v1/questions/${questionId}/options`)
    .set("Authorization", `Bearer ${mentorToken}`)
    .send({ optionText: "4", isCorrect: true });
  console.log("create option:", res.status);
  const optionId = res.body.id as number;

  // Register apprenant
  res = await request(app).post("/api/v1/auth/register").send({
    firstName: "Learner",
    lastName: "Test",
    email: apprenantEmail,
    password: pwd,
    address: "-",
    phone: "000",
    photoUrl: "-",
  });
  console.log("register apprenant:", res.status);
  const apprenantToken = res.body.accessToken as string;
  const apprenantUserId = res.body.user.id as number;

  // Create apprenant profile
  res = await request(app)
    .post("/api/v1/profiles/apprenant")
    .set("Authorization", `Bearer ${apprenantToken}`)
    .send({ bio: "bio", profession: "student" });
  console.log("create apprenant profile:", res.status);

  // Enroll
  res = await request(app)
    .post(`/api/v1/cours/${coursId}/enroll`)
    .set("Authorization", `Bearer ${apprenantToken}`)
    .send({});
  console.log("enroll:", res.status);

  // Complete lesson
  res = await request(app)
    .post(`/api/v1/lessons/${lessonId}/complete`)
    .set("Authorization", `Bearer ${apprenantToken}`)
    .send({});
  console.log("complete lesson:", res.status);

  // Fetch quiz public and submit
  res = await request(app).get(`/api/v1/quizzes/${quizId}`);
  console.log("get quiz public:", res.status);
  res = await request(app)
    .post(`/api/v1/quizzes/${quizId}/submit`)
    .set("Authorization", `Bearer ${apprenantToken}`)
    .send({ answers: [{ questionId, optionIds: [optionId] }] });
  console.log("submit quiz:", res.status, res.body);

  // List my inscriptions
  res = await request(app)
    .get(`/api/v1/me/inscriptions`)
    .set("Authorization", `Bearer ${apprenantToken}`);
  console.log("list my inscriptions:", res.status, (res.body?.length ?? 0));

  // Elevate mentor to Admin and re-login
  await prisma.user.update({ where: { id: mentorUserId }, data: { role: "Admin" as any } });
  res = await request(app).post("/api/v1/auth/login").send({ email: mentorEmail, password: pwd });
  const adminToken = res.body.accessToken as string;
  console.log("admin relogin:", res.status);

  // Admin list users
  res = await request(app).get("/api/v1/users").set("Authorization", `Bearer ${adminToken}`);
  console.log("admin list users:", res.status);

  // Partner user setup
  res = await request(app).post("/api/v1/auth/register").send({
    firstName: "Partner",
    lastName: "Test",
    email: partnerEmail,
    password: pwd,
    address: "-",
    phone: "000",
    photoUrl: "-",
  });
  const partnerToken = res.body.accessToken as string;
  const partnerUserId = res.body.user.id as number;
  await request(app)
    .post("/api/v1/profiles/partenaire")
    .set("Authorization", `Bearer ${partnerToken}`)
    .send({ organisationName: "Org", activitySector: "Tech", juridicStatus: "SARL", description: "Desc", siteweb: "example.com", contact: "contact", logoUrl: "-" });
  console.log("create partner profile: ok");

  // Re-login as partner to get updated role
  res = await request(app).post("/api/v1/auth/login").send({ email: partnerEmail, password: pwd });
  const partnerTokenRefreshed = res.body.accessToken as string;

  // Create Post as partner
  const dateExp = new Date(Date.now() + 7*24*3600*1000).toISOString();
  res = await request(app)
    .post("/api/v1/posts")
    .set("Authorization", `Bearer ${partnerTokenRefreshed}`)
    .send({ title: "Stage Dev", content: "Node.js", dateExpiration: dateExp, typeOportunite: "stage", status: "open" });
  console.log("create post:", res.status);
  const postId = res.body.id as number;

  // Notifications: create direct, fetch and mark read
  const notif = await prisma.notification.create({ data: { userId: apprenantUserId, title: "Hello", content: "World" } });
  res = await request(app).get("/api/v1/notifications").set("Authorization", `Bearer ${apprenantToken}`);
  console.log("list notifications:", res.status, (res.body?.length ?? 0));
  res = await request(app).patch(`/api/v1/notifications/${notif.id}/read`).set("Authorization", `Bearer ${apprenantToken}`).send({});
  console.log("mark notification read:", res.status);

  // Messages
  res = await request(app).post("/api/v1/messages").set("Authorization", `Bearer ${partnerToken}`).send({ receiverId: mentorUserId, content: "Bonjour" });
  console.log("send message:", res.status);
  res = await request(app).get("/api/v1/messages/conversations").set("Authorization", `Bearer ${mentorToken}`);
  console.log("list conversations:", res.status);

  // Certificates: force 100 progression and issue
  const apprenant = await prisma.apprenant.findUnique({ where: { userId: apprenantUserId } });
  const inscription = await prisma.inscription.findFirst({ where: { apprenantId: apprenant!.id, coursId } });
  if (inscription) {
    await prisma.inscription.update({ where: { id: inscription.id }, data: { progression: 100 } });
    res = await request(app).post("/api/v1/certificats/issue").set("Authorization", `Bearer ${adminToken}`).send({ apprenantUserId, coursId });
    console.log("issue certificate:", res.status);
    const certId = res.body.id as number;
    res = await request(app).get(`/api/v1/certificats/${certId}/pdf`);
    console.log("certificate pdf:", res.status);
  }

  // Clean up (optional): delete created post as admin
  res = await request(app).delete(`/api/v1/posts/${postId}`).set("Authorization", `Bearer ${adminToken}`);
  console.log("delete post (admin):", res.status);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "EduImpact API",
    version: "0.1.0",
    description: "API documentation for EduImpact backend",
  },
  servers: [{ url: "/api/v1" }],
  tags: [
    { name: "Auth" },
    { name: "Users" },
    { name: "Cours" },
    { name: "Modules" },
    { name: "Lessons" },
    { name: "Inscriptions" },
    { name: "Quiz" },
    { name: "Messages" },
    { name: "Notifications" },
    { name: "Posts" },
    { name: "Certificats" },
    { name: "Profiles" },
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        responses: { "200": { description: "OK" } },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register",
        responses: { "201": { description: "Created" } },
      },
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Refresh token",
        responses: { "200": { description: "OK" } },
      },
    },
    "/auth/oauth": {
      post: {
        tags: ["Auth"],
        summary: "OAuth upsert (Google, etc.)",
        responses: { "200": { description: "OK" } },
      },
    },
    "/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        responses: { "200": { description: "OK" } },
      },
      patch: { tags: ["Users"], summary: "Update self" },
    },
    "/cours": {
      get: { tags: ["Cours"], summary: "List cours" },
      post: { tags: ["Cours"], summary: "Create cours (Admin/Mentor)" },
    },
    "/cours/{id}": {
      get: {
        tags: ["Cours"],
        summary: "Get cours",
        parameters: [{ name: "id", in: "path", required: true }],
      },
      patch: { tags: ["Cours"], summary: "Update cours" },
      delete: { tags: ["Cours"], summary: "Delete cours" },
    },
    "/cours/{coursId}/modules": {
      get: {
        tags: ["Modules"],
        summary: "List modules for cours",
        parameters: [{ name: "coursId", in: "path", required: true }],
      },
      post: { tags: ["Modules"], summary: "Create module (Admin/Mentor)" },
    },
    "/modules/{moduleId}/lessons": {
      get: {
        tags: ["Lessons"],
        summary: "List lessons for module",
        parameters: [{ name: "moduleId", in: "path", required: true }],
      },
      post: { tags: ["Lessons"], summary: "Create lesson (Admin/Mentor)" },
    },
    "/lessons/{id}": {
      get: {
        tags: ["Lessons"],
        summary: "Get lesson",
        parameters: [{ name: "id", in: "path", required: true }],
      },
      patch: { tags: ["Lessons"], summary: "Update lesson" },
      delete: { tags: ["Lessons"], summary: "Delete lesson" },
    },
    "/lessons/{id}/complete": {
      post: { tags: ["Lessons"], summary: "Complete lesson (Apprenant)" },
    },
    "/modules/{moduleId}/quizzes": {
      get: { tags: ["Quiz"], summary: "List quizzes for module" },
      post: { tags: ["Quiz"], summary: "Create quiz (Admin/Mentor)" },
    },
    "/quizzes/{id}": {
      get: { tags: ["Quiz"], summary: "Get quiz (public)" },
      patch: { tags: ["Quiz"], summary: "Update quiz" },
      delete: { tags: ["Quiz"], summary: "Delete quiz" },
    },
    "/quizzes/{id}/full": {
      get: { tags: ["Quiz"], summary: "Get quiz (full, Admin/Mentor)" },
    },
    "/quizzes/{id}/submit": {
      post: { tags: ["Quiz"], summary: "Submit quiz (Apprenant)" },
    },
    "/quizzes/{quizId}/questions": {
      get: { tags: ["Quiz"], summary: "List questions" },
      post: { tags: ["Quiz"], summary: "Create question" },
    },
    "/questions/{id}": {
      patch: { tags: ["Quiz"], summary: "Update question" },
      delete: { tags: ["Quiz"], summary: "Delete question" },
    },
    "/questions/{questionId}/options": {
      get: { tags: ["Quiz"], summary: "List options" },
      post: { tags: ["Quiz"], summary: "Create option" },
    },
    "/options/{id}": {
      patch: { tags: ["Quiz"], summary: "Update option" },
      delete: { tags: ["Quiz"], summary: "Delete option" },
    },
    "/questions/{questionId}/reponses": {
      get: { tags: ["Quiz"], summary: "List reponses" },
      post: { tags: ["Quiz"], summary: "Create reponse" },
    },
    "/reponses/{id}": {
      patch: { tags: ["Quiz"], summary: "Update reponse" },
      delete: { tags: ["Quiz"], summary: "Delete reponse" },
    },
    "/cours/{coursId}/enroll": {
      post: { tags: ["Inscriptions"], summary: "Enroll (Apprenant)" },
    },
    "/me/inscriptions": {
      get: { tags: ["Inscriptions"], summary: "List my inscriptions" },
    },
    "/inscriptions/{id}/progression": {
      patch: {
        tags: ["Inscriptions"],
        summary: "Update progression (Apprenant)",
      },
    },
    "/users": { get: { tags: ["Users"], summary: "List users (Admin)" } },
    "/users/{id}": {
      get: { tags: ["Users"], summary: "Get user (Admin)" },
      patch: { tags: ["Users"], summary: "Update user (Admin)" },
    },
    "/posts": {
      get: { tags: ["Posts"], summary: "List posts" },
      post: { tags: ["Posts"], summary: "Create post (Partenaire/Admin)" },
    },
    "/posts/{id}": {
      get: { tags: ["Posts"], summary: "Get post" },
      patch: { tags: ["Posts"], summary: "Update post" },
      delete: { tags: ["Posts"], summary: "Delete post" },
    },
    "/notifications": {
      get: { tags: ["Notifications"], summary: "List my notifications" },
    },
    "/notifications/{id}/read": {
      patch: { tags: ["Notifications"], summary: "Mark read" },
    },
    "/messages": { post: { tags: ["Messages"], summary: "Send message" } },
    "/messages/conversations": {
      get: { tags: ["Messages"], summary: "List conversations" },
    },
    "/messages/conversation/{userId}": {
      get: { tags: ["Messages"], summary: "Get conversation" },
    },
    "/certificats/issue": {
      post: {
        tags: ["Certificats"],
        summary: "Issue certificate (Admin/Mentor)",
      },
    },
    "/certificats/{id}/pdf": {
      get: { tags: ["Certificats"], summary: "Get certificate PDF" },
    },
    "/profiles/me": { get: { tags: ["Profiles"], summary: "Get my profile" } },
    "/profiles/apprenant": {
      post: { tags: ["Profiles"], summary: "Create Apprenant profile" },
    },
    "/profiles/mentor": {
      post: { tags: ["Profiles"], summary: "Create Mentor profile" },
    },
    "/profiles/partenaire": {
      post: { tags: ["Profiles"], summary: "Create Partenaire profile" },
    },
  },
};

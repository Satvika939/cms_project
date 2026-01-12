import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Programs from "./pages/Programs";
import ProgramDetails from "./pages/ProgramDetails";
import EditProgram from "./pages/EditProgram";
import CreateProgram from "./pages/CreateProgram";

import CreateTerm from "./pages/CreateTerm";
import TermDetails from "./pages/TermDetails.jsx";
import EditTerm from "./pages/EditTerm.jsx";
import LessonActions from "./pages/LessonActions.jsx";

import LessonsList from "./pages/LessonsList";
import LessonDetails from "./pages/LessonDetails";
import CreateLesson from "./pages/CreateLesson";
import EditLesson from "./pages/EditLesson";
import ScheduleLesson from "./pages/ScheduleLesson.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import CatalogProgramDetail from "./pages/CatalogProgramDetail.jsx";
import CatalogPrograms from "./pages/CatalogPrograms.jsx";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>

        <Route path="/catalog/programs" element={<CatalogPrograms />} />
        <Route
          path="/catalog/programs/:programId"
          element={<CatalogProgramDetail />}
        />
        {/* 🔐 AUTH */}
        <Route path="/login" element={<Login />} />

        {/* 🔁 DEFAULT REDIRECT */}
        <Route path="/" element={<Navigate to="/programs" />} />

        {/* 📚 PROGRAMS LIST */}
        <Route
          path="/programs"
          element={
            <ProtectedRoute>
              <Programs />
            </ProtectedRoute>
          }
        />

        {/* ➕ CREATE PROGRAM */}
        <Route
          path="/programs/new"
          element={
            <ProtectedRoute roles={["admin", "editor"]}>
              <CreateProgram />
            </ProtectedRoute>
          }
        />

        {/* 👀 VIEW PROGRAM */}
        <Route
          path="/programs/:programId"
          element={
            <ProtectedRoute>
              <ProgramDetails />
            </ProtectedRoute>
          }
        />

        {/* ✏️ EDIT PROGRAM */}
        <Route
          path="/programs/:programId/edit"
          element={
            <ProtectedRoute roles={["admin", "editor"]}>
              <EditProgram />
            </ProtectedRoute>
          }
        />

        {/* ======================= */}
        {/* 📘 TERMS ROUTES */}
        {/* ======================= */}

        {/* ➕ CREATE TERM */}
        <Route
          path="/programs/:programId/terms/new"
          element={
            <ProtectedRoute roles={["admin", "editor"]}>
              <CreateTerm />
            </ProtectedRoute>
          }
        />

        {/* 👀 VIEW TERM */}
        <Route
          path="/programs/:programId/terms/:termId"
          element={
            <ProtectedRoute>
              <TermDetails />
            </ProtectedRoute>
          }
        />

        {/* ✏️ EDIT TERM */}
        <Route
          path="/programs/:programId/terms/:termId/edit"
          element={
            <ProtectedRoute roles={["admin", "editor"]}>
              <EditTerm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programs/:programId/terms/:termId/lessons"
          element={
            <ProtectedRoute>
              <LessonsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programs/:programId/terms/:termId/lessons/new"
          element={
            <ProtectedRoute roles={["admin", "editor"]}>
              <CreateLesson />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programs/:programId/terms/:termId/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <LessonDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/programs/:programId/terms/:termId/lessons/:lessonId/edit"
          element={
            <ProtectedRoute roles={["admin", "editor"]}>
              <EditLesson />
            </ProtectedRoute>
          }
        />

        <Route
        path="/programs/:programId/terms/:termId/lessons/:lessonId/schedule"
        element={
          <ProtectedRoute roles={["admin", "editor"]}>
            <ScheduleLesson />
          </ProtectedRoute>
        }
      />

      <Route
        path="/programs/:programId/terms/:termId/lessons/:lessonId/actions"
        element={<ProtectedRoute roles={["admin", "editor"]}>
            <LessonActions /> 
          </ProtectedRoute>}
      />

      
      </Routes>

    </BrowserRouter>
  );
}

export default App;

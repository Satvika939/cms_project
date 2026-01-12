import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./Programs.css";
import Header from "../components/Header"


function Programs() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    fetchPrograms();
    // eslint-disable-next-line
  }, [status, language]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();
      if (status) query.append("status", status);
      if (language) query.append("language", language);

      const data = await api.get(
        `/cms/programs${query.toString() ? `?${query}` : ""}`
      );

      setPrograms(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="programs-page">
        {/* <Header/> */}
      <div className="programs-header">
        <h2>📚 Programs</h2>

        {(user.role === "admin" || user.role === "editor") && (
          <button
            className="primary-btn"
            onClick={() => navigate("/programs/new")}
          >
            ➕ Create Program
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-row">
        <select
            className="filter-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
        >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
        </select>

        <select
            className="filter-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
        >
            <option value="">All Languages</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="te">Telugu</option>
        </select>
        </div>


      {/* Content */}
      {loading ? (
        <p className="loading-text">Loading programs...</p>
      ) : programs.length === 0 ? (
        <p className="empty-text">No programs found</p>
      ) : (
        <div className="table-wrapper">
          <table className="programs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Primary Language</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {programs.map((p) => (
                <tr key={p.id}>
                  <td className="program-title">{p.title}</td>
                  <td>
                    <span className={`status-badge ${p.status}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.language_primary}</td>
                  <td className="actions-cell">
                    <button
                      className="secondary-btn"
                      onClick={() => navigate(`/programs/${p.id}`)}
                    >
                      View
                    </button>

                    {(user.role === "admin" || user.role === "editor") && (
                      <button
                        className="secondary-btn"
                        onClick={() =>
                          navigate(`/programs/${p.id}/edit`)
                        }
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* <Footer/> */}
    </div>
  );
}

export default Programs;

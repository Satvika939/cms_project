import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import "./ProgramDetails.css";

function ProgramDetails() {
  const { programId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [program, setProgram] = useState(null);
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgram();
    fetchTerms();
    // eslint-disable-next-line
  }, []);

  const fetchProgram = async () => {
    try {
      const data = await api.get(`/cms/programs/${programId}`);
      setProgram(data);
    } catch (err) {
      alert("Failed to load program");
    }
  };

  const fetchTerms = async () => {
    try {
      const data = await api.get(`/cms/programs/${programId}/terms`);
      setTerms(data);
    } catch (err) {
      alert("Failed to load terms");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;
  if (!program) return <p>Program not found</p>;

  return (
    <div className="program-details-page">
      {/* Back */}
      <button
        className="back-link"
        onClick={() => navigate("/programs")}
      >
        ← Back to Programs
      </button>

      {/* Program Card */}
      <div className="program-card">
        <div className="program-header">
          <h2>{program.title}</h2>

          {(user.role === "admin" || user.role === "editor") && (
            <button
              className="secondary-btn"
              onClick={() => navigate(`/programs/${programId}/edit`)}
            >
              ✏️ Edit Program
            </button>
          )}
        </div>

        <p className="program-desc">{program.description}</p>

        <div className="program-meta">
          <div>
            <span>Status</span>
            <strong>{program.status}</strong>
          </div>

          <div>
            <span>Primary Language</span>
            <strong>{program.language_primary}</strong>
          </div>

          <div>
            <span>Languages Available</span>
            <strong>{program.languages_available.join(", ")}</strong>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="terms-section">
        <div className="terms-header">
          <h3>📘 Terms</h3>

          {(user.role === "admin" || user.role === "editor") && (
            <button
              className="primary-btn"
              onClick={() =>
                navigate(`/programs/${programId}/terms/new`)
              }
            >
              ➕ Create Term
            </button>
          )}
        </div>

        {terms.length === 0 ? (
          <p className="empty-text">No terms found</p>
        ) : (
          <table className="terms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th width="180">Actions</th>
              </tr>
            </thead>
            <tbody>
              {terms.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td className="term-actions">
                    <button
                      className="action-pill view-pill"
                      onClick={() =>
                        navigate(`/programs/${programId}/terms/${t.id}`)
                      }
                    >
                      View
                    </button>

                    {(user.role === "admin" || user.role === "editor") && (
                      <button
                        className="action-pill edit-pill"
                        onClick={() =>
                          navigate(`/programs/${programId}/terms/${t.id}/edit`)
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
        )}
      </div>
    </div>
  );
}

export default ProgramDetails;

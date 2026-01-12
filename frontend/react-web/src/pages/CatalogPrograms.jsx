import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "./CatalogPrograms.css";

function CatalogPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      const data = await api.get("/catalog/programs");
      setPrograms(data || []);
    } catch {
      alert("Failed to load catalog");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading-text">Loading catalog...</p>;

  return (
    <div className="catalog-page">
      <h2 className="catalog-title">🎬 Programs Catalog</h2>

      <div className="catalog-grid">
        {programs.map((p) => (
          <div
            key={p.id}
            className="program-card"
            onClick={() => navigate(`/catalog/programs/${p.id}`)}
          >
            <div className="program-thumb">
              <span className="thumb-placeholder">
                {p.title.charAt(0)}
              </span>
            </div>

            <div className="program-body">
              <h3>{p.title}</h3>
              <p className="program-desc">
                {p.description || "No description available"}
              </p>

              <div className="program-footer">
                <span className="lang-badge">
                  {p.language_primary.toUpperCase()}
                </span>

                <span className="published-dot">
                  ● Published
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CatalogPrograms;

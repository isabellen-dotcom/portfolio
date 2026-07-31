import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  // Fetch from Airtable
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
        const token = process.env.REACT_APP_AIRTABLE_TOKEN;

        if (!baseId || !token) {
          setError('Missing Airtable credentials. Check your .env.local file.');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://api.airtable.com/v0/${baseId}/Projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Transform Airtable records
        const transformedProjects = data.records
          .filter(record => record.fields.Status === 'Published')
          .map((record, index) => ({
            id: record.id,
            title: record.fields.Title || 'Untitled',
            description: record.fields.Description || '',
            category: record.fields.Category?.[0] || 'Other',
            type: record.fields.Type?.[0] || 'Other',
            tags: record.fields.Tags || [],
            link: record.fields.Link || null,
            sortOrder: index,
          }));

        setProjects(transformedProjects);
        setError(null);
      } catch (err) {
        console.error('Error fetching from Airtable:', err);
        setError(`Failed to load projects: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category))];

  const typeColors = {
    Web: '#378ADD',
    Documentation: '#0F6E56',
    Design: '#D4537E',
    Strategy: '#BA7517',
    Content: '#185FA5',
    Analytics: '#639922',
    Tool: '#534AB7',
    Video: '#993C1D',
    Other: '#5F5E5A',
  };

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory, projects]);

  if (error && projects.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2 style={{ color: '#d32f2f', marginBottom: '0.5rem' }}>Error Loading Portfolio</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>{error}</p>
        <details style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <summary style={{ cursor: 'pointer', color: '#378ADD' }}>Troubleshooting</summary>
          <pre style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem', overflow: 'auto' }}>
1. Check your .env.local file exists with:
   REACT_APP_AIRTABLE_BASE_ID=your_base_id
   REACT_APP_AIRTABLE_TOKEN=your_token

2. Verify your Base ID and Token are correct

3. Ensure your Airtable table is named "Projects"

4. Make sure you've published at least one project
   with Status = "Published"

5. Run: npm start to restart the app
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Hero */}
      <div className="hero">
        <h1>Project Portfolio</h1>
        <p>A collection of strategic communications, design, and technology projects</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Projects</p>
          <p className="stat-value">{projects.length}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Categories</p>
          <p className="stat-value">{categories.length - 1}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Showing</p>
          <p className="stat-value">{filtered.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Category Filters */}
      <div className="filters">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p>Loading projects from Airtable...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
          <p>No projects found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="projects-grid">
          {filtered.map((project, idx) => (
            <div
              key={project.id}
              className="project-card"
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => setSelectedProject(project)}
            >
              <div className="card-header">
                <span
                  className="type-badge"
                  style={{ color: typeColors[project.type] || typeColors.Other }}
                >
                  {project.type}
                </span>
              </div>

              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>

              {project.tags && project.tags.length > 0 && (
                <div className="tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="category-label">{project.category}</p>

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
            >
              ✕
            </button>

            <div className="modal-header">
              <span
                className="modal-type-badge"
                style={{ color: typeColors[selectedProject.type] || typeColors.Other }}
              >
                {selectedProject.type}
              </span>
              <span className="modal-category">{selectedProject.category}</span>
            </div>

            <h2 className="modal-title">{selectedProject.title}</h2>

            <p className="modal-description">{selectedProject.description}</p>

            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div className="modal-tags">
                <p className="modal-tags-label">Tags:</p>
                <div className="tags-list">
                  {selectedProject.tags.map(tag => (
                    <span key={tag} className="modal-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedProject.link && (
              <a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-link-button"
              >
                View Full Project →
              </a>
            )}

            <button
              className="modal-close-button"
              onClick={() => setSelectedProject(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

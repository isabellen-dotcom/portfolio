import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

const App = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  // Lyft color palette mapping for tags
  const getTagColor = (tag) => {
    const tagLower = tag.toLowerCase();
    if (['design', 'visual', 'timeline'].some(t => tagLower.includes(t))) {
      return { bg: 'rgba(207, 0, 144, 0.1)', text: '#CF0090', border: '#CF0090' };
    }
    if (['content', 'writing', 'messaging'].some(t => tagLower.includes(t))) {
      return { bg: 'rgba(194, 11, 157, 0.1)', text: '#C20B9D', border: '#C20B9D' };
    }
    if (['technology', 'automation', 'strategy', 'planning'].some(t => tagLower.includes(t))) {
      return { bg: 'rgba(68, 0, 68, 0.1)', text: '#440044', border: '#440044' };
    }
    if (['data', 'analysis'].some(t => tagLower.includes(t))) {
      return { bg: 'rgba(89, 78, 83, 0.1)', text: '#594E53', border: '#594E53' };
    }
    return { bg: 'rgba(116, 106, 110, 0.1)', text: '#746A6E', border: '#746A6E' };
  };

  // Fetch from Airtable
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
        const token = process.env.REACT_APP_AIRTABLE_TOKEN;

        if (!baseId || !token) {
          setError('Missing Airtable credentials.');
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://api.airtable.com/v0/${baseId}/Projects`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!response.ok) throw new Error(`API error: ${response.status}`);

        const data = await response.json();
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
            image: record.fields.Image?.[0]?.url || null,
            workingFiles: record.fields['Working files'] || null,
            sortOrder: index,
          }));

        setProjects(transformedProjects);
        setError(null);
      } catch (err) {
        setError(`Failed to load projects: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const categories = ['All', ...new Set(projects.map(p => p.category))];
  const typeColors = {
    Web: '#378ADD', Documentation: '#0F6E56', Design: '#D4537E', Strategy: '#BA7517',
    Content: '#185FA5', Analytics: '#639922', Tool: '#534AB7', Video: '#993C1D', Other: '#5F5E5A',
  };

  const filtered = useMemo(() => {
    return projects.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory, projects]);

  if (error && projects.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}><h2 style={{ color: '#d32f2f' }}>Error</h2><p>{error}</p></div>;
  }

  return (
    <div className="app">
      <div className="hero">
        <h1>Project Portfolio</h1>
        <p>A collection of strategic communications, design, and technology projects</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><p className="stat-label">Total Projects</p><p className="stat-value">{projects.length}</p></div>
        <div className="stat-card"><p className="stat-label">Categories</p><p className="stat-value">{categories.length - 1}</p></div>
        <div className="stat-card"><p className="stat-label">Showing</p><p className="stat-value">{filtered.length}</p></div>
      </div>

      <div className="search-container">
        <input type="text" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
      </div>

      <div className="filters">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}>{cat}</button>
        ))}
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div> : filtered.length === 0 ? <div style={{ textAlign: 'center', padding: '3rem' }}>No projects found.</div> : (
        <div className="projects-grid">
          {filtered.map((project, idx) => (
            <div key={project.id} className="project-card" style={{ animationDelay: `${idx * 0.05}s` }} onClick={() => setSelectedProject(project)}>
              {project.image && <div className="card-image"><img src={project.image} alt={project.title} /></div>}
              <div className="card-header"><span className="type-badge" style={{ color: typeColors[project.type] || typeColors.Other }}>{project.type}</span></div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              {project.tags && project.tags.length > 0 && (
                <div className="tags">
                  {project.tags.map(tag => {
                    const colors = getTagColor(tag);
                    return <span key={tag} className="tag" style={{ background: colors.bg, color: colors.text, border: `0.5px solid ${colors.border}` }}>{tag}</span>;
                  })}
                </div>
              )}
              <p className="category-label">{project.category}</p>
              {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link" onClick={(e) => e.stopPropagation()}>View Project →</a>}
            </div>
          ))}
        </div>
      )}

      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}>✕</button>
            {selectedProject.image && <div className="modal-image-container"><img src={selectedProject.image} alt={selectedProject.title} className="modal-image" /></div>}
            <div className="modal-header">
              <span className="modal-type-badge" style={{ color: typeColors[selectedProject.type] || typeColors.Other }}>{selectedProject.type}</span>
              <span className="modal-category">{selectedProject.category}</span>
            </div>
            <h2 className="modal-title">{selectedProject.title}</h2>
            <p className="modal-description">{selectedProject.description}</p>
            {selectedProject.tags && selectedProject.tags.length > 0 && (
              <div className="modal-tags">
                <p className="modal-tags-label">Tags:</p>
                <div className="tags-list">
                  {selectedProject.tags.map(tag => {
                    const colors = getTagColor(tag);
                    return <span key={tag} className="modal-tag" style={{ background: colors.bg, color: colors.text, border: `0.5px solid ${colors.border}` }}>{tag}</span>;
                  })}
                </div>
              </div>
            )}
            {selectedProject.workingFiles && (
              <a href={selectedProject.workingFiles} target="_blank" rel="noopener noreferrer" className="modal-link-button">
                Access Files →
              </a>
            )}
            {selectedProject.link && <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="modal-link-button">View Full Project →</a>}
            <button className="modal-close-button" onClick={() => setSelectedProject(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

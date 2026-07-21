document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("projects-grid");
  if (!gridContainer) return;

  const projects = window.PRODUCTS_DATA || [];
  gridContainer.innerHTML = ""; // Clear static placeholder items

  projects.forEach(project => {
    const card = createProjectCard(project);
    gridContainer.appendChild(card);

    // If there's a githubRepo and it is public, attempt to fetch live details from GitHub API
    if (project.githubRepo && !project.isPrivate) {
      fetchGitHubDetails(project.githubRepo, card);
    }
  });
});

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.id = `project-${project.id}`;

  // 1. Media Section
  let mediaHtml = "";
  if (project.video) {
    mediaHtml = `
      <div class="project-media">
        <video controls preload="metadata">
          <source src="${project.video}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
        <div class="overlay-text">${project.title}</div>
      </div>
    `;
  } else if (project.image) {
    mediaHtml = `
      <div class="project-media">
        <img src="${project.image}" alt="${project.title}">
      </div>
    `;
  } else {
    // Dynamic default icon choice based on project tags
    let iconClass = "fas fa-code";
    if (project.tags) {
      const lowerTags = project.tags.map(t => t.toLowerCase());
      if (lowerTags.includes("game") || lowerTags.includes("unity")) iconClass = "fas fa-gamepad";
      else if (lowerTags.includes("security") || lowerTags.includes("cybersecurity") || lowerTags.includes("ctf")) iconClass = "fas fa-shield-alt";
      else if (lowerTags.includes("spotify") || lowerTags.includes("music")) iconClass = "fab fa-spotify";
      else if (lowerTags.includes("database") || lowerTags.includes("sql")) iconClass = "fas fa-database";
      else if (lowerTags.includes("api") || lowerTags.includes("web api")) iconClass = "fas fa-network-wired";
    }

    mediaHtml = `
      <div class="project-media">
        <div class="project-media-fallback">
          <i class="${iconClass}"></i>
        </div>
      </div>
    `;
  }

  // 2. Status Badge Class mapping
  const statusClass = project.status ? project.status.toLowerCase().replace(" ", "-") : "completed";
  const statusText = project.status || "Completed";

  // 3. Tags list
  const tagsHtml = (project.tags || []).map(tag => `<span class="project-tag">${tag}</span>`).join("");

  // 4. Action Buttons (Smart redundancy resolution and privacy handling)
  const isGitHubLink = project.link && (project.link.includes("github.com") || project.link.includes("git"));
  const hasRepoPath = !!project.githubRepo;
  const isPrivate = !!project.isPrivate;
  
  let buttonsHtml = "";

  if (project.link && !isGitHubLink) {
    // Case 1: Separate Live Website (e.g. HitConfirm)
    buttonsHtml += `<a href="${project.link}" class="project-btn primary" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Visit Site</a>`;
    
    // Add GitHub repo button only if a public repo is available
    if (hasRepoPath && !isPrivate) {
      buttonsHtml += `<a href="https://github.com/${project.githubRepo}" class="project-btn secondary" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>`;
    }
  } else {
    // Case 2: No separate website, or the link itself is a GitHub link
    if (hasRepoPath && !isPrivate) {
      // Show one main GitHub button linking to the repository
      buttonsHtml += `<a href="https://github.com/${project.githubRepo}" class="project-btn primary" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>`;
    } else if (project.link) {
      // If repo is private/unavailable, link to the fallback URL (e.g., user profile)
      buttonsHtml += `<a href="${project.link}" class="project-btn primary" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> GitHub</a>`;
    }
  }

  card.innerHTML = `
    ${mediaHtml}
    <div class="project-info">
      <div class="project-header">
        <h3 class="project-title"><a href="${project.link || '#'}" target="_blank" rel="noopener noreferrer">${project.title}</a></h3>
        <span class="project-status ${statusClass}">${statusText}</span>
      </div>
      <p class="project-description">${project.description}</p>
      
      <!-- GitHub stats container (populated dynamically if githubRepo is provided) -->
      <div class="project-github-stats" style="display: none;"></div>

      <div class="project-tags">
        ${tagsHtml}
      </div>
      <div class="project-actions">
        ${buttonsHtml}
      </div>
    </div>
  `;

  return card;
}

/**
 * Fetches repository metadata from GitHub REST API
 * @param {string} repoPath e.g. "VictorBaezM/1st-Semester-2022-CTFs"
 * @param {HTMLElement} cardNode The DOM element for this project card
 */
function fetchGitHubDetails(repoPath, cardNode) {
  const statsContainer = cardNode.querySelector(".project-github-stats");
  if (!statsContainer) return;

  fetch(`https://api.github.com/repos/${repoPath}`)
    .then(response => {
      if (!response.ok) throw new Error("API request failed");
      return response.json();
    })
    .then(data => {
      const stars = data.stargazers_count;
      const forks = data.forks_count;
      const lang = data.language;

      let statsHtml = "";
      if (lang) {
        // Color indicator based on language
        let langColor = "#EDA57C"; // default orange
        if (lang === "JavaScript") langColor = "#f1e05a";
        else if (lang === "Python") langColor = "#3572A5";
        else if (lang === "C#") langColor = "#178600";
        else if (lang === "TypeScript") langColor = "#3178c6";
        else if (lang === "CSS") langColor = "#563d7c";
        else if (lang === "HTML") langColor = "#e34c26";

        statsHtml += `<span><i class="fas fa-circle" style="color: ${langColor}; font-size: 8px;"></i> ${lang}</span>`;
      }
      statsHtml += `<span><i class="fas fa-star"></i> ${stars} stars</span>`;
      statsHtml += `<span><i class="fas fa-code-branch"></i> ${forks}</span>`;

      statsContainer.innerHTML = statsHtml;
      statsContainer.style.display = "flex";

      // If project description is empty or placeholder, we backfill it with GitHub's repository description
      const descNode = cardNode.querySelector(".project-description");
      if (descNode && (!descNode.textContent || descNode.textContent.trim() === "")) {
        descNode.textContent = data.description || "No description provided.";
      }
    })
    .catch(err => {
      console.warn(`Could not load GitHub stats for ${repoPath}:`, err);
      // Fallback: fails silently and leaves default styling intact
    });
}

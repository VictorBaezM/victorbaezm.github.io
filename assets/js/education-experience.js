document.addEventListener("DOMContentLoaded", () => {
  const eduContainer = document.getElementById("education-grid");
  const expContainer = document.getElementById("experience-grid");

  if (eduContainer && window.EDUCATION_DATA) {
    eduContainer.innerHTML = ""; // Clear static placeholder fallback items
    window.EDUCATION_DATA.forEach(edu => {
      const card = createEducationCard(edu);
      eduContainer.appendChild(card);
    });
  }

  if (expContainer && window.EXPERIENCE_DATA) {
    expContainer.innerHTML = ""; // Clear static placeholder fallback items
    window.EXPERIENCE_DATA.forEach(exp => {
      const card = createExperienceCard(exp);
      expContainer.appendChild(card);
    });
  }
});

function createEducationCard(edu) {
  const card = document.createElement("div");
  card.className = "portfolio-card";
  card.id = `edu-${edu.id}`;

  // 1. Logo / Media Section
  let mediaHtml = "";
  if (edu.logo) {
    mediaHtml = `
      <div class="portfolio-media logo-media">
        <img src="${edu.logo}" alt="${edu.institution} Logo">
      </div>
    `;
  } else {
    mediaHtml = `
      <div class="portfolio-media">
        <div class="portfolio-media-fallback">
          <i class="fas fa-graduation-cap"></i>
        </div>
      </div>
    `;
  }

  // 2. Status Badge Class mapping
  const statusClass = edu.status ? edu.status.toLowerCase().replace(" ", "-") : "completed";
  const statusText = edu.status || "Completed";

  // 3. Tags list
  const tagsHtml = (edu.tags || []).map(tag => `<span class="portfolio-tag">${tag}</span>`).join("");

  // 4. Action Buttons
  let buttonsHtml = "";
  if (edu.link) {
    buttonsHtml += `<a href="${edu.link}" class="portfolio-btn primary" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Visit Institution</a>`;
  }

  card.innerHTML = `
    ${mediaHtml}
    <div class="portfolio-info">
      <div class="portfolio-header">
        <h3 class="portfolio-title"><a href="${edu.link || '#'}" target="_blank" rel="noopener noreferrer">${edu.institution}</a></h3>
        <span class="portfolio-status ${statusClass}">${statusText}</span>
      </div>
      <h4 style="margin-top: -5px; margin-bottom: 15px; font-size: 0.95rem; color: #555; font-weight: 600;">
        ${edu.degree} <i style="font-size: 0.85rem; color: #777; font-weight: normal; margin-left: 5px;">(${edu.duration})</i>
      </h4>
      <p class="portfolio-description">${edu.description}</p>
      <div class="portfolio-tags">
        ${tagsHtml}
      </div>
      ${buttonsHtml ? `<div class="portfolio-actions">${buttonsHtml}</div>` : ""}
    </div>
  `;

  return card;
}

function createExperienceCard(exp) {
  const card = document.createElement("div");
  card.className = "portfolio-card";
  card.id = `exp-${exp.id}`;

  // 1. Logo / Media Section
  let mediaHtml = "";
  if (exp.logo) {
    mediaHtml = `
      <div class="portfolio-media logo-media">
        <img src="${exp.logo}" alt="${exp.company} Logo">
      </div>
    `;
  } else {
    mediaHtml = `
      <div class="portfolio-media">
        <div class="portfolio-media-fallback">
          <i class="fas fa-briefcase"></i>
        </div>
      </div>
    `;
  }

  // 2. Status Badge Class mapping
  const statusClass = exp.status ? exp.status.toLowerCase().replace(" ", "-") : "completed";
  const statusText = exp.status || "Completed";

  // 3. Tags list
  const tagsHtml = (exp.tags || []).map(tag => `<span class="portfolio-tag">${tag}</span>`).join("");

  // 4. Action Buttons
  let buttonsHtml = "";
  if (exp.link) {
    buttonsHtml += `<a href="${exp.link}" class="portfolio-btn primary" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Visit Company</a>`;
  }

  card.innerHTML = `
    ${mediaHtml}
    <div class="portfolio-info">
      <div class="portfolio-header">
        <h3 class="portfolio-title"><a href="${exp.link || '#'}" target="_blank" rel="noopener noreferrer">${exp.company}</a></h3>
        <span class="portfolio-status ${statusClass}">${statusText}</span>
      </div>
      <h4 style="margin-top: -5px; margin-bottom: 15px; font-size: 0.95rem; color: #555; font-weight: 600;">
        ${exp.role} <i style="font-size: 0.85rem; color: #777; font-weight: normal; margin-left: 5px;">(${exp.duration})</i>
      </h4>
      <p class="portfolio-description">${exp.description}</p>
      <div class="portfolio-tags">
        ${tagsHtml}
      </div>
      ${buttonsHtml ? `<div class="portfolio-actions">${buttonsHtml}</div>` : ""}
    </div>
  `;

  return card;
}

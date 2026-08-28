document.addEventListener("DOMContentLoaded", () => {
  const uprmContainer = document.getElementById("uprm-courses-grid");
  const gtContainer = document.getElementById("gt-courses-grid");

  if (uprmContainer && window.COURSES_DATA && window.COURSES_DATA.uprm) {
    uprmContainer.innerHTML = ""; // Clear fallback elements
    window.COURSES_DATA.uprm.forEach(cat => {
      const card = createCourseCard(cat);
      uprmContainer.appendChild(card);
    });
  }

  if (gtContainer && window.COURSES_DATA && window.COURSES_DATA.gt) {
    gtContainer.innerHTML = ""; // Clear fallback elements
    window.COURSES_DATA.gt.forEach(cat => {
      const card = createCourseCard(cat);
      gtContainer.appendChild(card);
    });
  }
});

function createCourseCard(cat) {
  const card = document.createElement("div");
  card.className = "portfolio-card";
  card.id = cat.id;

  // 1. Icon / Media Header
  const iconClass = cat.icon || "fas fa-graduation-cap";
  const mediaHtml = `
    <div class="portfolio-media">
      <div class="portfolio-media-fallback">
        <i class="${iconClass}"></i>
      </div>
    </div>
  `;

  // 2. Courses List items
  const coursesListHtml = cat.courses.map(course => `
    <div style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; line-height: 1.4; color: #555; text-align: left;">
      <strong style="color: #333; font-weight: 600;">${course.code}</strong> — ${course.title}
    </div>
  `).join("");

  // 3. Info structure
  card.innerHTML = `
    ${mediaHtml}
    <div class="portfolio-info" style="display: flex; flex-direction: column; flex-grow: 1;">
      <div class="portfolio-header" style="margin-bottom: 15px;">
        <h3 class="portfolio-title" style="font-size: 1.15em !important; text-align: left;">${cat.category}</h3>
        <span class="portfolio-status completed" style="background-color: #ebf5fe; color: #0b69c5;">${cat.courses.length} Courses</span>
      </div>
      
      <!-- Expandable container -->
      <div class="courses-expandable" style="display: none; margin-bottom: 20px; max-height: 300px; overflow-y: auto; padding-right: 5px; border-top: 1px solid #e0e0e0; padding-top: 10px;">
        ${coursesListHtml}
      </div>

      <div class="portfolio-actions" style="margin-top: auto; padding-top: 10px;">
        <a href="javascript:void(0)" class="portfolio-btn primary toggle-courses-btn" style="width: 100%;">
          <i class="fas fa-eye"></i> Show Courses
        </a>
      </div>
    </div>
  `;

  // 4. Toggle functionality
  const toggleBtn = card.querySelector(".toggle-courses-btn");
  const expandable = card.querySelector(".courses-expandable");

  toggleBtn.addEventListener("click", () => {
    const isHidden = expandable.style.display === "none";
    if (isHidden) {
      expandable.style.display = "block";
      toggleBtn.innerHTML = `<i class="fas fa-eye-slash"></i> Hide Courses`;
      toggleBtn.classList.remove("primary");
      toggleBtn.classList.add("secondary");
    } else {
      expandable.style.display = "none";
      toggleBtn.innerHTML = `<i class="fas fa-eye"></i> Show Courses`;
      toggleBtn.classList.remove("secondary");
      toggleBtn.classList.add("primary");
    }
  });

  return card;
}

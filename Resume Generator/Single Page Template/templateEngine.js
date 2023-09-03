class TemplateEngine {

  constructor() {
    this.init();
  }

  init() {
  }

  contactsTemplate(contactNumber, email, city) {
    return `
          <li><i class="fas fa-phone"></i> +911234567890 / +911234567890</li>
          <li>
            <i class="fas fa-envelope"></i> youremail@gmail.com
          </li>
          <li><i class="fas fa-map-marker-alt"></i> City Name</li>
        `;
  }

  skillsTemplate(skillsList) {
    return `
          <li>Skill 1</li>
          <li>Skill 2</li>
          <li>Skill 3</li>
          <li>Skill 4</li>
          <li>Skill 5</li>
          <li>Skill 6</li>
          <li>Skill 7</li>
      `;
  }

  ideAndToolsTemplate(ideList) {
    return `
          <li>IDE or Tool Name 1</li>
          <li>IDE or Tool Name 2</li>
          <li>IDE or Tool Name 3</li>
          <li>IDE or Tool Name 4</li>
      `;
  }

  otherStuffTemplate(othersStuffList) {
    return `
          <li>Other Stuff 1</li>
          <li>Other Stuff 2</li>
          <li>Other Stuff 3</li>
          <li>Other Stuff 4</li>
      `;
  }
}

// const obj = new TemplateEngine();
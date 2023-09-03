class TemplateEngine {
  constructor() {
    this.addToLeftBtn = document.getElementById('add-left-section');
    this.addToRightBtn = document.getElementById('add-right-section');
    this.leftColumn = document.getElementById('left-column');
    this.rightColumn = document.getElementById('right-column');
    this.saveBtn = document.getElementById('save-data');
    this.resumeContainer = document.getElementById('resume');
    this.addEvents();
    this.loadResumeData();
  }

  addEvents() {
    this.addToLeftBtn.addEventListener('click', () => this.addLeftSectionTemplate());
    this.addToRightBtn.addEventListener('click', () => this.addRightSectionTemplate());

    // Add keyboard event listener to delete selected sections
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Delete') {
        this.deleteSelectedSection();
      }
    });

    this.saveBtn.addEventListener('click', () => this.saveResumeJSON());
  }

  addLeftSectionTemplate() {
    const newSectionDiv = document.createElement('div');
    newSectionDiv.className = 'new-left-section left-section delete';
    newSectionDiv.innerHTML = `
        <h3 class="section-title" contenteditable="true">Heading</h3>
        <ul class="item-list" contenteditable="true">
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>`;
    this.leftColumn.appendChild(newSectionDiv);
  }

  addRightSectionTemplate() {
    const newSectionDiv = document.createElement('div');
    newSectionDiv.className = 'new-right-section right-section delete';
    newSectionDiv.setAttribute('contenteditable', 'true');
    newSectionDiv.innerHTML = `
    <h2 class="section-title">Heading</h2>
    <h3 class="item-title">
      Sub Heading
    </h3>
    <h4 class="item-details">Section Heading</h4>
    <ul class="responsibilities-list" contenteditable="true">
      <li>List Item</li>
    </ul>`;
    this.rightColumn.appendChild(newSectionDiv);
  }

  deleteSelectedSection() {
    const selectedSections = document.querySelector(':focus-visible');
    if (selectedSections) {
      const parentDeleteSection = selectedSections.closest('.delete');
      if (parentDeleteSection) {
        parentDeleteSection.remove();
      } else {
        console.error('unable to delete section.');
      }
    }
  }

  saveResumeJSON() {
    const resumeJSON = this.createResumeJSON(this.resumeContainer);

    // Save the JSON data to local storage
    localStorage.setItem('resumeJSON', JSON.stringify(resumeJSON));

    // Print the JSON data in string format
    // console.log(JSON.stringify(resumeJSON, null, 2));
  }

  loadResumeData() {
    // Check if resume data exists in local storage
    const resumeData = localStorage.getItem('resumeJSON');
    if (resumeData) {
      // Clear the current resume content
      this.resumeContainer.innerHTML = '';

      // Parse the JSON data from local storage
      const resumeJSON = JSON.parse(resumeData);

      // Recursively generate the UI from the JSON data
      this.generateUIFromJSON(resumeJSON, this.resumeContainer);
    }
  }

  generateUIFromJSON(json, parentElement) {
    // Check if the JSON data represents the resumeContainer
    if (json.tag === 'div' && json.attributes && json.attributes.id && json.attributes.id.includes('resume')) {
      // Use the resumeContainer itself
      const element = this.resumeContainer;

      // Set attributes for the HTML element
      if (json.attributes) {
        for (const attrName in json.attributes) {
          element.setAttribute(attrName, json.attributes[attrName].join(' '));
        }
      }

      // Recursively generate child elements if they exist
      if (json.children) {
        json.children.forEach((childJSON) => {
          this.generateUIFromJSON(childJSON, element);
        });
      }
    } else {
      // Create the HTML element based on the JSON data
      const element = document.createElement(json.tag);

      // Set attributes for the HTML element
      if (json.attributes) {
        for (const attrName in json.attributes) {
          element.setAttribute(attrName, json.attributes[attrName].join(' '));
        }
      }

      // Set text content if it exists
      if (json.text) {
        element.textContent = json.text;
      }

      // Append the element to the parent
      parentElement.appendChild(element);

      // Recursively generate child elements if they exist
      if (json.children) {
        json.children.forEach((childJSON) => {
          this.generateUIFromJSON(childJSON, element);
        });
      }
    }
  }

  createResumeJSON(element) {
    const json = {};

    // Get the tag name of the HTML element
    json.tag = element.tagName.toLowerCase();

    // Get the attributes of the HTML element
    json.attributes = {};
    Array.from(element.attributes).forEach((attr) => {
      json.attributes[attr.name] = String(attr.value).split(' ');
    });

    // Check if the tag name is one of the specified ones
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'a', 'p'].includes(json.tag)) {
      // Include text content for specified tags
      json.text = element.textContent.trim();
    }

    // Recursively process child elements if there are any
    if (element.children.length > 0) {
      json.children = [];
      Array.from(element.children).forEach((child) => {
        json.children.push(this.createResumeJSON(child)); // Recursive call
      });
    }

    return json;
  }




}

const obj = new TemplateEngine();
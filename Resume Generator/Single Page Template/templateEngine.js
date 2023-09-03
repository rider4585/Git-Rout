class TemplateEngine {
  constructor() {
    this.addToLeftBtn = document.getElementById('add-left-section');
    this.addToRightBtn = document.getElementById('add-right-section');
    this.leftColumn = document.getElementById('left-column');
    this.rightColumn = document.getElementById('right-column');
    this.addEvents();
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
        console.error('Parent section not found for:', section);
      }
    }
  }
}

const obj = new TemplateEngine();
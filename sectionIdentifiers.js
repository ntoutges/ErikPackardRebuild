export class SectionIdentifiers {
  constructor(parent) {
    this.el = document.createElement("div");
    this.el.classList.add("sections");

    parent.append(this.el);
    this.sections = {};
    this.selected = null;
  }

  build() {
    this.el.innerHTML = "";
    const sectionsArr = Object.keys(this.sections);
    
    function selectSection(el) {
      const id = el.getAttribute("data-section-id");

      if (this.selected) {
        this.sections[this.selected].classList.remove("selected");
        const section = document.querySelector(`div[data-section-name=\"${this.selected}\"]`);
        if (section) {
          section.querySelector(".section-headers")?.classList.remove("selected");
        }
      }
      this.selected = id ?? null;
      
      if (this.selected) {
        this.sections[this.selected].classList.add("selected");
        const section = document.querySelector(`div[data-section-name=\"${this.selected}\"]`);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
          section.querySelector(".section-headers")?.classList.remove("collapsed");
          section.querySelector(".section-headers")?.classList.add("selected");
        }
      }
    }

    for (const section of sectionsArr) {
      const sectionEl = document.createElement("div");
      sectionEl.classList.add("sections-el");
      sectionEl.innerText = section;
      sectionEl.setAttribute("data-section-id", section);

      const background = document.createElement("div");
      background.classList.add("sections-background")
      sectionEl.append(background);

      this.sections[section] = sectionEl;
      this.el.append(sectionEl);

      sectionEl.addEventListener("click", selectSection.bind(this, sectionEl));
      if (this.selected === null) sectionEl.click(); // nothing yet selected, select this
    }

    if (this.sections.hasOwnProperty(this.selected)) this.sections[this.selected].classList.add("selected");
  }

  addSection(name) {
    if (this.sections.hasOwnProperty(name)) return; // section already exists
    this.sections[name] = null;

    this.build();
  }

  popSection(name) {
    if (!this.sections.hasOwnProperty(name)) return; // section doesn't exist
    delete this.sections[name];

    this.build();
  }
}
export class BiographyItem {
  constructor(parent, title) {
    this.el = document.createElement("div");
    this.el.classList.add("profile-biography-items");

    parent.append(this.el);
    this.names = {};
    this.title = title;

    this.build();
  }

  build() {
    this.el.innerHTML = ""; // reset element
    
    const title = document.createElement("div");
    title.classList.add("profile-biography-item-titles");
    title.innerText = this.title;
    this.el.append(title);

    const nameArr = Object.keys(this.names);
    for (const name of nameArr) {
      const nameObj = name.replace(/\((.+?)\)\[(.+?)\]/g, "<a href=\"$2\" target=\"blank\">$1</a>");

      const childEl = document.createElement("div");
      childEl.classList.add("profile-biography-item-elements");
      childEl.innerHTML = nameObj;
      this.el.append(childEl);
    }
  }

  addChild(name) {
    if (this.names.hasOwnProperty(name)) return; // already exists
    this.names[name] = true;
    this.build();
  }z

  removeChild(name) {
    if (!this.names.hasOwnProperty(name)) return; // doesn't exists
    delete this.names[name];
    this.build();
  }
}
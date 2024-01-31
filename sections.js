export class Section {
  constructor({
    parent,
    title,
    content,
    collapsible=true
  }) {
    this.el = document.createElement("div");
    this.el.classList.add("section-containers");
    this.el.setAttribute("data-section-name", title);

    this.header = document.createElement("div");
    this.header.classList.add("section-headers");
    this.header.innerHTML = title;
    if (collapsible) this.header.classList.add("collapsible");
    
    this.body = document.createElement("div");
    this.body.classList.add("section-bodies");

    if (collapsible) {
      this.header.addEventListener("click", () => {
        this.header.classList.toggle("collapsed");
      });
    }
    
    this.el.append(this.header);
    this.el.append(this.body);

    parent.append(this.el);

    let toAppend = false;
    switch (content.type) {
      case "links":
        toAppend = Section.buildLinkDump(content.value);
        break;
      case "section":
        toAppend = Section.buildSubSection(content.value);
        break;
      case "doc":
        toAppend = Section.buildDocSection(content.value);
        break;
    }
    if (toAppend) this.body.append(toAppend);
  }

  static buildSubSection(subsectionData) {
    const container = document.createElement("div");
    for (const name in subsectionData) {
      new Section({
        "parent": container,
        "content": subsectionData[name].content,
        "title": name,
        "collapsible": subsectionData[name].collapsible ?? false
      });
    }
    return container;
  }

  static buildLinkDump(linksArr) {
    const container = document.createElement("ul");
    container.classList.add("link-dumps");
    for (const linkStr of linksArr) {
      const listItem = document.createElement("li");
      const linkObj = linkStr.replace(/\((.+?)\)\[(.+?)\]/g, "<a href=\"$2\" target=\"blank\">$1</a>");
      listItem.innerHTML = linkObj;
      container.append(listItem);
    }
    return container;
  }

  static buildDocSection(docsArr) {
    const container = document.createElement("ul");
    container.classList.add("link-dumps");
    for (const linkStr of docsArr) {
      const listItem = document.createElement("li");

      const matchData = (/\((.+?)\)\[(.+?)\]/g).exec(linkStr);
      if (!matchData) continue;
      
      const txt = matchData[1];
      const uri = encodeURIComponent(matchData[2]);
      const link = document.createElement("a");
      link.href = `https://docs.google.com/gview?url=${uri}`;
      link.target = "_blank";
      link.innerHTML = txt;
      listItem.append(link);
      container.append(listItem);
    }
    return container;
  }
}
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

      for (const matchData of linkStr.matchAll(/([^(]*)\((.+?)\)\[(.+?)\]([^(]*)/g)) {
        const initialText = matchData[1] || "";
        const finalText = matchData[4] || "";
        const txt = matchData[2];

        let uri = matchData[3];
        const semicolonIndex = uri.lastIndexOf(";")+1;
        const ext = uri.substring(uri.lastIndexOf(".")+1);
        const isDoc = ext == "doc" || ext == "docx" || uri.substring(semicolonIndex) == "doc";

        if (isDoc) {
          if (uri.substring(semicolonIndex) == "doc") uri = uri.substring(0, semicolonIndex-1);
          uri = `https://docs.google.com/gview?url=${encodeURIComponent(uri)}`;
        }
        const link = document.createElement("a");
        link.href = uri;
        link.target = "_blank";
        link.innerHTML = txt;
        listItem.append(initialText, link, finalText);
      }
      container.append(listItem);
    }
    return container;
  }
}
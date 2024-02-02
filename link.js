var shift = {};
var links = {};
var linkParents = {};

const linkPattern = /\/([^/]+)(\/|$)/;
export class Link {
  constructor({
    imgSrc="",
    title="Unnamed Link",
    desc="",
    color="cornsilk",
    series = "default",
    href
  }) {
    this.el = document.createElement("a");
    this.el.classList.add("link-els");
    this.el.style.background = color;
    this.el.href = href;
    this.el.target = "_blank";

    // may remove this...
    if (linkPattern.test(href)) this.el.title = href.match(linkPattern)[1];
    else this.el.title = href;

    // the bulk of this is just to construct the html, and fill it out
    this.img = document.createElement("img");
    this.img.src = "./graphics/" + imgSrc;
    this.img.classList.add("link-icons");
    this.img.draggable = false;
    this.el.append(this.img);

    const bios = document.createElement("div");
    bios.classList.add("link-bios");
    this.el.append(bios);

    this.titleEl = document.createElement("div");
    this.titleEl.classList.add("link-titles");
    this.titleEl.innerText = title;

    this.descEl = document.createElement("div");
    this.descEl.classList.add("link-descs");
    this.descEl.innerText = desc;

    bios.append(this.titleEl, this.descEl);

    if (!links.hasOwnProperty(series)) links[series] = [];
    links[series].push(this);

    if (linkParents.hasOwnProperty(series)) linkParents[series].append(this.el);

    this.hideTimer = null;
  }

  shrink() {
    this.el.classList.add("shrink");
    
    // don't start timeout again
    if (this.hideTimer !== null) return;
    this.hideTimer = setTimeout(() => {
      this.el.style.display = "none";
      this.hideTimer = null;
    }, 100);
  }
  grow() {
    this.el.style.display = ""; // unhide
    this.el.offsetWidth; // trigger CSS reflow
    this.el.classList.remove("shrink");
    if (this.hideTimer !== null) {
      clearTimeout(this.hideTimer); // don't hide again
      this.hideTimer = null;
    }
  }

  static shift(step, series="default") {
    if (!shift.hasOwnProperty(series)) shift[series] = 0;
    
    const oldShift = shift[series];
    shift[series] += step;
    
    if (shift[series] < 0) shift[series] = 0;
    else if (shift[series] >= (links[series])?.length) shift[series] = links[series].length-1;

    if (oldShift == shift[series] || !links.hasOwnProperty(series)) return; // no difference
    const newShift = shift[series];

    for (let i = 0; i < Math.max(oldShift, newShift); i++) {
      if (i < newShift) {
        links[series][i].shrink();
      }
      else links[series][i].grow();
    }
  }

  static setSeriesParent(parent, series="default") {
    linkParents[series] = parent;
  }
}
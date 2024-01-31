import { BiographyItem } from "./bio.js";
import { Link } from "./link.js";
import { SectionIdentifiers } from "./sectionIdentifiers.js";
import { Section } from "./sections.js";

const $ = document.querySelector.bind(document);

Link.setSeriesParent($("#links-body"), "default");
const sectionIdentifiers = new SectionIdentifiers($("#sidebar"));

$("#link-scroll-left").addEventListener("click", Link.shift.bind(null, -1, "default"));
$("#link-scroll-right").addEventListener("click", Link.shift.bind(null, 1, "default"));

fetch("./data/structure.json").then(res => res.json()).then(data => {
  if (data.hasOwnProperty("profile")) {
    if (data.profile.hasOwnProperty("image")) createProfileImage(data.profile.image);
    if (data.profile.hasOwnProperty("biography")) createBiography(data.profile.biography);
  }
  if (data.hasOwnProperty("links")) createLinks(data.links);
  if (data.hasOwnProperty("sections")) createSectionsIdentifiers(data.sections);
});

fetch("./data/sections.json").then(res => res.json()).then(data => {
  createSections(data);
});

function createProfileImage(src) {
  $("#profile-picture").src = src;
}

function createBiography(data) {
  for (const key in data) {
    const item = new BiographyItem($("#profile-biography"), key);
    for (const name of data[key]) { item.addChild(name); }
  }
}

function createLinks(data) {
  for (const oldLinkData of data) {
    const newLinkData = {
      title: oldLinkData.title,
      href: oldLinkData.href,
      series: "default"
    };
    if (oldLinkData.description) newLinkData.desc = oldLinkData.description;
    if (oldLinkData.img) newLinkData.imgSrc = oldLinkData.img;

    new Link(newLinkData);
  }
}

function createSectionsIdentifiers(data) {
  for (const sectionName of data) {
    sectionIdentifiers.addSection(sectionName);
  }
}

function createSections(data) {
  for (const sectionName in data) {
    const sectionData = data[sectionName];
    new Section({
      parent: $("#content"),
      title: sectionName,
      content: sectionData.content,
      collapsible: sectionData.collapsible ?? false
    })
  }
}

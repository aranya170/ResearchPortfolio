// Single source for search-engine metadata. scripts/prerender.js uses it at build time to
// write the <head> tags, JSON-LD, sitemap.xml and robots.txt.
export default {
  // The one official address; every other host points search engines here
  siteUrl: "https://aranyakishordas.vercel.app",

  name: "Aranya Kishor Das",
  // ~60 characters: shown as the blue link in search results
  title: "Aranya Kishor Das | AI & Robotics Researcher, Bangladesh",
  // ~155 characters: shown under the link in search results
  description:
    "Aranya Kishor Das is an AI and robotics researcher and software engineer in Dhaka, Bangladesh, President of UIU Robotics Club and creator of RoboNeT.",
  shareImage: "/share-card.png",
  shareImageAlt: "Aranya Kishor Das, AI and robotics researcher and software engineer from Bangladesh",

  jobTitles: ["AI Researcher", "Robotics Researcher", "Software Engineer"],
  knowsAbout: [
    "Artificial Intelligence",
    "Deep Learning",
    "Computer Vision",
    "Image Segmentation",
    "Remote Sensing",
    "Robotics",
    "Parallel Kinematics",
    "Embedded Systems",
    "Internet of Things",
    "Full-Stack Web Development",
    "STEM Education",
  ],
  location: { locality: "Dhaka", country: "Bangladesh", countryCode: "BD" },
  university: { name: "United International University", url: "https://www.uiu.ac.bd/" },
  memberOf: [{ name: "UIU Robotics Club", role: "President" }],

  // Every profile that is you: helps search engines connect them into one identity.
  // Add your ORCID and ResearchGate URLs here once you have them.
  sameAs: [
    "https://github.com/aranya170",
    "https://www.linkedin.com/in/aranya170",
    // "https://orcid.org/0000-0000-0000-0000",
    // "https://www.researchgate.net/profile/Aranya-Kishor-Das",
  ],

  googleSiteVerification: "04MWDElRDxtE4FUM61bxVxhFMIfrReh66Aw7IjiMG-A",
};

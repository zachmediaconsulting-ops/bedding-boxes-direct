// MAIN MENU and FOOTER LINKS. Edit labels/order here. Every href must be a page that exists
// (the build fails on broken links). Campaign (ad) pages are never added to the menu.
import { PRODUCTS } from '../data/products.mjs';
import { INDUSTRIES } from './industries.mjs';

export const NAV = [
  { label: 'Home', href: '/' },
  {
    label: 'Bedding Boxes', href: '/all-bedding-boxes-for-sale/',
    mega: { type: 'image', layout: 'third', image: '12-yard-bedding-box-for-sale-7', alt: 'Blue Bedding Boxes Direct bedding boxes on the manufacturing lot', title: 'Shop All Bedding Boxes' },
    items: [
      { label: 'All Sizes', href: '/all-bedding-boxes-for-sale/' },
      ...PRODUCTS.map((p) => ({ label: `${p.size} Yard Bedding Box`, href: p.path })),
      { label: 'Custom Bedding Boxes', href: '/bedding-box-fabrication-company/' },
      { label: 'AR500 Bedding Boxes', href: '/ar500-bedding-boxes-for-sale/' },
      { label: 'Mini Excavator Bedding Box', href: '/product-category/mini-excavator-bedding-box-for-sale/' },
    ],
  },
  {
    label: 'Industries', href: '/industries/',
    mega: { type: 'image', layout: 'third', image: 'what-are-bedding-boxes-used-for', alt: 'Excavator digging a utility trench', title: 'Industries We Serve' },
    // Same pages, order and names as the footer sitemap's Industries column.
    items: [
      { label: 'All Industries', href: '/industries/' },
      { label: 'Utility Contractors', href: '/bedding-boxes-for-utility-companies/' },
      { label: 'Trenching', href: '/bedding-boxes-for-trenching/' },
      { label: 'Municipalities', href: '/bedding-boxes-for-municipalities/' },
      ...INDUSTRIES.map((i) => ({ label: i.label, href: i.path })),
    ],
  },
  {
    label: 'Volume Deals', href: '/fleet-bedding-box-bundles/',
    mega: { type: 'deals' },
    items: [
      { label: '10-Box Bundle (Save 5%)', href: '/fleet-bedding-box-bundles/#10-bedding-box-bundle' },
      { label: '20-Box Bundle (Save 7%)', href: '/fleet-bedding-box-bundles/#20-bedding-box-bundle' },
      { label: 'Large Fleet Orders', href: '/fleet-bedding-box-bundles/#large-fleet-orders' },
    ],
  },
  {
    label: 'Resources', href: '/blog/',
    mega: { type: 'resources', pdf: '/media/bedding-box-specifications.pdf' },
    items: [
      { label: 'Size Selection Guide', href: '/what-size-bedding-box-do-i-need/' },
      { label: 'Uses and Applications', href: '/what-is-a-bedding-box-used-for/' },
      { label: 'Rent vs. Buy Calculator', href: '/bedding-box-rent-vs-buy-calculator/' },
      { label: 'Shipping Information', href: '/shipping-details/' },
      { label: 'Bedding Boxes by State', href: '/bedding-boxes-for-sale/' },
      { label: 'All Resources', href: '/blog/' },
    ],
  },
  {
    label: 'States', href: '/bedding-boxes-for-sale/',
    mega: { type: 'states' },
    items: [{ label: 'All States', href: '/bedding-boxes-for-sale/' }, ...US_STATES.map((s) => ({ label: s.name, href: statePath(s) }))],
  },
  { label: 'About', href: '/about-bedding-boxes-direct/' },
  { label: 'Contact', href: '/contact-us/' },
];

// Footer columns (same headings as the original footer: Site Map / Industries Served / Additional Info).
export const FOOTER = [
  {
    title: 'Industries Served', links: [
      ['Utilities', '/bedding-boxes-for-utility-companies/'], ['Trenching', '/bedding-boxes-for-trenching/'],
      ['Municipalities', '/bedding-boxes-for-municipalities/'], ['Excavating', '/industries/excavation-contractors/'],
      ['Rental', '/industries/equipment-rental-fleets/'], ['Pipeline', '/industries/pipeline-contractors/'], ['All Industries', '/industries/'],
    ],
  },
  {
    title: 'Additional Info', links: [
      ['What is a bedding box used for?', '/what-is-a-bedding-box-used-for/'], ['What size bedding box do I need?', '/what-size-bedding-box-do-i-need/'],
      ['Rent vs. Buy Calculator', '/bedding-box-rent-vs-buy-calculator/'], ['Shipping Details', '/shipping-details/'],
      ['Bedding Boxes by State', '/bedding-boxes-for-sale/'], ['About Us', '/about-bedding-boxes-direct/'], ['Contact Us', '/contact-us/'],
    ],
  },
];

export const LEGAL = [['Privacy Policy', '/privacy-policy/'], ['Return & Refund Policy', '/return-refund-policy/'], ['Shipping Details', '/shipping-details/']];

// FOOTER SITE DIRECTORY — every public page, so all pages are reachable from the footer.
// The build fails if a page is missing here (except ad landing pages, thank-you and 404).
import { US_STATES, statePath } from '../data/states.mjs';

export const DIRECTORY = [
  {
    title: 'Bedding Boxes', links: [
      ['All Bedding Boxes', '/all-bedding-boxes-for-sale/'], ['Bedding Boxes', '/bedding-boxes/'],
      ...PRODUCTS.map((p) => [`${p.size} Yard Bedding Box`, p.path]),
      ['Mini Excavator Bedding Box', '/product-category/mini-excavator-bedding-box-for-sale/'],
      ['Custom Bedding Boxes', '/bedding-box-fabrication-company/'], ['AR500 Bedding Boxes', '/ar500-bedding-boxes-for-sale/'],
    ],
  },
  {
    title: 'Equipment Guides', links: [
      ['Gravel Boxes for Sale', '/gravel-boxes-for-sale/'], ['Stone Boxes for Sale', '/stone-boxes-for-sale/'],
      ['Excavator Bedding Boxes', '/excavator-bedding-boxes/'], ['Pipe Bedding Boxes', '/pipe-bedding-boxes/'],
      ['Stone Mizer Alternative', '/stone-mizer-alternative/'],
    ],
  },
  {
    title: 'Industries', links: [
      ['All Industries', '/industries/'], ['Utility Contractors', '/bedding-boxes-for-utility-companies/'],
      ['Trenching', '/bedding-boxes-for-trenching/'], ['Municipalities', '/bedding-boxes-for-municipalities/'],
      ...INDUSTRIES.map((i) => [i.label, i.path]),
    ],
  },
  {
    title: 'Volume Deals & Company', links: [
      ['Fleet Bundles', '/fleet-bedding-box-bundles/'], ['Request a Quote', '/request-a-quote/'],
      ['About Us', '/about-bedding-boxes-direct/'], ['Contact Us', '/contact-us/'],
      ['Resources', '/blog/'], ['What is a bedding box used for?', '/what-is-a-bedding-box-used-for/'],
      ['What size bedding box do I need?', '/what-size-bedding-box-do-i-need/'], ['Rent vs. Buy Calculator', '/bedding-box-rent-vs-buy-calculator/'],
      ['Shipping Details', '/shipping-details/'], ['Privacy Policy', '/privacy-policy/'], ['Return & Refund Policy', '/return-refund-policy/'],
    ],
  },
  { title: 'Bedding Box Availability', states: true, links: [['All States', '/bedding-boxes-for-sale/'], ...US_STATES.map((s) => [s.name, statePath(s)])] },
];

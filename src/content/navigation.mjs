// MAIN MENU and FOOTER LINKS. Edit labels/order here. Every href must be a page that exists
// (the build fails on broken links). Campaign (ad) pages are never added to the menu.
import { PRODUCTS } from '../data/products.mjs';

export const NAV = [
  { label: 'Home', href: '/' },
  {
    label: 'Bedding Boxes', href: '/all-bedding-boxes-for-sale/', items: [
      { label: 'All Sizes', href: '/all-bedding-boxes-for-sale/' },
      ...PRODUCTS.map((p) => ({ label: `${p.size} Yard Bedding Box`, href: p.path })),
      { label: 'Custom Bedding Boxes', href: '/bedding-box-fabrication-company/' },
      { label: 'AR500 Bedding Boxes', href: '/ar500-bedding-boxes-for-sale/' },
      { label: 'Mini Excavator Bedding Box', href: '/product-category/mini-excavator-bedding-box-for-sale/' },
    ],
  },
  {
    label: 'Industries', href: '/industries/', items: [
      { label: 'Utility Contractors', href: '/bedding-boxes-for-utility-companies/' },
      { label: 'Equipment Rental Fleets', href: '/industries/equipment-rental-fleets/' },
      { label: 'Underground Utilities', href: '/industries/underground-utility-construction/' },
      { label: 'Water & Sewer', href: '/industries/water-sewer-contractors/' },
      { label: 'Pipeline', href: '/industries/pipeline-contractors/' },
      { label: 'Excavation', href: '/industries/excavation-contractors/' },
      { label: 'Trenching', href: '/bedding-boxes-for-trenching/' },
      { label: 'Municipalities', href: '/bedding-boxes-for-municipalities/' },
      { label: 'All Industries', href: '/industries/' },
    ],
  },
  {
    label: 'Volume Deals', href: '/fleet-bedding-box-bundles/', items: [
      { label: '10-Box Bundle (Save 5%)', href: '/fleet-bedding-box-bundles/#10-bedding-box-bundle' },
      { label: '20-Box Bundle (Save 7%)', href: '/fleet-bedding-box-bundles/#20-bedding-box-bundle' },
      { label: 'Large Fleet Orders', href: '/fleet-bedding-box-bundles/#large-fleet-orders' },
    ],
  },
  {
    label: 'Resources', href: '/blog/', items: [
      { label: 'Size Selection Guide', href: '/what-size-bedding-box-do-i-need/' },
      { label: 'Uses and Applications', href: '/what-is-a-bedding-box-used-for/' },
      { label: 'Rent vs. Buy Calculator', href: '/bedding-box-rent-vs-buy-calculator/' },
      { label: 'Shipping Information', href: '/shipping-details/' },
      { label: 'Bedding Boxes by State', href: '/bedding-boxes-for-sale/' },
      { label: 'All Resources', href: '/blog/' },
    ],
  },
  { label: 'About', href: '/about-bedding-boxes-direct/' },
  { label: 'Contact', href: '/contact-us/' },
];

// Footer columns (same headings as the original footer: Site Map / Industries Served / Additional Info).
export const FOOTER = [
  {
    title: 'Site Map', links: [
      ['All Bedding Boxes', '/all-bedding-boxes-for-sale/'], ['7 Yard Bedding Boxes', '/product/7-yard-bedding-box-for-sale/'],
      ['9 Yard Bedding Boxes', '/product/9-yard-bedding-box-for-sale/'], ['12 Yard Bedding Boxes', '/product/12-yard-bedding-box-for-sale/'],
      ['Custom Bedding Boxes', '/bedding-box-fabrication-company/'], ['AR500 Bedding Boxes', '/ar500-bedding-boxes-for-sale/'],
      ['Fleet Bundles', '/fleet-bedding-box-bundles/'], ['Request a Quote', '/request-a-quote/'],
    ],
  },
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

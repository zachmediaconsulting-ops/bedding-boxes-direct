// Business facts used across the site. Change a phone number, email or hours here and it changes everywhere.
// Only information published on the original site lives here.
export const SITE = {
  url: 'https://www.beddingboxesdirect.com', // www + trailing slashes, same as the WordPress site
  name: 'Bedding Boxes Direct',
  parentCompany: 'A Merica Metal Works Company', // shown in the footer copyright line, as on the original site
  tagline: 'American Made Bedding Boxes for Sale',
  summary: 'Helping contractors increase profit margins by improving job site efficiency and reducing material waste.',
  email: 'sales@beddingboxesdirect.com',
  owner: 'Stacy Swingley',
  address: { street: '1399 S Fork Rd', city: 'Cody', region: 'WY', postal: '82414', country: 'US' },

  // One sales line (owner decision 2026-11-20: the (406) number was removed). It answers both time zones,
  // so the hours show Mountain and Eastern times together under every phone button.
  phones: [
    { key: 'sales', label: 'Sales', display: '1 (307) 263-5020', number: '(307) 263-5020', href: 'tel:+13072635020', e164: '+1-307-263-5020', hours: 'Mon–Fri 5AM to 5PM (MST) · Mon–Fri 7AM to 7PM (EST)' },
  ],
  officeHours: 'Mon–Fri 5AM to 5PM (MST) · Mon–Fri 7AM to 7PM (EST)',
  responseTime: 'Monday through Friday we will respond within 24hrs.',

  youtube: 'pT4-OnbnhAw', // "Why choose Bedding Boxes Direct? (90 seconds)"
  heroVideo: '/media/bedding-boxes-direct-vertical.mp4',
  sameAs: ['https://www.facebook.com/p/Bedding-Boxes-Direct-61583246799629/'],
  shipsTo: 'Nationwide shipping to the continental United States (excluding Alaska & Hawaii).',
};

// Every state uses the one sales line.
export const TIMEZONE_LINE = { Eastern: 'sales', Central: 'sales', Mountain: 'sales', Pacific: 'sales' };

export const phone = (key = 'sales') => SITE.phones.find((p) => p.key === key) || SITE.phones[0];
export const mainPhone = SITE.phones[0];
export const addressLine = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postal}`;

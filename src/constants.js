// TODO: move this to the proxy server

export const INTROSEARCH_STAGES = ['keywords', 'raise', 'location'];

export const ZIPCODECLIENTKEY = 'js-IQnw1s8a35CYiI4clJrcM1yIvqTyyciNZfDHMIrhOY2ViLWXTjzYVzYEdkPjwRqD';

export const ZIPDISTANCE = '40';

export const MINPLACE = 800;

export const STAGEPROPS = {
  none: {
    faIcon: 'ellipsis-h',
    text: 'Get Connected',
  },
  added: {
    faIcon: 'check',
    text: 'Needs an Intro',
    advice: 'Use this investor’s data to try to find mutual contacts that can introduce you. You can try contacting them directly, but an introduction has a higher chance of success.',
  },
  connected: {
    faIcon: 'project-diagram',
    text: 'Having a Conversation',
    advice: 'Now that you’ve been introduced, start a conversation about why your startup would be a great investment opportunity.',
  },
  conversing: {
    faIcon: 'comments',
    text: 'Getting an Agreement',
  },
  negotiating: {
    faIcon: 'hands-helping',
    text: 'Negotiating the Details',
  },
  invested: {
    faIcon: 'money-check',
    text: 'They Have Invested',
  },
  leading: {
    faIcon: 'flag',
    text: 'They are My Lead Investor',
  },
  archived: {
    faIcon: 'archive',
    text: 'They are Archived',
  },
};

export const PROFILE_INPUT_KEYS = [
  { field: 'description', default: '' },
  { field: 'linkedin', default: '' },
  { field: 'links', default: [] },
  { field: 'location_city', default: '' },
  { field: 'location_state', default: '' },
  { field: 'name', default: '' },
  { field: 'permalink', default: '' },
  { field: 'primary_job_title', default: '' },
  { field: 'primary_organization_homepage', default: '' },
  { field: 'primary_organization_logo', default: '' },
  { field: 'primary_organization_name', default: '' },
  { field: 'remote', default: false },
  { field: 'team_size', default: 1 },
  { field: 'twitter', default: '' },
  { field: 'uuid', default: '' },
];

export const cb_founder_imagePrefix = 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/';
export const cb_logo_imagePrefix = 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/';

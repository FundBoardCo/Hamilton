// TODO: move this to the proxy server

export const INTROSEARCH_STAGES = ['keywords', 'raise', 'location'];

export const ZIPCODECLIENTKEY = 'js-IQnw1s8a35CYiI4clJrcM1yIvqTyyciNZfDHMIrhOY2ViLWXTjzYVzYEdkPjwRqD';

export const ZIPDISTANCE = '20';

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

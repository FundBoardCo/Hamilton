import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { getSafeVar, processErr } from '../utils';

export default function people(state = {}, action) {
  const records = {};
  const { params = {} } = action;
  const { uuid, reason } = params;
  // TODO: remove this when we have real data
  const fakeData = {
    isLead: true,
    isOpen: true,
    isImpact: true,
    matches: {
      keywords: ['B2B', 'AI', 'Automation', 'AR'],
      raise: true,
      location: true,
      name: true,
      org: true,
    },
    investments: [
      {
        id: 'foo1',
        name: 'Nuve',
        startup_permalink: 'nuve',
        logo_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1397188930/e7218786673eb38ad8de0a87dee6f34c.jpg',
        founders: [
          {
            name: 'Elom Tsogbe',
            permalink: 'elom-tsogbe',
            image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/nh2fbkwucvqf8kmuir2u',
          },
        ],
      },
      {
        id: 'foo2',
        name: 'Fetch Package',
        startup_permalink: 'fetch-package',
        logo_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/jsfia9zgl83floeiazck',
        founders: [
          {
            name: 'Boone Putney',
            permalink: 'boone-putney',
            image_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1437093545/ibiepnrnymghaiu8nm2x.jpg',
          },
        ],
      },
      {
        id: 'foo3',
        name: 'SpyCloud, Inc.',
        startup_permalink: 'spycloud-inc',
        logo_url: 'https://res-5.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1496321283/mjf4w9kc2c3dvahf5qmt.png',
        founders: [
          {
            name: 'Jennifer Parker-Snider',
            permalink: 'jennifer-parker-snider',
            image_url: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/vncusmb4owdry1pyfc7q',
          },
        ],
      },
      {
        id: 'foo4',
        name: 'Outbound Engine',
        startup_permalink: 'outboundengine',
        logo_url: 'https://res-4.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1490121099/gutbkjabw5gwyay7hc6u.png',
        founders: [
          {
            name: 'Sharon Slonaker, SPHR, SHRM-SCP',
            permalink: 'sharon-slonaker-sphr-shrm-scp',
            image_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/i26pvn1tgt2qm5bcsvkl',
          },
        ],
      },
      {
        id: 'foo5',
        name: 'NarrativeDx',
        startup_permalink: 'narrativedx',
        logo_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/xdc5t6gzrk2dd3qvmcuv',
        founders: [
          {
            name: 'David Sassen',
            permalink: 'david-sassen',
            image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/jz0vv1uwojk0mprby49g',
          },
        ],
      },
      {
        id: 'foo6',
        name: 'StackEngine',
        startup_permalink: 'stackengine',
        logo_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1401710880/pbuw8i0trst6atnkxbie.jpg',
        founders: [
          {
            name: 'Jonathan Reeve',
            permalink: 'jonathan-reeve',
            image_url: 'https://res-4.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1450219352/dqi4ndwk2k1tm7drmlmk.jpg',
          },
        ],
      },
      {
        id: 'foo7',
        name: 'Favor',
        startup_permalink: 'favor',
        logo_url: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1504818744/hudc0ohrdxaeke6u60zn.png',
        founders: [
          {
            name: 'Jag Bath',
            permalink: 'jag-bath',
            image_url: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/uq3hxcigkd8ggs3myx0y',
          },
        ],
      },
      {
        id: 'foo1b',
        name: 'Nuve',
        startup_permalink: 'nuve',
        logo_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1397188930/e7218786673eb38ad8de0a87dee6f34c.jpg',
        founders: [
          {
            name: 'Elom Tsogbe',
            permalink: 'elom-tsogbe',
            image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/nh2fbkwucvqf8kmuir2u',
          },
        ],
      },
      {
        id: 'foo2b',
        name: 'Fetch Package',
        startup_permalink: 'fetch-package',
        logo_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/jsfia9zgl83floeiazck',
        founders: [
          {
            name: 'Boone Putney',
            permalink: 'boone-putney',
            image_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1437093545/ibiepnrnymghaiu8nm2x.jpg',
          },
        ],
      },
      {
        id: 'foo3b',
        name: 'SpyCloud, Inc.',
        startup_permalink: 'spycloud-inc',
        logo_url: 'https://res-5.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1496321283/mjf4w9kc2c3dvahf5qmt.png',
        founders: [
          {
            name: 'Jennifer Parker-Snider',
            permalink: 'jennifer-parker-snider',
            image_url: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/vncusmb4owdry1pyfc7q',
          },
        ],
      },
      {
        id: 'foo4b',
        name: 'Outbound Engine',
        startup_permalink: 'outboundengine',
        logo_url: 'https://res-4.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1490121099/gutbkjabw5gwyay7hc6u.png',
        founders: [
          {
            name: 'Sharon Slonaker, SPHR, SHRM-SCP',
            permalink: 'sharon-slonaker-sphr-shrm-scp',
            image_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/i26pvn1tgt2qm5bcsvkl',
          },
        ],
      },
      {
        id: 'foo5b',
        name: 'NarrativeDx',
        startup_permalink: 'narrativedx',
        logo_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/xdc5t6gzrk2dd3qvmcuv',
        founders: [
          {
            name: 'David Sassen',
            permalink: 'david-sassen',
            image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/jz0vv1uwojk0mprby49g',
          },
        ],
      },
      {
        id: 'foo6b',
        name: 'StackEngine',
        startup_permalink: 'stackengine',
        logo_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1401710880/pbuw8i0trst6atnkxbie.jpg',
        founders: [
          {
            name: 'Jonathan Reeve',
            permalink: 'jonathan-reeve',
            image_url: 'https://res-4.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1450219352/dqi4ndwk2k1tm7drmlmk.jpg',
          },
        ],
      },
      {
        id: 'foo7b',
        name: 'Favor',
        startup_permalink: 'favor',
        logo_url: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_120,w_120,f_auto,b_white,q_auto:eco/v1504818744/hudc0ohrdxaeke6u60zn.png',
        founders: [
          {
            name: 'Jag Bath',
            permalink: 'jag-bath',
            image_url: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_120,w_120,f_auto,g_faces,z_0.7,b_white,q_auto:eco/uq3hxcigkd8ggs3myx0y',
          },
        ],
      },
    ],
  };
  const rehydration = getSafeVar(() => action.payload.people, {});
  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...rehydration,
    };
    case types.PEOPLE_UPDATE:
      if (action.data.records) {
        action.data.records.forEach(r => {
          records[r.id] = { ...fakeData, ...r.fields };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PERSON_PUT_INVALID_REQUESTED:
      return {
        ...state,
        [uuid]: {
          ...state[uuid],
          invalid_reason: reason,
          invalid_status: 'pending',
        },
      };
    case types.PERSON_PUT_INVALID_SUCCEEDED:
      return {
        ...state,
        [uuid]: {
          ...state[uuid],
          invalid: true,
          invalid_status: 'succeeded',
        },
      };
    case types.PERSON_PUT_INVALID_FAILED:
      return {
        ...state,
        [uuid]: {
          ...state[uuid],
          invalid_status: processErr(action.error),
        },
      };
    case types.PERSON_CLEAR_INVALID:
      return {
        ...state,
        [uuid]: {
          ...state[uuid],
          invalid: false,
          invalid_reason: '',
          invalid_status: '',
        },
      };
    default: return state;
  }
}

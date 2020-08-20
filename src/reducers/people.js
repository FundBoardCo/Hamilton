import { REHYDRATE } from 'redux-persist';
import * as types from '../actions/types';
import { getSafeVar, processErr } from '../utils';

const fakeData = {
  fredwilson: {
    name: 'Fred Wilson',
    uuid: 'fredwilson',
    permalink: 'fred-wilson',
    image_id: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1462908941/jdrrrjvwo8rdcvfemaqv.jpg',
    primary_job_title: 'Partner',
    primary_organization: {
      value: 'Union Square Ventures',
      image_url: 'https://res-5.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/m55dmtzuaacwuqc2lmug',
      permalink: 'union-square-ventures',
      entity_def_id: 'Venture Capital',
      homepage: 'https://www.usv.com',
      linkedin: 'https://www.linkedin.com/company/union-square-ventures',
      twitter: 'https://twitter.com/usv',
      is_impact_fund: false,
    },
    location_city: 'New York',
    location_state: 'NY',
    linkedin: 'https://www.linkedin.com/in/fredwilson/',
    twitter: 'https://twitter.com/fredwilson',
    description: 'Fred Wilson has been a venture capitalist since 1987. He currently is a managing partner at Union Square Ventures and also founded Flatiron Partners. Fred has a Bachelors degree in Mechanical Engineering from MIT and an MBA from The Wharton School of Business at the University of Pennsylvania. Fred is married with three children and lives in New York City.',
    raise_min: 750000,
    raise_max: 200000000,
    is_lead_investor: true,
    is_partner_investor: true,
    partners: [
      {
        name: 'Brad Burnham',
        permalink: 'brad-burnham',
        primary_job_title: 'Managing Partner',
        image_url: 'https://res-4.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1397182336/20d190f3e1f49bf8271a716985025f19.jpg',
      },
      {
        name: 'Albert Wenger',
        permalink: 'albert-wenger',
        primary_job_title: 'Managing Partner',
        image_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1419330417/ufeehwy3xcsunl1wlz2u.jpg',
      },
      {
        name: 'Andy Weissman',
        permalink: 'andy-weissman',
        primary_job_title: 'Partner',
        image_url: 'https://res-5.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1460434088/hritkx8s6dsdstnx6jpm.png',
      },
      {
        name: 'John Buttrick',
        permalink: 'john-buttrick',
        primary_job_title: 'Investment Partner',
        image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1397185169/aa7f773dd31470ded934475bc0f69a66.jpg',
      },
    ],
    is_open_to_outreach: false,
    interests: '',
  },
  kevindurant: {
    name: 'Kevin Durant',
    uuid: 'kevindurant',
    permalink: 'kevin-durant',
    image_id: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/fj7xugrnfu6tvdh0q0se',
    primary_job_title: 'Founder',
    primary_organization: {
      value: 'Thirty Five Ventures',
      image_url: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/lrpbkpqely6e51cuiejl',
      permalink: 'thirty-five-ventures',
      entity_def_id: 'Venture Capital',
      homepage: 'http://www.thirtyfive.ventures',
      linkedin: 'https://www.linkedin.com/company/thirty-five-ventures/',
      twitter: 'https://twitter.com/35ventures',
      is_impact_fund: true,
    },
    location_city: 'Oakland',
    location_state: 'CA',
    linkedin: 'https://www.linkedin.com/in/kevin-durant-3a66178b',
    twitter: 'http://www.twitter.com/kdtrey5',
    description: 'Kevin Durant is a 12-year NBA veteran who plays for the Brooklyn Nets. He is a 2x NBA Champion and Finals MVP; having also won an NBA MVP Award, four NBA scoring titles, two Olympic gold medals, two NBA All-Star Game MVP Awards, and an NBA Rookie of the Year Award. He is also a ten-time NBA All-Star. Off the court, Durant is co-founder and partner of Thirty Five Ventures. Thirty Five Ventures includes his diverse investment portfolio, including companies such as Postmates, Acorns, Overtime, & Coinbase; the media and creative development arm; and the Kevin Durant Charity Foundation. Projects under the Thirty Five Ventures umbrella include the sports business vertical “The Boardroom,” in partnership with ESPN, which examines the ins and outs of sports business and illuminates the world of sports far beyond what fans ordinarily see. Kevin also served as an executive producer on Fox Sports Films’ “Q Ball,” which premiered at the San Francisco International Film Festival in Spring 2019. Upcoming projects include the scripted series “SWAGGER” with Imagine Entertainment and Apple. Last fall also saw the opening of The Durant Center in Suitland, Maryland, the Kevin Durant Charity Foundation’s college pipeline program in conjunction with College Track.',
    raise_min: 4200000,
    raise_max: 80000000,
    is_lead_investor: false,
    is_partner_investor: true,
    partners: [
      {
        name: 'Rich Kleiman',
        permalink: 'rich-kleiman',
        primary_job_title: 'Co-Founder and Business Partner',
        image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1504199387/usdvyuprjq0ev9ui8cvi.png',
      },
    ],
    is_open_to_outreach: false,
    interests: '',
  },
};

const fakeInvestments = [
  {
    id: 'dronebase',
    date: '',
    name: 'DroneBase',
    amount: 7500000,
    startup_permalink: 'dronebase',
    logo_url: 'https://res-5.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/f6aomtcqnjkrpxpgnfd3',
    founders: [
      {
        name: 'Daniel Burton',
        permalink: 'daniel-burton',
        image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1427270850/ypl6susd7zlvmjtvban5.png',
      },
      {
        name: 'N Osgoo',
        permalink: 'nicholas-osgood',
        image_url: '',
      },
      {
        name: 'Tomas Becklin',
        permalink: 'tomas-becklin',
        image_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1397184397/2adf8ee5d28fdb2196a9f1da46a891b2.jpg',
      },
    ],
  },
  {
    id: 'recountmedia',
    date: '',
    name: 'Recount Media',
    amount: 13000000,
    startup_permalink: 'recountmedia',
    logo_url: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/shfygagdppwsjrunybdo',
    founders: [
      {
        name: 'John Battelle',
        permalink: 'john-battelle',
        image_url: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1468839965/tjwvovqu4n4hfnrhjldj.png',
      },
      {
        name: 'John Heilemann',
        permalink: 'john-heilemann',
        image_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1428749631/wbbdf1vugera3ur5lwfg.png',
      },
    ],
  },
  {
    id: 'noah',
    date: '',
    name: 'noah',
    amount: 5000000,
    startup_permalink: 'noah',
    logo_url: 'https://res-1.cloudinary.com/crunchbase-production/image/upload/c_lpad,h_170,w_170,f_auto,b_white,q_auto:eco/yfozbeti98za9gh1uyrb',
    founders: [
      {
        name: 'Sahil Gupta',
        permalink: 'sahil-gupta-4',
        image_url: 'https://res-2.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/v1446209375/ygjk9dtvrknwwygpfc0r.png',
      },
      {
        name: 'Rahul Parulekar',
        permalink: 'rahul-parulekar',
        image_url: 'https://res-3.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_170,w_170,f_auto,g_faces,z_0.7,b_white,q_auto:eco/iqhzvqxdgdc0bitnkwxr',
      },
    ],
  },
];

fakeData.fredwilson.investments = [...fakeInvestments];
fakeData.kevindurant.investments = [...fakeInvestments];

export default function people(state = {}, action) {
  const records = {};
  const { params = {}, data } = action;
  const {
    uuid,
    ids,
    reason,
  } = params;
  const rehydration = getSafeVar(() => action.payload.people, {});

  switch (action.type) {
    case REHYDRATE: return {
      ...state,
      ...rehydration,
      ...fakeData,
    };
    case types.PEOPLE_GET_REQUEST:
      if (ids) {
        ids.forEach(i => {
          records[i] = { ...state[i], status: 'pending' };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PEOPLE_GET_SUCCEEDED:
      if (ids && data && Array.isArray(data)) {
        ids.forEach(i => {
          records[i] = {
            ...state[i],
            status: 'succeeded',
          };
        });
        data.forEach(r => {
          records[r.uuid] = {
            ...records[r.uuid],
            ...r,
          };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PEOPLE_GET_FAILED:
      if (ids) {
        const err = processErr(action.error);
        ids.forEach(i => {
          records[i] = { ...state[i], status: err };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PEOPLE_GET_DISMISS:
      if (ids) {
        ids.forEach(i => {
          records[i] = { ...state[i], status: '' };
        });
      }
      return {
        ...state,
        ...records,
      };
    case types.PEOPLE_UPDATE:
      // used with search for partial data
      return {
        ...state,
        records: { ...state.records, ...action.data },
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

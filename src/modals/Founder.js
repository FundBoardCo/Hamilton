import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  capitalizeFirstLetter,
  convertKeyTags,
} from '../utils';
import * as types from '../actions/types';
import NameTag from '../components/people/PersonNameTag';
import RaiseBullet from '../components/people/RaiseBullet';

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

export default function Founder() {
  const modalProps = useSelector(state => state.modal.modalProps);

  const {
    uuid,
    name = '',
    description = '',
    linkedin,
    twitter,
    permalink,
    raise,
    remote,
    location_city = '',
    location_state = '',
    links,
    team_size,
  } = modalProps;

  const location_joiner = location_city && location_state ? ', ' : '';
  const location = `${location_city}${location_joiner}${location_state}`;

  const userPublicUUID = useSelector(state => state.user.uuid);
  const isMyPage = uuid === userPublicUUID;

  const pathLocation = useLocation();
  const path = capitalizeFirstLetter(pathLocation.pathname.substring(1).split('/')[0]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: types.PUBLIC_GET_PROFILE_REQUESTED,
      uuid,
    });
  }, [uuid, dispatch]);

  const closeModal = () => {
    dispatch({
      type: types.MODAL_SET_OPEN,
      modal: '',
    });
  };

  return (
    <Modal
      aria-labelledby="Modal-Title"
      size="lg"
      centered
      show
      scrollable
      onHide={closeModal}
      className="modal-profile founder"
    >
      <Modal.Header closeButton>
        <Modal.Title className="sr-only">
          {name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <NameTag data={modalProps} path={path} isFounder />
        <section className="mb-4">
          {description && (
            <div
              className="description mb-3"
              dangerouslySetInnerHTML={{ __html: convertKeyTags(description) }}
            />
          )}
        </section>
        {[raise, location, remote, team_size].filter(i => i).length > 0 && (
          <section className="matches mb-4">
            <h3>Key Facts</h3>
            <ul>
              {!!raise && (
                <RaiseBullet
                  faIcon="rocket"
                  bool
                  text={`They are raising ${usdFormatter.format(raise)}.`}
                />
              )}
              {!!location && (
                <RaiseBullet
                  faIcon="map-marker-alt"
                  bool
                  text={`They are located in ${location}.`}
                />
              )}
              {!!remote && (
                <RaiseBullet
                  faIcon="wifi"
                  bool
                  text="They are remote."
                />
              )}
              {!!team_size && (
                <RaiseBullet
                  faIcon="users"
                  bool
                  text={`Team size: ${team_size}.`}
                />
              )}
            </ul>
          </section>
        )}
        <section className="mb-4">
          <h3>More Information</h3>
          {linkedin && (
            <div className="h4 text-linkedin d-flex">
              <FontAwesomeIcon icon={['fab', 'linkedin']} />
              &nbsp;
              <a
                href={linkedin}
                className="text-linkedin"
                target="_blank"
                rel="noopener noreferrer"
                data-track={`${path}FounderLinkedIn`}
              >
                LinkedIn
              </a>
            </div>
          )}
          {twitter && (
            <div className="h4 text-twitter d-flex">
              <FontAwesomeIcon icon={['fab', 'twitter']} />
              &nbsp;
              <a
                href={twitter}
                className="text-twitter"
                target="_blank"
                rel="noopener noreferrer"
                data-track={`${path}FounderTwitter`}
              >
                Twitter
              </a>
            </div>
          )}
          {permalink && (
            <div className="h4 d-flex text-primary">
              <FontAwesomeIcon icon="link" />
              &nbsp;
              <a
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                data-track={`${path}InvestorCrunchBase`}
              >
                CrunchBase
              </a>
            </div>
          )}
          {Array.isArray(links) && links.map(l => (
            <div className="h4 d-flex text-primary" key={l.text}>
              <FontAwesomeIcon icon="link" />
              &nbsp;
              <a
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                data-track={`${path}FounderLink`}
              >
                {l.text}
              </a>
            </div>
          ))}
        </section>
        {isMyPage && (
          <section className="mb-4 d-flex justify-content-center">
            <a
              href="/profile"
              className="h4 text-secondary"
            >
              You can add more details by editing your profile.
            </a>
          </section>
        )}
      </Modal.Body>
    </Modal>
  );
}

Founder.defaultProps = {
  match: {},
};

Founder.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.objectOf(PropTypes
      .oneOfType([PropTypes.bool, PropTypes.string, PropTypes.objectOf(PropTypes.string)])),
  }),
};

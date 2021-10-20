import React from 'react';
import { Link, Button } from 'rebass/styled-components';
import Tippy from '@tippy.js/react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SocialLink as SocialLinkType } from '../types';
import { getIconDefinition } from '../utils/icons';

type Props = SocialLinkType & {
  invert?: boolean;
  onPress: Function;
};

const IconButton = ({ icon, name, onPress, invert }: Props) => {
  const iconDefinition = getIconDefinition(icon);
  if (!iconDefinition) {
    return null;
  }

  return (
    <Tippy
      content={name}
      placement="bottom"
      trigger="mouseenter"
      arrow={false}
    >
      <IconLink
        target="_blank"
        invert={invert}
        rel="noreferrer"
        onClick={onPress}
        aria-label={name}
      >
        <FontAwesomeIcon icon={iconDefinition} title={name} />
      </IconLink>
    </Tippy>
  );
};

const IconLink = styled(Button)<{ invert?: boolean }>`
  transition: opacity 0.4s;
  background-color: transparent;
  color: ${({ theme, invert }) =>
    invert ? theme.colors.background : theme.colors.primary};
  text-decoration: none;

  &:hover {
    opacity: 0.7;
  }
`;

export default IconButton;

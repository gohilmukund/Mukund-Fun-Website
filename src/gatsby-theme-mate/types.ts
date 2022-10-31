import { IconName } from '@fortawesome/fontawesome-svg-core';
import { DefaultTheme } from 'styled-components';
import { Theme as RebassTheme } from '@rebass/preset';

export type Theme = DefaultTheme & RebassTheme;

export type Image = {
  src: string;
  alt: string;
};

export type Favicon = {
  src: string;
};

export type Project = {
  name: string;
  description: string;
  homepage: string;
  repository: string;
  type: string;
  publishedDate: string;
  logo: Image;
};

export type WorkExperience = {
  name: string;
  description: string;
  homepage: string;
  position: string;
  joiningDate: string;
  leavingDate: string;
  logo: Image;
  onPress?: Function;
};

export type Certification = {
  name: string;
  issuingOrganization: string;
  credentialUrl: string;
  issueDate: string;
  certificateImage: Image;
  badge: Image;
  onPress?: Function;
};

export type AboutMe = {
  markdown: string;
  profile: Image;
  profilePicture: Image;
};

export type SocialLink = {
  url: string;
  name: string;
  icon: IconName;
};

export type MediumPost = {
  title: string;
  text: string;
  cover: string;
  url: string;
  date: string;
  time: number;
};

export type MediumAuthor = {
  id: string;
  name: string;
  username: string;
};

export type Landing = {
  name: string;
  roles: string[];
  socialLinks: SocialLink[];
};

import merge from 'lodash/merge';
import { Image, User } from '@tigerhall/core';

function image(override: Partial<Image> = {}): Partial<Image> {
  return {
    id: '51e5cabc-ec3c-4205-a0c7-0500bf3e2bed',
    uri: 'https://images.prod.tigerhall.io/2023-02-01/4e26c5fc-ee88-4e67-8bfd-e34d9a448218.jpg',
    alt: '',
    filename: '4e26c5fc-ee88-4e67-8bfd-e34d9a448218.jpg',
    __typename: 'Image'
  };
}

function user(override: Partial<User>): Partial<User> {
  return merge(
    {
      id: '8be81de6-f4ac-41cf-b695-576cbbb22a7d',
      firstName: 'Antoine',
      lastName: 'Hedgecock',
      avatarImage: image(),
      coverImage: image(),
      biography: 'I tinker with things until they work',
      contentCompletedCount: 30,
      followerCount: 29,
      followingCount: 47,
      jobTitle: 'VP of Engineering',
      isExpert: true,
      isFollowing: false,
      isMentor: false,
      facebookLink: '',
      twitterHandle: '',
      instagramHandle: '',
      linkedinLink: '',
      websiteLink: 'https://tigerhall.com',
      createdAt: '2022-10-01T07:16:44.757773Z',
      email: 'antoine@tigerhall.com',
      mobileNumber: '',
      blocked: false,
      newsletter: false,
      roles: ['user', 'org_livestream', 'admin'],
      company: 'Tigerhall',
      couponRemainingCharges: 0,
      couponCode: '',
      lifegoals: [],
      stats: {
        __typename: 'UserStats',
        ebooksRead: 8,
        eventsAttended: 0,
        podcastsCompleted: 13,
        videosCompleted: 9,
        eventsBooked: 5
      },
      organisations: [],
      organisationGroups: [],
      accessLevel: 'FULL_ACCESS',
      stripeCustomers: {},
      creditCard: null,
      consumedTrialContent: [],
      subscription: null,
      updatedAt: '2023-05-25T19:04:13.097893Z',
      __typename: 'User'
    },
    override
  );
}

export const fixtures = {
  user,
  image
};

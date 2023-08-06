import { ContentCard } from '@tigerhall/core/lib/types';
import { MODALTYPES } from 'components/ui/modals';

export const redirectToUserFollowingFollwerRoute = (userId: string) =>
  `/profile/${userId}/follower-following`;
export const redirectToContentCardRoute = (): string => '/profile/content-card';
export const redirectToEditProfile = (): string => '/profile/edit';
export const redirectToProfile = (): string => '/profile';
export const redirectToUserProfile = (userId: string): string =>
  `/profile/${userId}`;

export const contentRoute = (id: string) => `?content=${id}`;
export const learningPathRoute = (id: string) => `?trail=${id}`;
export const videoPlayerRoute = (id: string) => `?video=${id}`;
export const livestreamPlayerRoute = (id: string) => `?livestream=${id}`;
export const powerReadModal = (id: string) => `?power-read=${id}`;
export const replyModalRoute = (contentId: string, commentId: string) =>
  `?content=${contentId}&comment=${commentId}`;
export const commonModal = (modalType: MODALTYPES) => `?modal=${modalType}`;
export const assignmentRoute = (id: string) => `?assignment=${id}`;

export const contentModalRoute = (content: ContentCard) => {
  switch (content.__typename) {
    case 'LearningPath':
      return learningPathRoute(content.id);

    case 'Podcast':
    case 'Event':
    case 'Ebook':
    case 'Stream':
      return videoPlayerRoute(content.id);

    default:
      throw new Error('Unsupported content type');
  }
};

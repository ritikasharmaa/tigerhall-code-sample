import isNumber from 'lodash/isNumber';
import cloneDeep from 'lodash/cloneDeep';
import {
  ContentConnection,
  NotificationConnection
} from '@tigerhall/core/lib/types';

export const SKIP_MERGE = 'skip_merge';
export const defaultPaginationPolicy = {
  keyArgs: (args: any) => {
    const fields = cloneDeep(args);
    delete fields?.filter?.limit;
    delete fields?.filter?.offset;

    return JSON.stringify(fields);
  },

  merge(
    existing: ContentConnection,
    incoming: ContentConnection,
    { args }: { args: any }
  ) {
    if (isNumber(args?.filter?.offset) && args?.filter?.offset !== 0) {
      const mergedEdges = existing?.edges ? existing?.edges.slice(0) : [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < incoming?.edges?.length; i++) {
        mergedEdges[args?.filter?.offset + i] = incoming?.edges[i];
      }

      const newCards = {
        ...existing,
        ...incoming,
        edges: mergedEdges
      };

      return newCards;
    }
    return incoming;
  }
};

export const notificationFetchMorePolicy = {
  keyArgs: [],
  merge(
    existing: NotificationConnection,
    incoming: NotificationConnection,
    { args }: { args: any }
  ) {
    if (!existing) {
      return incoming;
    }

    if (!incoming?.edges?.length) {
      return existing;
    }

    // copied from mobile codebase
    if (incoming?.meta?.nextCursor === SKIP_MERGE) {
      return {
        ...incoming,
        meta: existing?.meta
      };
    }

    if (
      args?.pagination?.afterCursor ===
      existing?.edges?.[existing.edges.length - 1]?.cursor
    ) {
      return {
        meta: {
          ...existing.meta,
          hasNext: incoming.meta.hasNext,
          nextCursor: incoming.meta.nextCursor,
          hasPrev: existing.meta.hasPrev,
          prevCursor: existing.meta.prevCursor
        },
        edges: [...existing.edges, ...incoming.edges]
      };
    }

    if (args?.pagination?.beforeCursor === existing?.edges?.[0]?.cursor) {
      return {
        meta: {
          ...existing.meta,
          hasPrev: incoming.meta.hasPrev || existing.meta.hasPrev,
          prevCursor: incoming.meta.prevCursor || existing.meta.prevCursor,
          hasNext: existing.meta.hasNext,
          nextCursor: existing.meta.nextCursor
        },
        edges: [...incoming.edges, ...existing.edges]
      };
    }

    // default case
    return incoming;
  }
};

import * as React from 'react';
import {
  Box,
  Flex,
  Heading,
  Image,
  LinkBox,
  Text,
  VStack
} from '@chakra-ui/react';
import { ContentTimeBadge, LinkOverlay } from '@tigerhall/components';
import {
  Assignment,
  AssignmentState,
  formatContentsCountSummary,
  resizeImage,
  segment
} from '@tigerhall/core';
import { DateTime } from 'luxon';

import { AssignmentStateBadge } from '../AssignmentStateBadge';

export interface AssignmentCardProps
  extends Pick<
    Assignment,
    | 'id'
    | '__typename'
    | 'assignmentTitle'
    | 'assignmentReason'
    | 'dueDate'
    | 'length'
    | 'completionRate'
    | 'status'
    | 'state'
  > {
  backgroundImage?: Pick<
    NonNullable<Assignment['backgroundImage']>,
    'uri' | 'alt'
  > | null;
  userAssignmentStatistics: Pick<
    Assignment['userAssignmentStatistics'],
    'assignedTrails' | 'assignedPodcasts' | 'assignedEbooks' | 'assignedStreams'
  >;
}

export function AssignmentCard({
  id,
  __typename: typename,
  assignmentTitle,
  assignmentReason,
  dueDate,
  length,
  completionRate,
  backgroundImage,
  userAssignmentStatistics,
  state
}: AssignmentCardProps) {
  const {
    assignedTrails = 0,
    assignedEbooks = 0,
    assignedPodcasts = 0,
    assignedStreams = 0
  } = userAssignmentStatistics || {};

  function handleOnClick() {
    segment.assignmentClicked({
      assignmentId: id,
      assignmentName: assignmentTitle
    });
  }

  return (
    <LinkBox
      as="article"
      display="flex"
      flexDirection="column"
      gap="0.5rem"
      position="relative"
      borderRadius="lg"
      border="1px solid"
      borderColor={
        state === AssignmentState.New ? 'tigerOrange.700' : 'coolGray.700'
      }
      width="18rem"
      height="17.75rem"
      overflow="hidden"
      p="1rem"
      pt="3rem"
      zIndex={0}
    >
      {backgroundImage?.uri ? (
        <Image
          pos="absolute"
          inset={0}
          width="100%"
          height="100%"
          zIndex={-1}
          src={resizeImage({
            url: backgroundImage.uri,
            width: 100,
            height: 100
          })}
          alt={backgroundImage?.alt || ''}
          background="coolGray.900"
          objectFit="cover"
          loading="lazy"
          decoding="async"
          filter="grayscale(50%) blur(2px) brightness(0.2) contrast(0.9)"
        />
      ) : null}
      <Box position="absolute" top={0} left={0}>
        <AssignmentStateBadge
          completionRate={completionRate}
          dueDate={dueDate}
          isNewAssignment={state === AssignmentState.New}
        />
      </Box>
      <VStack width="100%" flex={1} spacing="0.25rem" alignItems="start">
        <Heading
          as="h3"
          fontSize="md"
          color="white"
          lineHeight="1.3"
          noOfLines={2}
        >
          <LinkOverlay href={`?assignment=${id}`} onClick={handleOnClick}>
            {assignmentTitle}
          </LinkOverlay>
        </Heading>
        <Text as="span" fontSize="xs" color="gray.400" noOfLines={2}>
          {formatContentsCountSummary({
            trails: assignedTrails,
            ebooks: assignedEbooks,
            podcasts: assignedPodcasts,
            streams: assignedStreams
          })}
        </Text>
        {assignmentReason ? (
          <Text fontSize="xs" color="gray.400" pt="0.5rem" noOfLines={4}>
            <b>Purpose/ Goal: </b>
            {assignmentReason}
          </Text>
        ) : null}
      </VStack>
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        {!!dueDate ? (
          <Text as="span" fontSize="xs" color="gray.400">
            Due Date:{' '}
            {DateTime.fromISO(dueDate).toLocaleString(DateTime.DATE_MED)}
          </Text>
        ) : (
          <Box />
        )}
        <ContentTimeBadge duration={length} typename={typename} />
      </Flex>
    </LinkBox>
  );
}

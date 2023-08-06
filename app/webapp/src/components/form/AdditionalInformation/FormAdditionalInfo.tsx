import { Divider, Flex } from '@chakra-ui/react';
import { Typography } from '@tigerhall/ui-components';
import * as React from 'react';

import FormAdditionalInfoSection from './FormAdditionalInfoSection';

interface Props {
  title: string;
}

export default function FormAdditionalInfo({ title }: Props) {
  return (
    <Flex flexDirection="column" flex={1}>
      <Divider my="8" />
      <Flex justify="space-between">
        <Typography mb={4} variant="heading2">
          {title}
        </Typography>
      </Flex>

      <Typography mb={4} variant="body">
        Include any information that attendees would benefit from. This could be
        a more detailed look into the flow of the session, areas that will be
        discussed, key takeaways, whom the session is catered to, and so on. You
        can add more than one section if needed.
      </Typography>

      <FormAdditionalInfoSection index={0} />
    </Flex>
  );
}

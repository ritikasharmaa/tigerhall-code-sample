import React from 'react';
import { Box } from '@chakra-ui/react';
import { Typography } from '@tigerhall/ui-components';

const Separator = () => (
  <Box h="1px" my={8} width="100%" background="rgba(255,255,255, 0.2)" />
);

export default function Section({ title, children, hideSeparator = false }) {
  return (
    <>
      {hideSeparator ? null : <Separator />}
      <Typography mb={4} variant="heading2">
        {title}
      </Typography>
      {children}
    </>
  );
}

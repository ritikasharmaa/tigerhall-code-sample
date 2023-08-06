import * as React from 'react';
import { Flex } from '@chakra-ui/react';
import { FormInput } from '@tigerhall/components';
import { EditorForm } from 'components/ui/lexical/form/EditorForm';

const FormAdditionalInfoSection = ({ index }) => (
  <Flex gap="1rem" direction="column">
    <FormInput
      name={`contentSegments.${index}.header`}
      label="Title"
      placeholder="Add your title"
    />

    <EditorForm
      showHeadings={false}
      name={`contentSegments.${index}.paragraph`}
      label="Body"
      placeholder="Add your body"
    />
  </Flex>
);

export default FormAdditionalInfoSection;

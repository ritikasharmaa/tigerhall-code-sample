import * as React from 'react';
import { Icon, ButtonProps } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@tigerhall/icons';
import { TrackedButton } from '@tigerhall/components';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps extends Omit<ButtonProps, 'as'> {
  to?: string;
  name?: string;
  children?: string;
}

export function BackButton({
  to,
  name = 'BACK',
  children = 'Back',
  ...rest
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <TrackedButton
      as="button"
      name={name}
      variant="outline"
      size="lg"
      width="fit-content"
      leftIcon={<Icon as={ChevronLeftIcon} />}
      onClick={() => {
        if (to) {
          navigate(to);
        } else {
          navigate(-1);
        }
      }}
      {...rest}
    >
      {children}
    </TrackedButton>
  );
}

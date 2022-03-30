
import { Heading } from '@chakra-ui/react';

export function NavLabel({ children, ...props }) {
    return (
      <Heading
        as="h3"
        size="xs"
        color="brand1.600"
        textTransform="uppercase"
        py={2}
        {...props}
      >
        {children}
      </Heading>
    );
  }
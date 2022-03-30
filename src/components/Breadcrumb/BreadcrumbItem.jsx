import { Icon, Link } from "@chakra-ui/react";
import NextLink from "next/link";

export const BreadcrumbItem = ({
  children,
  icon,
  href,
  isCurrentPage,
  ...props
}) => {
  return (
    <NextLink href={href} passHref>
      <Link
        fontWeight="medium"
        fontSize="sm"
        color={isCurrentPage ? "brand1.700" : "brand1.500"}
        {...props}
        textTransform="capitalize"
      >
        {icon ? <Icon as={icon} pt={"5px"} boxSize={5} /> : children}
      </Link>
    </NextLink>
  );
};

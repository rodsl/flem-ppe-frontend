import { HStack, Icon } from "@chakra-ui/react";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { useRouter } from "next/router";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { BreadcrumbItem } from "components/Breadcrumb/BreadcrumbItem";

export const BreadcrumbBar = ({ divider = ChevronRightIcon, entities }) => {
  const router = useRouter();
  const linkPath = router.asPath.split("/");
  linkPath.shift();

  const pathArray = linkPath.map((path, i) => {
    return { breadcrumb: path.replace("-"," "), href: "/" + linkPath.slice(0, i + 1).join("/") };
  });
  
  return (
    <HStack
      spacing={2}
      divider={<Icon as={divider} border={0} fontSize="14px" />}
    >
      <BreadcrumbItem href="/" icon={FiHome} />
      {Array.isArray(pathArray) && pathArray.map((path, idx) => (
        <BreadcrumbItem href={path.href} key={`${path.breadcrumb}${idx}`}>
          {entities.find((entity) => entity.value === path.breadcrumb)?.label||path.breadcrumb}
        </BreadcrumbItem>
      ))}
    </HStack>
  );
};

import { sidebarData } from "./sidebarData";

const stepOne = sidebarData.map((item) => item.items);

const stepTwo = stepOne.flat(1);

const stepThree = stepTwo
  .filter((item) => item.subItems)
  .map((item) => item.subItems)
  .flat(1);

const stepFour = stepTwo.map((item) => ({
  title: item.title,
  href: item.href,
  icon: item.icon,
}));

const itemsWithoutFilter = [...stepThree, ...stepFour];

export const breadcrumbData = [
  ...new Map(itemsWithoutFilter.map((item) => [item.href, item])).values(),
];

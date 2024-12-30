import { navItemsProtected, navItemsPublic } from "@/data/nav-items";
import { auth } from "@/server/auth";

export const getNavItems = async () => {
  const session = await auth();
  return session ? navItemsProtected : navItemsPublic;
};

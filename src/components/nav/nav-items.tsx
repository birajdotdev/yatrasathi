import Link from "next/link";

export type NavItem = {
  label: string;
  href: string;
};

interface NavItemsProps {
  items: NavItem[];
  mobile?: boolean;
}

export default function MenuItems({ items, mobile = false }: NavItemsProps) {
  const baseClasses = "transition-colors hover:text-primary ";
  const mobileClasses = "block py-2 text-lg font-medium text-muted-foreground";
  const desktopClasses = "text-sm font-medium text-muted-foreground";

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}

import Link from "next/link";

export type MenuItem = {
  label: string;
  href: string;
};

interface MenuItemsProps {
  items: MenuItem[];
  mobile?: boolean;
}

export default function MenuItems({ items, mobile = false }: MenuItemsProps) {
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

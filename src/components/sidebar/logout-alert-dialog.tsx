import { SignOutButton } from "@clerk/nextjs";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LogoutAlertDialog() {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
        <AlertDialogDescription>
          This action will end your current session.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <SignOutButton>
          <AlertDialogAction>Log out</AlertDialogAction>
        </SignOutButton>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
}

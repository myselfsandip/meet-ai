import useAuth from "@/hooks/useAuth";
import GeneratedAvatar from "../GeneratedAvatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, CreditCard, CreditCardIcon, LogOut, LogOutIcon } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";



function DashboardUserButton() {
    const { isLoading, isAuthenticated, user } = useAuth();
    const logoutMutation = useLogout();
    const isMobile = useIsMobile();


    if (isLoading || !isAuthenticated) {
        return null;
    }

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
                    {user ? (
                        <GeneratedAvatar seed={user.name} variant="botttsNeutral" className="size-9 mr-3" />
                    ) : null}

                    <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                        <p className="text-sm truncate w-full">
                            {user?.name}
                        </p>
                        <p className="text-xs truncate w-full">
                            {user?.email}
                        </p>
                    </div>
                    <ChevronDownIcon className="size-4 shrink-0" />
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{user?.name}</DrawerTitle>
                        <DrawerDescription>{user?.email}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <Button
                            variant="outline"
                            onClick={() => { }}
                        >
                            <CreditCardIcon className="size-4 text-black" />
                            Billing
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => logoutMutation.mutate()}
                        >
                            <LogOutIcon className="size-4 text-black" />
                            Logout
                        </Button>

                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (<DropdownMenu>
        <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
            {user ? (
                <GeneratedAvatar seed={user.name} variant="botttsNeutral" className="size-9 mr-3" />
            ) : null}

            <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
                <p className="text-sm truncate w-full">
                    {user?.name}
                </p>
                <p className="text-xs truncate w-full">
                    {user?.email}
                </p>
            </div>
            <ChevronDownIcon className="size-4 shrink-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" className="w-72">
            <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                    <span className="font-medium truncate">{user?.name}</span>
                    <span className="font-normal text-sm text-muted-foreground truncate">{user?.email}</span>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
                className="cursor-pointer flex items-center justify-between"
            >
                Billing
                <CreditCard className="size-4" />
            </DropdownMenuItem>
            <DropdownMenuItem
                className="cursor-pointer flex items-center justify-between"
                onClick={() => logoutMutation.mutate()}
            >
                Logout
                <LogOut className="size-4" />
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>);
}

export default DashboardUserButton;
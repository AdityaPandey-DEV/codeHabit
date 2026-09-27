"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const MobileSidebar = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6 text-white" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-[#264747] bg-[#102a2a] p-0 text-white">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Sidebar mb-0 />
            </SheetContent>
        </Sheet>
    );
};

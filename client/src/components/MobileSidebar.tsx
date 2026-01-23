"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
            <SheetContent side="left" className="p-0 bg-gray-900 border-gray-800 text-white w-72">
                <Sidebar mb-0 />
            </SheetContent>
        </Sheet>
    );
};

import React from "react";
import { BookOpen, FileText } from "lucide-react";
import type { DashboardNavigationConfig } from "@/app/types/navigation";
import { UserSectionPosition } from "@/app/types/navigation";
import { ICON_SIZES } from "@/app/utils";

export const readingNavigation: DashboardNavigationConfig = {
    title: "Reading",
    icon: <BookOpen className="text-white" size={ICON_SIZES.xlg} />,
    horizontalItems: [],
    groups: [
        {
            id: "reading",
            title: "Reading",
            items: [
                {
                    id: "open-document",
                    name: "Open document",
                    icon: <FileText size={ICON_SIZES.lg} />,
                    href: "/reading",
                },
            ],
        },
    ],
    userSectionPosition: UserSectionPosition.Undefined,
};

import React from "react";
import { Clover } from "lucide-react";
import type { DashboardNavigationConfig } from "@/app/types/navigation";
import { UserSectionPosition } from "@/app/types/navigation";
import { ICON_SIZES } from "@/app/utils";
import { categories, godNames } from "./data";

const iconSize = ICON_SIZES.lg;

export const devotionalNavigation: DashboardNavigationConfig = {
    title: "Devotional",
    icon: <Clover className="text-white" size={ICON_SIZES.xlg} />,
    horizontalItems: [],
    groups: godNames.map((god) => ({
        id: god,
        title: god,
        items: categories.map((category) => ({
            id: category,
            name: category,
            icon: <Clover size={iconSize} />,
            href: `/devotional/${god}/${category}`,
        })),
    })),
    userSectionPosition: UserSectionPosition.Undefined,
};

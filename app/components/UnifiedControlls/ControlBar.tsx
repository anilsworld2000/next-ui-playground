import { ReactNode, useState } from "react";
import cnClassNames from "@/app/utils";
import { useTheme } from "@/app/hooks/ThemeContext";
import FilterButton, { FilterButtonProps } from "@/app/components/Buttons/FilterButton";
import SortButton, { SortButtonProps } from "@/app/components/Buttons/SortButton";
import SearchButton, { SearchInputProps } from "@/app/components/Buttons/SearchButton";
import ViewToggleButton, { ViewToggleButtonProps } from "../Buttons/ViewToggleButton";

type Props = {
    sortButtonConfig?: SortButtonProps;
    searchInputConfigs?: SearchInputProps;
    filterButtonConfig?: FilterButtonProps;
    viewToggleButtonConfig?: ViewToggleButtonProps;
    utilityControlls?: ReactNode[];
    iconSize?: number;
    iconStrokeWidth?: number;
    controlBarClassName?: string;
    controlBarItemsClassName?: string;
};

export default function ControlBar({
    sortButtonConfig,
    searchInputConfigs,
    filterButtonConfig,
    viewToggleButtonConfig,
    utilityControlls,
    iconSize = 18,
    iconStrokeWidth = 1,
    controlBarClassName = "",
    controlBarItemsClassName = ""
}: Props) {
    const theme = useTheme();
    const [searchTerm, setSearchTerm] = useState("");
    console.log("ControlBar Rendered with searchTerm:", searchTerm);
    const disabledActionButtonClass = "opacity-50 cursor-not-allowed pointer-events-none";

    const searchBar = () => {
        return (
            searchInputConfigs && (
                <SearchButton
                    // Use the value from props to keep it in sync with the parent
                    value={searchInputConfigs.value}
                    onSearch={(val: string) => {
                        // Update local state for immediate UI feedback
                        setSearchTerm(val);
                        // CRITICAL: Notify the GoalsPage so it can filter the data
                        if (searchInputConfigs.onSearch) {
                            searchInputConfigs.onSearch(val);
                        }
                    }}
                    disabled={searchInputConfigs.disabled}
                    iconSize={iconSize}
                    iconStrokeWidth={iconStrokeWidth}
                    className={controlBarItemsClassName}
                />
            )
        );
    }

    const filterPills = () => {
        return (
            filterButtonConfig &&
            <FilterButton
                cssClasses={controlBarItemsClassName}
                disabled={filterButtonConfig.disabled}
                tooltip={filterButtonConfig.tooltip}
                iconSize={iconSize}
                iconStrokeWidth={iconStrokeWidth}
                type={filterButtonConfig.filterOptions ? "select" : "text"}
                filterOptions={filterButtonConfig.filterOptions}
                value={filterButtonConfig.value}
                onChange={(val: string) => filterButtonConfig.onChange(val)}
            />
        );
    };

    const sortButton = () => {
        return (
            sortButtonConfig && (
                <SortButton
                    disabled={sortButtonConfig.disabled}
                    sortKey={sortButtonConfig.sortKey}
                    currentSort={sortButtonConfig.currentSort}
                    onSortChange={sortButtonConfig.onSortChange}
                    iconSize={iconSize}
                    iconStrokeWidth={iconStrokeWidth}
                    cssClasses={cnClassNames(controlBarItemsClassName, sortButtonConfig.disabled ? disabledActionButtonClass : "")}
                />
            )
        );
    };

    const viewToggle = () => {
        return (
            viewToggleButtonConfig && (
                <ViewToggleButton
                    disabled={viewToggleButtonConfig.disabled}
                    cssClasses={controlBarItemsClassName}
                    tooltip={viewToggleButtonConfig.tooltip}
                    onToggle={viewToggleButtonConfig.onToggle}
                    view={viewToggleButtonConfig.view}
                />
            )
        );
    };

    const divider = () => {
        return <div className={cnClassNames("hidden md:block w-[1px] self-stretch opacity-50 my-2", theme.theme.primary)} />;
    }

    return (
        <div className={controlBarClassName}>

            {/* Search Zone */}
            {searchBar()}

            {/* Filter Pills Zone */}
            {filterPills()}

            {/* Sort Button */}
            {sortButton()}

            {/* View Toggle Button */}
            {viewToggle()}

            {/* Divider (Visual refinement) */}
            {utilityControlls && utilityControlls.length > 0 && divider()}

            {/* Utility Zone */}
            {utilityControlls &&
                utilityControlls.map((control, index) => (
                    <div
                        key={index}
                        className={controlBarItemsClassName}>
                        {control}
                    </div>
                ))
            }
        </div>
    );
}
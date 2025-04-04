import { IconName } from "@fortawesome/free-brands-svg-icons";

export type CategoryName = "ALL" | "AMAZING_VIEWS" | "BEACH" | "OMG" | "TREEHOUSES" | "FARMS" | "TINY_HOMES" | "LAKE"|"CAMPING"|
"CONTAINERS" | "CASTLE" | "SKIING" | "CAMPERS"|"ARTIC"| "BOAT" | "BED_AND_BREAKFASTS"| "ROOMS"| "EARTH_HOMES"|"TOWER"|"CAVES"|
"LUXES"| "CHEFS_KITCHEN";

export interface Category{
    icon :IconName,
    displayName: string,
    technicalName: CategoryName,
    activated: boolean


}
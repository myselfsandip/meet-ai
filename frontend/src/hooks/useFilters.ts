import { DEFAULT_PAGE } from "@/utils/constants";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export const useFilters = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true })
    });
}
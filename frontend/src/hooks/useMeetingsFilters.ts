import { meetingStatusEnum } from "@/lib/validations/meetings";
import { DEFAULT_PAGE } from "@/utils/constants";
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

export const useMeetingsFilters = () => {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({ clearOnDefault: true }),
        status: parseAsStringEnum(Object.values(meetingStatusEnum)),
        agentId: parseAsString.withDefault("").withOptions({ clearOnDefault: true })
    });
}
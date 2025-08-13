import { CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, LoaderIcon, VideoIcon } from "lucide-react";
import CommandSelect from "./CommandSelect";
import { meetingStatusEnum, type MeetingStatus } from "@/lib/validations/meetings";
import { useMeetingsFilters } from "@/hooks/useMeetingsFilters";


const options = [
    {
        id: meetingStatusEnum.Values.upcoming,
        value: meetingStatusEnum.Values.upcoming,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <ClockArrowUpIcon />
                {meetingStatusEnum.Values.upcoming}
            </div>
        )
    },
    {
        id: meetingStatusEnum.Values.completed,
        value: meetingStatusEnum.Values.completed,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleCheckIcon />
                {meetingStatusEnum.Values.completed}
            </div>
        )
    },
    {
        id: meetingStatusEnum.Values.active,
        value: meetingStatusEnum.Values.active,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <VideoIcon />
                {meetingStatusEnum.Values.active}
            </div>
        )
    },
    {
        id: meetingStatusEnum.Values.processing,
        value: meetingStatusEnum.Values.processing,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <LoaderIcon />
                {meetingStatusEnum.Values.processing}
            </div>
        )
    },
    {
        id: meetingStatusEnum.Values.cancelled,
        value: meetingStatusEnum.Values.cancelled,
        children: (
            <div className="flex items-center gap-x-2 capitalize">
                <CircleXIcon />
                {meetingStatusEnum.Values.cancelled}
            </div>
        )
    },
]


export const StatusFilter = () => {
    const [filters, SetFilters] = useMeetingsFilters();

    return (
        <CommandSelect
            placeholder="Status"
            className="h-9"
            options={options}
            onSelect={(value) => SetFilters({ status: value as MeetingStatus })}
            value={filters.status ?? ""}
        />
    )
}
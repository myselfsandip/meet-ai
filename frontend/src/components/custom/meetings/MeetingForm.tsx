import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import type { MeetingModel } from "@/types/meetingsTypes";
import { meetingInsertSchema, meetingUpdateSchema, type meetingInsertFormData, type meetingUpdateFormData } from "@/lib/validations/meetings";
import { meetingsApi } from "@/services/meetingsApi";
import { agentsApi } from "@/services/agentsApi";
import CommandSelect from "./CommandSelect";
import GeneratedAvatar from "../GeneratedAvatar";
import { debounce } from "@/utils/debounce";
import NewAgentDialog from "../agent/NewAgentDialog";

interface MeetingFormProps {
    onSuccess?: (id?: string) => void;
    onCancel?: () => void;
    initialValues?: MeetingModel;
}

function MeetingForm({ onSuccess, onCancel, initialValues }: MeetingFormProps) {
    const queryClient = useQueryClient();
    const [agentSearch, setAgentSearch] = useState("");
    const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);

    //Debounce On Search Input
    const debouncedSetAgentSearch = useCallback(debounce((val: string) => {
        setAgentSearch(val);
    }, 300),
        []
    );

    const { data: agents } = useQuery({
        queryKey: ['agents', agentSearch],
        queryFn: () => agentsApi.getAgents({ search: agentSearch, pageSize: 100 }),
    })

    const isEdit = !!initialValues?.id;
    const schema = isEdit ? meetingUpdateSchema : meetingInsertSchema;
    type FormData = z.infer<typeof schema>;

    const form = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: isEdit ?
            {
                id: initialValues?.id ?? "",
                name: initialValues?.name ?? "",
                agentId: initialValues?.agentId ?? ""
            } :
            {
                name: "",
                agentId: initialValues?.agentId ?? ""
            } as any,

    });

    const createMeeting = useMutation({
        mutationFn: meetingsApi.createMeeting,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["meetings"] });
            onSuccess?.(data.id);
        },
        onError: (error: any) => {
            const errMsg = error?.response?.data?.message || "Something went wrong!";
            toast.error(errMsg);
        },
    });

    const updateMeeting = useMutation({
        mutationFn: meetingsApi.updateMeeting,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["meeting", data.id] });
            onSuccess?.();
        },
        onError: (error: any) => {
            const errMsg = error?.response?.data?.message || "Something went wrong!";
            toast.error(errMsg);
        },
    });

    const ispending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = (values: FormData) => {
        if (isEdit) {
            updateMeeting.mutate(values as meetingUpdateFormData);
        } else {
            createMeeting.mutate(values as meetingInsertFormData);
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const input = inputRef.current;
        if (input && initialValues?.name) {
            requestAnimationFrame(() => {
                const length = input.value.length;
                input.setSelectionRange(length, length);
            });
        }
    }, [initialValues?.name]);

    return (
        <>
        <NewAgentDialog open={openNewAgentDialog} onOpenChange={setOpenNewAgentDialog} />
            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        ref={(el) => {
                                            field.ref(el);
                                            inputRef.current = el;
                                        }}
                                        placeholder="e.g. Math Consultations"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        name="agentId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Agent</FormLabel>
                                <FormControl>
                                    <CommandSelect options={(agents?.data ?? []).map((agent) => ({
                                        id: agent.id,
                                        value: agent.id,
                                        children: (
                                            <div className="flex items-center gap-x-2">
                                                <GeneratedAvatar variant="botttsNeutral" seed={agent.name} className="border size-6" />
                                                <span>{agent.name}</span>
                                            </div>
                                        )
                                    }))}
                                        onSelect={field.onChange}
                                        onSearch={debouncedSetAgentSearch}
                                        value={field.value}
                                        placeholder="Select an agent"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Not found what you&apos;re looking for?{" "}
                                    <button type="button" className="text-primary hover:underline"
                                        onClick={() => setOpenNewAgentDialog(true)}
                                    >
                                        Create new Agent
                                    </button>
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <div className="flex gap-2">
                        {onCancel && (
                            <Button
                                variant="ghost"
                                disabled={ispending}
                                type="button"
                                onClick={() => onCancel()}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button disabled={ispending} type="submit">
                            {isEdit ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    );
}

export default MeetingForm;

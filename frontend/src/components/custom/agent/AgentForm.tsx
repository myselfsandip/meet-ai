import { agentsInsertSchema, type agentInsertFormData } from "@/lib/validations/agents";
import { agentsApi } from "@/services/agentsApi";
import type { AgentInterface } from "@/types/agentsTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import GeneratedAvatar from "../GeneratedAvatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentInterface;
}


function AgentForm({ onSuccess, onCancel, initialValues }: AgentFormProps) {
    const queryClient = useQueryClient();

    const createAgent = useMutation({
        mutationFn: agentsApi.createAgent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agents'] });  // Reloads the Agents List after the New Agent Added
            onSuccess?.();
        },
        onError: (error: any) => {
            const errMsg = error?.response?.data?.message || "Something went wrong!";
            toast.error(errMsg);
            //Later have to do  - Check if error code is "FORBIDDEN", redirect to "/upgrade"
        },
    })
    const form = useForm<agentInsertFormData>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? '',
            instructions: initialValues?.instructions ?? ''
        }
    });

    const isEdit = !!initialValues?.id;
    const ispending = createAgent.isPending;

    const onSubmit = (values: agentInsertFormData) => {
        if (isEdit) {
            console.log("TODO: updateAgent");
        } else {
            createAgent.mutate(values)
        }
    }

    return (<Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <GeneratedAvatar
                seed={form.watch("name")}
                variant="botttsNeutral"
                className="border size-16"
            />
            <FormField name="name"
                control={form.control}
                render={({ field }) => <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="e.g. Math tutor" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                } />
            <FormField name="instructions"
                control={form.control}
                render={({ field }) => <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                        <Textarea {...field} placeholder="You are a helpful math assistant that can answer questions and help with tasks." />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                } />

            <div>
                {onCancel &&
                    (<Button variant="ghost" disabled={ispending} type="button" onClick={() => onCancel()}>
                        Cancel
                    </Button>)
                }
                <Button disabled={ispending} type="submit">
                    {isEdit ? "Update" : "Create"}
                </Button>
            </div>
        </form>
    </Form>);
}

export default AgentForm;
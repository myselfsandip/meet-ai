import { agentsInsertSchema, type agentInsertFormData } from "@/lib/validations/agents";
import { agentsApi } from "@/services/agentsApi";
import type { AgentModel } from "@/types/agentsTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import GeneratedAvatar from "../GeneratedAvatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useRef } from "react";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentModel;
}


function AgentForm({ onSuccess, onCancel, initialValues }: AgentFormProps) {
    const queryClient = useQueryClient();

    const form = useForm<agentInsertFormData>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? '',
            instructions: initialValues?.instructions ?? ''
        }
    });

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
    });

    const updateAgent = useMutation({
        mutationFn: agentsApi.updateAgent,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['agent', data.id] });
            onSuccess?.();
        },
        onError: (error: any) => {
            const errMsg = error?.response?.data?.message || "Something went wrong!";
            toast.error(errMsg);
            //Later have to do  - Check if error code is "FORBIDDEN", redirect to "/upgrade"
        },
    });




    const isEdit = !!initialValues?.id;
    const ispending = createAgent.isPending || updateAgent.isPending;

    const onSubmit = (values: agentInsertFormData) => {
        if (isEdit) {
            updateAgent.mutate({ ...values, id: initialValues.id })
        } else {
            createAgent.mutate(values)
        }
    }

    //Agent Name Auto Selection Resolver. It sets the Cursor at the end of the Text
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const input = inputRef.current;
        if (input && initialValues?.name) {
            // setTimeout(() => {
            //     const length = input.value.length;
            //     input.setSelectionRange(length, length)
            // }, 0); // SetTimeout is used to make sure that the DOM is loaded 
            // or Use requestAnimationFrame

            requestAnimationFrame(() => {
                const length = input.value.length;
                input.setSelectionRange(length, length);
            })
        }
    }, [initialValues?.name]);



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
                        <Input  {...field}
                            ref={(el) => {
                                field.ref(el);
                                inputRef.current = el;
                            }}
                            placeholder="e.g. Math tutor" />
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
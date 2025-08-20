import { createAvatar } from "@dicebear/core";
import { botttsNeutral, initials } from "@dicebear/collection";

export interface AvatarOptions {
    seed: string;
    variant: "botttsNeutral" | "initials";
}

export async function generateAvatarUri({ seed, variant }: AvatarOptions): Promise<string> {
    if (variant === "botttsNeutral") {
        const avatar = createAvatar(botttsNeutral, { seed });
        return avatar.toDataUri();
    }

    const avatar = createAvatar(initials, {
        seed,
        fontWeight: 500,
        fontSize: 42
    });
    return avatar.toDataUri();
}
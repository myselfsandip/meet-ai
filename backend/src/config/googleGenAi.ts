import {
    GoogleGenAI,
    LiveServerMessage,
    Modality,
    Session,
} from "@google/genai";

export interface GeminiRealtimeClient {
    updateSession: (options: { instructions: string }) => void;
    disconnect: () => void;
    sendAudio: (audioData: ArrayBuffer) => void;
}

class GeminiRealtimeManager {
    private client: GoogleGenAI;
    private activeSessions: Map<string, Session> = new Map();
    private activeClients: Map<string, GeminiRealtimeClient> = new Map();
    private audioQueues: Map<string, ArrayBuffer[]> = new Map();

    constructor(apiKey: string) {
        this.client = new GoogleGenAI({
            apiKey: apiKey,
        });
    }

    async connectToCall(
        callId: string,
        agentUserId: string,
        streamCall: any
    ): Promise<GeminiRealtimeClient> {
        console.log(`🔄 Attempting to connect Gemini to call: ${callId}`);

        const model = "gemini-2.5-flash-preview-native-audio-dialog";

        let currentInstructions =
            "You are a helpful AI assistant participating in a video call. Respond naturally to voice conversations. Keep your responses conversational and engaging.";

        try {
            // Initialize audio queue for this call
            this.audioQueues.set(callId, []);

            const session = await this.client.live.connect({
                model: model,
                callbacks: {
                    onopen: () => {
                        console.log(`✅ Gemini session opened for call: ${callId}`);
                        // Send initial greeting after connection
                        this.sendInitialGreeting(callId);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        await this.handleGeminiMessage(message, streamCall, callId);
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error(
                            `❌ Gemini session error for call ${callId}:`,
                            e.message
                        );
                        // Attempt reconnection after a delay
                        setTimeout(() => {
                            console.log(
                                `🔄 Attempting to reconnect Gemini for call: ${callId}`
                            );
                            this.attemptReconnection(callId, agentUserId, streamCall);
                        }, 5000);
                    },
                    onclose: (e: CloseEvent) => {
                        console.log(
                            `🔌 Gemini session closed for call ${callId}:`,
                            e.reason
                        );
                        this.cleanup(callId);
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: "Aoede", // Try different voice: Aoede, Charon, Orus, Puck
                            },
                        },
                    },
                    systemInstruction: {
                        parts: [
                            {
                                text: currentInstructions,
                            },
                        ],
                    },
                    generationConfig: {
                        temperature: 0.8,
                        topP: 0.9,
                        candidateCount: 1,
                    },
                },
            });

            // Store the session
            this.activeSessions.set(callId, session);

            // Create client interface
            const client: GeminiRealtimeClient = {
                updateSession: (options: { instructions: string }) => {
                    currentInstructions = options.instructions;
                    console.log(
                        `📝 Instructions updated for call ${callId}:`,
                        options.instructions
                    );
                    this.updateSessionInstructions(callId, options.instructions);
                },
                disconnect: () => {
                    this.disconnectCall(callId);
                },
                sendAudio: (audioData: ArrayBuffer) => {
                    this.sendAudioToGemini(callId, audioData);
                },
            };

            this.activeClients.set(callId, client);

            // Set up Stream.io event handlers
            await this.setupStreamAudioHandling(streamCall, callId);

            return client;
        } catch (error) {
            console.error(`❌ Error connecting to Gemini for call ${callId}:`, error);
            this.cleanup(callId);
            throw new Error(
                `Failed to connect to Gemini: ${error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    }

    private async sendInitialGreeting(callId: string) {
        const session = this.activeSessions.get(callId);
        if (session) {
            try {
                // Send a text input to trigger initial response
                await session.sendRealtimeInput({
                    text: "Hello! I've joined the call. How can I help you today?",
                });
                console.log(`👋 Initial greeting sent for call: ${callId}`);
            } catch (error) {
                console.error(
                    `Error sending initial greeting for call ${callId}:`,
                    error
                );
            }
        }
    }

    private async attemptReconnection(
        callId: string,
        agentUserId: string,
        streamCall: any
    ) {
        if (!this.activeSessions.has(callId)) {
            try {
                console.log(`🔄 Reconnecting Gemini for call: ${callId}`);
                await this.connectToCall(callId, agentUserId, streamCall);
            } catch (error) {
                console.error(`❌ Reconnection failed for call ${callId}:`, error);
            }
        }
    }

    private async updateSessionInstructions(
        callId: string,
        instructions: string
    ) {
        const session = this.activeSessions.get(callId);
        if (session) {
            try {
                await session.sendRealtimeInput({
                    text: `Please update your behavior according to these new instructions: ${instructions}. Continue the conversation naturally.`,
                });
                console.log(`✅ Instructions updated successfully for call ${callId}`);
            } catch (error) {
                console.error(
                    `❌ Error updating instructions for call ${callId}:`,
                    error
                );
            }
        }
    }

    private async setupStreamAudioHandling(streamCall: any, callId: string) {
        try {
            console.log(`🔊 Setting up Stream.io audio handling for call: ${callId}`);

            // Make sure the AI agent joins the call as a participant
            if (streamCall.join) {
                await streamCall.join({
                    create: false,
                    data: {
                        members: [
                            {
                                user_id: `agent-${callId}`,
                                role: "agent",
                            },
                        ],
                    },
                });
                console.log(`🤖 AI agent joined call: ${callId}`);
            }

            // Listen for audio events
            streamCall.on("audio.received", (audioEvent: any) => {
                this.handleStreamAudioReceived(audioEvent, callId);
            });

            streamCall.on("participant.joined", (event: any) => {
                console.log(
                    `👤 Participant joined call ${callId}:`,
                    event.participant?.user?.id
                );
            });

            streamCall.on("participant.left", (event: any) => {
                console.log(
                    `👋 Participant left call ${callId}:`,
                    event.participant?.user?.id
                );
                // If this is the last human participant, we might want to end the call
                if (event.participant?.user?.id !== `agent-${callId}`) {
                    this.handleParticipantLeft(callId, streamCall);
                }
            });

            streamCall.on("call.ended", () => {
                console.log(`📞 Call ended: ${callId}`);
                this.disconnectCall(callId);
            });

            console.log(
                `✅ Stream.io audio handling set up successfully for call: ${callId}`
            );
        } catch (error) {
            console.error(
                `❌ Error setting up Stream.io audio handling for call ${callId}:`,
                error
            );
            throw error;
        }
    }

    private handleParticipantLeft(callId: string, streamCall: any) {
        // Add logic to check if any human participants remain
        // For now, we'll disconnect after a short delay to allow for reconnections
        setTimeout(() => {
            console.log(`⏰ Checking if call ${callId} should be ended...`);
            // You can add logic here to check active participants
            // this.disconnectCall(callId);
        }, 30000); // Wait 30 seconds
    }

    private handleStreamAudioReceived(audioEvent: any, callId: string) {
        try {
            // Filter out AI agent's own audio to prevent feedback
            if (audioEvent.participant?.user?.id === `agent-${callId}`) {
                return;
            }

            if (audioEvent.audioData && audioEvent.audioData.length > 0) {
                const audioBuffer = this.convertStreamAudioToBuffer(
                    audioEvent.audioData
                );
                if (audioBuffer.byteLength > 0) {
                    this.sendAudioToGemini(callId, audioBuffer);
                }
            }
        } catch (error) {
            console.error(
                `❌ Error handling Stream.io audio for call ${callId}:`,
                error
            );
        }
    }

    private convertStreamAudioToBuffer(audioData: any): ArrayBuffer {
        try {
            if (audioData instanceof ArrayBuffer) {
                return audioData;
            } else if (audioData.buffer instanceof ArrayBuffer) {
                return audioData.buffer;
            } else if (
                Array.isArray(audioData) ||
                audioData instanceof Float32Array
            ) {
                // Convert Float32 PCM to 16-bit PCM
                const pcm16Buffer = new ArrayBuffer(audioData.length * 2);
                const view = new DataView(pcm16Buffer);
                for (let i = 0; i < audioData.length; i++) {
                    const sample = Math.max(-1, Math.min(1, audioData[i]));
                    view.setInt16(i * 2, sample * 0x7fff, true);
                }
                return pcm16Buffer;
            } else if (audioData instanceof Uint8Array) {
                // Ensure we have a valid buffer and handle potential errors
                if (audioData.buffer && audioData.byteLength > 0) {
                    try {
                        // Use type assertion to avoid TypeScript intersection issues
                        const buffer = audioData.buffer as ArrayBuffer | SharedArrayBuffer;

                        if (buffer instanceof ArrayBuffer) {
                            return buffer.slice(
                                audioData.byteOffset,
                                audioData.byteOffset + audioData.byteLength
                            );
                        } else {
                            // For SharedArrayBuffer, create a new ArrayBuffer with the data
                            const newBuffer = new ArrayBuffer(audioData.byteLength);
                            const newView = new Uint8Array(newBuffer);
                            newView.set(audioData);
                            return newBuffer;
                        }
                    } catch (error) {
                        console.warn(
                            "Failed to slice Uint8Array buffer, creating new ArrayBuffer"
                        );
                        // Always create a new ArrayBuffer as fallback
                        const newBuffer = new ArrayBuffer(audioData.byteLength);
                        const newView = new Uint8Array(newBuffer);
                        newView.set(audioData);
                        return newBuffer;
                    }
                }
                return new ArrayBuffer(0);
            }

            console.warn(`Unknown audio data format for conversion`);
            return new ArrayBuffer(0);
        } catch (error) {
            console.error(`Error converting audio data:`, error);
            return new ArrayBuffer(0);
        }
    }

    private sendAudioToGemini(callId: string, audioBuffer: ArrayBuffer) {
        const session = this.activeSessions.get(callId);
        if (session && audioBuffer.byteLength > 0) {
            try {
                // Add to queue to prevent overwhelming the API
                const queue = this.audioQueues.get(callId) || [];
                queue.push(audioBuffer);
                this.audioQueues.set(callId, queue);

                // Process queue with throttling
                this.processAudioQueue(callId);
            } catch (error) {
                console.error(
                    `❌ Error queueing audio for Gemini call ${callId}:`,
                    error
                );
            }
        }
    }

    private async processAudioQueue(callId: string) {
        const session = this.activeSessions.get(callId);
        const queue = this.audioQueues.get(callId);

        if (!session || !queue || queue.length === 0) {
            return;
        }

        try {
            // Process one audio chunk at a time
            const audioBuffer = queue.shift();
            if (audioBuffer) {
                const blob = this.createAudioBlob(audioBuffer);
                await session.sendRealtimeInput({ media: blob as any });
                console.log(
                    `🎵 Audio sent to Gemini for call ${callId}, queue size: ${queue.length}`
                );
            }

            // Schedule next processing if queue not empty
            if (queue.length > 0) {
                setTimeout(() => this.processAudioQueue(callId), 100); // 100ms throttle
            }
        } catch (error) {
            console.error(
                `❌ Error processing audio queue for call ${callId}:`,
                error
            );
        }
    }

    private createAudioBlob(audioBuffer: ArrayBuffer): Blob {
        return new Blob([audioBuffer], { type: "audio/pcm" });
    }

    private async handleGeminiMessage(
        message: LiveServerMessage,
        streamCall: any,
        callId: string
    ) {
        try {
            // Handle audio response
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData;
            if (audio && audio.data) {
                await this.playAudioResponse(audio.data, streamCall, callId);
            }

            // Handle interruption
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
                console.log(`⏸️ Audio interrupted for call ${callId}`);
                this.stopCurrentAudio(streamCall, callId);
            }

            // Log text responses for debugging
            const textPart = message.serverContent?.modelTurn?.parts?.find(
                (part) => part.text
            );
            if (textPart?.text) {
                console.log(
                    `💬 Gemini text response for call ${callId}:`,
                    textPart.text
                );
            }

            // Handle setup complete
            if (message.setupComplete) {
                console.log(`✅ Gemini setup complete for call ${callId}`);
            }
        } catch (error) {
            console.error(
                `❌ Error handling Gemini message for call ${callId}:`,
                error
            );
        }
    }

    private async playAudioResponse(
        audioData: string,
        streamCall: any,
        callId: string
    ) {
        try {
            const audioBuffer = this.decodeBase64Audio(audioData);
            await this.sendAudioToStreamCall(audioBuffer, streamCall, callId);
            console.log(`🔊 Audio response sent to Stream.io call ${callId}`);
        } catch (error) {
            console.error(
                `❌ Error playing audio response for call ${callId}:`,
                error
            );
        }
    }

    private decodeBase64Audio(base64Data: string): ArrayBuffer {
        try {
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes.buffer;
        } catch (error) {
            console.error(`Error decoding base64 audio:`, error);
            return new ArrayBuffer(0);
        }
    }

    private async sendAudioToStreamCall(
        audioBuffer: ArrayBuffer,
        streamCall: any,
        callId: string
    ) {
        try {
            // Try multiple methods to send audio to Stream.io
            if (streamCall.sendAudio) {
                await streamCall.sendAudio(audioBuffer, { userId: `agent-${callId}` });
            } else if (streamCall.audio?.send) {
                await streamCall.audio.send(audioBuffer);
            } else if (streamCall.publishAudio) {
                await streamCall.publishAudio(audioBuffer);
            } else {
                console.warn(
                    `⚠️ No audio sending method found for Stream.io call ${callId}`
                );
                // Try to use WebRTC directly if available
                if (streamCall.localParticipant?.publishAudio) {
                    await streamCall.localParticipant.publishAudio(audioBuffer);
                }
            }
        } catch (error) {
            console.error(
                `❌ Error sending audio to Stream.io call ${callId}:`,
                error
            );
        }
    }

    private stopCurrentAudio(streamCall: any, callId: string) {
        try {
            if (streamCall.audio?.stop) {
                streamCall.audio.stop();
            } else if (streamCall.stopAudio) {
                streamCall.stopAudio();
            }
            console.log(`⏹️ Stopped audio playback for call ${callId}`);
        } catch (error) {
            console.error(`❌ Error stopping audio for call ${callId}:`, error);
        }
    }

    private cleanup(callId: string) {
        this.activeSessions.delete(callId);
        this.activeClients.delete(callId);
        this.audioQueues.delete(callId);
        console.log(`🧹 Cleaned up resources for call: ${callId}`);
    }

    disconnectCall(callId: string) {
        const session = this.activeSessions.get(callId);
        if (session) {
            try {
                session.close();
                console.log(`📞 Closed Gemini session for call: ${callId}`);
            } catch (error) {
                console.error(`❌ Error closing session for call ${callId}:`, error);
            }
        }
        this.cleanup(callId);
        console.log(`🔌 Disconnected Gemini for call: ${callId}`);
    }

    disconnectAll() {
        console.log(`🔌 Disconnecting all Gemini sessions...`);
        for (const [callId, session] of this.activeSessions) {
            try {
                session.close();
            } catch (error) {
                console.error(`❌ Error closing session for call ${callId}:`, error);
            }
        }
        this.activeSessions.clear();
        this.activeClients.clear();
        this.audioQueues.clear();
        console.log("✅ Disconnected all Gemini sessions");
    }
}

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
}

export const geminiManager = new GeminiRealtimeManager(geminiApiKey);

export const connectGemini = async (options: {
    call: any;
    agentUserId: string;
}): Promise<GeminiRealtimeClient> => {
    const { call, agentUserId } = options;
    const callId = call.id || call.cid;

    console.log(
        `🚀 Connecting Gemini to call ${callId} with agent ${agentUserId}`
    );
    return await geminiManager.connectToCall(callId, agentUserId, call);
};

export default geminiManager;

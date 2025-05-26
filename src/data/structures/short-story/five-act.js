export const fiveActStructureShortStory = {
    goal: "Create a focused short story using the classical five-act dramatic structure",    
    description: "The Five-Act Structure, adapted for short story format, offers a concise yet complete narrative framework. This 5-section approach condenses the traditional structure while maintaining essential dramatic elements, perfect for crafting powerful short fiction with limited word count.",    
    idealLength: "5 chapters (short story format: 1,500-5,000 words total)",    
    preWritingQuestion: {
        task: "What core conflict or transformation will your short story explore?",
        suggestions: ["Personal revelation", "Moral dilemma", "Relationship conflict", "Inner vs. outer self", "Confronting fear", "Loss and acceptance"]
    },    
    chapterOne: {
        index: 1,
        objective: "Exposition & Inciting Incident",
        purpose: "Efficiently establish the protagonist, setting, and trigger the central conflict.",
        questions: [
            {
                index: 1,
                question: "Who is your protagonist and what defining trait or situation makes them interesting?",
                suggestions: []
            },
            {
                index: 2,
                question: "What essential setting details create atmosphere and context?",
                suggestions: ["Time period", "Distinctive location", "Mood/tone", "Social environment"]
            },
            {
                index: 3,
                question: "What disruption or challenge immediately upsets the status quo?",
                suggestions: []
            },
            {
                index: 4,
                question: "What key desire or need drives your protagonist?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 300,
            max: 800
        },
        promptToUser: "Introduce your protagonist and their world with focused detail, then quickly disrupt their normal life with a meaningful challenge or opportunity.",
        prompt: "Establish character and setting with precise details, then introduce a clear disruption that demands a response.",
        aiPrompt: `
            Create the opening section for a [GENRE] short story using the Five-Act Structure.
            Introduce [CHARACTER NAME] with 1-2 vivid characteristics and their essential circumstance.
            Establish just enough about the [SETTING] to ground the reader.
            Within the first few paragraphs, present [DISRUPTING EVENT] that forces the protagonist to respond.
            Clearly suggest what the protagonist desires or needs.
            End with a sense of the protagonist's initial reaction to this disruption.
            Keep language concise but evocative—every word must serve multiple purposes.
        `
    },
    
    chapterTwo: {
        index: 2,
        objective: "Rising Action",
        purpose: "Escalate tensions through focused complications as the protagonist responds to the challenge.",
        questions: [
            {
                index: 1,
                question: "How does your protagonist actively respond to the inciting incident?",
                suggestions: []
            },
            {
                index: 2,
                question: "What key obstacle or complication makes the situation more difficult?",
                suggestions: ["External opposition", "Internal conflict", "Misunderstanding", "Time pressure"]
            },
            {
                index: 3,
                question: "What's at stake if the protagonist fails?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 400,
            max: 1200
        },
        promptToUser: "Show your protagonist taking action while facing increasing difficulties. Focus on the most significant complication that drives the story forward.",
        prompt: "The protagonist actively engages with the central conflict while encountering meaningful resistance.",
        aiPrompt: `
            Create the rising action section for a [GENRE] short story using the Five-Act Structure.
            Show [CHARACTER NAME] taking concrete steps toward addressing [MAIN CONFLICT].
            Introduce one significant complication: [COMPLICATION].
            Reveal what's truly at stake for the protagonist.
            If using a supporting character, ensure they heighten tension rather than distract.
            Build momentum toward an inevitable confrontation or decision.
            End with tension at its highest point before the climax.
            Keep descriptions focused only on details that advance the conflict or reveal character.
        `
    },
    
    chapterThree: {
        index: 3,
        objective: "Climax",
        purpose: "Present the decisive moment that forces change or revelation.",
        questions: [
            {
                index: 1,
                question: "What crucial decision, confrontation, or revelation occurs?",
                suggestions: ["Choice between values", "Face-to-face conflict", "Truth revealed", "Internal realization"]
            },
            {
                index: 2,
                question: "How does this moment challenge or change the protagonist?",
                suggestions: []
            },
            {
                index: 3,
                question: "What is the emotional peak of the story?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 300,
            max: 1000
        },
        promptToUser: "Create a powerful moment of truth where your protagonist reaches a point of no return. Make this scene emotionally resonant and meaningful.",
        prompt: "The protagonist faces the central conflict directly in a moment that forces transformation.",
        aiPrompt: `
            Create the climax section for a [GENRE] short story using the Five-Act Structure.
            Bring [CHARACTER NAME] to the crucial moment of [CLIMACTIC EVENT].
            Make this scene immediate and visceral—use sensory details sparingly but effectively.
            Focus on the character's emotional experience during this pivotal moment.
            Ensure this moment directly relates to the story's central question or theme.
            Show a clear turning point where something fundamental changes.
            End with the immediate result of this climactic moment.
            Use pacing through sentence structure—shorter sentences for intensity, longer for reflection.
        `
    },
    
    chapterFour: {
        index: 4,
        objective: "Falling Action",
        purpose: "Show immediate consequences and how the protagonist processes the climax.",
        questions: [
            {
                index: 1,
                question: "What is the immediate aftermath of the climax?",
                suggestions: []
            },
            {
                index: 2,
                question: "How does the protagonist respond emotionally or practically?",
                suggestions: []
            },
            {
                index: 3,
                question: "What has fundamentally changed in the protagonist or their situation?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 250,
            max: 800
        },
        promptToUser: "Demonstrate the immediate consequences of the climax and show your protagonist processing what has happened.",
        prompt: "Show the direct aftermath of the climactic moment and how it affects the protagonist.",
        aiPrompt: `
            Create the falling action section for a [GENRE] short story using the Five-Act Structure.
            Show the immediate consequences of [CLIMACTIC EVENT].
            Reveal [CHARACTER NAME]'s emotional or practical response.
            Demonstrate what has fundamentally changed as a result.
            Begin transitioning toward the resolution.
            Maintain emotional authenticity in how the character processes what happened.
            Keep the pace deliberate—this section should feel like exhaling after holding breath.
        `
    },
    
    chapterFive: {
        index: 5,
        objective: "Resolution",
        purpose: "Provide closure and reveal the character's new understanding or situation.",
        questions: [
            {
                index: 1,
                question: "How has the protagonist changed by the end?",
                suggestions: []
            },
            {
                index: 2,
                question: "What final image or moment encapsulates the story's meaning?",
                suggestions: []
            },
            {
                index: 3,
                question: "What insight or new understanding has been gained?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 250,
            max: 600
        },
        promptToUser: "Bring your story to a meaningful close with a final image, moment, or realization that resonates with your theme.",
        prompt: "Conclude with a clear resolution that reveals the meaning of the journey and the character's transformation.",
        aiPrompt: `
            Create the resolution section for a [GENRE] short story using the Five-Act Structure.
            Show [CHARACTER NAME]'s new state or understanding after everything that's happened.
            Provide closure on the central conflict.
            Create a final moment or image that echoes or contrasts with the beginning.
            Reveal the story's core insight or theme through action or realization, not explanation.
            End with a line that resonates beyond the story itself.
            Be concise—the perfect short story ending feels both surprising and inevitable.
        `
    },
    
    implementationDetails: {
        genreSpecificGuidance: {
            literary: "Focus on subtle character transformation through precise language and meaningful symbolism",
            speculative: "Even with fantastic elements, keep the emotional core grounded in universal human experiences",
            mystery: "Plant subtle clues earlier that pay off at the climax, without overwhelming the character focus",
            horror: "Build atmospheric tension through the rising action, with the climax revealing the true nature of the threat",
            slice_of_life: "The transformation may be internal and subtle, focusing on a shift in perspective rather than dramatic events"
        },
        chapterLengthProportions: {
            chapterOne: "20% of total word count",
            chapterTwo: "30% of total word count",
            chapterThree: "20% of total word count",
            chapterFour: "15% of total word count",
            chapterFive: "15% of total word count"
        },
        analysisFeatures: [
            "Verify that every scene directly relates to the central conflict",
            "Check that character transformation is evident from beginning to end",
            "Ensure the climax genuinely changes something fundamental for the protagonist",
            "Confirm that descriptions are minimal but evocative, serving multiple purposes"
        ],
        commonPitfalls: [
            "Including too many characters or subplots for the limited format",
            "Overexplaining the theme or message in the resolution",
            "Beginning too far before the actual story starts",
            "Creating a climax that doesn't meaningfully challenge or change the protagonist",
            "Including details or scenes that don't advance the central conflict"
        ],
        shortStorySpecificTips: [
            "Focus on a single emotional truth or realization",
            "Use symbolic objects or settings to carry multiple meanings",
            "Consider a compressed timeframe (hours or days rather than weeks or years)",
            "Limit characters to only those essential to the central conflict",
            "Use implications and subtext rather than explicit explanation when possible"
        ]
    }
};

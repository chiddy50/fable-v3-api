export const sevenPointStructureNovel = {
    goal: "Create a novel using the classic seven-point story structure",
    
    description: "The Seven-Point Story Structure is a powerful narrative framework focused on key turning points in a character's journey. This approach maps perfectly to a 7-chapter novel format, creating a clear progression of plot beats that maintains momentum and ensures character transformation.",
    
    idealLength: "7 chapters (novel format)",
    
    preWritingQuestion: {
        task: "What type of character transformation will drive your story?",
        suggestions: ["Overcoming fear", "Finding strength", "Discovering truth", "Learning to trust", "Letting go", "Finding purpose", "Redemption"]
    },
    
    chapterOne: {
        index: 1,
        objective: "Hook",
        purpose: "Introduce the protagonist in their everyday life and hint at what's missing or wrong.",
        questions: [
            {
                index: 1,
                question: "What is the hero's normal life like?",
                suggestions: ["Daily routines", "Important relationships", "Occupation or status", "Living conditions"]
            },
            {
                index: 2,
                question: "What flaws or internal conflict do they have?",
                suggestions: []
            },
            {
                index: 3,
                question: "What is the emotional or moral weakness they need to overcome?",
                suggestions: []
            },
            {
                index: 4,
                question: "What hints at potential change or danger in their world?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2000,
            max: 5000
        },
        promptToUser: "Introduce the main character and their ordinary world. Highlight what's lacking or broken in their life, and tease what needs to change.",
        prompt: "Set up the protagonist's current reality, flaws, and what's missing in their life.",
        aiPrompt: `
            Create the hook chapter for a [GENRE] novel using the Seven-Point Structure.
            Introduce [CHARACTER NAME], a [CHARACTER DESCRIPTION] with [FLAW OR WEAKNESS].
            Establish their normal life in [SETTING].
            Show their primary relationships and routines.
            Reveal what's missing or broken in their life: [LACKING ELEMENT].
            Hint at the coming disruption or opportunity.
            End with subtle foreshadowing of the change that's about to occur.
        `
    },
    
    chapterTwo: {
        index: 2,
        objective: "First Plot Point",
        purpose: "Something drastic happens that changes everything and kicks the story into motion.",
        questions: [
            {
                index: 1,
                question: "What major event throws the protagonist's world off balance?",
                suggestions: ["A challenge", "A threat", "An opportunity", "A loss", "A discovery"]
            },
            {
                index: 2,
                question: "What new goal or problem do they face?",
                suggestions: []
            },
            {
                index: 3,
                question: "How are they forced to act or change direction?",
                suggestions: []
            },
            {
                index: 4,
                question: "What is their initial reaction to this change?",
                suggestions: ["Resistance", "Denial", "Excitement", "Fear", "Confusion"]
            }
        ],
        wordCount: {
            min: 2500,
            max: 5000
        },
        promptToUser: "Something major changes the protagonist's world — a threat, opportunity, or twist that forces them to act.",
        prompt: "Introduce the event that disrupts the status quo and sets the main conflict in motion.",
        aiPrompt: `
            Create the first plot point chapter for a [GENRE] novel using the Seven-Point Structure.
            Show [CHARACTER NAME] experiencing [MAJOR DISRUPTING EVENT].
            Demonstrate how this event completely changes their situation or worldview.
            Establish the central conflict or quest that will drive the rest of the story.
            Show the protagonist's reaction and initial attempts to deal with the change.
            End with the character committing to a path or goal, even reluctantly.
        `
    },
    
    chapterThree: {
        index: 3,
        objective: "First Pinch Point",
        purpose: "Add pressure through an external force, often involving the antagonist.",
        questions: [
            {
                index: 1,
                question: "How does the antagonist or opposing force threaten the protagonist?",
                suggestions: []
            },
            {
                index: 2,
                question: "What new danger or complication arises?",
                suggestions: []
            },
            {
                index: 3,
                question: "What's revealed about the stakes?",
                suggestions: []
            },
            {
                index: 4,
                question: "How does the protagonist respond to this pressure?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2500,
            max: 5000
        },
        promptToUser: "Introduce or reinforce the antagonist's threat. Make the conflict feel real and immediate.",
        prompt: "The protagonist faces real pressure from opposing forces, raising the stakes of the conflict.",
        aiPrompt: `
            Create the first pinch point chapter for a [GENRE] novel using the Seven-Point Structure.
            Show [CHARACTER NAME] encountering significant pressure from [ANTAGONIST/OPPOSING FORCE].
            Introduce a new complication: [COMPLICATION].
            Raise the stakes by revealing what could be lost if the protagonist fails.
            Demonstrate the protagonist's response to this increased pressure.
            End with the character feeling the weight of the challenge but determined to continue.
        `
    },
    
    chapterFour: {
        index: 4,
        objective: "Midpoint",
        purpose: "A turning point — the protagonist gains new understanding or commitment.",
        questions: [
            {
                index: 1,
                question: "What realization shifts the protagonist's perspective?",
                suggestions: []
            },
            {
                index: 2,
                question: "What big decision do they make now?",
                suggestions: []
            },
            {
                index: 3,
                question: "How does this change their approach to the goal?",
                suggestions: []
            },
            {
                index: 4,
                question: "What truth about themselves or the situation do they discover?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 3000,
            max: 6000
        },
        promptToUser: "The protagonist has a major insight or breakthrough. Their journey becomes more active and intentional from this point forward.",
        prompt: "A pivotal moment where the protagonist shifts from reacting to acting with purpose and new understanding.",
        aiPrompt: `
            Create the midpoint chapter for a [GENRE] novel using the Seven-Point Structure.
            Show [CHARACTER NAME] experiencing a crucial realization: [REALIZATION].
            Include a moment of truth that changes how they view their situation.
            Demonstrate a shift from reactive to proactive behavior.
            Show the character making an important decision based on their new understanding.
            Paint this as a clear turning point—the journey shifts direction from here.
            End with a sense of renewed purpose or changed strategy.
        `
    },
    
    chapterFive: {
        index: 5,
        objective: "Second Pinch Point",
        purpose: "Raise the stakes again — the hero is under pressure.",
        questions: [
            {
                index: 1,
                question: "What new danger or failure makes things worse?",
                suggestions: []
            },
            {
                index: 2,
                question: "How does the antagonist gain ground?",
                suggestions: []
            },
            {
                index: 3,
                question: "What consequences grow more serious?",
                suggestions: []
            },
            {
                index: 4,
                question: "How does this test the protagonist's new resolve?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2500,
            max: 5000
        },
        promptToUser: "Add tension — the antagonist strikes again or things spiral. The hero is overwhelmed or forced to face a setback.",
        prompt: "The conflict intensifies as the protagonist faces their greatest challenges yet.",
        aiPrompt: `
            Create the second pinch point chapter for a [GENRE] novel using the Seven-Point Structure.
            Show [CHARACTER NAME] experiencing a significant setback: [SETBACK].
            Demonstrate the antagonist or opposing force gaining strength or advantage.
            Escalate the consequences and make the stakes even higher than before.
            Test the protagonist's commitment to their goal or cause.
            Show them nearly breaking but finding the will to continue.
            End with the protagonist at their lowest point, but with a glimmer of determination.
        `
    },
    
    chapterSix: {
        index: 6,
        objective: "Second Plot Point",
        purpose: "The final piece of the puzzle falls into place — the hero finds the key to winning.",
        questions: [
            {
                index: 1,
                question: "What truth or revelation gives the hero hope?",
                suggestions: []
            },
            {
                index: 2,
                question: "What final plan or insight empowers them?",
                suggestions: []
            },
            {
                index: 3,
                question: "How does this prepare for the climax?",
                suggestions: []
            },
            {
                index: 4,
                question: "What internal or external resources does the protagonist gather?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2500,
            max: 5000
        },
        promptToUser: "The protagonist discovers something vital that allows them to take control of their fate and prepare for the final battle or decision.",
        prompt: "The protagonist gains the final insight, tool, or resolve needed to face the ultimate challenge.",
        aiPrompt: `
            Create the second plot point chapter for a [GENRE] novel using the Seven-Point Structure.
            Show [CHARACTER NAME] discovering the key to potential victory: [KEY INSIGHT/TOOL].
            Reveal a crucial truth that changes how they approach the conflict.
            Demonstrate the protagonist gathering their resolve and resources.
            Show them making final preparations for the climactic confrontation.
            Include a moment where they come to terms with what they must do.
            End with the protagonist poised to face their greatest challenge.
        `
    },
    
    chapterSeven: {
        index: 7,
        objective: "Resolution",
        purpose: "The climax and aftermath — resolve the conflict and show transformation.",
        questions: [
            {
                index: 1,
                question: "How does the final confrontation play out?",
                suggestions: []
            },
            {
                index: 2,
                question: "What changes in the protagonist?",
                suggestions: []
            },
            {
                index: 3,
                question: "What is the new normal or emotional outcome?",
                suggestions: []
            },
            {
                index: 4,
                question: "How is the original weakness or flaw addressed?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2500,
            max: 6000
        },
        promptToUser: "Resolve the main conflict. Show how the protagonist has changed, and wrap up the story's emotional threads.",
        prompt: "Bring the story to its climax and conclusion, showing the protagonist's transformation and the resolution of conflicts.",
        aiPrompt: `
            Create the resolution chapter for a [GENRE] novel using the Seven-Point Structure.
            Show [CHARACTER NAME] in the final confrontation or challenge: [CLIMACTIC SCENE].
            Demonstrate how they apply everything they've learned or become.
            Resolve the main conflict definitively.
            Reveal how the protagonist has changed since the beginning.
            Show how their original flaw or weakness has been addressed.
            Establish their new normal or future direction.
            End with emotional closure that reflects the story's themes.
        `
    },
    
    implementationDetails: {
        genreSpecificGuidance: {
            action: "Emphasize external threats at pinch points and physical challenges in the final confrontation",
            romance: "Focus the midpoint on a shift in the relationship dynamic, with the central romantic conflict resolved in the resolution",
            mystery: "Use the second plot point for the key revelation that allows the protagonist to finally understand the truth",
            fantasy: "The midpoint often involves discovering the true nature of magic or the world's rules",
            thriller: "Make both pinch points intensify danger, with the antagonist seeming most powerful just before the second plot point"
        },
        chapterLengthProportions: {
            chapterOne: "12% of total word count",
            chapterTwo: "14% of total word count",
            chapterThree: "14% of total word count",
            chapterFour: "16% of total word count",
            chapterFive: "14% of total word count",
            chapterSix: "14% of total word count",
            chapterSeven: "16% of total word count"
        },
        analysisFeatures: [
            "Verify that the midpoint truly shifts the protagonist from reactive to proactive",
            "Check that both pinch points effectively increase pressure on the protagonist",
            "Ensure the second plot point provides a necessary element for the final resolution",
            "Confirm that the character's transformation addresses their initial flaw or weakness"
        ],
        commonPitfalls: [
            "Creating a hook that doesn't clearly establish what's lacking in the protagonist's life",
            "Making the first plot point too subtle to truly disrupt the status quo",
            "Failing to make the antagonist's threat concrete at the pinch points",
            "Resolving major conflicts before the final chapter",
            "Not connecting the protagonist's final transformation to their initial flaws"
        ],
        structuralRecommendations: [
            "Each plot point should be a clear cause-and-effect moment that changes the story's direction",
            "The midpoint should mirror the protagonist's final transformation but in incomplete form",
            "The distance between pinch points and plot points should feel evenly paced",
            "The resolution should directly address the issue presented in the hook"
        ]
    }
};
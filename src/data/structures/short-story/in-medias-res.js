export const inMediasRes = {
    goal: "Begin the story in the middle of the action, creating immediate engagement and tension",
    
    description: "In Medias Res (Latin for 'in the midst of things') is a narrative technique where the story begins at a crucial point in the action, bypassing exposition. This structure creates immediate tension and curiosity, perfect for short stories.",
    
    idealLength: "1-3 chapters (short story format)",
    
    preWritingQuestion: {
        task: "Visualize an intense, dramatic moment for your protagonist. What's happening?",
        suggestions: ["A confrontation", "A discovery", "A crisis", "A decision point", 
                      "The aftermath of something significant", "A dangerous situation", 
                      "A moment of transformation"]
    },
    
    chapterOne: {
        index: 1,
        objective: "The Action (Opening Conflict)",
        purpose: "Drop the reader right into a dramatic or high-stakes scene without explanation",
        questions: [
            {
                index: 1,
                question: "What is happening right now that's urgent or intense?",
                suggestions: ["A physical confrontation", "A crucial conversation", "A shocking discovery", 
                              "A moment of danger", "An emotional breakdown"]
            },
            {
                index: 2,
                question: "Who is the protagonist, and what immediate challenge are they facing?",
                suggestions: []
            },
            {
                index: 3,
                question: "What emotions or stakes are present in this moment?",
                suggestions: ["Fear", "Anger", "Desperation", "Confusion", "Excitement", "Grief"]
            },
            {
                index: 4,
                question: "What isn't being said — what mystery draws us in?",
                suggestions: ["An unexplained relationship", "A hidden motivation", "A past event", 
                              "Something only the character understands"]
            }
        ],
        wordCount: {
            min: 300,
            max: 800
        },
        promptToUser: "Begin your story at a dramatic high point. Avoid explaining how your character got here - that comes later. Focus on immediate action, emotion, and creating questions in the reader's mind.",
        prompt: "Begin the story in the middle of an intense or dramatic moment. Describe what the protagonist is doing and feeling, and hint at what might have led up to this moment without fully explaining it yet.",
        aiPrompt: `
            Create the opening chapter for a [GENRE] short story using In Medias Res structure.
            Begin in the middle of [DRAMATIC SITUATION].
            Show [CHARACTER NAME] immediately dealing with [SPECIFIC CHALLENGE].
            Include vivid sensory details about what the character sees, hears, and feels.
            Create a sense of urgency and intensity.
            Hint at backstory without explaining it.
            End the chapter with a moment that deepens the mystery or raises the stakes.
        `
    },
    
    chapterTwo: {
        index: 2,
        objective: "The Unfolding (Backstory + Escalation)",
        purpose: "Slowly reveal how the situation came to be, while raising the stakes",
        questions: [
            {
                index: 1,
                question: "What events or decisions led to the current conflict?",
                suggestions: []
            },        
            {
                index: 2,
                question: "What's at stake if the protagonist fails?",
                suggestions: ["Personal loss", "Harm to others", "Lost opportunity", "Identity crisis"]
            },
            {
                index: 3,
                question: "What do we now learn about the characters, world, or relationships?",
                suggestions: []
            },
            {
                index: 4,
                question: "How does the conflict become more complicated?",
                suggestions: ["New obstacle", "Betrayal", "Misunderstanding", "Time pressure", "Internal conflict"]
            }
        ],
        wordCount: {
            min: 400,
            max: 1000
        },
        promptToUser: "In this chapter, continue the action while weaving in essential backstory. Reveal just enough about how your character arrived at this moment while making their situation more complex.",
        prompt: "Reveal parts of the protagonist's past or earlier events that led to the current moment. Deepen the conflict and raise the stakes. Continue with forward motion while dropping key backstory details naturally.",
        aiPrompt: `
            Create the middle chapter for a [GENRE] short story using In Medias Res structure.
            Continue the action from Chapter 1 where [CHARACTER NAME] is dealing with [SITUATION].
            Reveal important backstory about [BACKSTORY ELEMENT] through dialogue, memories, or flashbacks.
            Introduce a new complication: [COMPLICATION].
            Raise the stakes by showing what the character stands to lose.
            Balance moving the story forward with revealing the past.
            End with a moment that increases tension or forces a difficult choice.
        `
    },
    
    chapterThree: {
        index: 3,
        objective: "The Climax and Resolution",
        purpose: "Resolve the main conflict with a twist, transformation, or realization",
        questions: [
            {
                index: 1,
                question: "What final choice, action, or event resolves the story?",
                suggestions: []
            },
            {
                index: 2,
                question: "How does the protagonist change?",
                suggestions: ["New understanding", "Change in values", "Decision to act differently", "Acceptance"]
            },
            {
                index: 3,
                question: "What is the emotional payoff or irony?",
                suggestions: []
            },
            {
                index: 4,
                question: "What happens immediately after the climax?",
                suggestions: ["Brief aftermath", "Reflection", "Hint at future", "Return to a new normal"]
            }
        ],
        wordCount: {
            min: 300,
            max: 800
        },
        promptToUser: "Bring your story to a powerful conclusion. Resolve the immediate conflict while showing how your character has been changed by these events.",
        prompt: "Conclude the story with a decisive moment or realization. Resolve the central conflict and reveal how the protagonist is changed. End with impact — something that lingers emotionally or intellectually.",
        aiPrompt: `
            Create the final chapter for a [GENRE] short story using In Medias Res structure.
            Bring [CHARACTER NAME]'s situation to its climax.
            Show them making a crucial choice or taking decisive action regarding [CENTRAL CONFLICT].
            Reveal any final pieces of backstory that give meaning to this moment.
            Demonstrate how the character has changed since the opening scene.
            Provide emotional resolution or a meaningful realization.
            End with a powerful image, thought, or line that resonates with the story's themes.
        `
    },
    
    implementationDetails: {
        enhancementOptions: {
            miniFlashbacks: {
                description: "Short flashbacks within chapters 2 and 3 to provide context without derailing momentum",
                implementation: "Use italics or clear transitions to indicate brief jumps to the past"
            },
            circularEnding: {
                description: "End in a similar setting to where the story began, but with the character changed",
                implementation: "Return to the opening location or situation, highlighting transformation"
            },
            delayedReveal: {
                description: "Hold back a key piece of information until late in the story",
                implementation: "Plant subtle clues throughout that gain significance with the final reveal"
            }
        },
        genreSpecificGuidance: {
            thriller: "Focus on immediate physical danger in Chapter 1",
            romance: "Begin with an emotionally charged encounter",
            mystery: "Start with the discovery of something unexplainable",
            fantasy: "Open with the character using or encountering magic in a crucial moment"
        },
        chapterLengthProportions: {
            chapterOne: "30% of total word count",
            chapterTwo: "40% of total word count",
            chapterThree: "30% of total word count"
        },
        analysisFeatures: [
            "Check if Chapter 1 truly begins in action without excessive explanation",
            "Verify that backstory is revealed gradually rather than in exposition dumps",
            "Ensure the story maintains forward momentum while revealing the past"
        ],
        commonPitfalls: [
            "Explaining too much too soon",
            "Starting with action that's intense but not meaningful to the character",
            "Introducing too many characters in the opening scene",
            "Relying on flashbacks that interrupt rather than enhance the narrative flow"
        ]
    }
};
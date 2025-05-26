export const singleEffect = {
    goal: "Create a unified emotional impact (e.g. fear, awe, sorrow, irony, joy, etc.)",
    
    preWritingQuestion: {
        task: "What emotion or effect do you want your reader to feel by the end of the story?",
        suggestions: ["Dread", "Wonder", "Tragic irony", "Surprise", "Bittersweet nostalgia", 
                      "Hope", "Horror", "Awe", "Sadness", "Revelation", "Satisfaction", "Existential unease"]
    },
    
    chapterOne: {
        index: 1,
        objective: "Set the Mood & Establish the Central Premise",
        purpose: "Introduce tone, setting, and hint at the emotional effect. Establishes the setting, introduces the characters, and sets the tone that will lead to the intended effect",
        questions: [
            {
                index: 1,
                question: "What feeling should your story ultimately evoke? (eerie, joyful, tragic, dread, wonder, melancholy, etc.)?",
                suggestions: []
            },
            {
                index: 2,
                question: "Where and when does the story happen?",
                suggestions: []
            },
            {
                index: 3,
                question: "Who is the protagonist, and what are they experiencing?",
                suggestions: []
            },
            {
                index: 4,
                question: "What small detail or situation hints at something bigger or unsettling?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 300,
            max: 1000
        },
        promptToUser: "In this chapter, you'll establish the mood and introduce your main character. Focus on creating a distinctive atmosphere that will support your story's final effect.",
        prompt: "Create an opening scene that establishes the tone and introduces the protagonist in a setting that supports the desired emotional effect. Something about the environment or situation should hint that all is not what it seems.",
        aiPrompt: `
            Create an opening chapter for a [GENRE] short story with a Single-Effect Structure.
            Establish a [TONE] atmosphere that builds toward a feeling of [EFFECT].
            Introduce [CHARACTER NAME], who is [CHARACTER DESCRIPTION].
            Set the scene in [SETTING] and establish the initial situation.
            Include subtle foreshadowing of the final effect without revealing too much.
            Focus on sensory details that reinforce the desired atmosphere.
        `
    },
    
    chapterTwo: {
        index: 2,
        objective: "Build Suspense & Foreshadowing. Complication & Intensification",
        purpose: "Introduce tension or mystery that slowly builds toward the emotional effect. Deepen the situation, add complications, intensify the building effect",
        questions: [
            {
                index: 1,
                question: "What small actions or discoveries start shifting the mood?",
                suggestions: []
            },        
            {
                index: 2,
                question: "What questions are raised in the reader's mind?",
                suggestions: []
            },
            {
                index: 3,
                question: "Are there symbols, patterns, or repeated elements that foreshadow the ending?",
                suggestions: []
            },
            {
                index: 4,
                question: "What obstacle or revelation challenges your character?",
                suggestions: []
            },
            {
                index: 5,
                question: "How does this complication intensify the story's emotional direction?",
                suggestions: []
            },
            {
                index: 6,
                question: "What details can you add that strengthen the atmosphere established in Chapter 1?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 400,
            max: 1200
        },
        promptToUser: "In this middle chapter, you'll deepen the story's central situation and intensify the building effect. The emotional intensity should increase as your character faces complications.",
        prompt: "Show the protagonist beginning to sense a change or deeper meaning in their surroundings or events. Build subtle tension, suspense, or anticipation, guiding the reader emotionally.",
        aiPrompt: `
            Create the middle chapter for a [GENRE] short story with a Single-Effect Structure.
            Intensify the [TONE] established in Chapter 1.
            Present [CHARACTER NAME] with a complication: [COMPLICATION].
            Show how this situation deepens the building [EFFECT].
            Include details that echo and amplify elements from Chapter 1.
            Increase emotional intensity through dialogue, internal thoughts, or environmental changes.
            End with a moment that signals the approaching climax.
        `
    },
    
    chapterThree: {
        index: 3,
        objective: "Climax – The Emotional or Narrative Pivot",
        purpose: "Deliver the emotional payoff (shock, realization, fear, wonder, etc.)",
        questions: [
            {
                index: 1,
                question: "What moment or revelation completely shifts the reader's understanding?",
                suggestions: []
            },
            {
                index: 2,
                question: "How does the story heighten the chosen emotional effect?",
                suggestions: []
            },
            {
                index: 3,
                question: "How does the protagonist respond (or fail to respond)?",
                suggestions: []
            },
            {
                index: 4,
                question: "What final scene will deliver the maximum emotional impact?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 300,
            max: 800
        },
        promptToUser: "In this chapter, your story reaches its emotional peak. Everything built in previous chapters should culminate in a powerful moment.",
        prompt: "Reveal a climactic event, realization, or confrontation that delivers the chosen emotional effect with maximum impact. Make this moment memorable and irreversible.",
        aiPrompt: `
            Create the climax chapter for a [GENRE] short story with a Single-Effect Structure.
            Deliver the culminating [EFFECT] that the story has been building toward.
            Show [CHARACTER NAME]'s confrontation with [SITUATION/ANTAGONIST].
            Bring the [TONE] to its peak intensity.
            Include a powerful moment of realization, change, or revelation.
            Make this moment the emotional center of your entire story.
        `
    },
    
    chapterFour: {
        index: 4,
        objective: "Resolution – The Lasting Emotional Echo",
        purpose: "Wrap up briefly, reinforcing the emotional effect",
        questions: [
            {
                index: 1,
                question: "What is the emotional aftermath of the climax?",
                suggestions: []
            },
            {
                index: 2,
                question: "How has the world, the protagonist, or the reader's understanding changed?",
                suggestions: []
            },
            {
                index: 3,
                question: "What lingering image, sentence, or thought remains?",
                suggestions: []
            },
            {
                index: 4,
                question: "What final line will leave the strongest impression?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 200,
            max: 500
        },
        promptToUser: "In this final chapter, close your story with a powerful resolution that reinforces the emotional effect you've been building.",
        prompt: "Close the story quickly but powerfully. Leave a final image or emotion that echoes the story's core feeling. Don't explain — let the effect settle naturally.",
        aiPrompt: `
            Create the final chapter for a [GENRE] short story with a Single-Effect Structure.
            Show the aftermath of the climactic [EVENT/REVELATION] from Chapter 3.
            Reinforce the [EFFECT] that the story has been building toward.
            Show how [CHARACTER NAME] has been changed.
            Keep this chapter brief but impactful.
            End with a resonant final image or line that reinforces the story's single effect.
            Ensure all story elements come together to serve this unified emotional purpose.
        `
    },
    
    implementationDetails: {
        progressTracking: {
            feature: "Building Effect meter",
            description: "Visual representation of progress toward emotional climax"
        },
        genreSpecificGuidance: {
            horror: "Suggest unsettling details that gradually increase",
            romance: "Suggest emotional tension building techniques",
            mystery: "Suggest clue placement that leads to revelation",
            fantasy: "Suggest wonder-inducing elements that build toward awe"
        },
        chapterLengthProportions: {
            chapterOne: "25% of total word count",
            chapterTwo: "40% of total word count",
            chapterThree: "25% of total word count",
            chapterFour: "10% of total word count"
        },
        analysisFeatures: [
            "Evaluate if each chapter builds toward the intended effect",
            "Offer suggestions for strengthening the unified emotional impact",
            "Check for consistency in tone and atmosphere"
        ]
    }
};
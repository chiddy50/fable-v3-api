export const freytagsPyramidShortStory = {
    goal: "Create a short story with a classic dramatic arc of rising and falling tension",
    
    description: "Freytag's Pyramid is a traditional dramatic structure that follows a clear progression from exposition through conflict to resolution. This 7-chapter structure adapts the classic model specifically for short stories, offering a condensed but complete dramatic arc.",
    
    idealLength: "7 chapters (short story format)",
    
    preWritingQuestion: {
        task: "What central conflict or change will drive your story?",
        suggestions: ["Internal struggle", "Relationship conflict", "Challenge to overcome", 
                      "Mystery to solve", "Unexpected event", "Moral dilemma"]
    },
    
    chapterOne: {
        index: 1,
        objective: "Exposition",
        purpose: "Establish characters, setting, tone, and conflict hints.",
        questions: [
            {
                index: 1,
                question: "Who is the main character and what's their current situation?",
                suggestions: []
            },
            {
                index: 2,
                question: "Where and when is the story set?",
                suggestions: []
            },
            {
                index: 3,
                question: "What is the character's goal or desire?",
                suggestions: []
            },
            {
                index: 4,
                question: "What hints of conflict or tension are introduced?",
                suggestions: ["A lingering problem", "An unmet need", "A recurring worry", "A brewing storm"]
            }
        ],
        wordCount: {
            min: 300,
            max: 800
        },
        promptToUser: "Introduce your protagonist and their world. Give readers a clear sense of who they are and what normal life looks like before the story's main events begin.",
        prompt: "Introduce the protagonist, the setting, and their world. Give us a glimpse into their daily life and foreshadow the central conflict or tension.",
        aiPrompt: `
            Create the exposition chapter for a [GENRE] short story using Freytag's Pyramid structure.
            Introduce [CHARACTER NAME], showing their personality and situation.
            Establish the [SETTING] with sensory details that support the mood.
            Show what the character wants or needs in their everyday life.
            Hint at the coming conflict without directly stating it.
            Plant a seed of tension or anticipation.
            Keep the pace engaging while establishing necessary context.
        `
    },
    
    chapterTwo: {
        index: 2,
        objective: "Inciting Incident",
        purpose: "Introduce the event that disrupts normal life and sets the story in motion.",
        questions: [
            {
                index: 1,
                question: "What specific event changes the character's course?",
                suggestions: ["An arrival", "A departure", "A discovery", "A loss", "An announcement", "A challenge"]
            },        
            {
                index: 2,
                question: "How does this disrupt their ordinary life?",
                suggestions: []
            },
            {
                index: 3,
                question: "What challenge or obstacle now stands in their way?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 250,
            max: 600
        },
        promptToUser: "Create the moment that disrupts your protagonist's normal life and sets your story in motion. This should create a problem or challenge that demands attention.",
        prompt: "Describe the moment something disrupts the protagonist's life. It could be a new problem, an encounter, or a turning point that demands action.",
        aiPrompt: `
            Create the inciting incident chapter for a [GENRE] short story using Freytag's Pyramid structure.
            Show the moment when [DISRUPTING EVENT] occurs in [CHARACTER NAME]'s life.
            Make this event specific, vivid, and consequential.
            Demonstrate the character's immediate reaction and emotions.
            Establish what's at stake if they don't respond to this disruption.
            End with a clear sense that things cannot remain as they were.
        `
    },
    
    chapterThree: {
        index: 3,
        objective: "Rising Action",
        purpose: "Build tension with a series of events or complications.",
        questions: [
            {
                index: 1,
                question: "What challenges does the protagonist face?",
                suggestions: []
            },
            {
                index: 2,
                question: "What attempts are made to overcome the conflict?",
                suggestions: []
            },
            {
                index: 3,
                question: "Who are the allies or enemies?",
                suggestions: []
            },
            {
                index: 4,
                question: "How does the tension escalate?",
                suggestions: ["Failed attempts", "New obstacles", "Raised stakes", "Time pressure", "Complications"]
            }
        ],
        wordCount: {
            min: 400,
            max: 1000
        },
        promptToUser: "Increase the tension by showing your protagonist's attempts to deal with the central conflict. Add complications, obstacles, or failures that make the situation more difficult.",
        prompt: "Create a series of complications or smaller conflicts that raise the stakes. The protagonist struggles to move forward but faces pushback.",
        aiPrompt: `
            Create the rising action chapter for a [GENRE] short story using Freytag's Pyramid structure.
            Show [CHARACTER NAME] facing multiple challenges related to [MAIN CONFLICT].
            Include at least one failed attempt or setback.
            Introduce or develop supporting characters who help or oppose the protagonist.
            Escalate the tension with each new development.
            Show how these challenges affect the protagonist emotionally or psychologically.
            End with the situation becoming seemingly impossible to resolve.
        `
    },
    
    chapterFour: {
        index: 4,
        objective: "Climax",
        purpose: "The most intense, emotional, or action-packed turning point.",
        questions: [
            {
                index: 1,
                question: "What is the peak moment of confrontation or choice?",
                suggestions: []
            },
            {
                index: 2,
                question: "How does the protagonist respond to the central conflict?",
                suggestions: []
            },
            {
                index: 3,
                question: "What irreversible change takes place?",
                suggestions: ["Decision", "Action", "Realization", "Transformation", "Sacrifice"]
            }
        ],
        wordCount: {
            min: 300,
            max: 800
        },
        promptToUser: "Create the pivotal moment where your protagonist faces the central conflict head-on. This should be the most intense, emotional, or action-packed scene in your story.",
        prompt: "Write the story's most intense moment — a decision, battle, revelation, or turning point. This is where everything changes for the protagonist.",
        aiPrompt: `
            Create the climax chapter for a [GENRE] short story using Freytag's Pyramid structure.
            Write the most intense scene of the story where [CHARACTER NAME] faces [CENTRAL CONFLICT].
            Make this moment emotionally powerful and impactful.
            Show the character making a critical choice or taking decisive action.
            Include details that engage all senses and immerse the reader.
            Create a clear turning point that changes the trajectory of the story.
            End with a moment that makes the resolution inevitable.
        `
    },
    
    chapterFive: {
        index: 5,
        objective: "Falling Action",
        purpose: "Show consequences of the climax; tension winds down.",
        questions: [
            {
                index: 1,
                question: "What are the immediate outcomes of the climax?",
                suggestions: []
            },
            {
                index: 2,
                question: "How do characters respond to what's just happened?",
                suggestions: ["Relief", "Grief", "Confusion", "Acceptance", "Celebration", "Reflection"]
            },
            {
                index: 3,
                question: "What needs resolution?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 250,
            max: 600
        },
        promptToUser: "Show the immediate aftermath of your story's climax. How do characters react? What has changed? Begin moving toward resolution.",
        prompt: "Show what happens after the climax. Characters deal with the fallout, emotions, and decisions that follow the big turning point.",
        aiPrompt: `
            Create the falling action chapter for a [GENRE] short story using Freytag's Pyramid structure.
            Show the immediate aftermath of [CLIMACTIC EVENT].
            Reveal how [CHARACTER NAME] and others feel about what happened.
            Begin resolving secondary conflicts or questions.
            Show the first signs of a new equilibrium forming.
            Maintain reader interest while decreasing tension.
            Prepare for the final resolution of the story.
        `
    },
    
    chapterSix: {
        index: 6,
        objective: "Resolution",
        purpose: "Tie up loose ends and show how things have changed.",
        questions: [
            {
                index: 1,
                question: "Has the main conflict been resolved?",
                suggestions: []
            },
            {
                index: 2,
                question: "How is the protagonist different now?",
                suggestions: ["New understanding", "Changed priorities", "Growth", "Loss", "New direction"]
            },
            {
                index: 3,
                question: "What is the new status quo?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 250,
            max: 600
        },
        promptToUser: "Resolve your story's main conflict and show how your protagonist and their world have changed as a result of the journey.",
        prompt: "Bring the story to a close. The protagonist has changed or achieved something, and the story world settles into a new normal.",
        aiPrompt: `
            Create the resolution chapter for a [GENRE] short story using Freytag's Pyramid structure.
            Show how the main conflict involving [CHARACTER NAME] has been resolved.
            Demonstrate clear change in the protagonist compared to the beginning.
            Resolve any remaining questions or loose ends.
            Establish the new normal for the character and their world.
            Provide satisfying closure while honoring the story's themes.
        `
    },
    
    chapterSeven: {
        index: 7,
        objective: "Denouement (Optional Epilogue)",
        purpose: "Offer final insight, poetic closure, or emotional reflection.",
        questions: [
            {
                index: 1,
                question: "Is there a final reflection or symbolic moment?",
                suggestions: []
            },
            {
                index: 2,
                question: "What should the audience feel or take away?",
                suggestions: []
            },
            {
                index: 3,
                question: "Is there room for ambiguity or peace?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 150,
            max: 400
        },
        promptToUser: "End your story with a final moment of reflection, a symbolic image, or a glimpse into the future. This should leave readers with a strong emotional impression.",
        prompt: "End the story with a reflective moment, poetic image, or brief glimpse into the character's future. Leave the reader with a strong emotional echo.",
        aiPrompt: `
            Create the denouement/epilogue chapter for a [GENRE] short story using Freytag's Pyramid structure.
            Provide a final moment that reinforces the story's theme or message.
            Consider using a symbolic image, object, or setting that echoes earlier elements.
            Show [CHARACTER NAME]'s final thoughts or a brief glimpse of their future.
            Keep this brief but emotionally resonant.
            End with a line that leaves a lasting impression on the reader.
        `
    },
    
    implementationDetails: {
        optionalChapters: {
            denouement: {
                note: "Chapter 7 (Denouement) can be optional in shorter stories",
                implementation: "Make this optional in the UI with a toggle"
            }
        },
        genreSpecificGuidance: {
            mystery: "Ensure the climax includes the critical revelation",
            romance: "Focus on relationship development throughout the rising action",
            horror: "Build tension gradually through exposition and rising action",
            literary: "Emphasize character change and internal realizations"
        },
        chapterLengthProportions: {
            chapterOne: "15% of total word count",
            chapterTwo: "10% of total word count",
            chapterThree: "25% of total word count",
            chapterFour: "20% of total word count",
            chapterFive: "10% of total word count",
            chapterSix: "15% of total word count",
            chapterSeven: "5% of total word count"
        },
        analysisFeatures: [
            "Verify that the climax is truly the highest point of tension",
            "Check that each chapter advances the story purpose",
            "Ensure character growth is evident from beginning to end"
        ],
        commonPitfalls: [
            "Including too much exposition before the inciting incident",
            "Creating a climax that doesn't feel significant enough",
            "Rushing the resolution without emotional impact",
            "Introducing new conflicts after the climax"
        ]
    }
};
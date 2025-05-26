export const fiveActStructureNovel = {
    goal: "Create a novel using the classical five-act dramatic structure",
    
    description: "The Five-Act Structure, originating from classical theater and adapted for modern storytelling, offers a balanced and comprehensive framework for novel-length narratives. This 9-chapter approach transforms each act into paired chapters (except for the climax, which stands alone), providing clear progression and emotional depth.",
    
    idealLength: "9 chapters (novel format)",
    
    preWritingQuestion: {
        task: "What kind of story are you telling?",
        suggestions: ["Adventure", "Romance", "Coming-of-age", "Tragedy", "Mystery", "Fantasy", "Drama", "Thriller"]
    },
    
    chapterOne: {
        index: 1,
        objective: "Exposition (Part 1)",
        purpose: "Introduce the world, protagonist, and initial status quo.",
        questions: [
            {
                index: 1,
                question: "Who is the main character?",
                suggestions: []
            },
            {
                index: 2,
                question: "What is the setting (time/place/culture)?",
                suggestions: []
            },
            {
                index: 3,
                question: "What's the character's everyday life like?",
                suggestions: ["Daily routines", "Important relationships", "Occupation or status", "Living conditions"]
            },
            {
                index: 4,
                question: "What tone or theme is being set?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2000,
            max: 4000
        },
        promptToUser: "Set up the protagonist's world and establish the tone. Show who they are, what they value, and what the world around them looks like.",
        prompt: "Introduce the protagonist, their world, and the status quo before any disruption occurs.",
        aiPrompt: `
            Create the exposition chapter for a [GENRE] novel using the Five-Act Structure.
            Introduce [CHARACTER NAME], a [CHARACTER DESCRIPTION].
            Establish their normal life in [SETTING].
            Show their primary relationships with [SECONDARY CHARACTERS].
            Reveal their desires, strengths, and flaws.
            Set the tone and atmosphere of the story.
            End with a hint of the coming disruption.
        `
    },
    
    chapterTwo: {
        index: 2,
        objective: "Exposition (Part 2) – Inciting Incident",
        purpose: "Disrupt the normal world with a triggering event.",
        questions: [
            {
                index: 1,
                question: "What happens that disturbs the character's routine?",
                suggestions: ["A visitor", "A discovery", "A challenge", "A loss", "An opportunity"]
            },
            {
                index: 2,
                question: "What stakes or problem arise?",
                suggestions: []
            },
            {
                index: 3,
                question: "What choice is presented?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2000,
            max: 4000
        },
        promptToUser: "Introduce a moment or event that disturbs the status quo and demands a response from the protagonist.",
        prompt: "Present a significant disruption that forces the protagonist out of their comfort zone and sets the main conflict in motion.",
        aiPrompt: `
            Create the inciting incident chapter for a [GENRE] novel using the Five-Act Structure.
            Show [CHARACTER NAME] experiencing [DISRUPTING EVENT].
            Demonstrate how this event challenges the status quo.
            Establish the central conflict or problem that will drive the story.
            Show the protagonist's initial reaction to this disruption.
            Present a choice or challenge that cannot be ignored.
            End with the protagonist at a decision point.
        `
    },
    
    chapterThree: {
        index: 3,
        objective: "Rising Action (Part 1)",
        purpose: "The protagonist reacts and starts to pursue a goal.",
        questions: [
            {
                index: 1,
                question: "What goal is formed?",
                suggestions: []
            },
            {
                index: 2,
                question: "What initial resistance or struggle emerges?",
                suggestions: []
            },
            {
                index: 3,
                question: "What allies or obstacles appear?",
                suggestions: ["New characters", "Environmental challenges", "Internal doubts", "External opposition"]
            }
        ],
        wordCount: {
            min: 2500,
            max: 5000
        },
        promptToUser: "Show the early consequences of the inciting incident and how the protagonist begins to pursue a solution or escape.",
        prompt: "The protagonist takes initial action toward their goal, facing the first real obstacles and finding early allies or tools.",
        aiPrompt: `
            Create the first rising action chapter for a [GENRE] novel using the Five-Act Structure.
            Show [CHARACTER NAME] committing to [GOAL] in response to the inciting incident.
            Introduce initial obstacles: [OBSTACLES].
            Establish allies or resources that will help the protagonist.
            Reveal the protagonist's initial strategy or approach.
            Include early successes and failures that test their resolve.
            End with a complication that leads to deeper commitment.
        `
    },
    
    chapterFour: {
        index: 4,
        objective: "Rising Action (Part 2)",
        purpose: "Increase tension and deepen character investment.",
        questions: [
            {
                index: 1,
                question: "How do complications escalate?",
                suggestions: []
            },
            {
                index: 2,
                question: "How does the protagonist change or struggle?",
                suggestions: ["New skills", "Internal conflict", "Changing relationships", "Growing determination"]
            },
            {
                index: 3,
                question: "What secondary goals or stakes arise?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 3000,
            max: 6000
        },
        promptToUser: "Raise the stakes and challenges. The protagonist is committed now, but the situation grows harder.",
        prompt: "Complications intensify, relationships deepen, and the protagonist must adapt to increasingly difficult circumstances.",
        aiPrompt: `
            Create the second rising action chapter for a [GENRE] novel using the Five-Act Structure.
            Show [CHARACTER NAME] facing intensified challenges related to [MAIN CONFLICT].
            Escalate the complications: [COMPLICATIONS].
            Deepen relationships with supporting characters.
            Show the protagonist changing or adapting to meet new challenges.
            Increase what's at stake personally and externally.
            End with mounting tension leading toward an inevitable confrontation.
        `
    },
    
    chapterFive: {
        index: 5,
        objective: "Climax",
        purpose: "The turning point — intense confrontation or transformation.",
        questions: [
            {
                index: 1,
                question: "What is the pivotal event that changes everything?",
                suggestions: ["Confrontation", "Revelation", "Decision", "Battle", "Transformation"]
            },
            {
                index: 2,
                question: "Does the protagonist fail, succeed, or experience loss?",
                suggestions: []
            },
            {
                index: 3,
                question: "How do relationships or goals shift?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2500,
            max: 5000
        },
        promptToUser: "Craft a powerful moment of decision, confrontation, or revelation. The hero cannot return to who they were.",
        prompt: "Everything culminates in a pivotal moment that marks a point of no return for the protagonist and resolves the central tension.",
        aiPrompt: `
            Create the climax chapter for a [GENRE] novel using the Five-Act Structure.
            Build to [CHARACTER NAME] experiencing the story's most intense moment: [CLIMACTIC EVENT].
            Create mounting tension through pacing, setting, and high stakes.
            Include a decisive moment that fundamentally changes the protagonist or their situation.
            Show the emotional and physical cost of this pivotal event.
            Resolve the primary conflict or dramatically transform it.
            End with the clear sense that everything has changed.
        `
    },
    
    chapterSix: {
        index: 6,
        objective: "Falling Action (Part 1)",
        purpose: "Respond to the climax — consequences unfold.",
        questions: [
            {
                index: 1,
                question: "What are the consequences of the climax?",
                suggestions: []
            },
            {
                index: 2,
                question: "What internal and external shifts happen?",
                suggestions: []
            },
            {
                index: 3,
                question: "How does the protagonist react?",
                suggestions: ["Processing emotions", "Dealing with aftermath", "New understanding", "Recovery"]
            }
        ],
        wordCount: {
            min: 2000,
            max: 4000
        },
        promptToUser: "Explore the aftermath. The hero deals with wins, losses, and fallout. The world starts to change.",
        prompt: "Show the immediate aftermath of the climax as characters process what happened and adapt to new circumstances.",
        aiPrompt: `
            Create the first falling action chapter for a [GENRE] novel using the Five-Act Structure.
            Show the immediate consequences of [CLIMACTIC EVENT].
            Reveal how [CHARACTER NAME] is processing what occurred.
            Demonstrate the changes to relationships and the world.
            Begin addressing unresolved secondary conflicts.
            Show the protagonist's emotional reaction and adjustment.
            End with a sense of the new direction or remaining challenges.
        `
    },
    
    chapterSeven: {
        index: 7,
        objective: "Falling Action (Part 2)",
        purpose: "The protagonist makes final decisions to resolve or move forward.",
        questions: [
            {
                index: 1,
                question: "What choice or action helps lead toward resolution?",
                suggestions: []
            },
            {
                index: 2,
                question: "Is there a final pursuit, confrontation, or mission?",
                suggestions: []
            },
            {
                index: 3,
                question: "How does the character show growth?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2000,
            max: 4000
        },
        promptToUser: "The hero pushes toward closure, whether it's reconciliation, escape, sacrifice, or triumph.",
        prompt: "The protagonist actively works to resolve remaining conflicts and secure their new place in the changed world.",
        aiPrompt: `
            Create the second falling action chapter for a [GENRE] novel using the Five-Act Structure.
            Show [CHARACTER NAME] taking deliberate steps toward final resolution.
            Include a final challenge or decision that tests their growth.
            Resolve any significant secondary conflicts.
            Demonstrate how the protagonist has changed since the beginning.
            Show them applying lessons learned from their journey.
            End with a sense of movement toward closure.
        `
    },
    
    chapterEight: {
        index: 8,
        objective: "Denouement (Part 1)",
        purpose: "Tie up external threads.",
        questions: [
            {
                index: 1,
                question: "What happens to key side characters?",
                suggestions: []
            },
            {
                index: 2,
                question: "What visible changes occurred in the world or society?",
                suggestions: []
            },
            {
                index: 3,
                question: "Is justice served or change acknowledged?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 1500,
            max: 3000
        },
        promptToUser: "Wrap up secondary plotlines and consequences. Offer satisfaction or realism in how the world changes post-conflict.",
        prompt: "Provide closure for supporting characters and show the broader impact of the story's events on the world.",
        aiPrompt: `
            Create the first denouement chapter for a [GENRE] novel using the Five-Act Structure.
            Resolve the fates of supporting characters connected to [CHARACTER NAME].
            Show the tangible changes to [SETTING] resulting from the story's events.
            Address questions of justice, forgiveness, or reconciliation.
            Tie up loose ends and secondary plotlines.
            Begin establishing the new status quo.
            End with a sense of external resolution.
        `
    },
    
    chapterNine: {
        index: 9,
        objective: "Denouement (Part 2)",
        purpose: "Reveal the protagonist's internal resolution and new normal.",
        questions: [
            {
                index: 1,
                question: "How has the hero changed internally?",
                suggestions: []
            },
            {
                index: 2,
                question: "What lesson or transformation was completed?",
                suggestions: []
            },
            {
                index: 3,
                question: "What is their new life or perspective?",
                suggestions: ["New goals", "Healed wounds", "Changed priorities", "Fresh relationships"]
            }
        ],
        wordCount: {
            min: 1500,
            max: 3000
        },
        promptToUser: "Reveal the emotional and personal conclusion. The protagonist is changed. The journey is over, but what remains?",
        prompt: "Conclude with the protagonist's personal resolution, showing how they've been transformed and what their new life looks like.",
        aiPrompt: `
            Create the final denouement chapter for a [GENRE] novel using the Five-Act Structure.
            Show [CHARACTER NAME]'s completed internal journey.
            Reveal their new understanding or wisdom gained.
            Establish their new normal or direction in life.
            Provide emotional closure to their personal arc.
            Connect their transformation to the story's themes.
            End with a powerful final image or moment that encapsulates the journey's meaning.
        `
    },
    
    implementationDetails: {
        genreSpecificGuidance: {
            tragedy: "Focus on the protagonist's fatal flaw during rising action, and ensure the denouement addresses the consequences of their fall",
            adventure: "Emphasize physical challenges and external obstacles throughout the rising action",
            romance: "Ensure the climax resolves the central relationship question, with denouement showing the new relationship dynamic",
            mystery: "Use the climax for the major revelation with subsequent chapters showing the fallout and justice",
            thriller: "Maintain tension even after the climax, with falling action containing additional threats or complications"
        },
        chapterLengthProportions: {
            chapterOne: "10% of total word count",
            chapterTwo: "10% of total word count",
            chapterThree: "12% of total word count",
            chapterFour: "15% of total word count",
            chapterFive: "15% of total word count",
            chapterSix: "12% of total word count",
            chapterSeven: "10% of total word count",
            chapterEight: "8% of total word count",
            chapterNine: "8% of total word count"
        },
        analysisFeatures: [
            "Verify that the climax truly marks a point of no return for the protagonist",
            "Check that rising action steadily increases tension and stakes",
            "Ensure character development is consistent and meaningful throughout the arc",
            "Confirm that the denouement provides both external and internal resolution"
        ],
        commonPitfalls: [
            "Introducing the inciting incident too late in the story",
            "Creating a climax that doesn't fundamentally change the situation",
            "Resolving the main conflict before the designated climax chapter",
            "Introducing new major conflicts during falling action",
            "Making the denouement too lengthy or introducing new problems"
        ]
    }
};

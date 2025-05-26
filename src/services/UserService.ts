import { IBase } from "../repositories/BaseRepository";
import { IAuth } from "../shared/AuthService";
import { IErrorService } from "../shared/ErrorService";
import { Response, Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest, IJwtPayload, User } from "../shared/Interface";
import * as jose from "jose"

export interface IUserService {
	register(req: Request, res: Response): Promise<void>;
}

export class UserService implements IUserService {
	constructor(
		private userRepo: IBase,

		private transactionRepo: IBase,
		private storyRepo: IBase,
		private chapterRepo: IBase,
		private sceneRepo: IBase,
		private characterRepo: IBase,
		private articleRepo: IBase,
		private articleTransactionRepo: IBase,
		private storyAccessRepo: IBase,
		private articleAccessRepo: IBase,
		private paymentRepo: IBase,
		private genresOnStoriesRepo: IBase,
		private tagsOnArticleRepo: IBase,		
		private storyStructureRepo: IBase,

		private authService: IAuth,
		private errorService: IErrorService
	) { }

	public register = async (
		req: Request,
		res: Response
	): Promise<void> => {

		try {
			const { publicAddress, username, email, id } = req.body;

			const existingUser = await this.userRepo.getUnique({ where: { email } }) as User | null;

			const userData = {
				email,
				primaryWalletAddress: publicAddress,
				name: username
			};

			const responseMessage: string = existingUser
				? "User updated"
				: "New user created";

			const user = existingUser
				? await this.userRepo.update({ where: { id: existingUser.id }, data: userData }) as User
				: await this.userRepo.create({ data: userData }) as User;

			const statusCode: number = existingUser ? 200 : 201;
			// console.log({user});

			// if (user && !user?.publicId) {
			//   await this.createExternalUser({
			//     email,
			//     username,
			//     user_id: user?.id, 
			//     publicAddress
			//   })
			// }

			res.status(statusCode).json({ data: user, error: false, message: responseMessage });

		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);
		}
	}

	public update = async (
		req: CustomRequest,
		res: Response
	): Promise<void> => {
		try {
			const { 
				depositAddress, name, tipLink, dateOfBirth, 
				email, imageUrl, favoriteGenre, favoriteVibe, 
				userType, typeOfCreator, firstTimeLogin 
			} = req.body;

			console.log({firstTimeLogin});
			

			const user: IJwtPayload = req.user as IJwtPayload;

			if (!user) throw new Error("Unidentified User");

			const userUpdated = await this.userRepo.update({
				where: { id: user?.id },
				data: {
					...(depositAddress && { depositAddress: depositAddress }),
					...(name && { name: name }),
					...(tipLink && { tipLink: tipLink }),
					...(email && { email: email }),
					...(dateOfBirth && { dateOfBirth: dateOfBirth }),
					...(imageUrl && { imageUrl: imageUrl }),
					...(userType && { userType: userType }),	
					...(firstTimeLogin && { firstTimeLogin: firstTimeLogin === "false" ? false : true }),	
				}
			}) as User;

			const updatedUserInfo = await this.userRepo.update({
				where: { id: user?.id },
				data: {
					info: {
						update: {							
							...(favoriteGenre && { favoriteGenre: favoriteGenre }),
							...(favoriteVibe && { favoriteVibe: favoriteVibe }),
							...(typeOfCreator && { typeOfCreator: typeOfCreator }),
							
						}
					}
				},
				include: { info: true }
			});
			res.status(200).json({ user: userUpdated, error: false, message: "User record updated" });

		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);
		}
	}

	public getUser = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {

			const { id: userId } = req.params;

			const user = await this.userRepo.get({
				where: {
					id: userId
				},
				include: {
					_count: {
						select: {
							articles: {
								where: {
									publishedAt: {
										not: null
									}
								}
							},
							stories: true
						}
					},
					socialMedia: true

				}
			});

			res.status(200).json({
				user,
				error: false,
				message: "success"
			});
		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);
		}
	}

	public getUserData = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {

			const users = await this.userRepo.getAll({
				include: {
					stories: {
						include: {  // Use another 'include' here instead of direct properties
							// storyStructure: true,
							storyGenres: true,
							chapters: {
								include: {
									scenes: true,
								}
							},
							scenes: true,
							characters: true,
							transactions: true,
							storyAccesses: true
						}
					},
					articles: {
						include: {
							transactions: true,
							articleTags: true,
							articleAccesses: true
						}
					},
					socialMedia: true,
					articleTransactions: true,
					storyAccesses: true,
					articleAccesses: true,
					payments: true,
					storyRatings: true,
				}
			});

			res.status(200).json({
				users,
				error: false,
				message: "success"
			});
		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);
		}
	}

	public getAuthUser = async (
		req: CustomRequest,
		res: Response
	): Promise<void> => {
		try {
			const user: IJwtPayload = req.user as IJwtPayload;
			const id = user?.id;

			const reader = await this.userRepo.get({
				where: { id },
				include: { socialMedia: true, info: true }
			}) as User | null;
			if (!reader) throw new Error("Unidentified User");

			res.status(200).json({
				user: reader,
				error: false,
				message: "success"
			});
		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);
		}
	}

	public verifyJwt = async (
		req: Request,
		res: Response
	): Promise<void> => {
		try {
			let authorizationHeader = req.headers["authorization"];
			if (!authorizationHeader) {
				throw new Error("Unauthorized");
			}

			const token: string | null = authorizationHeader.split(' ')[1];
			if (!token || token === 'undefined' || token === undefined) {
				throw new Error("No token found");
			}

			const { appPubKey, publicAddress } = req?.body; // social login

			console.log({
				appPubKey,
				publicAddress
			});

			if (appPubKey) {
				const jwks = await jose.createRemoteJWKSet(new URL("https://api-auth.web3auth.io/jwks")); // for social logins

				const jwtDecoded = await jose.jwtVerify(token, jwks, { algorithms: ["ES256"] });
				if (!jwtDecoded) {
					return;
				}
				console.log(jwtDecoded);
				if ((jwtDecoded.payload as any).wallets.find((x: { type: string }) => x.type === "web3auth_app_key").public_key.toLowerCase() === appPubKey.toLowerCase()) {
					// Verified
					res.status(200).json({ name: 'Verification Successful' })
				} else {
					res.status(400).json({ name: 'Verification Failed' })
				}

			}

			if (publicAddress) {
				const jwks = await jose.createRemoteJWKSet(new URL("https://authjs.web3auth.io/jwks")); // for external wallet

				const jwtDecoded = await jose.jwtVerify(token, jwks, { algorithms: ["ES256"] });
				if (!jwtDecoded) {
					return;
				}
				console.log(jwtDecoded);
				if ((jwtDecoded.payload as any).wallets.find((x: { type: string }) => x.type === "solana").address.toLowerCase() === publicAddress.toLowerCase()) {
					// Verified
					res.status(200).json({ name: 'Verification Successful' })
				} else {
					res.status(400).json({ name: 'Verification Failed' })
				}

			}

			// res.status(200).json({ 
			//   jwtDecoded,
			//   error: false, 
			//   message: "success" 
			// });

		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);
		}
	}

	public saveFirstTimeUserProfile = async (
		req: CustomRequest,
		res: Response
	): Promise<void> => {
		try {
			const user: IJwtPayload = req.user as IJwtPayload;
			
		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);			
		}
	}








	public addData = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { data, stories, userId } = req.body;

		try {
			stories.forEach(async (story: any) => {
	
				const newStory: any = await this.createStory(story, userId);

				// // ADD GENRE TO STORIES
				// story.storyGenres.forEach(async (genre: any) => {
				// 	await this.genresOnStoriesRepo.create({
				// 		data: {
				// 			storyId: newStory?.id,
				// 			storyGenreId: genre.storyGenreId,
				// 		},
				// 	});
				// });

				// // ADD TRANSACTIONS TO STORY
				// story.transactions.forEach(async (transaction: any) => {
				// 	await this.transactionRepo.create({
				// 		data: {
				// 			storyId: newStory?.id,
				// 			userId: userId,
				// 			reference: transaction.reference,
				// 			key: transaction.key,
				// 			unique_id: transaction.unique_id,
				// 			deposit_address: transaction.deposit_address,
				// 			locale: transaction.locale,
				// 			mode: transaction.mode,
				// 			narration: transaction.narration,
				// 			confirmedAt: transaction.confirmedAt,
				// 			type: transaction.type,
				// 			status: transaction.status,
				// 			amount: transaction.amount,
				// 			formatAmount: transaction.formatAmount,
				// 			currency: transaction.currency,
				// 		},
				// 	});
				// });

				// // ADD STORY STRUCTURE
				// await this.storyStructureRepo.create({
				// 	data: {
				// 		storyId: newStory?.id,
				// 		introduceProtagonistAndOrdinaryWorld: story.storyStructure.introduceProtagonistAndOrdinaryWorld,
				// 		incitingIncident: story.storyStructure.incitingIncident,
				// 		firstPlotPoint: story.storyStructure.firstPlotPoint,
				// 		risingActionAndMidpoint: story.storyStructure.risingActionAndMidpoint,
				// 		pinchPointsAndSecondPlotPoint: story.storyStructure.pinchPointsAndSecondPlotPoint,
				// 		climaxAndFallingAction: story.storyStructure.climaxAndFallingAction,
				// 		resolution: story.storyStructure.resolution,
				// 		introductionSummary: story.storyStructure.introductionSummary,
				// 		incitingIncidentSummary: story.storyStructure.incitingIncidentSummary,
				// 		firstPlotPointSummary: story.storyStructure.firstPlotPointSummary,
				// 		risingActionAndMidpointSummary: story.storyStructure.risingActionAndMidpointSummary,
				// 		pinchPointsAndSecondPlotPointSummary: story.storyStructure.pinchPointsAndSecondPlotPointSummary,
				// 		climaxAndFallingActionSummary: story.storyStructure.climaxAndFallingActionSummary,
				// 		resolutionSummary: story.storyStructure.resolutionSummary
				// 	}
				// });

				// // CREATE CHAPTERS
				// story.chapters.forEach(async (chapter: any) => {
				// 	const newChapter: any = await this.chapterRepo.create({
				// 		data: {
				// 			storyId: newStory?.id,
				// 			index: chapter.index,
				// 			readersHasAccess: chapter.readersHasAccess,
				// 			characters: chapter.characters,
				// 			isFree: chapter.isFree,
				// 			content: chapter.content
				// 		},
				// 	});


				// 	// CREATE SCENES
				// 	story.scenes.forEach(async (scene: any) => {
				// 		const newScene = await this.sceneRepo.create({
				// 			data: {
				// 				storyId: newStory?.id,
				// 				chapterId: newChapter.id,
				// 				imageUrl: scene.imageUrl,
				// 				title: scene.title,
				// 				setting: scene.setting,
				// 				prompt: scene.prompt,
				// 				imageId: scene.imageId,
				// 				imageStatus: scene.imageStatus,
				// 				charactersInvolved: scene.charactersInvolved,
				// 				meta: scene.meta,
				// 				content: scene.content,
				// 				order: scene.order,
				// 			},
				// 		});
				// 	});
				// });

				// // CREATE CHARACTERS
				// story.characters.forEach(async (character: any) => {
				// 	const newCharacter = await this.characterRepo.create({
				// 		data: {
				// 			storyId: newStory?.id,
				// 			name: character.name,
				// 			role: character.role,
				// 			motivations: character.motivations,
				// 			backstory: character.backstory
				// 		},
				// 	});
				// });

				// // ADD USER ACCESS TO STORIES
				// story.storyAccesses.forEach(async (access: any) => {
				// 	await this.storyAccessRepo.create({
				// 		data: {
				// 			storyId: newStory?.id,
				// 			userId: userId,
				// 			currentChapter: access.currentChapter,
				// 			hasAccess: access.hasAccess,
				// 		},
				// 	});
				// });

			});



			data.forEach(async (user: any) => {
	
				const newUser = await this.userRepo.create({
					data: {
						email: user?.email,
						name: user?.name,
						publicId: user?.publicId,
						depositAddress: user?.depositAddress,
						credits: user?.credits,
						averageRating: user?.averageRating,
						totalRatings: user?.totalRatings,
	
						socialMedia: {
							create: {
								x: null
							} // This will create a social media record with all nullable fields set to null
						}
					}
				}) as User;
	
				// CREATE STORIES
				user.stories.forEach(async (story: any) => {
	
					const newStory: any = await this.createStory(story, newUser.id);
	
					// ADD GENRE TO STORIES
					story.storyGenres.forEach(async (genre: any) => {
						await this.genresOnStoriesRepo.create({
							data: {
								storyId: newStory?.id,
								storyGenreId: genre.storyGenreId,
							},
						});
					});
	
					// ADD TRANSACTIONS TO STORY
					story.transactions.forEach(async (transaction: any) => {
						await this.transactionRepo.create({
							data: {
								storyId: newStory?.id,
								userId: newUser?.id,
								reference: transaction.reference,
								key: transaction.key,
								unique_id: transaction.unique_id,
								deposit_address: transaction.deposit_address,
								locale: transaction.locale,
								mode: transaction.mode,
								narration: transaction.narration,
								confirmedAt: transaction.confirmedAt,
								type: transaction.type,
								status: transaction.status,
								amount: transaction.amount,
								formatAmount: transaction.formatAmount,
								currency: transaction.currency,
							},
						});
					});
	
					// ADD STORY STRUCTURE
					await this.storyStructureRepo.create({
						data: {
							storyId: newStory?.id,
							introduceProtagonistAndOrdinaryWorld: story.storyStructure.introduceProtagonistAndOrdinaryWorld,
							incitingIncident: story.storyStructure.incitingIncident,
							firstPlotPoint: story.storyStructure.firstPlotPoint,
							risingActionAndMidpoint: story.storyStructure.risingActionAndMidpoint,
							pinchPointsAndSecondPlotPoint: story.storyStructure.pinchPointsAndSecondPlotPoint,
							climaxAndFallingAction: story.storyStructure.climaxAndFallingAction,
							resolution: story.storyStructure.resolution,
							introductionSummary: story.storyStructure.introductionSummary,
							incitingIncidentSummary: story.storyStructure.incitingIncidentSummary,
							firstPlotPointSummary: story.storyStructure.firstPlotPointSummary,
							risingActionAndMidpointSummary: story.storyStructure.risingActionAndMidpointSummary,
							pinchPointsAndSecondPlotPointSummary: story.storyStructure.pinchPointsAndSecondPlotPointSummary,
							climaxAndFallingActionSummary: story.storyStructure.climaxAndFallingActionSummary,
							resolutionSummary: story.storyStructure.resolutionSummary
						}
					});
	
					// CREATE CHAPTERS
					story.chapters.forEach(async (chapter: any) => {
						const newChapter: any = await this.chapterRepo.create({
							data: {
								storyId: newStory?.id,
								index: chapter.index,
								readersHasAccess: chapter.readersHasAccess,
								characters: chapter.characters,
								isFree: chapter.isFree,
								content: chapter.content
							},
						});
	
	
						// CREATE SCENES
						chapter.scenes.forEach(async (scene: any) => {
							const newScene = await this.sceneRepo.create({
								data: {
									storyId: newStory?.id,
									chapterId: newChapter.id,
									imageUrl: scene.imageUrl,
									title: scene.title,
									setting: scene.setting,
									prompt: scene.prompt,
									imageId: scene.imageId,
									imageStatus: scene.imageStatus,
									charactersInvolved: scene.charactersInvolved,
									meta: scene.meta,
									content: scene.content,
									order: scene.order,
								},
							});
						});
					});
	
					// CREATE CHARACTERS
					story.characters.forEach(async (character: any) => {
						const newCharacter = await this.characterRepo.create({
							data: {
								storyId: newStory?.id,
								name: character.name,
								role: character.role,
								motivations: character.motivations,
								backstory: character.backstory
							},
						});
					});
	
					// ADD USER ACCESS TO STORIES
					story.storyAccesses.forEach(async (access: any) => {
						await this.storyAccessRepo.create({
							data: {
								storyId: newStory?.id,
								userId: newUser?.id,
								currentChapter: access.currentChapter,
								hasAccess: access.hasAccess,
							},
						});
					});
	
				});
	
				// CREATE ARTICLES
				user.articles.forEach(async (article: any) => {
	
					const newArticle = await this.articleRepo.create({
						data: {
							userId: newUser?.id,
							title: article?.title,
							slug: article?.slug,
							content: article?.content,
							excerpt: article?.excerpt,
							type: article?.type,
							coverImage: article?.coverImage,
							isPaid: article?.isPaid,
							paidAt: article?.paidAt,
							publishedAt: article?.publishedAt,
							price: article?.price,
							isFree: article?.isFree,
							averageRating: article?.averageRating,
							totalRatings: article?.totalRatings,
						}
					}) as any;
	
					// ADD TRANSACTIONS TO ARTICLE
					article.transactions.forEach(async (transaction: any) => {
						await this.transactionRepo.create({
							data: {
								articleId: newArticle?.id,
								userId: newUser?.id,
								reference: transaction.reference,
								key: transaction.key,
								unique_id: transaction.unique_id,
								deposit_address: transaction.deposit_address,
								locale: transaction.locale,
								mode: transaction.mode,
								narration: transaction.narration,
								confirmedAt: transaction.confirmedAt,
								type: transaction.type,
								status: transaction.status,
								amount: transaction.amount,
								formatAmount: transaction.formatAmount,
								currency: transaction.currency,
							},
						});
					});
	
					// ADD USER ACCESS TO ARTICLES
					article.articleAccesses.forEach(async (access: any) => {
						await this.articleAccessRepo.create({
							data: {
								articleID: newArticle?.id,
								userId: newUser?.id,
								currentChapter: access.currentChapter,
								hasAccess: access.hasAccess,
							},
						});
					});
	
				});
	
	
				// ADD USER PAYMENT TRANSACTIONS
				user.payments.forEach(async (payment: any) => {
					await this.paymentRepo.create({
						data: {
							userId: newUser?.id,
							reference: payment.reference,
							key: payment.key,
							unique_id: payment.unique_id,
							deposit_address: payment.deposit_address,
							locale: payment.locale,
							mode: payment.mode,
							narration: payment.narration,
							confirmedAt: payment.confirmedAt,
							type: payment.type,
							status: payment.status,
							amount: payment.amount,
							formatAmount: payment.formatAmount,
							currency: payment.currency,
						},
					});
				});
	
			});
			
			res.status(200).json({
				error: false,
				message: "success"
			});
		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);			
		}

	}

	public addStory = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { story, userId } = req.body;
		try {
			const newStory: any = await this.createStory(story, userId);
			
			res.status(200).json({
				story: newStory,
				error: false,
				message: "success"
			});

		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);						
		}
	}

	public addStoryGenre = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { storyGenres, storyId } = req.body;
		try {
			storyGenres.forEach(async (genre: any) => {
				await this.genresOnStoriesRepo.create({
					data: {
						storyId: storyId,
						storyGenreId: genre.storyGenreId,
					},
				});
			});
			res.status(200).json({
				error: false,
				message: "success"
			});

		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);						
		}
	}

	public addStoryTransaction = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { transactions, storyId, userId } = req.body;
		try {
			transactions.forEach(async (transaction: any) => {
				await this.transactionRepo.create({
					data: {
						storyId: storyId,
						userId: userId,
						reference: transaction.reference,
						key: transaction.key,
						unique_id: transaction.unique_id,
						deposit_address: transaction.deposit_address,
						locale: transaction.locale,
						mode: transaction.mode,
						narration: transaction.narration,
						confirmedAt: transaction.confirmedAt,
						type: transaction.type,
						status: transaction.status,
						amount: transaction.amount,
						formatAmount: transaction.formatAmount,
						currency: transaction.currency,
					},
				});
			});
			res.status(200).json({
				error: false,
				message: "success"
			});

		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);						
		}
	}

	public addStoryStructure = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { storyStructure, storyId, userId } = req.body;
		try {
			await this.storyStructureRepo.create({
				data: {
					storyId: storyId,
					introduceProtagonistAndOrdinaryWorld: storyStructure.introduceProtagonistAndOrdinaryWorld,
					incitingIncident: storyStructure.incitingIncident,
					firstPlotPoint: storyStructure.firstPlotPoint,
					risingActionAndMidpoint: storyStructure.risingActionAndMidpoint,
					pinchPointsAndSecondPlotPoint: storyStructure.pinchPointsAndSecondPlotPoint,
					climaxAndFallingAction: storyStructure.climaxAndFallingAction,
					resolution: storyStructure.resolution,
					introductionSummary: storyStructure.introductionSummary,
					incitingIncidentSummary: storyStructure.incitingIncidentSummary,
					firstPlotPointSummary: storyStructure.firstPlotPointSummary,
					risingActionAndMidpointSummary: storyStructure.risingActionAndMidpointSummary,
					pinchPointsAndSecondPlotPointSummary: storyStructure.pinchPointsAndSecondPlotPointSummary,
					climaxAndFallingActionSummary: storyStructure.climaxAndFallingActionSummary,
					resolutionSummary: storyStructure.resolutionSummary
				}
			});
			res.status(200).json({
				error: false,
				message: "success"
			});

		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);						
		}
	}

	public addStoryChapter = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { chapters, chapter, storyId } = req.body;
		try {
			// chapters.forEach(async (chapter: any) => {
				const newChapter: any = await this.chapterRepo.create({
					data: {
						storyId: storyId,
						index: chapter.index,
						readersHasAccess: chapter.readersHasAccess,
						characters: chapter.characters,
						isFree: chapter.isFree,
						content: chapter.content
					},
				});


				// CREATE SCENES
				chapter.scenes.forEach(async (scene: any) => {
					const newScene = await this.sceneRepo.create({
						data: {
							storyId: storyId,
							chapterId: newChapter.id,
							imageUrl: scene.imageUrl,
							title: scene.title,
							setting: scene.setting,
							prompt: scene.prompt,
							imageId: scene.imageId,
							imageStatus: scene.imageStatus,
							charactersInvolved: scene.charactersInvolved,
							meta: scene.meta,
							content: scene.content,
							order: scene.order,
						},
					});
				});
			// });

			res.status(200).json({
				error: false,
				message: "success"
			});

		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);						
		}
	}

	public addStoryAccess = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { storyAccesses, storyId, userId } = req.body;
		try {
			storyAccesses.forEach(async (access: any) => {
				await this.storyAccessRepo.create({
					data: {
						storyId: storyId,
						userId: userId,
						currentChapter: access.currentChapter,
						hasAccess: access.hasAccess,
					},
				});
			});
			res.status(200).json({
				error: false,
				message: "success"
			});

		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);						
		}
	}

	public addPayments = async (
		req: Request,
		res: Response
	): Promise<void> => {
		const { payments, userId } = req.body;
		try {
			payments.forEach(async (payment: any) => {
				await this.paymentRepo.create({
					data: {
						userId: userId,
						reference: payment.reference,
						key: payment.key,
						unique_id: payment.unique_id,
						deposit_address: payment.deposit_address,
						locale: payment.locale,
						mode: payment.mode,
						narration: payment.narration,
						confirmedAt: payment.confirmedAt,
						type: payment.type,
						status: payment.status,
						amount: payment.amount,
						formatAmount: payment.formatAmount,
						currency: payment.currency,
					},
				});
			});
			res.status(200).json({
				error: false,
				message: "success"
			});

		} catch (error) {
			this.errorService.handleErrorResponse(error)(res);						
		}
	}

	private createStory = async (story: any, userId: any) => {
		const newStory: any = await this.storyRepo.create({
			data: {
				userId: userId,
				projectTitle: story.projectTitle,
				projectDescription: story.projectDescription,
				type: story.type,
				writingStep: story.writingStep,
				introductionStep: story.introductionStep,
				status: story.status,
				introductionTone: story.introductionTone,
				introductionSetting: story.introductionSetting,
				protagonistSuggestions: story.protagonistSuggestions,
				suggestedCharacters: story.suggestedCharacters,
				isFree: story.isFree,
				typeOfEvent: story.typeOfEvent,
				causeOfTheEvent: story.causeOfTheEvent,
				stakesAndConsequences: story.stakesAndConsequences,
				incitingIncidentTone: story.incitingIncidentTone,
				incitingIncidentCharacters: story.incitingIncidentCharacters,
				incitingIncidentSetting: story.incitingIncidentSetting,
				protagonistGoal: story.protagonistGoal,
				protagonistTriggerToAction: story.protagonistTriggerToAction,
				obstaclesProtagonistWillFace: story.obstaclesProtagonistWillFace,
				firstPlotPointCharacters: story.firstPlotPointCharacters,
				firstPlotPointSetting: story.firstPlotPointSetting,
				firstPlotPointTone: story.firstPlotPointTone,
				challengesProtagonistFaces: story.challengesProtagonistFaces,
				protagonistPerspectiveChange: story.protagonistPerspectiveChange,
				majorEventPropellingClimax: story.majorEventPropellingClimax,
				risingActionAndMidpointCharacters: story.risingActionAndMidpointCharacters,
				risingActionAndMidpointSetting: story.risingActionAndMidpointSetting,
				risingActionAndMidpointTone: story.risingActionAndMidpointTone,
				newObstacles: story.newObstacles,
				discoveryChanges: story.discoveryChanges,
				howStakesEscalate: story.howStakesEscalate,
				pinchPointsAndSecondPlotPointCharacters: story.pinchPointsAndSecondPlotPointCharacters,
				pinchPointsAndSecondPlotPointSetting: story.pinchPointsAndSecondPlotPointSetting,
				pinchPointsAndSecondPlotPointTone: story.pinchPointsAndSecondPlotPointTone,
				finalChallenge: story.finalChallenge,
				challengeOutcome: story.challengeOutcome,
				storyResolution: story.storyResolution,
				climaxAndFallingActionSetting: story.climaxAndFallingActionSetting,
				climaxAndFallingActionTone: story.climaxAndFallingActionTone,
				climaxAndFallingActionCharacters: story.climaxAndFallingActionCharacters,
				climaxConsequences: story.climaxConsequences,
				howCharactersEvolve: story.howCharactersEvolve,
				resolutionOfConflict: story.resolutionOfConflict,
				resolutionCharacters: story.resolutionCharacters,
				resolutionSetting: story.resolutionSetting,
				resolutionTone: story.resolutionTone,
				paidAt: story.paidAt,
				isPaid: story.isPaid,
				price: story.price,
				freeUntil: story.freeUntil,
				accessEnd: story.accessEnd,
				createdAt: story.createdAt,
				publishedAt: story.publishedAt,
			}
		});

		return newStory;
	}


}

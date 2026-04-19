/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../controllers/tsoa/auth.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../controllers/tsoa/user.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ReportController } from './../controllers/tsoa/report.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { NotificationController } from './../controllers/tsoa/notification.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { MessageController } from './../controllers/tsoa/message.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LogbookController } from './../controllers/tsoa/logbook.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { InternshipController } from './../controllers/tsoa/internship.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { EvaluationController } from './../controllers/tsoa/evaluation.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ApplicationController } from './../controllers/tsoa/application.controller';
import { expressAuthentication } from './../middleware/auth.middleware';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "MessageResponse": {
        "dataType": "refObject",
        "properties": {
            "success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string","required":true},
            "data": {"dataType":"any"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "role": {"dataType":"string","required":true},
            "firstName": {"dataType":"string","required":true},
            "lastName": {"dataType":"string","required":true},
            "phone": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ForgotPasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ResetPasswordRequest": {
        "dataType": "refObject",
        "properties": {
            "token": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StudentProfileBody": {
        "dataType": "refObject",
        "properties": {
            "firstName": {"dataType":"string"},
            "lastName": {"dataType":"string"},
            "phone": {"dataType":"string"},
            "studentId": {"dataType":"string"},
            "department": {"dataType":"string"},
            "faculty": {"dataType":"string"},
            "yearOfStudy": {"dataType":"double"},
            "institution": {"dataType":"string"},
            "bio": {"dataType":"string"},
            "skills": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SupervisorProfileBody": {
        "dataType": "refObject",
        "properties": {
            "firstName": {"dataType":"string"},
            "lastName": {"dataType":"string"},
            "phone": {"dataType":"string"},
            "title": {"dataType":"string"},
            "department": {"dataType":"string"},
            "institution": {"dataType":"string"},
            "specialization": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CompanyProfileBody": {
        "dataType": "refObject",
        "properties": {
            "companyName": {"dataType":"string"},
            "industry": {"dataType":"string"},
            "description": {"dataType":"string"},
            "website": {"dataType":"string"},
            "phone": {"dataType":"string"},
            "email": {"dataType":"string"},
            "addressLine1": {"dataType":"string"},
            "addressLine2": {"dataType":"string"},
            "city": {"dataType":"string"},
            "country": {"dataType":"string"},
            "latitude": {"dataType":"double"},
            "longitude": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "StartConversationBody": {
        "dataType": "refObject",
        "properties": {
            "recipientId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SendMessageBody": {
        "dataType": "refObject",
        "properties": {
            "content": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LogbookEntryBody": {
        "dataType": "refObject",
        "properties": {
            "frequency": {"dataType":"string","required":true},
            "entryDate": {"dataType":"string","required":true},
            "weekNumber": {"dataType":"double"},
            "activitiesDone": {"dataType":"string","required":true},
            "skillsGained": {"dataType":"string"},
            "challenges": {"dataType":"string"},
            "nextWeekPlan": {"dataType":"string"},
            "enrollmentId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_LogbookEntryBody_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"frequency":{"dataType":"string"},"entryDate":{"dataType":"string"},"weekNumber":{"dataType":"double"},"activitiesDone":{"dataType":"string"},"skillsGained":{"dataType":"string"},"challenges":{"dataType":"string"},"nextWeekPlan":{"dataType":"string"},"enrollmentId":{"dataType":"string"}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApproveEntryBody": {
        "dataType": "refObject",
        "properties": {
            "note": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AttendanceBody": {
        "dataType": "refObject",
        "properties": {
            "date": {"dataType":"string","required":true},
            "status": {"dataType":"string","required":true},
            "checkInTime": {"dataType":"string"},
            "checkOutTime": {"dataType":"string"},
            "hoursLogged": {"dataType":"double"},
            "note": {"dataType":"string"},
            "enrollmentId": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "InternshipBody": {
        "dataType": "refObject",
        "properties": {
            "title": {"dataType":"string","required":true},
            "description": {"dataType":"string","required":true},
            "type": {"dataType":"string","required":true},
            "field": {"dataType":"string","required":true},
            "location": {"dataType":"string"},
            "city": {"dataType":"string"},
            "country": {"dataType":"string"},
            "latitude": {"dataType":"double"},
            "longitude": {"dataType":"double"},
            "isRemote": {"dataType":"boolean"},
            "isPaid": {"dataType":"boolean"},
            "stipendAmount": {"dataType":"double"},
            "currency": {"dataType":"string"},
            "durationWeeks": {"dataType":"double"},
            "startDate": {"dataType":"string"},
            "endDate": {"dataType":"string"},
            "applicationDeadline": {"dataType":"string"},
            "slots": {"dataType":"double"},
            "requirements": {"dataType":"array","array":{"dataType":"string"}},
            "responsibilities": {"dataType":"array","array":{"dataType":"string"}},
            "skills": {"dataType":"array","array":{"dataType":"string"}},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Partial_InternshipBody_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{"title":{"dataType":"string"},"description":{"dataType":"string"},"type":{"dataType":"string"},"field":{"dataType":"string"},"location":{"dataType":"string"},"city":{"dataType":"string"},"country":{"dataType":"string"},"latitude":{"dataType":"double"},"longitude":{"dataType":"double"},"isRemote":{"dataType":"boolean"},"isPaid":{"dataType":"boolean"},"stipendAmount":{"dataType":"double"},"currency":{"dataType":"string"},"durationWeeks":{"dataType":"double"},"startDate":{"dataType":"string"},"endDate":{"dataType":"string"},"applicationDeadline":{"dataType":"string"},"slots":{"dataType":"double"},"requirements":{"dataType":"array","array":{"dataType":"string"}},"responsibilities":{"dataType":"array","array":{"dataType":"string"}},"skills":{"dataType":"array","array":{"dataType":"string"}}},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "EvaluationBody": {
        "dataType": "refObject",
        "properties": {
            "enrollmentId": {"dataType":"string","required":true},
            "stage": {"dataType":"string","required":true},
            "punctuality": {"dataType":"double"},
            "communication": {"dataType":"double"},
            "technicalSkills": {"dataType":"double"},
            "teamwork": {"dataType":"double"},
            "initiative": {"dataType":"double"},
            "professionalism": {"dataType":"double"},
            "strengths": {"dataType":"string"},
            "areasForImprovement": {"dataType":"string"},
            "generalComments": {"dataType":"string"},
            "recommendForHire": {"dataType":"boolean"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SelfAssessmentBody": {
        "dataType": "refObject",
        "properties": {
            "enrollmentId": {"dataType":"string"},
            "stage": {"dataType":"string","required":true},
            "skillsDeveloped": {"dataType":"double"},
            "goalsMet": {"dataType":"double"},
            "supervisorSupport": {"dataType":"double"},
            "workEnvironment": {"dataType":"double"},
            "overallExperience": {"dataType":"double"},
            "achievements": {"dataType":"string"},
            "challenges": {"dataType":"string"},
            "lessonsLearned": {"dataType":"string"},
            "futureGoals": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ApplyBody": {
        "dataType": "refObject",
        "properties": {
            "coverLetterText": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateStatusBody": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string","required":true},
            "rejectionReason": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ScheduleInterviewBody": {
        "dataType": "refObject",
        "properties": {
            "scheduledAt": {"dataType":"string","required":true},
            "durationMinutes": {"dataType":"double"},
            "meetingLink": {"dataType":"string"},
            "location": {"dataType":"string"},
            "notes": {"dataType":"string"},
            "interviewerName": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsAuthController_register: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"RegisterRequest"},
        };
        app.post('/api/auth/register',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.register)),

            async function AuthController_register(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_register, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'register',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"LoginRequest"},
        };
        app.post('/api/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_verifyEmail: Record<string, TsoaRoute.ParameterSchema> = {
                token: {"in":"query","name":"token","required":true,"dataType":"string"},
        };
        app.get('/api/auth/verify-email',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.verifyEmail)),

            async function AuthController_verifyEmail(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_verifyEmail, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'verifyEmail',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_forgotPassword: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ForgotPasswordRequest"},
        };
        app.post('/api/auth/forgot-password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.forgotPassword)),

            async function AuthController_forgotPassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_forgotPassword, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'forgotPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_resetPassword: Record<string, TsoaRoute.ParameterSchema> = {
                body: {"in":"body","name":"body","required":true,"ref":"ResetPasswordRequest"},
        };
        app.post('/api/auth/reset-password',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.resetPassword)),

            async function AuthController_resetPassword(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_resetPassword, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'resetPassword',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_getMe: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/auth/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.getMe)),

            async function AuthController_getMe(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_getMe, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'getMe',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getStudentProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/users/student/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getStudentProfile)),

            async function UserController_getStudentProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getStudentProfile, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getStudentProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateStudentProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"StudentProfileBody"},
        };
        app.put('/api/users/student/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateStudentProfile)),

            async function UserController_updateStudentProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateStudentProfile, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateStudentProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_uploadStudentPhoto: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/users/student/me/photo',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.uploadStudentPhoto)),

            async function UserController_uploadStudentPhoto(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_uploadStudentPhoto, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'uploadStudentPhoto',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_uploadStudentCv: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/users/student/me/cv',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.uploadStudentCv)),

            async function UserController_uploadStudentCv(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_uploadStudentCv, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'uploadStudentCv',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getSupervisorProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/users/supervisor/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getSupervisorProfile)),

            async function UserController_getSupervisorProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getSupervisorProfile, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getSupervisorProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateSupervisorProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"SupervisorProfileBody"},
        };
        app.put('/api/users/supervisor/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateSupervisorProfile)),

            async function UserController_updateSupervisorProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateSupervisorProfile, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateSupervisorProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getCompanyProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/users/company/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getCompanyProfile)),

            async function UserController_getCompanyProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getCompanyProfile, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getCompanyProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateCompanyProfile: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"CompanyProfileBody"},
        };
        app.put('/api/users/company/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateCompanyProfile)),

            async function UserController_updateCompanyProfile(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateCompanyProfile, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateCompanyProfile',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_uploadCompanyLogo: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/users/company/me/logo',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.uploadCompanyLogo)),

            async function UserController_uploadCompanyLogo(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_uploadCompanyLogo, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'uploadCompanyLogo',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_listUsers: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/users',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.listUsers)),

            async function UserController_listUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_listUsers, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'listUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_toggleUserActive: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.patch('/api/users/:id/toggle-active',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.toggleUserActive)),

            async function UserController_toggleUserActive(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_toggleUserActive, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'toggleUserActive',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReportController_listMyReports: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/reports',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ReportController)),
            ...(fetchMiddlewares<RequestHandler>(ReportController.prototype.listMyReports)),

            async function ReportController_listMyReports(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_listMyReports, request, response });

                const controller = new ReportController();

              await templateService.apiHandler({
                methodName: 'listMyReports',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReportController_listAllReports: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/reports/all',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ReportController)),
            ...(fetchMiddlewares<RequestHandler>(ReportController.prototype.listAllReports)),

            async function ReportController_listAllReports(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_listAllReports, request, response });

                const controller = new ReportController();

              await templateService.apiHandler({
                methodName: 'listAllReports',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReportController_getAnalytics: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/api/reports/analytics',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ReportController)),
            ...(fetchMiddlewares<RequestHandler>(ReportController.prototype.getAnalytics)),

            async function ReportController_getAnalytics(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_getAnalytics, request, response });

                const controller = new ReportController();

              await templateService.apiHandler({
                methodName: 'getAnalytics',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReportController_generateMyLogbookPdf: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/reports/logbook/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ReportController)),
            ...(fetchMiddlewares<RequestHandler>(ReportController.prototype.generateMyLogbookPdf)),

            async function ReportController_generateMyLogbookPdf(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_generateMyLogbookPdf, request, response });

                const controller = new ReportController();

              await templateService.apiHandler({
                methodName: 'generateMyLogbookPdf',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReportController_generateLogbookPdf: Record<string, TsoaRoute.ParameterSchema> = {
                studentId: {"in":"path","name":"studentId","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/reports/logbook/:studentId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ReportController)),
            ...(fetchMiddlewares<RequestHandler>(ReportController.prototype.generateLogbookPdf)),

            async function ReportController_generateLogbookPdf(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_generateLogbookPdf, request, response });

                const controller = new ReportController();

              await templateService.apiHandler({
                methodName: 'generateLogbookPdf',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReportController_generateEvaluationPdf: Record<string, TsoaRoute.ParameterSchema> = {
                enrollmentId: {"in":"path","name":"enrollmentId","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/reports/evaluation/:enrollmentId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ReportController)),
            ...(fetchMiddlewares<RequestHandler>(ReportController.prototype.generateEvaluationPdf)),

            async function ReportController_generateEvaluationPdf(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_generateEvaluationPdf, request, response });

                const controller = new ReportController();

              await templateService.apiHandler({
                methodName: 'generateEvaluationPdf',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReportController_generateCertificate: Record<string, TsoaRoute.ParameterSchema> = {
                enrollmentId: {"in":"path","name":"enrollmentId","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/reports/certificate/:enrollmentId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ReportController)),
            ...(fetchMiddlewares<RequestHandler>(ReportController.prototype.generateCertificate)),

            async function ReportController_generateCertificate(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_generateCertificate, request, response });

                const controller = new ReportController();

              await templateService.apiHandler({
                methodName: 'generateCertificate',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReportController_generateInstitutionalExcel: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                department: {"in":"query","name":"department","dataType":"string"},
                year: {"in":"query","name":"year","dataType":"double"},
        };
        app.post('/api/reports/institutional',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ReportController)),
            ...(fetchMiddlewares<RequestHandler>(ReportController.prototype.generateInstitutionalExcel)),

            async function ReportController_generateInstitutionalExcel(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReportController_generateInstitutionalExcel, request, response });

                const controller = new ReportController();

              await templateService.apiHandler({
                methodName: 'generateInstitutionalExcel',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsNotificationController_getNotifications: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/notifications',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(NotificationController)),
            ...(fetchMiddlewares<RequestHandler>(NotificationController.prototype.getNotifications)),

            async function NotificationController_getNotifications(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsNotificationController_getNotifications, request, response });

                const controller = new NotificationController();

              await templateService.apiHandler({
                methodName: 'getNotifications',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsNotificationController_markAsRead: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.patch('/api/notifications/:id/read',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(NotificationController)),
            ...(fetchMiddlewares<RequestHandler>(NotificationController.prototype.markAsRead)),

            async function NotificationController_markAsRead(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsNotificationController_markAsRead, request, response });

                const controller = new NotificationController();

              await templateService.apiHandler({
                methodName: 'markAsRead',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsNotificationController_markAllAsRead: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.patch('/api/notifications/read-all',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(NotificationController)),
            ...(fetchMiddlewares<RequestHandler>(NotificationController.prototype.markAllAsRead)),

            async function NotificationController_markAllAsRead(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsNotificationController_markAllAsRead, request, response });

                const controller = new NotificationController();

              await templateService.apiHandler({
                methodName: 'markAllAsRead',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMessageController_getConversations: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/messages',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessageController)),
            ...(fetchMiddlewares<RequestHandler>(MessageController.prototype.getConversations)),

            async function MessageController_getConversations(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMessageController_getConversations, request, response });

                const controller = new MessageController();

              await templateService.apiHandler({
                methodName: 'getConversations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMessageController_startConversation: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"StartConversationBody"},
        };
        app.post('/api/messages/start',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessageController)),
            ...(fetchMiddlewares<RequestHandler>(MessageController.prototype.startConversation)),

            async function MessageController_startConversation(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMessageController_startConversation, request, response });

                const controller = new MessageController();

              await templateService.apiHandler({
                methodName: 'startConversation',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMessageController_getMessages: Record<string, TsoaRoute.ParameterSchema> = {
                conversationId: {"in":"path","name":"conversationId","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/messages/:conversationId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessageController)),
            ...(fetchMiddlewares<RequestHandler>(MessageController.prototype.getMessages)),

            async function MessageController_getMessages(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMessageController_getMessages, request, response });

                const controller = new MessageController();

              await templateService.apiHandler({
                methodName: 'getMessages',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsMessageController_sendMessage: Record<string, TsoaRoute.ParameterSchema> = {
                conversationId: {"in":"path","name":"conversationId","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"SendMessageBody"},
        };
        app.post('/api/messages/:conversationId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(MessageController)),
            ...(fetchMiddlewares<RequestHandler>(MessageController.prototype.sendMessage)),

            async function MessageController_sendMessage(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsMessageController_sendMessage, request, response });

                const controller = new MessageController();

              await templateService.apiHandler({
                methodName: 'sendMessage',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLogbookController_getMyEntries: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/api/logbook/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LogbookController)),
            ...(fetchMiddlewares<RequestHandler>(LogbookController.prototype.getMyEntries)),

            async function LogbookController_getMyEntries(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLogbookController_getMyEntries, request, response });

                const controller = new LogbookController();

              await templateService.apiHandler({
                methodName: 'getMyEntries',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLogbookController_createEntry: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"LogbookEntryBody"},
        };
        app.post('/api/logbook',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LogbookController)),
            ...(fetchMiddlewares<RequestHandler>(LogbookController.prototype.createEntry)),

            async function LogbookController_createEntry(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLogbookController_createEntry, request, response });

                const controller = new LogbookController();

              await templateService.apiHandler({
                methodName: 'createEntry',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLogbookController_updateEntry: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"Partial_LogbookEntryBody_"},
        };
        app.put('/api/logbook/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LogbookController)),
            ...(fetchMiddlewares<RequestHandler>(LogbookController.prototype.updateEntry)),

            async function LogbookController_updateEntry(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLogbookController_updateEntry, request, response });

                const controller = new LogbookController();

              await templateService.apiHandler({
                methodName: 'updateEntry',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLogbookController_getStudentEntries: Record<string, TsoaRoute.ParameterSchema> = {
                studentId: {"in":"path","name":"studentId","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
        };
        app.get('/api/logbook/student/:studentId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LogbookController)),
            ...(fetchMiddlewares<RequestHandler>(LogbookController.prototype.getStudentEntries)),

            async function LogbookController_getStudentEntries(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLogbookController_getStudentEntries, request, response });

                const controller = new LogbookController();

              await templateService.apiHandler({
                methodName: 'getStudentEntries',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLogbookController_approveEntry: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"ApproveEntryBody"},
        };
        app.patch('/api/logbook/:id/approve',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LogbookController)),
            ...(fetchMiddlewares<RequestHandler>(LogbookController.prototype.approveEntry)),

            async function LogbookController_approveEntry(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLogbookController_approveEntry, request, response });

                const controller = new LogbookController();

              await templateService.apiHandler({
                methodName: 'approveEntry',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLogbookController_getAttendanceSummary: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/logbook/attendance/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LogbookController)),
            ...(fetchMiddlewares<RequestHandler>(LogbookController.prototype.getAttendanceSummary)),

            async function LogbookController_getAttendanceSummary(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLogbookController_getAttendanceSummary, request, response });

                const controller = new LogbookController();

              await templateService.apiHandler({
                methodName: 'getAttendanceSummary',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsLogbookController_logAttendance: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"AttendanceBody"},
        };
        app.post('/api/logbook/attendance',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(LogbookController)),
            ...(fetchMiddlewares<RequestHandler>(LogbookController.prototype.logAttendance)),

            async function LogbookController_logAttendance(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsLogbookController_logAttendance, request, response });

                const controller = new LogbookController();

              await templateService.apiHandler({
                methodName: 'logAttendance',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternshipController_listInternships: Record<string, TsoaRoute.ParameterSchema> = {
                page: {"in":"query","name":"page","dataType":"double"},
                limit: {"in":"query","name":"limit","dataType":"double"},
                type: {"in":"query","name":"type","dataType":"string"},
                field: {"in":"query","name":"field","dataType":"string"},
                city: {"in":"query","name":"city","dataType":"string"},
                isRemote: {"in":"query","name":"isRemote","dataType":"boolean"},
                isPaid: {"in":"query","name":"isPaid","dataType":"boolean"},
                search: {"in":"query","name":"search","dataType":"string"},
        };
        app.get('/api/internships',
            ...(fetchMiddlewares<RequestHandler>(InternshipController)),
            ...(fetchMiddlewares<RequestHandler>(InternshipController.prototype.listInternships)),

            async function InternshipController_listInternships(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternshipController_listInternships, request, response });

                const controller = new InternshipController();

              await templateService.apiHandler({
                methodName: 'listInternships',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternshipController_getInternship: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/api/internships/:id',
            ...(fetchMiddlewares<RequestHandler>(InternshipController)),
            ...(fetchMiddlewares<RequestHandler>(InternshipController.prototype.getInternship)),

            async function InternshipController_getInternship(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternshipController_getInternship, request, response });

                const controller = new InternshipController();

              await templateService.apiHandler({
                methodName: 'getInternship',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternshipController_createInternship: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"InternshipBody"},
        };
        app.post('/api/internships',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InternshipController)),
            ...(fetchMiddlewares<RequestHandler>(InternshipController.prototype.createInternship)),

            async function InternshipController_createInternship(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternshipController_createInternship, request, response });

                const controller = new InternshipController();

              await templateService.apiHandler({
                methodName: 'createInternship',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternshipController_updateInternship: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"Partial_InternshipBody_"},
        };
        app.put('/api/internships/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InternshipController)),
            ...(fetchMiddlewares<RequestHandler>(InternshipController.prototype.updateInternship)),

            async function InternshipController_updateInternship(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternshipController_updateInternship, request, response });

                const controller = new InternshipController();

              await templateService.apiHandler({
                methodName: 'updateInternship',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternshipController_deleteInternship: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.delete('/api/internships/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InternshipController)),
            ...(fetchMiddlewares<RequestHandler>(InternshipController.prototype.deleteInternship)),

            async function InternshipController_deleteInternship(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternshipController_deleteInternship, request, response });

                const controller = new InternshipController();

              await templateService.apiHandler({
                methodName: 'deleteInternship',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternshipController_toggleBookmark: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/api/internships/:id/bookmark',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InternshipController)),
            ...(fetchMiddlewares<RequestHandler>(InternshipController.prototype.toggleBookmark)),

            async function InternshipController_toggleBookmark(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternshipController_toggleBookmark, request, response });

                const controller = new InternshipController();

              await templateService.apiHandler({
                methodName: 'toggleBookmark',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternshipController_getBookmarks: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/internships/bookmarks/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InternshipController)),
            ...(fetchMiddlewares<RequestHandler>(InternshipController.prototype.getBookmarks)),

            async function InternshipController_getBookmarks(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternshipController_getBookmarks, request, response });

                const controller = new InternshipController();

              await templateService.apiHandler({
                methodName: 'getBookmarks',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsInternshipController_getMyInternships: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/internships/company/mine',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(InternshipController)),
            ...(fetchMiddlewares<RequestHandler>(InternshipController.prototype.getMyInternships)),

            async function InternshipController_getMyInternships(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsInternshipController_getMyInternships, request, response });

                const controller = new InternshipController();

              await templateService.apiHandler({
                methodName: 'getMyInternships',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEvaluationController_submitEvaluation: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"EvaluationBody"},
        };
        app.post('/api/evaluations',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EvaluationController)),
            ...(fetchMiddlewares<RequestHandler>(EvaluationController.prototype.submitEvaluation)),

            async function EvaluationController_submitEvaluation(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEvaluationController_submitEvaluation, request, response });

                const controller = new EvaluationController();

              await templateService.apiHandler({
                methodName: 'submitEvaluation',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEvaluationController_getEvaluations: Record<string, TsoaRoute.ParameterSchema> = {
                enrollmentId: {"in":"path","name":"enrollmentId","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/evaluations/enrollment/:enrollmentId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EvaluationController)),
            ...(fetchMiddlewares<RequestHandler>(EvaluationController.prototype.getEvaluations)),

            async function EvaluationController_getEvaluations(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEvaluationController_getEvaluations, request, response });

                const controller = new EvaluationController();

              await templateService.apiHandler({
                methodName: 'getEvaluations',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEvaluationController_approveEvaluation: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.patch('/api/evaluations/:id/approve',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EvaluationController)),
            ...(fetchMiddlewares<RequestHandler>(EvaluationController.prototype.approveEvaluation)),

            async function EvaluationController_approveEvaluation(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEvaluationController_approveEvaluation, request, response });

                const controller = new EvaluationController();

              await templateService.apiHandler({
                methodName: 'approveEvaluation',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEvaluationController_submitSelfAssessment: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"SelfAssessmentBody"},
        };
        app.post('/api/evaluations/self-assessment',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EvaluationController)),
            ...(fetchMiddlewares<RequestHandler>(EvaluationController.prototype.submitSelfAssessment)),

            async function EvaluationController_submitSelfAssessment(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEvaluationController_submitSelfAssessment, request, response });

                const controller = new EvaluationController();

              await templateService.apiHandler({
                methodName: 'submitSelfAssessment',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsEvaluationController_getMySelfAssessments: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/evaluations/self-assessment/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(EvaluationController)),
            ...(fetchMiddlewares<RequestHandler>(EvaluationController.prototype.getMySelfAssessments)),

            async function EvaluationController_getMySelfAssessments(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsEvaluationController_getMySelfAssessments, request, response });

                const controller = new EvaluationController();

              await templateService.apiHandler({
                methodName: 'getMySelfAssessments',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsApplicationController_getMyApplications: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/applications/me',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController.prototype.getMyApplications)),

            async function ApplicationController_getMyApplications(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApplicationController_getMyApplications, request, response });

                const controller = new ApplicationController();

              await templateService.apiHandler({
                methodName: 'getMyApplications',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsApplicationController_apply: Record<string, TsoaRoute.ParameterSchema> = {
                internshipId: {"in":"path","name":"internshipId","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"ApplyBody"},
        };
        app.post('/api/applications/:internshipId/apply',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController.prototype.apply)),

            async function ApplicationController_apply(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApplicationController_apply, request, response });

                const controller = new ApplicationController();

              await templateService.apiHandler({
                methodName: 'apply',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 201,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsApplicationController_withdraw: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.patch('/api/applications/:id/withdraw',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController.prototype.withdraw)),

            async function ApplicationController_withdraw(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApplicationController_withdraw, request, response });

                const controller = new ApplicationController();

              await templateService.apiHandler({
                methodName: 'withdraw',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsApplicationController_getApplicationsForInternship: Record<string, TsoaRoute.ParameterSchema> = {
                internshipId: {"in":"path","name":"internshipId","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/api/applications/internship/:internshipId',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController.prototype.getApplicationsForInternship)),

            async function ApplicationController_getApplicationsForInternship(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApplicationController_getApplicationsForInternship, request, response });

                const controller = new ApplicationController();

              await templateService.apiHandler({
                methodName: 'getApplicationsForInternship',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsApplicationController_updateStatus: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"UpdateStatusBody"},
        };
        app.patch('/api/applications/:id/status',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController.prototype.updateStatus)),

            async function ApplicationController_updateStatus(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApplicationController_updateStatus, request, response });

                const controller = new ApplicationController();

              await templateService.apiHandler({
                methodName: 'updateStatus',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsApplicationController_scheduleInterview: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
                body: {"in":"body","name":"body","required":true,"ref":"ScheduleInterviewBody"},
        };
        app.post('/api/applications/:id/interview',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController)),
            ...(fetchMiddlewares<RequestHandler>(ApplicationController.prototype.scheduleInterview)),

            async function ApplicationController_scheduleInterview(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsApplicationController_scheduleInterview, request, response });

                const controller = new ApplicationController();

              await templateService.apiHandler({
                methodName: 'scheduleInterview',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

/*
MIT License

Copyright (c) 2023 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF,
OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { PrismaClient, QuestionType } from '@prisma/client'
import { checkAuth } from './utils/checkAuth';
import httpErrorHandler from '@middy/http-error-handler';
import createHttpError from 'http-errors';
import { verifyHost } from './utils/verifyHost';
import Joi from 'joi';
import { validateEventSchema } from './utils/validateEventSchema';
import cors from '@middy/http-cors';
import { createMcqQuestionCore } from './utils/createMcqQuestionCore';
const prisma = new PrismaClient()

const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const { playerId, roomId, title, options, correctAnswer } = event.body as any;

  const {question, options: _options} = await createMcqQuestionCore(playerId, roomId, title, options, correctAnswer);
  
  await prisma.$disconnect();
  //Checking workflow
  // TODO! Notify room players about question

  return {
    statusCode: 200,
    body: JSON.stringify({
      question,
      options,
    })
  }
})

handler
  .use(httpJsonBodyParser())
  .use(checkAuth({ blockExecution: true })) // Block execution if invalid token
  .use(validateEventSchema(
    Joi.object({
      playerId: Joi.string().required(),
      roomId: Joi.string().required(),
      title: Joi.string().required(),
      correctAnswer: Joi.number().required(),
      options: Joi.array().items(
        Joi.string().required()
      ).length(4).required(),
    })))
  .use(httpErrorHandler())
  .use(cors({
    origin: process.env.ALLOWED_ORIGIN
  }))

module.exports.handler = handler

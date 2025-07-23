import express from "express";

import { listThread, searchThread } from "../controllers/threadController";
import { signup, signin, signout } from "../controllers/userController";
import { protector, publicOnly } from "../middlewares";

const rootRouter = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *    summary: 게시글 목록 조회
 *    description: 전체 게시글 목록을 조회합니다.
 *    tags: [Threads]
 *    responses:
 *      '200':
 *        description: 성공적으로 게시글 목록을 반환함.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  title:
 *                    type: string
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 */
rootRouter.get("/", listThread);

/**
 * @swagger
 * /search:
 *  get:
 *    summary: 게시글 검색
 *    description: 키워드를 사용하여 게시글을 검색합니다.
 *    tags: [Threads]
 *    parameters:
 *      - in: query
 *        name: keyword
 *        required: true
 *        schema:
 *          type: string
 *        description: 검색할 키워드
 *    responses:
 *      '200':
 *        description: 검색된 게시글 목록을 반환함.
 *      '400':
 *        description: 검색 키워드가 제공되지 않음.
 */
rootRouter.get("/search", searchThread);

/**
 * @swagger
 * /join:
 *  post:
 *    summary: 회원가입
 *    description: 새로운 사용자를 등록합니다.
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *                format: email
 *              password:
 *                type: string
 *              password2:
 *                type: string
 *    responses:
 *      '201':
 *        description: 회원가입 성공.
 *      '400':
 *        description: 잘못된 요청 데이터.
 *      '409':
 *        description: 이미 존재하는 이메일.
 */
rootRouter.post("/join", publicOnly, signup);

/**
 * @swagger
 * /login:
 *  post:
 *    summary: 로그인
 *    description: 아이디와 비밀번호로 로그인하고 인증 토큰을 발급받습니다.
 *    tags: [Users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '200':
 *        description: 로그인 성공, 인증 토큰 반환.
 *      '401':
 *        description: 인증 실패.
 */
rootRouter.post("/login", publicOnly, signin);

/**
 * @swagger
 * /logout:
 *  get:
 *    summary: 로그아웃
 *    description: 현재 로그인된 세션을 종료합니다.
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      '200':
 *        description: 로그아웃 성공.
 *      '401':
 *        description: 인증되지 않은 사용자.
 */
rootRouter.get("/logout", protector, signout);

export default rootRouter;

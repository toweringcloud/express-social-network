import express from "express";

import { githubLogin, githubCallback } from "../controllers/githubController";
import { listThread, searchThread } from "../controllers/threadController";
import { signup, signin, signout } from "../controllers/userController";
import { protector, publicOnly } from "../middlewares";

const rootRouter = express.Router();

/**
 * @swagger
 * /:
 *  get:
 *    summary: 글 차례 보기
 *    description: 모든 글의 차례를 봅니다.
 *    tags: [Threads]
 *    responses:
 *      '200':
 *        description: 성공적으로 글 차례를 반환함.
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
 *    summary: 글 찾기
 *    description: 키워드를 사용하여 글을 찾습니다.
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
 *        description: 검색된 글 목록을 반환함.
 *      '400':
 *        description: 검색 키워드가 제공되지 않음.
 */
rootRouter.get("/search", searchThread);

/**
 * @swagger
 * /github:
 *  get:
 *    summary: GitHub 로그인 시작
 *    description: 사용자를 GitHub 인증 페이지로 리디렉션합니다.
 *    tags: [Users]
 *    responses:
 *      302:
 *        description: GitHub 로그인 페이지로 성공적으로 리디렉션됨.
 */
rootRouter.get("/github", publicOnly, githubLogin);

/**
 * @swagger
 * /github/callback:
 *  get:
 *    summary: GitHub 로그인 콜백
 *    description: GitHub 인증 후 사용자가 리디렉션되는 경로입니다. 로그인을 처리하고 세션을 생성합니다.
 *    tags: [Users]
 *    responses:
 *      '302':
 *        description: 로그인 성공 후 메인 페이지로 리디렉션됨.
 */
rootRouter.get("/github/callback", publicOnly, githubCallback);

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

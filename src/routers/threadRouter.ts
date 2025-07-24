import express from "express";

import {
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController";
import {
  createThread,
  readThread,
  updateThread,
  deleteThread,
  toggleLikeOnThread,
} from "../controllers/threadController";
import { fileUpload, protector } from "../middlewares";

const threadRouter = express.Router();

/**
 * @swagger
 * /threads:
 *  post:
 *    summary: 새로운 글 쓰기
 *    description: 사진과 내용을 포함한 새로운 글을 씁니다.
 *    tags: [Threads]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              photo:
 *                type: string
 *                format: binary
 *                description: 업로드할 사진 파일
 *              content:
 *                type: string
 *                description: 글 내용
 *    responses:
 *      '201':
 *        description: 글이 성공적으로 생성됨.
 *      '400':
 *        description: 잘못된 요청 데이터.
 *      '401':
 *        description: 인증되지 않은 사용자.
 */
threadRouter.post(
  "/",
  protector,
  fileUpload("photos", 5).single("photo"),
  createThread
);

/**
 * @swagger
 * /threads/{id}:
 *  get:
 *    summary: 어떤 글 보기
 *    description: 어떤 글을 자세히 봅니다.
 *    tags: [Threads]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *          pattern: '^[0-9]*$'
 *        description: 조회할 글의 ID
 *    responses:
 *      '200':
 *        description: 성공적으로 글 정보를 반환함.
 *      '404':
 *        description: 해당 ID의 글을 찾을 수 없음.
 */
threadRouter.get("/:id([0-9]*)", readThread);

/**
 * @swagger
 * /threads/{id}:
 *  put:
 *    summary: 어떤 글 가다듬기
 *    description: 어떤 글의 알맹이를 가다듬습니다.
 *    tags: [Threads]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *          pattern: '^[0-9]*$'
 *        description: 수정할 글의 ID
 *    requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              photo:
 *                type: string
 *                format: binary
 *              content:
 *                type: string
 *    responses:
 *      '200':
 *        description: 글이 성공적으로 바뀜.
 *      '401':
 *        description: 인증되지 않은 사용자.
 *      '403':
 *        description: 글을 수정할 권한이 없음.
 *      '404':
 *        description: 해당 ID의 글을 찾을 수 없음.
 */
threadRouter.put(
  "/:id([0-9]*)",
  protector,
  fileUpload("photos", 5).single("photo"),
  updateThread
);

/**
 * @swagger
 * /threads/{id}:
 *  delete:
 *    summary: 어떤 글 지우기
 *    description: 어떤 글을 지웁니다.
 *    tags: [Threads]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *          pattern: '^[0-9]*$'
 *        description: 삭제할 글의 ID
 *    responses:
 *      '204':
 *        description: 글이 성공적으로 지워짐.
 *      '401':
 *        description: 인증되지 않은 사용자.
 *      '403':
 *        description: 글을 삭제할 권한이 없음.
 *      '404':
 *        description: 해당 ID의 글을 찾을 수 없음.
 */
threadRouter.delete("/:id([0-9]*)", protector, deleteThread);

/**
 * @swagger
 * /threads/{id}/comment:
 *  post:
 *    summary: 어떤 글에 대한 새 댓글 쓰기
 *    description: 어떤 글에 대해 새 댓글을 보탭니다.
 *    tags: [Threads]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *          pattern: '^[0-9]*$'
 *        description: 삭제할 글의 ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                description: 댓글 내용
 *    responses:
 *      '201':
 *        description: 댓글이 성공적으로 생성됨.
 *      '400':
 *        description: 잘못된 요청 데이터.
 *      '401':
 *        description: 인증되지 않은 사용자.
 *      '404':
 *        description: 해당 ID의 글을 찾을 수 없음.
 */
threadRouter.post("/:id([0-9]*)/comment", protector, createComment);

/**
 * @swagger
 * /threads/{id}/comment/{cid}:
 *  put:
 *    summary: 어떤 글의 댓글 가다듬기
 *    description: 어떤 글에 덧붙인 댓글을 가다듭습니다.
 *    tags: [Threads]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *          pattern: '^[0-9]*$'
 *        description: 삭제할 글의 ID
 *      - in: path
 *        name: cid
 *        required: true
 *        schema:
 *          type: number
 *          pattern: '^[0-9]*$'
 *        description: 댓글의 ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                description: 댓글 내용
 *    responses:
 *      '201':
 *        description: 댓글이 성공적으로 바뀜.
 *      '400':
 *        description: 잘못된 요청 데이터.
 *      '401':
 *        description: 인증되지 않은 사용자.
 *      '404':
 *        description: 해당 ID의 글이나 댓글을 찾을 수 없음.
 */
threadRouter.put("/:id([0-9]*)/comment/:cid([0-9]*)", protector, updateComment);

/**
 * @swagger
 * /threads/{id}/comment/{cid}:
 *  delete:
 *    summary: 어떤 글의 댓글 지우기
 *    description: 어떤 글에 덧붙인 댓글을 지웁니다.
 *    tags: [Threads]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *          pattern: '^[0-9]*$'
 *        description: 삭제할 글의 ID
 *      - in: path
 *        name: cid
 *        required: true
 *        schema:
 *          type: number
 *          pattern: '^[0-9]*$'
 *        description: 댓글의 ID
 *    responses:
 *      '204':
 *        description: 글이 성공적으로 지워짐.
 *      '401':
 *        description: 인증되지 않은 사용자.
 *      '403':
 *        description: 글을 삭제할 권한이 없음.
 *      '404':
 *        description: 해당 ID의 글을 찾을 수 없음.
 */
threadRouter.delete(
  "/:id([0-9]*)/comment/:cid([0-9]*)",
  protector,
  deleteComment
);

/**
 * @swagger
 * /threads/{id}/like:
 *  post:
 *    summary: 글이 좋아요
 *    description: 글이 마음에 드는 지 나타냅니다.
 *    tags: [Threads]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *          pattern: '^[0-9]*$'
 *        description: 글의 ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              like:
 *                type: boolean
 *                description: 좋아요(true) or 무응답(false)
 *    responses:
 *      '201':
 *        description: 호감도(좋아요)가 반영됨.
 *      '204':
 *        description: 호감도(좋아요)가 취소됨.
 *      '401':
 *        description: 인증되지 않은 사용자.
 */
threadRouter.post("/:id([0-9]*)/like", protector, toggleLikeOnThread);

export default threadRouter;

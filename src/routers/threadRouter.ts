import express from "express";

import {
  createThread,
  readThread,
  updateThread,
  deleteThread,
} from "../controllers/threadController";
import { fileUpload, protector } from "../middlewares";

const threadRouter = express.Router();

/**
 * @swagger
 * /threads/upload:
 *  post:
 *    summary: 새 게시글 작성
 *    description: 사진과 내용을 포함한 새로운 게시글을 작성합니다.
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
 *                description: 게시글 내용
 *    responses:
 *      '201':
 *        description: 게시글이 성공적으로 생성됨.
 *      '400':
 *        description: 잘못된 요청 데이터.
 *      '401':
 *        description: 인증되지 않은 사용자.
 */
threadRouter.post(
  "/upload",
  protector,
  fileUpload("photos", 5).single("photo"),
  createThread
);

/**
 * @swagger
 * /threads/{id}:
 *  get:
 *    summary: 특정 게시글 조회
 *    description: ID를 사용하여 특정 게시글의 상세 정보를 조회합니다.
 *    tags: [Threads]
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          pattern: '^[0-9a-f]{24}$'
 *        description: 조회할 게시글의 ID (MongoDB ObjectId)
 *    responses:
 *      '200':
 *        description: 성공적으로 게시글 정보를 반환함.
 *      '404':
 *        description: 해당 ID의 게시글을 찾을 수 없음.
 */
threadRouter.get("/:id([0-9a-f]{24})", readThread);

/**
 * @swagger
 * /threads/{id}/edit:
 *  put:
 *    summary: 게시글 수정
 *    description: ID를 사용하여 특정 게시글의 사진이나 내용을 수정합니다.
 *    tags: [Threads]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          pattern: '^[0-9a-f]{24}$'
 *        description: 수정할 게시글의 ID
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
 *        description: 게시글이 성공적으로 수정됨.
 *      '401':
 *        description: 인증되지 않은 사용자.
 *      '403':
 *        description: 게시글을 수정할 권한이 없음.
 *      '404':
 *        description: 해당 ID의 게시글을 찾을 수 없음.
 */
threadRouter.put(
  "/:id([0-9a-f]{24})/edit",
  protector,
  fileUpload("photos", 5).single("photo"),
  updateThread
);

/**
 * @swagger
 * /threads/{id}/delete:
 *  delete:
 *    summary: 게시글 삭제
 *    description: ID를 사용하여 특정 게시글을 삭제합니다.
 *    tags: [Threads]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *          pattern: '^[0-9a-f]{24}$'
 *        description: 삭제할 게시글의 ID
 *    responses:
 *      '200':
 *        description: 게시글이 성공적으로 삭제됨.
 *      '401':
 *        description: 인증되지 않은 사용자.
 *      '403':
 *        description: 게시글을 삭제할 권한이 없음.
 *      '404':
 *        description: 해당 ID의 게시글을 찾을 수 없음.
 */
threadRouter.delete("/:id([0-9a-f]{24})/delete", protector, deleteThread);

export default threadRouter;
